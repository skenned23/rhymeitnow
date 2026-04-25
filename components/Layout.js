
import Link from 'next/link'

export function SiteNav() {
  return (
    <nav style={{ background: '#0a0906', borderBottom: '1px solid #251e10', padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
        <div style={{ width: '8px', height: '8px', background: '#c8a86a', borderRadius: '50%' }} />
        <span style={{ fontSize: '0.85rem', letterSpacing: '3px', color: '#c8a86a', textTransform: 'uppercase' }}>RhymeItNow</span>
      </Link>
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <Link href="/" style={{ fontSize: '0.78rem', color: '#a89878', letterSpacing: '1px', textDecoration: 'none' }}>Rhyme Finder</Link>
        <Link href="/rap-builder" style={{ fontSize: '0.78rem', color: '#a89878', letterSpacing: '1px', textDecoration: 'none' }}>Rap Builder</Link>
        <Link href="/poetry-builder" style={{ fontSize: '0.78rem', color: '#a89878', letterSpacing: '1px', textDecoration: 'none' }}>Poetry Builder</Link>
        <Link href="/freestyle" style={{ fontSize: '0.78rem', color: '#a89878', letterSpacing: '1px', textDecoration: 'none' }}>🎤 Freestyle</Link>
        <Link href="/find-a-word" style={{ fontSize: '0.78rem', color: '#a89878', letterSpacing: '1px', textDecoration: 'none' }}>Find a Word</Link>
        <Link href="/about" style={{ fontSize: '0.78rem', color: '#a89878', letterSpacing: '1px', textDecoration: 'none' }}>About</Link>
        <Link href="/contact" style={{ fontSize: '0.78rem', color: '#a89878', letterSpacing: '1px', textDecoration: 'none' }}>Contact</Link>
      </div>
    </nav>
  )
}

export function SiteFooter() {
  return (
    <footer style={{ background: '#0a0906', borderTop: '1px solid #1e1810', padding: '1.5rem 2rem', marginTop: '4rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <span style={{ fontSize: '0.78rem', color: '#7a6a50' }}>© 2025 RhymeItNow. Free rhyme finder for poets and songwriters.</span>
        <div style={{ display: 'flex', gap: '1.25rem' }}>
          <Link href="/freestyle" style={{ fontSize: '0.75rem', color: '#7a6a50', textDecoration: 'none' }}>Freestyle</Link>
          <Link href="/rap-builder" style={{ fontSize: '0.75rem', color: '#7a6a50', textDecoration: 'none' }}>Rap Builder</Link>
          <Link href="/poetry-builder" style={{ fontSize: '0.75rem', color: '#7a6a50', textDecoration: 'none' }}>Poetry Builder</Link>
          <Link href="/find-a-word" style={{ fontSize: '0.75rem', color: '#7a6a50', textDecoration: 'none' }}>Find a Word</Link>
          <Link href="/about" style={{ fontSize: '0.75rem', color: '#7a6a50', textDecoration: 'none' }}>About</Link>
          <Link href="/contact" style={{ fontSize: '0.75rem', color: '#7a6a50', textDecoration: 'none' }}>Contact</Link>
          <Link href="/privacy" style={{ fontSize: '0.75rem', color: '#7a6a50', textDecoration: 'none' }}>Privacy</Link>
          <Link href="/terms" style={{ fontSize: '0.75rem', color: '#7a6a50', textDecoration: 'none' }}>Terms</Link>
        </div>
      </div>
    </footer>
  )
}
