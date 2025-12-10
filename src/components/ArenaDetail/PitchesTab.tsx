'use client'

import { SearchOutlined, SwapOutlined, MenuOutlined } from '@ant-design/icons'
import PitchCard from './PitchCard'

interface Pitch {
  id: number
  headline: string
  description: string
  arenaName: string
  address: string
  pitchTypes: { label: string; color: string }[]
  facilities: string[]
  imageUrl?: string
  likes: number
  comments: number
}

export default function PitchesTab() {
  const pitches: Pitch[] = [
    {
      id: 1,
      headline: 'Pitches Headline',
      description: 'Ingress about this Pitch in the arena in up to 2 rows of text ksdf lskdj fdlkdj fdlas jdkfs',
      arenaName: 'Drotsvägen 1',
      address: 'SE-191 33, Sollentuna',
      pitchTypes: [
        { label: '11v11', color: '#10b981' },
        { label: '7v7', color: '#6366f1' },
        { label: '5v5', color: '#8b5cf6' },
      ],
      facilities: ['Gym', 'Sports Hall', 'D.Room', 'D.Room', 'D.Room', 'D.Room', 'M.Room', 'M.Room', 'Cafe', 'Restaurant'],
      likes: 48,
      comments: 15,
    },
    {
      id: 2,
      headline: 'Pitches Headline',
      description: 'Ingress about the arena in up to 2 rows of text ksdf lskdj fdlkdj fdlas jdkfs',
      arenaName: 'Drotsvägen 1',
      address: 'SE-191 33, Sollentuna',
      pitchTypes: [
        { label: '11v11', color: '#10b981' },
        { label: '7v7', color: '#6366f1' },
        { label: '5v5', color: '#8b5cf6' },
      ],
      facilities: ['Gym', 'Sports Hall', 'D.Room', 'D.Room', 'D.Room', 'D.Room', 'M.Room', 'M.Room', 'Cafe', 'Restaurant'],
      likes: 48,
      comments: 15,
    },
    {
      id: 3,
      headline: 'Pitches Headline',
      description: 'Ingress about the arena in up to 2 rows of text ksdf lskdj fdlkdj fdlas jdkfs',
      arenaName: 'Drotsvägen 1',
      address: 'SE-191 33, Sollentuna',
      pitchTypes: [
        { label: '11v11', color: '#10b981' },
        { label: '7v7', color: '#6366f1' },
        { label: '5v5', color: '#8b5cf6' },
      ],
      facilities: ['Gym', 'Sports Hall', 'D.Room', 'D.Room', 'D.Room', 'D.Room', 'M.Room', 'M.Room', 'Cafe', 'Restaurant'],
      likes: 48,
      comments: 15,
    },
  ]

  return (
    <div className="pitches-tab-container">
      {/* Header */}
      <div className="pitches-header">
        <div className="pitches-header-info">
          <span className="pitches-count">3</span>
          <span className="pitches-label">Arenas - Football - All - Active</span>
        </div>

        <div className="pitches-actions">
          <button className="action-btn">
            <SearchOutlined />
          </button>
          <button className="action-btn">
            <SwapOutlined />
          </button>
          <button className="action-btn">
            <MenuOutlined />
          </button>
        </div>
      </div>

      <div className="pitches-grid">
        {pitches.map((pitch) => (
          <PitchCard key={pitch.id} pitch={pitch} />
        ))}
      </div>
    </div>
  )
}

