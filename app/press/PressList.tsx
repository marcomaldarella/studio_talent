'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { PressItem } from '../../types'
import '../../styles/press.css'

const PLACEHOLDERS: PressItem[] = Array.from({ length: 16 }, (_, i) => ({
  _id: `ph${i}`,
  publication: i % 2 === 0 ? 'AD Italia' : 'Domus',
  year: 2026,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in mi risus.',
}))

export default function PressList({ items }: { items: PressItem[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const list = items.length > 0 ? items : PLACEHOLDERS
  const hovered = list.find((p) => p._id === hoveredId)

  return (
    <div className="st-press-body">
      {/* Left column: hover image */}
      <div className="st-press-left">
        {hovered?.coverImage && (
          <Image
            src={hovered.coverImage}
            alt={hovered.publication}
            width={120}
            height={160}
            className={`st-press-hover-img${hoveredId ? ' visible' : ''}`}
          />
        )}
      </div>

      {/* Right column: list */}
      <div className="st-press-list">
        {list.map((item) => {
          const isHovered = hoveredId === item._id
          const Tag = item.link ? 'a' : 'div'
          const linkProps = item.link
            ? { href: item.link, target: '_blank', rel: 'noopener noreferrer' }
            : {}

          return (
            <Tag
              key={item._id}
              className={`st-press-item${item.link ? ' has-link' : ''}`}
              onMouseEnter={() => setHoveredId(item._id)}
              onMouseLeave={() => setHoveredId(null)}
              {...linkProps}
            >
              <div className="st-press-item-header">
                <span className={`st-press-item-pub${isHovered ? ' active-pub' : ''}`}>
                  {isHovered && <span className="st-press-active-dot">■</span>}
                  {item.publication}
                </span>
              </div>
              <div className="st-press-item-meta">
                <span className="st-press-item-year">{item.year}</span>
              </div>
              {item.description && (
                <p className="st-press-item-desc">{item.description}</p>
              )}
            </Tag>
          )
        })}
      </div>
    </div>
  )
}
