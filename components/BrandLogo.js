import RMLogo from './RMLogo'

export default function BrandLogo({ size = 48, dark = false, className = '' }) {
  const fontSize = Math.max(11, Math.round(size * 0.22))
  const color = dark ? 'rgba(255,255,255,0.95)' : '#111827'

  return (
    <div className={`flex items-center gap-2.5 ${className}`} style={{ textDecoration: 'none' }}>
      <RMLogo size={size} />
      <span style={{
        fontSize,
        fontWeight: 700,
        color,
        whiteSpace: 'nowrap',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        letterSpacing: '-0.01em',
      }}>
        Car Rental Services
      </span>
    </div>
  )
}
