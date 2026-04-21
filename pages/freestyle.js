// pages/freestyle.js
import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { SiteNav, SiteFooter } from '../components/Layout'

const STYLES = [
  { key: 'trap', label: 'Trap' },
  { key: 'boom-bap', label: 'Boom Bap' },
  { key: 'emotional', label: 'Emotional' },
  { key: 'aggressive', label: 'Aggressive' },
  { key: 'storytelling', label: 'Storytelling' },
]

const BAR_OPTIONS = ['4', '8', '16']

const RANDOM_OBJECTS = [
  'a rusted stop sign', 'a half-eaten sandwich', 'a cracked smartphone',
  'a burning candle', 'a cold winter night', 'a broken watch',
  'a neon sign', 'a fast car', 'a Gucci bag', 'a pigeon',
  'a toaster', 'a vintage record player', 'a diamond ring',
  'a leaking faucet', 'a midnight train', 'a torn photograph',
  'a golden trophy', 'a empty bottle', 'a stray cat',
  'a flickering streetlight', 'a rusty key', 'a glass of water',
  'a paper crane', 'a leather jacket', 'a broken mirror',
  'a lottery ticket', 'a old basketball', 'a faded tattoo',
  'a borrowed time', 'a silver chain', 'a crumpled dollar bill',
  'a red umbrella', 'a vintage cassette', 'a wilted rose',
  'a rooftop sunset', 'a payphone', 'a empty stadium',
  'a hurricane', 'a loaded dice', 'a pawn shop guitar',
]

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)

const getRandomObjects = (count = 3) => shuffle(RANDOM_OBJECTS).slice(0, count)

export default function Freestyle() {
  const [objects, setObjects] = useState([])
  const [customInput, setCustomInput] = useState('')
  const [style, setStyle] = useState('trap')
  const [bars, setBars] = useState('8')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [teleprompter, setTeleprompter] = useState(false)
  const [copied, setCopied] = useState(false)
  const [scrolling, setScrolling] = useState(false)
  const [scrollSpeed, setScrollSpeed] = useState('normal')
  const SPEEDS = {
    slow: { px: 1, interval: 60 },
    normal: { px: 2, interval: 30 },
    fast: { px: 3, interval: 20 },
  }
  const scrollRef = useRef(null)
  const scrollInterval = useRef(null)

  useEffect(() => {
    setObjects(getRandomObjects(3))
  }, [])

  const handleShuffle = () => {
    setObjects(getRandomObjects(3))
    setResult(null)
  }

  const addCustomObject = () => {
    const trimmed = customInput.trim()
    if (!trimmed || objects.length >= 10) return
    setObjects(prev => [...prev, trimmed])
    setCustomInput('')
  }

  const removeObject = (i) => {
    setObjects(prev => prev.filter((_, idx) => idx !== i))
  }

  const generate = async () => {
    if (objects.length === 0) return
    setLoading(true)
    setResult(null)
    setTeleprompter(false)

    const prompt = `Write a ${bars}-bar ${style} rap verse that naturally incorporates these items: ${objects.join(', ')}. Make the flow feel authentic and the rhymes tight. Each item should appear meaningfully — not just name-dropped.`

    try {
      const res = await fetch('/api/rap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ line: prompt, style, bars }),
      })
      const data = await res.json()
      const lines = data.generated_bars || []
      setResult(lines)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const copyResult = () => {
    if (!result) return
    navigator.clipboard?.writeText(result.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  const startScroll = () => {
    setScrolling(true)
    const speed = SPEEDS[scrollSpeed]
    scrollInterval.current = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop += speed.px
      }
    }, speed.interval)
  }

  const stopScroll = () => {
    setScrolling(false)
    clearInterval(scrollInterval.current)
  }

  useEffect(() => {
    return () => clearInterval(scrollInterval.current)
  }, [])

  const s = {
    page: { minHeight: '100vh', background: '#080604', color: '#f0e4c8', fontFamily: 'Georgia, serif' },
    main: { maxWidth: '720px', margin: '0 auto', padding: '2rem 1.5rem' },
    hero: { textAlign: 'center', marginBottom: '2.5rem' },
    badge: { display: 'inline-block', fontSize: '11px', letterSpacing: '4px', color: '#c8a86a', textTransform: 'uppercase', marginBottom: '0.75rem', background: '#1e1a0e', padding: '4px 12px', borderRadius: '20px', border: '1px solid #3a2e1a' },
    h1: { fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: '700', color: '#f0e4c8', margin: '0 0 0.5rem', letterSpacing: '-1px' },
    sub: { color: '#5a4e38', fontSize: '1rem', lineHeight: '1.6' },
    card: { background: '#120e08', border: '1px solid #251e10', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.25rem' },
    cardLabel: { fontSize: '11px', letterSpacing: '3px', color: '#c8a86a', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'block' },
    objectsGrid: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1rem' },
    objectTag: { background: '#1e1a0e', border: '1px solid #3a2e1a', borderRadius: '20px', padding: '6px 12px', fontSize: '13px', color: '#c8b890', display: 'flex', alignItems: 'center', gap: '6px', fontStyle: 'italic' },
    removeBtn: { background: 'none', border: 'none', color: '#5a4e38', cursor: 'pointer', fontSize: '14px', padding: '0', lineHeight: '1' },
    addRow: { display: 'flex', gap: '8px' },
    input: { flex: 1, padding: '0.65rem 1rem', fontSize: '0.9rem', background: '#1a1510', border: '1px solid #3a2e1a', borderRadius: '8px', color: '#f0e4c8', fontFamily: 'Georgia, serif', outline: 'none' },
    addBtn: { padding: '0.65rem 1.25rem', background: '#1e1a0e', color: '#c8a86a', border: '1px solid #3a2e1a', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontFamily: 'Georgia, serif', whiteSpace: 'nowrap' },
    shuffleBtn: { width: '100%', padding: '0.75rem', background: 'transparent', color: '#7a6a4a', border: '1px solid #251e10', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontFamily: 'Georgia, serif', marginTop: '0.75rem', letterSpacing: '1px' },
    stylesRow: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
    styleBtn: (active) => ({
      padding: '0.5rem 1.1rem', fontSize: '13px', borderRadius: '20px', cursor: 'pointer', fontFamily: 'Georgia, serif',
      background: active ? '#c8a86a' : '#1a1510', color: active ? '#0e0c08' : '#7a6a4a',
      border: active ? 'none' : '1px solid #2a2010', fontWeight: active ? '700' : '400',
    }),
    barsRow: { display: 'flex', gap: '8px' },
    barBtn: (active) => ({
      flex: 1, padding: '0.6rem', fontSize: '13px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Georgia, serif', textAlign: 'center',
      background: active ? '#c8a86a' : '#1a1510', color: active ? '#0e0c08' : '#7a6a4a',
      border: active ? 'none' : '1px solid #2a2010', fontWeight: active ? '700' : '400',
    }),
    generateBtn: { width: '100%', padding: '1rem', background: loading ? '#6a5835' : '#c8a86a', color: '#0e0c08', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Georgia, serif', letterSpacing: '1px', marginBottom: '1.25rem' },
    resultCard: { background: '#120e08', border: '1px solid #251e10', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' },
    barLine: { fontSize: '1.05rem', color: '#f0e4c8', lineHeight: '1.9', marginBottom: '0.25rem' },
    actionRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
    actionBtn: (gold) => ({
      flex: 1, padding: '0.75rem', fontSize: '13px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Georgia, serif', textAlign: 'center', minWidth: '120px',
      background: gold ? '#c8a86a' : '#1e1a0e', color: gold ? '#0e0c08' : '#c8a86a',
      border: gold ? 'none' : '1px solid #3a2e1a', fontWeight: '700',
    }),
    teleprompterOverlay: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: '#000', zIndex: 1000, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'flex-start',
    },
    teleprompterText: {
      fontSize: 'clamp(1.8rem, 6vw, 3rem)', lineHeight: '1.7', color: '#f0e4c8',
      fontFamily: 'Georgia, serif', textAlign: 'center', padding: '2rem',
      overflowY: 'auto', height: '80vh', width: '100%', maxWidth: '800px',
    },
    teleprompterControls: {
      position: 'fixed', bottom: 0, left: 0, right: 0,
      display: 'flex', gap: '12px', padding: '1rem', background: '#000',
      justifyContent: 'center',
    },
  }

  return (
    <>
      <Head>
        <title>Freestyle Challenge — AI Rap Generator | RhymeItNow</title>
        <meta name="description" content="The AI Freestyle Challenge — throw any objects at the AI and watch it build fire bars instantly. Trap, boom bap, emotional and more." />
        <link rel="canonical" href="https://rhymeitnow.com/freestyle" />
      </Head>

      <SiteNav />

      {/* Teleprompter Mode */}
      {teleprompter && result && (
        <div style={s.teleprompterOverlay}>
          <div ref={scrollRef} style={s.teleprompterText}>
            {result.map((line, i) => (
              <div key={i} style={{ marginBottom: '1rem' }}>{line}</div>
            ))}
            <div style={{ height: '50vh' }} />
          </div>
          <div style={s.teleprompterControls}>
            {['slow', 'normal', 'fast'].map(sp => (
              <button key={sp} onClick={() => { stopScroll(); setScrollSpeed(sp) }}
                style={{ padding: '0.6rem 1rem', background: scrollSpeed === sp ? '#c8a86a' : '#1e1a0e', color: scrollSpeed === sp ? '#000' : '#c8a86a', border: '1px solid #3a2e1a', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontFamily: 'Georgia, serif', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: scrollSpeed === sp ? '700' : '400' }}>
                {sp}
              </button>
            ))}
            <button onClick={scrolling ? stopScroll : startScroll}
              style={{ padding: '0.75rem 2rem', background: scrolling ? '#c86a6a' : '#c8a86a', color: '#000', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
              {scrolling ? '⏸ Pause' : '▶ Scroll'}
            </button>
            <button onClick={() => { setTeleprompter(false); stopScroll() }}
              style={{ padding: '0.75rem 2rem', background: '#1e1a0e', color: '#c8a86a', border: '1px solid #3a2e1a', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
              ✕ Exit
            </button>
          </div>
        </div>
      )}

      <main style={s.main}>
        {/* Hero */}
        <div style={s.hero}>
          <div style={s.badge}>🎤 Freestyle Challenge</div>
          <h1 style={s.h1}>Rap About Anything</h1>
          <p style={s.sub}>Throw any objects at the AI — watch it build fire bars instantly.<br />Perfect for TikTok challenges, practice, and pure fun.</p>
        </div>

        {/* Objects */}
        <div style={s.card}>
          <span style={s.cardLabel}>Your Objects ({objects.length}/10)</span>
          <div style={s.objectsGrid}>
            {objects.map((obj, i) => (
              <div key={i} style={s.objectTag}>
                {obj}
                <button style={s.removeBtn} onClick={() => removeObject(i)}>✕</button>
              </div>
            ))}
            {objects.length === 0 && (
              <div style={{ color: '#3a3020', fontSize: '13px', fontStyle: 'italic' }}>No objects yet — shuffle or add your own</div>
            )}
          </div>
          {objects.length < 10 && (
            <div style={s.addRow}>
              <input
                type="text"
                value={customInput}
                onChange={e => setCustomInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustomObject()}
                placeholder="Add your own object..."
                style={s.input}
              />
              <button onClick={addCustomObject} style={s.addBtn}>+ Add</button>
            </div>
          )}
          <button onClick={handleShuffle} style={s.shuffleBtn}>
            🔀 Shuffle New Objects
          </button>
        </div>

        {/* Style */}
        <div style={s.card}>
          <span style={s.cardLabel}>Style</span>
          <div style={s.stylesRow}>
            {STYLES.map(st => (
              <button key={st.key} style={s.styleBtn(style === st.key)} onClick={() => setStyle(st.key)}>
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bars */}
        <div style={s.card}>
          <span style={s.cardLabel}>Bars</span>
          <div style={s.barsRow}>
            {BAR_OPTIONS.map(b => (
              <button key={b} style={s.barBtn(bars === b)} onClick={() => setBars(b)}>
                {b} Bars
              </button>
            ))}
          </div>
        </div>

        {/* Generate */}
        <button onClick={generate} disabled={loading || objects.length === 0} style={s.generateBtn}>
          {loading ? 'Building bars...' : '🔥 Generate Freestyle'}
        </button>

        {/* Result */}
        {result && (
          <>
            <div style={s.resultCard}>
              <span style={{ ...s.cardLabel, marginBottom: '1rem' }}>Your Freestyle — {style} · {bars} bars</span>
              {result.map((line, i) => (
                <div key={i} style={s.barLine}>{line}</div>
              ))}
            </div>
            <div style={s.actionRow}>
              <button onClick={copyResult} style={s.actionBtn(false)}>
                {copied ? '✓ Copied!' : '⧉ Copy Bars'}
              </button>
              <button onClick={() => setTeleprompter(true)} style={s.actionBtn(true)}>
                📺 Teleprompter Mode
              </button>
              <button onClick={generate} style={s.actionBtn(false)}>
                🔄 Regenerate
              </button>
            </div>

            {/* MusicAPI Affiliate Banner */}
            <div style={{ background: '#0d0a1a', border: '1px solid #2a1a4a', borderRadius: '10px', padding: '1rem 1.25rem', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '11px', letterSpacing: '3px', color: '#9a50ff', textTransform: 'uppercase', marginBottom: '0.25rem' }}>🎵 Turn Your Freestyle Into a Real Song</div>
                <div style={{ color: '#7a6a8a', fontSize: '13px' }}>Add a beat and vocals to your bars with MusicAPI</div>
              </div>
              <a href="https://www.musicapi.ai?via=stephen-kennedy" target="_blank" rel="noopener noreferrer"
                style={{ background: '#7a00ff', color: '#ffffff', borderRadius: '8px', padding: '0.6rem 1.25rem', fontSize: '13px', fontWeight: '700', fontFamily: 'Georgia, serif', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                Try MusicAPI →
              </a>
            </div>

            <button onClick={handleShuffle} style={{ ...s.shuffleBtn, marginTop: '0.75rem' }}>
              🔀 New Objects → New Challenge
            </button>
          </>
        )}

        {/* Footer CTA */}
        <div style={{ textAlign: 'center', padding: '2rem 0', borderTop: '1px solid #1e1810', marginTop: '2rem' }}>
          <div style={{ fontSize: '12px', color: '#3a3020', marginBottom: '0.5rem' }}>Want to find rhymes for a specific word?</div>
          <Link href="/" style={{ color: '#c8a86a', fontSize: '13px', textDecoration: 'none' }}>← Back to Rhyme Finder</Link>
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
