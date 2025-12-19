'use client'
import React from 'react'
import Link from 'next/link'
import { ArrowRightOutlined, TrophyOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { useAuthState } from '@/hooks/useAuthState'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { Avatar, Dropdown } from 'antd'

export default function LandingPage() {
  const { user, handleLogout } = useAuthState()
  const { userInfo } = useCurrentUser(user)

  return (
    <div className="min-h-screen bg-[#0a0e13] text-white flex flex-col relative overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1522778119026-d647f0565c6a?q=80&w=2940&auto=format&fit=crop')"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e13]/90 via-[#0a0e13]/80 to-[#0a0e13]"></div>
      </div>
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <TrophyOutlined className="text-3xl text-yellow-500" />
          <span className="text-2xl font-bold tracking-tight text-white">Zporter</span>
        </div>
        <div className="flex items-center gap-6">
          {user ? (
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'dashboard',
                    label: (
                      <Link href={`/dashboard/${user.uid}`} className="block px-2 py-1">
                        {userInfo?.name || user?.displayName || 'User'}
                      </Link>
                    ),
                    icon: <UserOutlined />,
                  },
                  {
                    type: 'divider',
                  },
                  {
                    key: 'logout',
                    label: 'Logout',
                    icon: <LogoutOutlined />,
                    danger: true,
                    onClick: () => {
                      handleLogout()
                    },
                  },
                ],
              }}
              placement="bottomRight"
              trigger={['click']}
            >
              <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                <Avatar
                  size={40}
                  src={userInfo?.photoURL || user?.photoURL}
                  icon={<UserOutlined />}
                  className="border-2 border-yellow-500/50"
                />
              </div>
            </Dropdown>
          ) : (
            <>
              <Link href="/login" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Log In
              </Link>
              <Link
                href="/signup"
                className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-fade-in pb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-sm">
          <span>Arena Booking Platform</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent drop-shadow-sm">
          Play Like a Pro. <br />
          <span className="text-white">Book in Seconds.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed">
          Find and book top-rated football arenas near you. Manage your team, schedule matches, and handle payments—all in one place.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/arenas"
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all transform hover:translate-y-[-2px] hover:shadow-lg hover:shadow-blue-600/30 flex items-center justify-center gap-2 group"
          >
          Arenas
            <ArrowRightOutlined className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 text-center opacity-80">
          <div>
            <p className="text-3xl font-bold text-white">50+</p>
            <p className="text-gray-500 text-sm uppercase tracking-wider mt-1">Premium Arenas</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">10k+</p>
            <p className="text-gray-500 text-sm uppercase tracking-wider mt-1">Happy Players</p>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="text-3xl font-bold text-white">24/7</p>
            <p className="text-gray-500 text-sm uppercase tracking-wider mt-1">Instant Booking</p>
          </div>
        </div>
      </main>
      <footer className="relative z-10 py-6 text-center text-gray-600 text-sm border-t border-white/5 bg-[#0a0e13]/90 backdrop-blur-xl">
        <p>&copy; {new Date().getFullYear()} Zporter. All rights reserved.</p>
      </footer>
    </div>
  )
}
