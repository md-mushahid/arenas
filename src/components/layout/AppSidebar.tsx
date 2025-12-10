'use client'

import {
  HomeOutlined,
  TrophyOutlined,
  TeamOutlined,
  AppstoreOutlined,
} from '@ant-design/icons'

const menu = [
  { label: 'Feed', icon: <HomeOutlined /> },
  { label: 'Matches', icon: <TrophyOutlined /> },
  { label: 'Fantasy Manager', icon: <AppstoreOutlined /> },
  { label: 'Clubs & Teams', icon: <TeamOutlined /> },
  { label: 'Arenas', icon: <TrophyOutlined />, active: true },
]

export default function AppSidebar() {
  return (
    <aside className="hidden lg:flex w-64 flex-col bg-[#060A14] border-r border-white/10">
      <div className="p-6 text-xl font-semibold text-yellow-400">
        Zporter
      </div>

      <nav className="flex-1 space-y-2 px-4">
        {menu.map(item => (
          <div
            key={item.label}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
              ${item.active ? 'bg-yellow-500/10 text-yellow-400' : 'hover:bg-white/10'}
            `}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </aside>
  )
}
