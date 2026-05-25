import RMLogo from './RMLogo'

export default function BrandLogo({ size = 48, dark = false, className = '' }) {
  const titleSize = Math.max(13, Math.round(size * 0.27))
  const subSize = Math.max(10, Math.round(size * 0.19))

  const titleColor = dark ? 'rgba(255,255,255,0.95)' : '#111827'
  const subColor = dark ? 'rgba(255,255,255,0.5)' : '#6b7280'

  return (
    <div
      className={className}
      style={{ display: 'flex', alignItems: 'center', gap: Math.round(size * 0.18), textDecoration: 'none' }}
    >
      <RMLogo size={size} />
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2, gap: 2 }}>
        <span style={{
          fontSize: titleSize,
          fontWeight: 800,
          color: titleColor,
          whiteSpace: 'nowrap',
          fontFamily: 'var(--font-jakarta, "Plus Jakarta Sans", system-ui, sans-serif)',
          letterSpacing: '-0.02em',
          transition: 'color 0.3s ease',
        }}>
          Car Rental
        </span>
        <span style={{
          fontSize: subSize,
          fontWeight: 600,
          color: subColor,
          whiteSpace: 'nowrap',
          fontFamily: 'var(--font-jakarta, "Plus Jakarta Sans", system-ui, sans-serif)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          transition: 'color 0.3s ease',
        }}>
          Services
        </span>
      </div>
    </div>
  )
}
