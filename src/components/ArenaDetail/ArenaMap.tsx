'use client'

interface ArenaMapProps {
  image?: string;
}

export default function ArenaMap({ image }: ArenaMapProps) {
  return (
    <section
      className="relative h-[420px] flex items-center justify-center text-center px-4 overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: `url('${image || '/images/image-1.jpg'}')`,
      }}
    >
      {/* Optional: Add content overlay if needed, currently empty as per request */}
    </section>
  )
}