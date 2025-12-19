"use client";
import { Drawer, message, Spin } from "antd"; // Keep Drawer and Spin/Message
import { useEffect, useState } from "react";
import { getArena, updateArena } from "@/actions/arena";
import { CloseOutlined, EnvironmentOutlined, DollarOutlined, LoadingOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import UploadCard from "./AddArena/UploadCard";

interface Suggestion {
  label: string;
  lat: number;
  lng: number;
  city?: string;
  country?: string;
}

interface EditArenaDrawerProps {
  open: boolean;
  onClose: () => void;
  arenaId: string | null;
  onSuccess?: () => void;
}

export default function EditArenaDrawer({
  open,
  onClose,
  arenaId,
  onSuccess,
}: EditArenaDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    country: "",
    contact_email: "",
    contact_number: "",
    price_per_hour: "",
    latitude: 0,
    longitude: 0,
  });

  // Location Search State
  const [addressQuery, setAddressQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (open && arenaId) {
      fetchArenaData(arenaId);
    } else {
      // Reset form
      setFormData({
        name: "",
        address: "",
        city: "",
        country: "",
        contact_email: "",
        contact_number: "",
        price_per_hour: "",
        latitude: 0,
        longitude: 0,
      });
      setImageUrl("");
      setAddressQuery("");
      setSelectedLocation(null);
    }
  }, [open, arenaId]);

  // Debounced Search for Photon API
  useEffect(() => {
    if (addressQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(addressQuery)}&limit=5`
        );
        const data = await res.json();

        const formattedSuggestions: Suggestion[] = data.features.map((feature: any) => {
          const { name, street, city, country, housenumber } = feature.properties;
          const labelParts = [name, housenumber, street, city, country].filter(Boolean);

          return {
            label: labelParts.join(', ') || feature.properties.formatted,
            lat: feature.geometry.coordinates[1],
            lng: feature.geometry.coordinates[0],
            city: city || feature.properties.city,
            country: country || feature.properties.country
          };
        });

        setSuggestions(formattedSuggestions);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [addressQuery]);


  const fetchArenaData = async (id: string) => {
    try {
      setFetching(true);
      const data = await getArena(id);
      if (data) {
        setFormData({
          name: data.name || "",
          address: data.address || "",
          city: data.city || "",
          country: data.country || "",
          contact_email: data.contact_email || "",
          contact_number: data.contact_number || "",
          price_per_hour: data.price_per_hour || "",
          latitude: data.latitude || 0,
          longitude: data.longitude || 0,
        });

        if (data.cover_image_url) setImageUrl(data.cover_image_url);
        if (data.address) setAddressQuery(data.address);
        if (data.latitude && data.longitude) {
          setSelectedLocation({ lat: data.latitude, lng: data.longitude });
        }
      } else {
        message.error("Arena not found");
        onClose();
      }
    } catch (error) {
      console.error("Failed to fetch arena:", error);
      message.error("Failed to load arena details");
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectLocation = (suggestion: Suggestion) => {
    setAddressQuery(suggestion.label);
    setSuggestions([]);
    setSelectedLocation({ lat: suggestion.lat, lng: suggestion.lng });

    setFormData(prev => ({
      ...prev,
      address: suggestion.label,
      city: suggestion.city || prev.city,
      country: suggestion.country || prev.country,
      latitude: suggestion.lat,
      longitude: suggestion.lng
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!arenaId) return;

    try {
      setLoading(true);
      await updateArena(arenaId, {
        ...formData,
        price_per_hour: parseFloat(formData.price_per_hour as string) || 0,
        cover_image_url: imageUrl,
      });
      message.success("Arena updated successfully");
      if (onSuccess) onSuccess();
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Failed to update arena:", error);
      message.error("Failed to update arena");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size="large"
      closeIcon={null}
      styles={{
        header: { display: "none" },
        body: { padding: 0, background: "#0a0e13" },
      }}
    >
      <div className="sticky top-0 z-10 bg-[#0a0e13] border-b border-[#2a3142] px-8 py-6 flex items-center justify-between">
        <h2 className="text-white text-2xl font-semibold">Edit Arena</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-[#252d3f] rounded-lg"
        >
          <CloseOutlined className="text-xl" />
        </button>
      </div>

      <div className="px-8 py-6">
        {fetching ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Arena Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Arena Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-[#0a0e13] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none"
              />
            </div>

            {/* Address Search */}
            <div className="space-y-2 relative">
              <label className="text-sm font-medium text-gray-300">Address / Location Search <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvironmentOutlined className="text-gray-500" />
                </div>
                <input
                  type="text"
                  value={addressQuery}
                  onChange={(e) => {
                    setAddressQuery(e.target.value);
                    setFormData(prev => ({ ...prev, address: e.target.value }));
                  }}
                  required
                  autoComplete="off"
                  className="w-full bg-[#0a0e13] border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none"
                />
              </div>

              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute top-[80px] left-0 right-0 bg-[#1f2937] border border-gray-600 rounded-lg z-50 shadow-xl max-h-60 overflow-y-auto">
                  {suggestions.map((item, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-3 hover:bg-[#374151] cursor-pointer text-gray-200 text-sm border-b border-gray-700 last:border-0 transition-colors flex items-center gap-2"
                      onClick={() => handleSelectLocation(item)}
                    >
                      <EnvironmentOutlined className="text-blue-500" />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* City & Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">City <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0a0e13] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Country <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0a0e13] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none"
                />
              </div>
            </div>

            {/* Price, Email, Phone */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Hourly Rate <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarOutlined className="text-gray-500" />
                  </div>
                  <input
                    type="number"
                    name="price_per_hour"
                    value={formData.price_per_hour}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full bg-[#0a0e13] border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailOutlined className="text-gray-500" />
                  </div>
                  <input
                    type="email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleChange}
                    className="w-full bg-[#0a0e13] border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Phone</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PhoneOutlined className="text-gray-500" />
                  </div>
                  <input
                    type="tel"
                    name="contact_number"
                    value={formData.contact_number}
                    onChange={handleChange}
                    className="w-full bg-[#0a0e13] border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <UploadCard
                title="Cover Image (Optional)"
                accept="image/*"
                icon="camera"
                onUpload={setImageUrl}
                initialImage={imageUrl}
              />
              <div className="bg-[#0a0e13] border border-dashed border-gray-800 rounded-xl p-6 flex flex-col justify-center items-center text-center h-full min-h-[160px]">
                {selectedLocation ? (
                  <>
                    <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mb-3">
                      <EnvironmentOutlined className="text-2xl text-green-500" />
                    </div>
                    <p className="text-green-400 font-medium">GPS Coordinates Set</p>
                    <div className="mt-2 text-xs text-gray-500 space-y-1">
                      <p>Lat: <span className="font-mono text-gray-400">{selectedLocation.lat.toFixed(6)}</span></p>
                      <p>Lng: <span className="font-mono text-gray-400">{selectedLocation.lng.toFixed(6)}</span></p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-3">
                      <EnvironmentOutlined className="text-2xl text-gray-600" />
                    </div>
                    <p className="text-gray-400 font-medium">No Location Pinned</p>
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-800">
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/20 transition-all active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? <LoadingOutlined className="mr-2" /> : null}
                {loading ? "Update" : "Update Arena"}
              </button>
            </div>
          </form>
        )}
      </div>
    </Drawer>
  );
}
