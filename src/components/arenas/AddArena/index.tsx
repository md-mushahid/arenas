'use client'

import { Drawer, Tabs } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { useState } from 'react'
import NameTab from './NameTab'

interface AddArenaDrawerProps {
  open: boolean
  onClose: () => void
}

export default function AddArenaDrawer({ open, onClose }: AddArenaDrawerProps) {
  const [activeTab, setActiveTab] = useState('name')

  const tabItems = [
    {
      key: 'name',
      label: 'Name',
      children: <NameTab onClose={onClose} />,
    },
  ]

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size={'large'}
      closeIcon={null}
      styles={{
        header: { display: 'none' },
        body: { padding: 0, background: '#0a0e13' },
      }}
    >
      <div className="sticky top-0 z-10 bg-[#0a0e13] border-b border-[#2a3142] px-8 py-6 flex items-center justify-between">
        <h2 className="text-white text-2xl font-semibold">Add Arena</h2>
        
        <div className="flex items-center gap-6">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-[#252d3f] rounded-lg"
          >
            <CloseOutlined className="text-xl" />
          </button>
        </div>
      </div>

      <div className="px-8">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
        />
      </div>
    </Drawer>
  )
}