'use client'

import dynamic from 'next/dynamic'
import '@/utils/leafletIcon'

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

export default function ArenaMap({
  lat,
  lng,
}: {
  lat: number
  lng: number
}) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={14}
      style={{ height: 200, width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[lat, lng]} />
    </MapContainer>
  )
}
