'use client'
import {
  HomeOutlined,
  TrophyOutlined,
  LoginOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { useSidebarStore } from '@/store/useSidebarStore'
import { useRouter } from 'next/navigation'
import { useAuthState } from '@/hooks/useAuthState'
import { Spin } from 'antd'

export default function AppSidebar() {
  const { user, loading, handleLogout } = useAuthState()
  const { isOpen, toggle } = useSidebarStore()
  const router = useRouter()
  const menu = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: <HomeOutlined />,
      path: `/dashboard/${user?.uid}`,
      show: user?.uid,
    },
    { key: 'arenas', label: 'Arenas', icon: <TrophyOutlined />, path: '/arenas', show: true },
    !user?.uid
      ? { key: 'login', label: 'Login', icon: <LoginOutlined />, path: '/login', show: true }
      : { key: 'logout', label: 'Logout', icon: <LogoutOutlined />, action: handleLogout, show: true },
  ]

  const handleClick = (item: any) => {
    if (item.path) {
      router.push(item.path)
    } else if (item.action) {
      item.action()
    }
  }
  if (loading) return <Spin />
  return (
    <aside
      className={`
        bg-[#060A14] border-r border-white/10
        transition-all duration-300
        flex flex-col
        ${isOpen ? 'w-64' : 'w-16'}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        {isOpen && <span className="text-xl font-semibold text-yellow-400">Zporter</span>}

        <div onClick={toggle} className="cursor-pointer text-white text-lg">
          {isOpen ? '❮' : '❯'}
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-1 px-2">
        {menu
          .filter((item) => item.show)
          .map((item) => (
            <div
              key={item.key}
              onClick={() => handleClick(item)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
                ${item.key === 'arenas' ? 'bg-yellow-500/10 text-yellow-400' : 'hover:bg-white/10 text-white'}
              `}
            >
              {item.icon}
              {isOpen && <span>{item.label}</span>}
            </div>
          ))}
      </nav>
    </aside>
  )
}
