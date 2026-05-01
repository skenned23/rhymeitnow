import { useState, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { SiteNav, SiteFooter } from '../components/Layout'

const STYLES = [
  { key: 'free-verse', label: 'Free Verse' },
  { key: 'sonnet', label: 'Sonnet' },
  { key: 'haiku', label: 'Haiku' },
  { key: 'ballad', label: 'Ballad' },
  { key: 'spoken-word', label: 'Spoken Word' },
]

const TONES = [
  { key: 'dark', label: 'Dark' },
  { key: 'romantic', label: 'Romantic' },
  { key: 'spiritual', label: 'Spiritual' },
  { key: 'nature', label: 'Nature' },
  { key: 'reflective', label: 'Reflective' },
]

const STANZA_OPTIONS = ['1', '2', '3']

const EXAMPLE_LINES = [
  'The moon forgot to rise last night',
  'I keep your silence like a stone',
  'Even the river learns to let go',
  'Time is just a wound that heals too slow',
  'She left before the coffee cooled',
]

export default function PoetryBuilder() {
  const [line, setLine] = useState('')
  const [style, setStyle] = useState('free-verse')
  const [tone, setTone] = useState('reflective')
  const [stanzas, setStanzas] = useState('1')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [allLines, setAllLines] = useState([])
  const [title, setTitle] = useState(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(null)

  const generate = async () => {
    if (!line.trim()) return
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const res = await fetch('/api/poetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          line: line.trim(),
          style,
          tone,
          stanzas,
          previousLines: allLines,
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data)
      setAllLines(prev => [...prev, ...data.generated_lines])

      // Auto-generate title
      const titleRes = await fetch('/api/poetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ line: data.generated_lines.join(' '), titleOnly: true }),
      })
      const titleData = await titleRes.json()
      if (titleData.title) setTitle(titleData.title)
    } catch (err) {
      setError('Something went wrong. Try again.')
    }
    setLoading(false)
  }

  const copyPoem = () => {
    const poem = (title ? title + '\n\n' : '') + allLines.join('\n')
    navigator.clipboard?.writeText(poem)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  const reset = () => {
    setResult(null)
    setAllLines([])
    setTitle(null)
    setLine('')
    setError(null)
  }

  const s = {
    page: { minHeight: '100vh', background: '#080604', color: '#f0e4c8', fontFamily: 'Georgia, serif' },
    main: { maxWidth: '720px', margin: '0 auto', padding: '2rem 1.5rem' },
    hero: { textAlign: 'center', marginBottom: '2.5rem' },
    badge: { display: 'inline-block', fontSize: '11px', letterSpacing: '4px', color: '#c8a86a', textTransform: 'uppercase', marginBottom: '0.75rem', background: '#1e1a0e', padding: '4px 12px', borderRadius: '20px', border: '1px solid #3a2e1a' },
    h1: { fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: '700', color: '#f0e4c8', margin: '0 0 0.5rem', letterSpacing: '-1px' },
    sub: { color: '#5a4e38', fontSize: '1rem', lineHeight: '1.6' },
    card: { background: '#120e08', border: '1px solid #251e10', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.25rem' },
    cardLabel: { fontSize: '11px', letterSpacing: '3px', color: '#c8a86a', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'block' },
    input: { width: '100%', padding: '0.75rem 1rem', fontSize: '1rem', background: '#1a1510', border: '1px solid #3a2e1a', borderRadius: '8px', color: '#f0e4c8', fontFamily: 'Georgia, serif', outline: 'none', lineHeight: '1.6', resize: 'vertical', minHeight: '60px' },
    examplesRow: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '0.75rem' },
    exampleChip: { background: 'transparent', border: '1px solid #2a2010', borderRadius: '20px', padding: '5px 12px', fontSize: '12px', color: '#7a6a4a', cursor: 'pointer', fontFamily: 'Georgia, serif', fontStyle: 'italic' },
    stylesRow: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
    styleBtn: (active) => ({
      padding: '0.5rem 1.1rem', fontSize: '13px', borderRadius: '20px', cursor: 'pointer', fontFamily: 'Georgia, serif',
      background: active ? '#c8a86a' : '#1a1510', color: active ? '#0e0c08' : '#7a6a4a',
      border: active ? 'none' : '1px solid #2a2010', fontWeight: active ? '700' : '400',
    }),
    generateBtn: { width: '100%', padding: '1rem', background: loading ? '#6a5835' : '#c8a86a', color: '#0e0c08', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Georgia, serif', letterSpacing: '1px', marginBottom: '1.25rem' },
    resultCard: { background: '#120e08', border: '1px solid #251e10', borderRadius: '12px', padding: '1.75rem', marginBottom: '1rem' },
    poemTitle: { fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontStyle: 'italic', color: '#c8a86a', marginBottom: '1.25rem', letterSpacing: '0.05em' },
    poemLine: { fontSize: '1.05rem', color: '#f0e4c8', lineHeight: '2', marginBottom: '0.1rem' },
    analysis: { fontSize: '13px', color: '#5a4e38', fontStyle: 'italic', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #1e1a10', lineHeight: '1.6' },
    actionRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
    actionBtn: (gold) => ({
      flex: 1, padding: '0.75rem', fontSize: '13px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Georgia, serif', textAlign: 'center', minWidth: '120px',
      background: gold ? '#c8a86a' : '#1e1a0e', color: gold ? '#0e0c08' : '#c8a86a',
      border: gold ? 'none' : '1px solid #3a2e1a', fontWeight: '700',
    }),
  }

  return (
    <>
      <Head>
        <title>Poetry Builder — AI Poetry Generator | RhymeItNow</title>
        <meta name="description" content="Build beautiful poetry with AI. Choose your style — sonnet, haiku, free verse, ballad — and generate stanza by stanza. For poets and songwriters." />
        <link rel="canonical" href="https://rhymeitnow.com/poetry-builder" />
      </Head>

      <SiteNav />

      <main style={s.main}>
        <div style={s.hero}>
          <div style={s.badge}>✍️ Poetry Builder</div>
          <h1 style={s.h1}>Build a Poem,<br />Line by Line</h1>
          <p style={s.sub}>Start with one line. Choose your form and tone.<br />Let the AI build the verse — stanza by stanza.</p>
        </div>

        {/* Opening Line */}
        <div style={s.card}>
          <span style={s.cardLabel}>Your Opening Line</span>
          <textarea
            style={s.input}
            value={line}
            onChange={e => setLine(e.target.value)}
            placeholder="Type your first line here..."
            rows={2}
          />
          <div style={s.examplesRow}>
            {EXAMPLE_LINES.map(ex => (
              <button key={ex} style={s.exampleChip} onClick={() => setLine(ex)}>
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Style */}
        <div style={s.card}>
          <span style={s.cardLabel}>Form</span>
          <div style={s.stylesRow}>
            {STYLES.map(st => (
              <button key={st.key} style={s.styleBtn(style === st.key)} onClick={() => setStyle(st.key)}>
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tone */}
        <div style={s.card}>
          <span style={s.cardLabel}>Tone</span>
          <div style={s.stylesRow}>
            {TONES.map(t => (
              <button key={t.key} style={s.styleBtn(tone === t.key)} onClick={() => setTone(t.key)}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stanzas — hide for haiku/sonnet */}
        {style !== 'haiku' && style !== 'sonnet' && (
          <div style={s.card}>
            <span style={s.cardLabel}>Stanzas</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {STANZA_OPTIONS.map(n => (
                <button key={n} style={{ ...s.styleBtn(stanzas === n), flex: 1, borderRadius: '8px' }} onClick={() => setStanzas(n)}>
                  {n} {n === '1' ? 'Stanza' : 'Stanzas'}
                </button>
              ))}
            </div>
          </div>
        )}

        <button onClick={generate} disabled={loading || !line.trim()} style={s.generateBtn}>
          {loading ? 'Writing verse...' : '✍️ Generate Verse'}
        </button>

        {error && <div style={{ color: '#8a5a4a', fontFamily: 'Georgia, serif', fontSize: '13px', marginBottom: '1rem' }}>{error}</div>}

        {/* Poem Output */}
        {allLines.length > 0 && (
          <div style={s.resultCard}>
            {title && <div style={s.poemTitle}>"{title}"</div>}
            {allLines.map((l, i) => (
              <div key={i} style={s.poemLine}>{l}</div>
            ))}
            {result?.analysis && (
              <div style={s.analysis}>✦ {result.analysis}</div>
            )}
          </div>
        )}

        {allLines.length > 0 && (
          <div style={s.actionRow}>
            <button onClick={copyPoem} style={s.actionBtn(false)}>
              {copied ? '✓ Copied!' : '⧉ Copy Poem'}
            </button>
            <button onClick={generate} disabled={loading} style={s.actionBtn(true)}>
              + Add Next Stanza
            </button>
            <button onClick={reset} style={s.actionBtn(false)}>
              ↺ Start Over
            </button>
          </div>
        )}

        <div style={{ textAlign: 'center', padding: '2rem 0', borderTop: '1px solid #1e1810', marginTop: '2rem' }}>
          <div style={{ fontSize: '12px', color: '#3a3020', marginBottom: '0.5rem' }}>Looking for rhymes instead?</div>
          <Link href="/" style={{ color: '#c8a86a', fontSize: '13px', textDecoration: 'none' }}>← Back to Rhyme Finder</Link>
        </div>
      </main>

      <SiteFooter />
    </>
  )
}