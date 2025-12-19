'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { message } from 'antd'
import 'leaflet/dist/leaflet.css'

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

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = require('react-leaflet').useMap()
  useEffect(() => {
    map.flyTo([lat, lng], 15)
  }, [lat, lng, map])
  return null
}

interface Suggestion {
  label: string
  lat: number
  lng: number
}

export default function IndexPage() {
  const [address, setAddress] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (address.length < 3) {
      setSuggestions([])
      return
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(address)}&limit=5`
        )
        const data = await res.json()

        // Photon returns GeoJSON
        const formattedSuggestions: Suggestion[] = data.features.map((feature: any) => {
          const { name, street, city, country, housenumber } = feature.properties

          // Construct a cleaner display label
          const labelParts = [name, housenumber, street, city, country].filter(Boolean)
          const label = labelParts.join(', ')

          return {
            label: label || feature.properties.formatted || "Unknown Location",
            lat: feature.geometry.coordinates[1],
            lng: feature.geometry.coordinates[0]
          }
        })

        setSuggestions(formattedSuggestions)
      } catch (error) {
        console.error("Error fetching suggestions:", error)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [address])

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    setAddress(suggestion.label)
    setLocation({ lat: suggestion.lat, lng: suggestion.lng })
    setSuggestions([]) // Hide suggestions after selection
  }

  const handleShowOnMap = () => {
    const match = suggestions.find(s => s.label === address)
    if (match) {
      handleSelectSuggestion(match)
    } else if (suggestions.length > 0) {
      // If no exact match but we have results, pick the first one
      handleSelectSuggestion(suggestions[0])
    } else {
      message.warning("No location found. Please select from the suggestions.")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value)
  }

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: 24, background: '#111620', borderRadius: 16, border: '1px solid #1f2937' }}>
      <h2 style={{ color: 'white', marginBottom: 16 }}>Accurate Location Search</h2>

      {/* 🗺️ Map */}
      <div
        style={{
          height: 300,
          borderRadius: 12,
          overflow: 'hidden',
          marginBottom: 20,
          background: '#1f2937',
          position: 'relative'
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
            <Recenter lat={location.lat} lng={location.lng} />
          </MapContainer>
        ) : (
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9ca3af',
              fontSize: 14,
            }}
          >
            Enter an address to preview map
          </div>
        )}
      </div>

      {/* 📝 Address input with suggestions */}
      <div style={{ marginBottom: 16, position: 'relative' }}>
        <input
          type="text"
          placeholder="Search arena... (e.g. Wembley Stadium)"
          value={address}
          onChange={handleInputChange}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: 8,
            border: '1px solid #374151',
            backgroundColor: '#0a0e13',
            color: 'white',
            fontSize: 14,
            outline: 'none'
          }}
        />

        {/* Custom Dropdown for better UX than datalist */}
        {suggestions.length > 0 && address.length >= 3 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: '#1f2937',
            border: '1px solid #374151',
            borderRadius: 8,
            marginTop: 4,
            zIndex: 1000,
            maxHeight: 200,
            overflowY: 'auto',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
          }}>
            {suggestions.map((item, index) => (
              <div
                key={index}
                onClick={() => handleSelectSuggestion(item)}
                style={{
                  padding: '10px 16px',
                  cursor: 'pointer',
                  color: '#e5e7eb',
                  borderBottom: index !== suggestions.length - 1 ? '1px solid #374151' : 'none',
                  fontSize: 14
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#374151'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {item.label}
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleShowOnMap}
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: 8,
          background: '#2563eb',
          color: '#fff',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          fontSize: 14,
          fontWeight: 600
        }}
      >
        Show on Map
      </button>
    </div>
  )
}
