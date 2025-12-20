"use client";
import React, { useState, useEffect } from "react";
import { message } from "antd"; // Keep message for toasts
import UploadCard from "./UploadCard";
import { useAuthState } from "@/hooks/useAuthState";
import { auth } from "@/lib/firebaseConfig";
import { EnvironmentOutlined, DollarOutlined, MailOutlined, PhoneOutlined, LoadingOutlined } from "@ant-design/icons";

interface Suggestion {
  label: string;
  lat: number;
  lng: number;
  city?: string;
  country?: string;
}

export default function NameTab({ onClose }: { onClose: () => void }) {
  const { user } = useAuthState();
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
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

  // Validation errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Location Search State
  const [addressQuery, setAddressQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationSelected, setLocationSelected] = useState(false);

  // Validation functions
  const validateName = (value: string): string => {
    if (!value) return "Arena name is required";
    if (value.length < 3) return "Arena name must be at least 3 characters";
    return "";
  };

  const validateAddress = (): string => {
    if (!addressQuery) return "Address is required";
    if (!locationSelected) return "Please select an address from the dropdown suggestions";
    return "";
  };

  const validateCity = (value: string): string => {
    if (!value) return "City is required";
    return "";
  };

  const validateCountry = (value: string): string => {
    if (!value) return "Country is required";
    return "";
  };

  const validateEmail = (value: string): string => {
    if (!value) return ""; // Email is optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Please enter a valid email address";
    return "";
  };

  const validatePhone = (value: string): string => {
    if (!value) return ""; // Phone is optional
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    if (!phoneRegex.test(value)) return "Please enter a valid phone number";
    return "";
  };

  const validatePrice = (value: string): string => {
    if (!value) return "Hourly rate is required";
    const price = parseFloat(value);
    if (isNaN(price)) return "Please enter a valid number";
    if (price <= 0) return "Price must be greater than 0";
    return "";
  };

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Handle blur to validate
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let error = "";

    switch (name) {
      case "name":
        error = validateName(value);
        break;
      case "city":
        error = validateCity(value);
        break;
      case "country":
        error = validateCountry(value);
        break;
      case "contact_email":
        error = validateEmail(value);
        break;
      case "contact_number":
        error = validatePhone(value);
        break;
      case "price_per_hour":
        error = validatePrice(value);
        break;
    }

    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  // Debounced Search for Photon API
  useEffect(() => {
    if (addressQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(addressQuery)}&limit=5`
        );
        const data = await res.json();

        const formattedSuggestions: Suggestion[] = data.features.map((feature: any) => {
          const { name, street, city, country, housenumber } = feature.properties;
          const labelParts = [name, housenumber, street, city, country].filter(Boolean);

          return {
            label: labelParts.join(", ") || feature.properties.formatted,
            lat: feature.geometry.coordinates[1],
            lng: feature.geometry.coordinates[0],
            city: city || feature.properties.city,
            country: country || feature.properties.country,
          };
        });

        setSuggestions(formattedSuggestions);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [addressQuery]);

  const handleSelectLocation = (suggestion: Suggestion) => {
    setAddressQuery(suggestion.label);
    setSuggestions([]);
    setSelectedLocation({ lat: suggestion.lat, lng: suggestion.lng });
    setLocationSelected(true);
    // Clear address error when location is selected
    setErrors(prev => ({ ...prev, address: "" }));

    setFormData((prev) => ({
      ...prev,
      address: suggestion.label,
      city: suggestion.city || prev.city,
      country: suggestion.country || prev.country,
      latitude: suggestion.lat,
      longitude: suggestion.lng,
    }));
  };

  // Clear location selected flag when user types
  const handleAddressQueryChange = (value: string) => {
    setAddressQuery(value);
    if (locationSelected) {
      setLocationSelected(false);
      setErrors(prev => ({ ...prev, address: "Please select an address from suggestions" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      message.error("You must be logged in to create an arena");
      return;
    }

    // Validate all fields
    const validationErrors: Record<string, string> = {
      name: validateName(formData.name),
      address: validateAddress(),
      city: validateCity(formData.city),
      country: validateCountry(formData.country),
      contact_email: validateEmail(formData.contact_email),
      contact_number: validatePhone(formData.contact_number),
      price_per_hour: validatePrice(formData.price_per_hour),
    };

    // Filter out empty errors
    const filteredErrors = Object.fromEntries(
      Object.entries(validationErrors).filter(([_, value]) => value !== "")
    );

    if (Object.keys(filteredErrors).length > 0) {
      setErrors(filteredErrors);
      message.error("Please fix all validation errors before submitting");
      return;
    }

    setLoading(true);
    setLoadingMessage("Creating arena...");

    try {
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) throw new Error("Failed to get authentication token");

      const response = await fetch("/api/arena", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          ...formData,
          price_per_hour: parseFloat(formData.price_per_hour) || 0,
          cover_image_url: imageUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create arena");
      }

      message.success("Arena created successfully!");
      setLoadingMessage("Redirecting...");

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
      setLocationSelected(false);
      setErrors({});

      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 500);
    } catch (error: any) {
      console.error("Error creating arena:", error);
      message.error(error.message || "Failed to create arena. Please try again.");
      setLoadingMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Arena Name <span className="text-red-500">*</span></label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="e.g. Grand Central Stadium"
          className={`w-full bg-[#0a0e13] border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:ring-1 transition-colors outline-none ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500'
            }`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
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
            onChange={(e) => handleAddressQueryChange(e.target.value)}
            placeholder="Type to search (e.g. 123 Main St...)"
            className={`w-full bg-[#0a0e13] border rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:ring-1 transition-colors outline-none ${errors.address ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500'
              }`}
            autoComplete="off"
          />
          {searching && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <LoadingOutlined className="text-blue-500" />
            </div>
          )}
        </div>
        {!errors.address && (
          <p className="text-xs text-gray-500">Search and select to auto-fill coordinates and city</p>
        )}
        {errors.address && (
          <p className="text-red-500 text-sm mt-1">{errors.address}</p>
        )}

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute top-[80px] left-0 right-0 bg-[#1f2937] border border-gray-600 rounded-lg z-50 shadow-2xl max-h-60 overflow-y-auto">
            {suggestions.map((item, idx) => (
              <div
                key={idx}
                className="px-4 py-3 hover:bg-[#374151] cursor-pointer text-gray-200 text-sm border-b border-gray-700 last:border-0 transition-colors flex items-center gap-2"
                onClick={() => handleSelectLocation(item)}
              >
                <EnvironmentOutlined className="text-blue-500 shrink-0" />
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
            onBlur={handleBlur}
            className={`w-full bg-[#0a0e13] border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:ring-1 transition-colors outline-none ${errors.city ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500'
              }`}
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Country <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full bg-[#0a0e13] border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:ring-1 transition-colors outline-none ${errors.country ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500'
              }`}
          />
          {errors.country && (
            <p className="text-red-500 text-sm mt-1">{errors.country}</p>
          )}
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
              onBlur={handleBlur}
              placeholder="0.00"
              min="0"
              step="0.01"
              className={`w-full bg-[#0a0e13] border rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:ring-1 transition-colors outline-none ${errors.price_per_hour ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500'
                }`}
            />
          </div>
          {errors.price_per_hour && (
            <p className="text-red-500 text-sm mt-1">{errors.price_per_hour}</p>
          )}
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
              onBlur={handleBlur}
              placeholder="arena@example.com"
              className={`w-full bg-[#0a0e13] border rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:ring-1 transition-colors outline-none ${errors.contact_email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500'
                }`}
            />
          </div>
          {errors.contact_email && (
            <p className="text-red-500 text-sm mt-1">{errors.contact_email}</p>
          )}
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
              onBlur={handleBlur}
              placeholder="+1234567890"
              className={`w-full bg-[#0a0e13] border rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:ring-1 transition-colors outline-none ${errors.contact_number ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500'
                }`}
            />
          </div>
          {errors.contact_number && (
            <p className="text-red-500 text-sm mt-1">{errors.contact_number}</p>
          )}
        </div>
      </div>

      {/* Image Upload & Map Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <UploadCard
          title="Cover Image (Optional)"
          accept="image/*"
          icon="camera"
          onUpload={setImageUrl}
        />

        <div className="bg-[#0a0e13] border border-dashed border-gray-800 rounded-xl p-6 flex flex-col justify-center items-center text-center h-full min-h-[160px]">
          {selectedLocation ? (
            <>
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mb-3">
                <EnvironmentOutlined className="text-2xl text-green-500" />
              </div>
              <p className="text-green-400 font-medium">Location Pinned</p>
              <div className="mt-2 text-xs text-gray-500 space-y-1">
                <p>Latitude: <span className="font-mono text-gray-400">{selectedLocation.lat.toFixed(6)}</span></p>
                <p>Longitude: <span className="font-mono text-gray-400">{selectedLocation.lng.toFixed(6)}</span></p>
              </div>
            </>
          ) : (
            <>
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-3">
                <EnvironmentOutlined className="text-2xl text-gray-600" />
              </div>
              <p className="text-gray-400 font-medium">No Location Selected</p>
              <p className="text-xs text-gray-600 mt-2 max-w-[200px]">Search for an address above to auto-pin the GPS coordinates.</p>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-800">
        <button
          type="submit"
          disabled={loading}
          className={`px-8 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/20 transition-all active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <LoadingOutlined />
              {loadingMessage || 'Creating...'}
            </span>
          ) : 'Create Arena'}
        </button>
      </div>
    </form>
  );
}