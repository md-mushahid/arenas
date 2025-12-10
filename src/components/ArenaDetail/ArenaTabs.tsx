'use client'

import { Tabs } from 'antd'
import { useState } from 'react'

// Dummy components for each tab
const StartTab = () => <div className="py-12 text-center text-gray-400">Start content</div>
const CalendarTab = () => <div className="py-12 text-center text-gray-400">Calendar content</div>
const PithesTab = () => <div className="py-12 text-center text-gray-400">Pithes content</div>
const RoomsTab = () => <div className="py-12 text-center text-gray-400">Rooms content</div>
const OtherTab = () => <div className="py-12 text-center text-gray-400">Other content</div>
const FactsTab = () => <div className="py-12 text-center text-gray-400">Facts content</div>
const MediaTab = () => <div className="py-12 text-center text-gray-400">Media content</div>
const HistoryTab = () => <div className="py-12 text-center text-gray-400">History content</div>
const FaqTab = () => <div className="py-12 text-center text-gray-400">FAQ content</div>
const SupportTab = () => <div className="py-12 text-center text-gray-400">Support content</div>

export default function ArenaTabs() {
  const [activeTab, setActiveTab] = useState('start')

  const tabItems = [
    { key: 'start', label: 'Start', children: <StartTab /> },
    { key: 'calendar', label: 'Calendar', children: <CalendarTab /> },
    { key: 'pithes', label: 'Pithes', children: <PithesTab /> },
    { key: 'rooms', label: 'Rooms', children: <RoomsTab /> },
    { key: 'other', label: 'Other', children: <OtherTab /> },
    { key: 'facts', label: 'Facts', children: <FactsTab /> },
    { key: 'media', label: 'Media', children: <MediaTab /> },
    { key: 'history', label: 'History', children: <HistoryTab /> },
    { key: 'faq', label: 'FAQ', children: <FaqTab /> },
    { key: 'support', label: 'Support', children: <SupportTab /> },
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
