type P = { color?: string; size?: number }

export function IconPlant({ color = 'currentColor', size = 22 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21v-7"/>
      <path d="M12 14c-3 0-5-2-5-5 0-1 0-3 1-4 3 0 4 2 4 5"/>
      <path d="M12 14c3 0 5-2 5-5 0-1 0-3-1-4-3 0-4 2-4 5"/>
    </svg>
  )
}

export function IconCalendar({ color = 'currentColor', size = 22 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round">
      <rect x="3" y="5" width="18" height="16" rx="2"/>
      <path d="M3 10h18M8 3v4M16 3v4"/>
    </svg>
  )
}

export function IconDrop({ color = 'currentColor', size = 22 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3s6 6.5 6 11a6 6 0 1 1-12 0c0-4.5 6-11 6-11z"
        fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  )
}

export function IconDropFill({ color = '#3b82f6', size = 16 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3s6 6.5 6 11a6 6 0 1 1-12 0c0-4.5 6-11 6-11z" fill={color}/>
    </svg>
  )
}

export function IconMenu({ color = 'currentColor', size = 22 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h16"/>
    </svg>
  )
}

export function IconBell({ color = 'currentColor', size = 22 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
      <path d="M10 21a2 2 0 0 0 4 0"/>
    </svg>
  )
}

export function IconPlus({ color = 'currentColor', size = 22 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  )
}

export function IconChevronRight({ color = 'currentColor', size = 18 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 6 15 12 9 18"/>
    </svg>
  )
}

export function IconChevronLeft({ color = 'currentColor', size = 18 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 6 9 12 15 18"/>
    </svg>
  )
}

export function IconSun({ color = 'currentColor', size = 14 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>
    </svg>
  )
}

export function IconLeaf({ color = 'currentColor', size = 16 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 3c-6 0-11 3-13 8-1.5 4 1 8 5 8 5 0 8-5 8-13V3z"/>
      <path d="M13 11c-2 2-4 5-5 9"/>
    </svg>
  )
}

export function IconScissors({ color = 'currentColor', size = 18 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="3"/>
      <circle cx="6" cy="18" r="3"/>
      <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"/>
    </svg>
  )
}

export function IconThermo({ color = 'currentColor', size = 18 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4a2 2 0 1 0-4 0v10a4 4 0 1 0 4 0V4z"/>
    </svg>
  )
}

export function IconDots({ color = 'currentColor', size = 18 }: P) {
  return (
    <svg width={size} height="4" viewBox="0 0 18 4" fill={color}>
      <circle cx="2" cy="2" r="2"/>
      <circle cx="9" cy="2" r="2"/>
      <circle cx="16" cy="2" r="2"/>
    </svg>
  )
}

export function IconClose({ color = 'currentColor', size = 16 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18"/>
    </svg>
  )
}

export function IconCamera({ color = 'currentColor', size = 22 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <circle cx="12" cy="14" r="3.5"/>
      <path d="M8.5 7l1.5-2.5h4L15.5 7"/>
    </svg>
  )
}

export function IconSparkle({ color = 'currentColor', size = 16 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2l2.09 6.26L20.5 10l-6.41 1.74L12 18l-2.09-6.26L3.5 10l6.41-1.74L12 2z"/>
      <path d="M19 15l.9 2.7 2.8.9-2.8.9L19 22l-.9-2.7-2.8-.9 2.8-.9L19 15z" opacity=".6"/>
    </svg>
  )
}
