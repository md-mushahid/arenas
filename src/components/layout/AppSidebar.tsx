'use client'
import {
  HomeOutlined,
  TrophyOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useSidebarStore } from '@/store/useSidebarStore'
import { useRouter } from 'next/navigation'
import { useAuthState } from '@/hooks/useAuthState'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { Spin, Avatar } from 'antd'

export default function AppSidebar() {
  const { user, loading, handleLogout } = useAuthState()
  const { userInfo } = useCurrentUser(user)
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
      <div className="flex items-center justify-between p-4 mb-4">
        {isOpen && <span className="text-xl font-semibold text-yellow-400">Zporter</span>}

        <div onClick={toggle} className="cursor-pointer text-white text-lg hover:text-yellow-400 transition-colors">
          {isOpen ? '❮' : '❯'}
        </div>
      </div>

      {/* User Info Section (Only when Open and Logged In) */}
      {isOpen && user && (
        <div className="flex flex-col items-center mb-6 px-4 text-center animate-fadeIn">
          <Avatar 
            size={64} 
            src={userInfo?.photoURL || user?.photoURL} 
            icon={<UserOutlined />} 
            className="mb-2 border-2 border-yellow-400/50"
          />
          <h3 className="text-white font-medium truncate w-full">
            {userInfo?.name || user?.displayName || 'User'}
          </h3>
          <p className="text-gray-400 text-xs mb-3 truncate w-full">{user?.email}</p>
        </div>
      )}

      {/* Menu */}
      <nav className="flex-1 space-y-1 px-2">
        {menu
          .filter((item) => item.show)
          .map((item) => (
            <div
              key={item.key}
              onClick={() => handleClick(item)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors
                ${item.key === 'arenas' ? 'bg-yellow-500/10 text-yellow-400' : 'hover:bg-white/10 text-white'}
              `}
              title={!isOpen ? item.label : ''}
            >
              <div className="text-lg">{item.icon}</div>
              {isOpen && <span className="text-sm">{item.label}</span>}
            </div>
          ))}
      </nav>
    </aside>
  )
}
