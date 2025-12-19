import ArenaMap from './ArenaMap'

interface Arena {
  name: string
  image?: string | null
  latitude: number
  longitude: number
  distance?: number
}

export default function ArenaCard({ arena }: { arena: Arena }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: 12 }}>
      <h3>{arena.name}</h3>

      {arena?.image ? (
        <img
          src={arena.image}
          alt={arena.name}
          style={{ width: '100%', height: 200, objectFit: 'cover' }}
        />
      ) : (
        <ArenaMap lat={arena.latitude} lng={arena.longitude} />
      )}

      {arena.distance && (
        <p>{arena.distance.toFixed(2)} km away</p>
      )}
    </div>
  )
}
