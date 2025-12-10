'use client'

import { HeartOutlined, LinkOutlined, ShareAltOutlined, MailOutlined, CommentOutlined } from '@ant-design/icons'
import { Button } from 'antd'

interface PitchType {
  label: string
  color: string
}

interface PitchCardProps {
  pitch: {
    id: number
    headline: string
    description: string
    arenaName: string
    address: string
    pitchTypes: PitchType[]
    facilities: string[]
    imageUrl?: string
    likes: number
    comments: number
  }
}

export default function PitchCard({ pitch }: PitchCardProps) {
  return (
    <div className="pitch-card">
      <div className="pitch-image">
        <div className="pitch-image-placeholder">
          <svg className="w-full h-full" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id={`grad-${pitch.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#1a3a2e', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#2f855a', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#1a3a2e', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <rect width="400" height="250" fill={`url(#grad-${pitch.id})`} />
            
            <rect x="150" y="80" width="100" height="90" fill="none" stroke="#4ade80" strokeWidth="2" opacity="0.6" />
            <line x1="200" y1="80" x2="200" y2="170" stroke="#4ade80" strokeWidth="2" opacity="0.6" />
            <circle cx="200" cy="125" r="20" fill="none" stroke="#4ade80" strokeWidth="2" opacity="0.6" />
            
            {Array.from({ length: 30 }, (_, i) => (
              <circle
                key={i}
                cx={Math.random() * 400}
                cy={Math.random() * 250}
                r={Math.random() * 4 + 2}
                fill="#22543d"
                opacity={Math.random() * 0.5 + 0.3}
              />
            ))}
          </svg>
        </div>
        <div className="pitch-image-title">{pitch.headline}</div>
      </div>

      <div className="pitch-content">
        <p className="pitch-description">{pitch.description}</p>

        <p className="pitch-full-description">
          Description of the Arena skdjf ook dlss dolf jdsd sdd slcs löod
          dsdlf dsoj sdkdf jdkdf dsld fdsla jfkdsj fklsd jfksdj fkdsd jfksdl jfdslj dldjs
          jfddsj fldld jfdskjf fldsdj fldld jfldkjlf lddsj fljdlj fklsdfljlföd
          jfldslj fldlkdjf dlfkljdjs dfljdsd fldkjflldkl flsdk jfldsldjfldslfjdlsdjfdsld
          jfdsjdsldsjfldskjfldsl
        </p>

        <div className="pitch-arena-info">
          <h4 className="arena-name">Arena name</h4>
          <p className="arena-address">{pitch.arenaName}</p>
          <p className="arena-address">{pitch.address}</p>
        </div>

        <div className="pitch-types">
          {pitch.pitchTypes.map((type, index) => (
            <span
              key={index}
              className="pitch-type-badge"
              style={{ backgroundColor: type.color }}
            >
              {type.label}
            </span>
          ))}
        </div>

        <div className="pitch-facilities">
          {pitch.facilities.map((facility, index) => (
            <span key={index} className="facility-badge">
              {facility}
            </span>
          ))}
        </div>

        <Button type="primary" size="large" block className="book-button">
          BOOK
        </Button>

        <div className="pitch-actions">
          <button className="action-icon">
            <HeartOutlined />
            <span>{pitch.likes}</span>
          </button>
          <button className="action-icon">
            <LinkOutlined />
          </button>
          <button className="action-icon">
            <ShareAltOutlined />
          </button>
          <button className="action-icon">
            <MailOutlined />
          </button>
          <button className="action-icon">
            <CommentOutlined />
            <span>{pitch.comments}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

