'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Map components (client only)
const MapContainer = dynamic(
  () => import('react-leaflet').then(m => m.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then(m => m.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then(m => m.Marker),
  { ssr: false }
)

interface Suggestion {
  display_name: string
  lat: string
  lon: string
}

export default function IndexPage() {
  const [address, setAddress] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(false)

  // 🔍 Fetch suggestions while typing (debounced)
  useEffect(() => {
    if (address.length < 3) {
      setSuggestions([])
      return
    }

    const timer = setTimeout(async () => {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}&limit=5`
      )
      const data = await res.json()
      setSuggestions(data || [])
    }, 400)

    return () => clearTimeout(timer)
  }, [address])

  // 📍 Convert selected address to map
  const handleShowOnMap = async () => {
    if (!address) return

    setLoading(true)

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}&limit=1`
    )
    const data = await res.json()

    if (!data || data.length === 0) {
      alert('Address not found')
      setLoading(false)
      return
    }

    setLocation({
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    })

    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 16 }}>
      {/* 🗺️ Map like profile image */}
      <div
        style={{
          height: 220,
          borderRadius: 12,
          overflow: 'hidden',
          marginBottom: 16,
          background: '#f0f0f0',
        }}
      >
        {location ? (
          <MapContainer
            center={[location.lat, location.lng]}
            zoom={15}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[location.lat, location.lng]} />
          </MapContainer>
        ) : (
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666',
              fontSize: 14,
            }}
          >
            Map Preview
          </div>
        )}
      </div>

      {/* 📝 Address input with suggestions */}
      <input
        list="address-suggestions"
        type="text"
        placeholder="Enter arena address"
        value={address}
        onChange={e => setAddress(e.target.value)}
        style={{
          width: '100%',
          padding: 10,
          marginBottom: 12,
          borderRadius: 6,
          border: '1px solid #ccc',
          backgroundColor: '#fff',
          color: '#000', // ✅ FIX TEXT VISIBILITY
          fontSize: 14,
        }}
      />

      <datalist id="address-suggestions">
        {suggestions.map((item, index) => (
          <option key={index} value={item.display_name} />
        ))}
      </datalist>

      <button
        onClick={handleShowOnMap}
        disabled={loading}
        style={{
          width: '100%',
          padding: 10,
          borderRadius: 6,
          background: '#1677ff',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontSize: 14,
        }}
      >
        {loading ? 'Finding location...' : 'Show on Map'}
      </button>
    </div>
  )
}
