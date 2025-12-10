'use client'
import { useState } from 'react'
import AddArena from './AddArena'

export default function ArenasHero() {
  const [open, setOpen] = useState(false)

  const onClose = () => {
    setOpen(false)
  }

  return (
    <section
      className="relative h-[420px] flex items-center justify-center text-center px-4 overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/image-1.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 space-y-4 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Find your Football Arena
        </h1>

        <p className="text-white/80 text-sm md:text-base">
          Add your football Arena to Zporter for free,
          <span
            onClick={() => setOpen(true)}
            className="underline cursor-pointer ml-1 text-blue-400"
          >
            click here
          </span>
        </p>
        <div className="text-green-400 text-sm font-medium">
          2 300 Arenas · Sweden · Active
        </div>
      </div>
      <AddArena open={open} onClose={onClose} />
    </section>
  )
}
