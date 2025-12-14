'use client'

interface Facility {
  name: string
  status: string
}

interface ArenaMapProps {
  facilities: Facility[]
}

export default function ArenaMap({ facilities }: ArenaMapProps) {

  return(<section
      className="relative h-[420px] flex items-center justify-center text-center px-4 overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/image-1.jpg')",
      }}
    ></section>)
  return (
    <div className="relative h-[400px] md:h-[500px] bg-gradient-to-br from-[#1a3a2e] via-[#2a4a3e] to-[#1a3a2e] overflow-hidden">
      {/* Simulated Satellite Map Background */}
      <div className="absolute inset-0 opacity-40">
        <svg className="w-full h-full" viewBox="0 0 1200 500">
          {/* Roads/Paths */}
          <path
            d="M 0,200 Q 300,180 600,220 T 1200,200"
            stroke="#4a5568"
            strokeWidth="3"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M 400,0 Q 420,200 450,500"
            stroke="#4a5568"
            strokeWidth="2"
            fill="none"
            opacity="0.5"
          />
          <path
            d="M 700,0 Q 680,250 700,500"
            stroke="#4a5568"
            strokeWidth="2"
            fill="none"
            opacity="0.5"
          />
          <rect x="320" y="280" width="120" height="80" fill="#2d3748" opacity="0.7" />
          <rect x="460" y="320" width="80" height="60" fill="#2d3748" opacity="0.6" />
          
          <ellipse cx="600" cy="300" rx="100" ry="80" fill="#2f855a" opacity="0.5" />
          <ellipse cx="800" cy="250" rx="80" ry="60" fill="#2f855a" opacity="0.4" />

          {Array.from({ length: 50 }, (_, i) => (
            <circle
              key={i}
              cx={Math.random() * 1200}
              cy={Math.random() * 500}
              r={Math.random() * 3 + 1}
              fill="#22543d"
              opacity={Math.random() * 0.3 + 0.2}
            />
          ))}
        </svg>
      </div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <div className="absolute top-[-80px] left-[-20px]">
            <div className="relative">
              <div className="w-10 h-10 bg-[#10b981] rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-[#1f2937] px-3 py-2 rounded shadow-lg whitespace-nowrap">
                <p className="text-white text-sm font-medium">{facilities[0]?.name}</p>
                <p className="text-green-400 text-xs">{facilities[0]?.status}</p>
              </div>
            </div>
          </div>

          <div className="absolute top-[60px] left-[100px]">
            <div className="relative">
              <div className="w-10 h-10 bg-[#10b981] rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-[#1f2937] px-3 py-2 rounded shadow-lg whitespace-nowrap">
                <p className="text-white text-sm font-medium">{facilities[1]?.name}</p>
                <p className="text-gray-400 text-xs">{facilities[1]?.status}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button className="w-10 h-10 bg-white rounded shadow-lg hover:bg-gray-100 transition-colors flex items-center justify-center text-xl font-bold">
          +
        </button>
        <button className="w-10 h-10 bg-white rounded shadow-lg hover:bg-gray-100 transition-colors flex items-center justify-center text-xl font-bold">
          −
        </button>
      </div>
    </div>
  )
}