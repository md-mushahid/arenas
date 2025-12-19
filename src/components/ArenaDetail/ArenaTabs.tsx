'use client'

import { Tabs } from 'antd'
import { useState } from 'react'
import ArenaCalendar from './ArenaCalendar'
import SupportChat from './SupportChat'

const rules = [
  {
    id: "1",
    title: "Cancellation Policy",
    description:
      "Bookings may be cancelled free of charge up to 24 hours before the scheduled start time. Cancellations made within 24 hours of the booking time are non-refundable.",
  },
  {
    id: "2",
    title: "Refund Policy",
    description:
      "Approved refunds will be processed to the original payment method within 3–5 business days. Processing time may vary depending on the payment provider.",
  },
  {
    id: "3",
    title: "No-Show Policy",
    description:
      "Failure to arrive at the arena within 15 minutes of the booked start time will be considered a no-show. No refunds or rescheduling will be provided in such cases.",
  },
  {
    id: "4",
    title: "Late Arrival",
    description:
      "Late arrivals will not be granted time extensions. The booking will end at the originally scheduled time.",
  },
  {
    id: "5",
    title: "Usage Rules",
    description:
      "The arena must be used only for the purpose specified at the time of booking. Any misuse may result in immediate termination of the session without refund.",
  },
  {
    id: "6",
    title: "Damage & Liability",
    description:
      "Users are responsible for any damage caused to arena property or equipment during their booking and may be charged accordingly.",
  },
  {
    id: "7",
    title: "Safety & Conduct",
    description:
      "All participants must follow arena safety guidelines and staff instructions at all times. Unsafe behavior may result in removal from the premises.",
  },
  {
    id: "8",
    title: "Management Rights",
    description:
      "Arena management reserves the right to cancel or modify bookings due to maintenance, safety concerns, or unforeseen circumstances. In such cases, a full refund will be issued.",
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
