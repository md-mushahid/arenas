'use client'

import { Tabs } from 'antd'
import { useState } from 'react'
import ArenaCalendar from './ArenaCalendar'
import SupportChat from './SupportChat'

const rules = [
  {
    id: "1",
    title: "Cancellation",
    description: "You can cancel your booking up to 24 hours before the start time.",
  },
  {
    id: "2",
    title: "Refund",
    description: "Refunds are processed within 3-5 business days.",
  },
  {
    id: "3",
    title: "No-shows",
    description: "No refund for no-shows. Please arrive on time.",
  },
];

const MediaTab = () => <div className="py-12 text-center text-gray-400">Media content</div>

export default function ArenaTabs({ arena }: any) {
  const [activeTab, setActiveTab] = useState('calendar')
  const tabItems = [
    { key: 'calendar', label: 'Calendar', children: <ArenaCalendar arena={arena} /> },
    { key: 'support', label: 'Support', children: <SupportChat rules={rules} /> },
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
