'use client'

import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import { EnvironmentOutlined } from '@ant-design/icons'

// Dynamically import Map components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false })

interface ArenaMapProps {
  image?: string;
  lat?: number;
  lng?: number;
}

export default function ArenaMap({ image, lat, lng }: ArenaMapProps) {
  // If we have an image, show it
  if (image) {
    return (
      <section
        className="relative h-[420px] flex items-center justify-center text-center px-4 overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: `url('${image}')`,
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </section>
    )
  }

  // If no image but we have coordinates, show map
  if (lat && lng) {
    return (
      <section className="relative h-[420px] bg-[#1f2937]">
        <MapContainer
          center={[lat, lng]}
          zoom={15}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
          dragging={false} // Static map for banner feel
          doubleClickZoom={false}
          zoomControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[lat, lng]} />
        </MapContainer>
        {/* Overlay to integrate into dark theme better */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none z-[400]"></div>
      </section>
    )
  }

  // Fallback if neither
  return (
    <section
      className="relative h-[420px] flex items-center justify-center text-center px-4 overflow-hidden bg-[#111620] border-b border-gray-800"
    >
      <div className="flex flex-col items-center justify-center text-gray-500">
        <EnvironmentOutlined className="text-6xl mb-4 opacity-20" />
        <p className="font-medium text-lg">No cover image available</p>
      </div>
    </section>
  )
}