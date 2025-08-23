'use client'

import React, { useState } from 'react'
import { truncateText, needsTruncation } from '@/lib/textUtils'

interface ExpandableDescriptionProps {
  text: string
  maxLength?: number
  className?: string
  showToggle?: boolean
}

export default function ExpandableDescription({ 
  text, 
  maxLength = 150, 
  className = '',
  showToggle = true 
}: ExpandableDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  if (!text) return null
  
  const shouldTruncate = needsTruncation(text, maxLength)
  const displayText = shouldTruncate && !isExpanded 
    ? truncateText(text, maxLength) 
    : text

  return (
    <div className={`expandable-description ${className}`}>
      <p className="description-text">
        {displayText}
      </p>
      {shouldTruncate && showToggle && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="toggle-description-btn"
          aria-label={isExpanded ? 'Tampilkan lebih sedikit' : 'Tampilkan lebih banyak'}
        >
          {isExpanded ? 'Tampilkan lebih sedikit' : 'Selengkapnya'}
        </button>
      )}
    </div>
  )
}