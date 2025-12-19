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
  name?: string;
}

export default function ArenaMap({ image, lat, lng, name }: ArenaMapProps) {
  console.log("image", image);
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
        {name && (
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
              {name}
            </h1>
          </div>
        )}
      </section>
    )
  }
  if (lat && lng) {
    const customIcon = typeof window !== 'undefined' ? require('leaflet').divIcon({
      html: `
        <div style="
          position: relative;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content;
          center;
        ">
          <svg 
            width="40" 
            height="40" 
            viewBox="0 0 24 24" 
            fill="#EF4444" 
            stroke="#DC2626" 
            stroke-width="1.5"
            style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));"
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      `,
      className: 'custom-marker-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    }) : null

    return (
      <section className="relative h-[420px] bg-[#1f2937]">
        <MapContainer
          center={[lat, lng]}
          zoom={15}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
          dragging={false}
          doubleClickZoom={false}
          zoomControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {customIcon && <Marker position={[lat, lng]} icon={customIcon} />}
        </MapContainer>
        <div className="absolute inset-0 bg-black/20 pointer-events-none z-[400]"></div>
        {name && (
          <div className="absolute bottom-6 left-6 z-[500] bg-black/70 backdrop-blur-md px-6 py-3 rounded-xl border border-white/10">
            <h2 className="text-2xl font-bold text-white drop-shadow-lg">
              {name}
            </h2>
          </div>
        )}
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