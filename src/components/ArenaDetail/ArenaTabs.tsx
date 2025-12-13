'use client'

import { Tabs } from 'antd'
import { useState } from 'react'
import ArenaCalendar from './ArenaCalendar'
import ContactUsForm from './.ContactUsForm'

const MediaTab = () => <div className="py-12 text-center text-gray-400">Media content</div>

export default function ArenaTabs() {
  const [activeTab, setActiveTab] = useState('calendar')

  const tabItems = [
    { key: 'calendar', label: 'Calendar', children: <ArenaCalendar /> },
    { key: 'media', label: 'Media', children: <MediaTab /> },
    { key: 'support', label: 'Support', children: <ContactUsForm/> },
  ]

  return (
    <div className="bg-[#0a0e13] border-b border-[#1f2937] px-4 md:px-8">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        className="arena-detail-tabs"
      />
    </div>
  )
}
