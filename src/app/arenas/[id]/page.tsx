'use client'
import ArenaMap from "@/components/ArenaDetail/ArenaMap"
import ArenaTabs from "@/components/ArenaDetail/ArenaTabs"

export default function ArenaDetailPage() {
  const arenaData = {
    name: 'Helenelunds IP',
    location: 'Sollentuna, Sweden',
    coordinates: { lat: 59.4167, lng: 17.9833 },
    facilities: [
      { name: 'Sollentuna Fotbollsklubb', status: 'Recently viewed' },
      { name: 'Edsberg Sportfält', status: 'Active' },
    ],
  }

  return (
    <div className="min-h-screen bg-[#0a0e13]">
      <ArenaMap facilities={arenaData.facilities} />
      <ArenaTabs />
    </div>
  )
}