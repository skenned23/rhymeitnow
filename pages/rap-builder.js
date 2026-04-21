import { useState } from 'react'
import Head from 'next/head'
import { SiteNav, SiteFooter } from '../components/Layout'

const STYLES = [
  { id: 'trap', label: 'Trap', desc: 'Hard hitting, minimal, melodic flow' },
  { id: 'boom-bap', label: 'Boom Bap', desc: 'Classic hip-hop, lyrical, complex' },
  { id: 'melodic', label: 'Melodic', desc: 'Sing-songy, emotional, hooks' },
  { id: 'aggressive', label: 'Aggressive', desc: 'Fast, intense, in-your-face' },
  { id: 'storytelling', label: 'Storytelling', desc: 'Narrative, vivid, descriptive' },
]

const EXAMPLES = [
  "I came up from nothing, built my empire from the ground",
  "They said I wouldn't make it, now I'm running this town",
  "Every night I'm grinding while they sleeping in the dark",
  "Started with a dream now I got a works of art",
]

const THEMES = [
  {
    id: 'dark', label: 'Dark Elegance',
    previewBg: '#0a0906', previewBorder: '#c8a86a',
    bg: '#0a0906', accent: '#c8a86a',
    barColor1: '#f0e4c8', barColor2: '#c8b890',
    labelColor: '#5a4e38', dividerColor: '#251e10', watermarkColor: '#3a3020',
  },
  {
    id: 'neon', label: 'Neon Night',
    previewBg: '#0d0018', previewBorder: '#00f5ff',
    bg: '#0d0018', accent: '#00f5ff',
    barColor1: '#ffffff', barColor2: '#00f5ff',
    labelColor: '#7a00ff', dividerColor: '#2a0050', watermarkColor: '#3a0070',
  },
  {
    id: 'minimal', label: 'Minimalist White',
    previewBg: '#ffffff', previewBorder: '#111111',
    bg: '#ffffff', accent: '#111111',
    barColor1: '#111111', barColor2: '#444444',
    labelColor: '#888888', dividerColor: '#e0e0e0', watermarkColor: '#cccccc',
  },
]

const FORMATS = [
  { id: '16:9', label: '16:9', sub: 'Twitter / Feed', width: 1080, height: 608 },
  { id: '9:16', label: '9:16', sub: 'TikTok / Stories', width: 1080, height: 1920 },
]

function saveAsImage(bars, styleName, theme, format) {
  const canvas = document.createElement('canvas')
  const scale = 2
  const is916 = format.id === '9:16'

  const W = 1080
  const H = is916 ? 1920 : 608

  const barFontSize = is916 ? 52 : 28
  const labelFontSize = is916 ? 24 : 11
  const watermarkFontSize = is916 ? 22 : 12
  const padding = is916 ? 90 : 80
  const lineHeight = is916 ? 80 : 52

  canvas.width = W * scale
  canvas.height = H * scale
  const ctx = canvas.getContext('2d')
  ctx.scale(scale, scale)

  ctx.font = `italic ${barFontSize}px Georgia, serif`
  const maxLineWidth = W - padding * 2
  const wrappedLines = []
  bars.forEach(bar => {
    const words = bar.split(' ')
    let current = ''
    words.forEach(word => {
      const test = current ? current + ' ' + word : word
      if (ctx.measureText(test).width > maxLineWidth) {
        if (current) wrappedLines.push(current)
        current = word
      } else {
        current = test
      }
    })
    if (current) wrappedLines.push(current)
  })

  const headerH = is916 ? 120 : 80
  const footerH = is916 ? 80 : 60
  const contentH = headerH + wrappedLines.length * lineHeight + footerH

  const startY = is916 ? Math.max(80, Math.floor((H - contentH) / 2)) : 0

  ctx.fillStyle = theme.bg
  ctx.fillRect(0, 0, W, H)

  ctx.fillStyle = theme.accent
  ctx.fillRect(padding, startY, W - padding * 2, is916 ? 3 : 2)

  ctx.font = `500 ${labelFontSize}px Georgia, serif`
  ctx.fillStyle = theme.labelColor
  ctx.fillText(styleName.toUpperCase() + ' · AI-GENERATED BARS', padding, startY + (is916 ? 52 : 36))

  const dividerY = startY + (is916 ? 68 : 48)
  ctx.strokeStyle = theme.dividerColor
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padding, dividerY)
  ctx.lineTo(W - padding, dividerY)
  ctx.stroke()

  ctx.font = `italic ${barFontSize}px Georgia, serif`
  wrappedLines.forEach((line, i) => {
    const y = dividerY + (is916 ? 60 : 40) + i * lineHeight
    ctx.fillStyle = theme.accent
    ctx.fillRect(padding, y - Math.floor(barFontSize * 0.8), 2, Math.floor(barFontSize * 1.1))
    ctx.fillStyle = i % 2 === 0 ? theme.barColor1 : theme.barColor2
    ctx.fillText(line, padding + 14, y)
  })

  const lastBarY = dividerY + (is916 ? 60 : 40) + wrappedLines.length * lineHeight
  const bottomDivY = lastBarY + (is916 ? 20 : 14)
  ctx.strokeStyle = theme.dividerColor
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padding, bottomDivY)
  ctx.lineTo(W - padding, bottomDivY)
  ctx.stroke()

  ctx.font = `${watermarkFontSize}px Georgia, serif`
  ctx.fillStyle = theme.watermarkColor
  const watermark = 'RHYMEITNOW.COM'
  const ww = ctx.measureText(watermark).width
  ctx.fillText(watermark, Math.floor((W - ww) / 2), bottomDivY + (is916 ? 44 : 28))

  const link = document.createElement('a')
  link.download = 'my-bars-rhymeitnow.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
}

function ThemePicker({ selectedTheme, onSelect }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ fontSize: '0.65rem', letterSpacing: '3px', color: '#5a4e38', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Image Theme</div>
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
        {THEMES.map(t => (
          <button key={t.id} onClick={() => onSelect(t.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '0.45rem 0.9rem',
              background: selectedTheme === t.id ? '#c8a86a' : '#130f08',
              color: selectedTheme === t.id ? '#0e0c08' : '#7a6a4a',
              border: `1px solid ${selectedTheme === t.id ? '#c8a86a' : '#251e10'}`,
              borderRadius: '6px', fontSize: '0.82rem', cursor: 'pointer',
              fontFamily: 'Georgia, serif', fontWeight: selectedTheme === t.id ? '700' : '400',
            }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: t.previewBg, border: `2px solid ${t.previewBorder}`, display: 'inline-block', flexShrink: 0 }} />
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function FormatPicker({ selectedFormat, onSelect }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <div style={{ fontSize: '0.65rem', letterSpacing: '3px', color: '#5a4e38', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Image Format</div>
      <div style={{ display: 'flex', gap: '0.6rem' }}>
        {FORMATS.map(f => (
          <button key={f.id} onClick={() => onSelect(f.id)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '0.5rem 1.25rem',
              background: selectedFormat === f.id ? '#c8a86a' : '#130f08',
              color: selectedFormat === f.id ? '#0e0c08' : '#7a6a4a',
              border: `1px solid ${selectedFormat === f.id ? '#c8a86a' : '#251e10'}`,
              borderRadius: '6px', cursor: 'pointer', fontFamily: 'Georgia, serif',
              fontWeight: selectedFormat === f.id ? '700' : '400',
            }}>
            <span style={{ fontSize: '0.95rem', fontWeight: '700' }}>{f.label}</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '2px' }}>{f.sub}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function RapBuilder() {
  const [inputLine, setInputLine] = useState('')
  const [style, setStyle] = useState('trap')
  const [bars, setBars] = useState(2)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [session, setSession] = useState([])
  const [copied, setCopied] = useState(false)
  const [imageTheme, setImageTheme] = useState('dark')
  const [imageFormat, setImageFormat] = useState('9:16')

  const currentTheme = THEMES.find(t => t.id === imageTheme) || THEMES[0]
  const currentFormat = FORMATS.find(f => f.id === imageFormat) || FORMATS[1]
  const currentStyleName = STYLES.find(s => s.id === style)?.label || 'Trap'

  const buildBars = async (line) => {
    const inputToUse = line || inputLine
    if (!inputToUse.trim()) return
    setLoading(true)
    setError(null)
    setResults(null)
    try {
      const res = await fetch('/api/rap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ line: inputToUse.trim(), style, bars, previousBars: session }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResults(data)
      setSession(prev => [...prev, inputToUse.trim(), ...(data.generated_bars || [])])
    } catch {
      setError('Could not generate bars right now. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const continueBuilding = () => {
    const lastBar = results?.generated_bars?.[results.generated_bars.length - 1]
    if (lastBar) { setInputLine(lastBar); setResults(null); buildBars(lastBar) }
  }

  const copySession = () => {
    navigator.clipboard?.writeText(session.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const clearSession = () => { setSession([]); setResults(null); setInputLine('') }

  return (
    <>
      <Head>
        <title>Rap Lyrics Builder — AI Rap Bar Generator | RhymeItNow</title>
        <meta name="description" content="Build rap lyrics with AI. Type a line and our rap bar generator creates the next bars matching your rhyme scheme, cadence, and style. Free rap lyrics builder." />
        <meta property="og:title" content="Rap Builder — AI Rap Bar Generator | RhymeItNow" />
        <link rel="canonical" href="https://rhymeitnow.com/rap-builder" />
      </Head>

      <SiteNav />

      <main>
        <div style={{ textAlign: 'center', padding: '2.5rem 2rem 1.5rem' }}>
          <div style={{ fontSize: '0.7rem', letterSpacing: '5px', color: '#7a6a4a', textTransform: 'uppercase', marginBottom: '0.75rem' }}>AI-Powered Rap Tool</div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: '700', margin: '0 0 0.5rem', color: '#f0e4c8', letterSpacing: '-1px', lineHeight: 1.1 }}>Rap Bar Builder</h1>
          <p style={{ color: '#6a5c40', fontSize: '1rem', margin: '0 0 2rem', maxWidth: '480px', display: 'inline-block', lineHeight: 1.6 }}>
            Type a line. AI builds the next bars — matching your rhyme scheme, cadence, and style.
          </p>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem 4rem' }}>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '3px', color: '#5a4e38', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Style</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {STYLES.map(s => (
                <button key={s.id} onClick={() => setStyle(s.id)}
                  style={{ padding: '0.5rem 1rem', background: style === s.id ? '#c8a86a' : '#130f08', color: style === s.id ? '#0e0c08' : '#7a6a4a', border: `1px solid ${style === s.id ? '#c8a86a' : '#251e10'}`, borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'Georgia, serif', fontWeight: style === s.id ? '700' : '400' }}>
                  {s.label}
                </button>
              ))}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#3a3020', marginTop: '0.5rem' }}>{STYLES.find(s => s.id === style)?.desc}</div>
          </div>

          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '3px', color: '#5a4e38', textTransform: 'uppercase' }}>Generate</div>
            {[2, 4, 6, 8].map(n => (
              <button key={n} onClick={() => setBars(n)}
                style={{ width: '36px', height: '36px', background: bars === n ? '#c8a86a' : '#130f08', color: bars === n ? '#0e0c08' : '#7a6a4a', border: `1px solid ${bars === n ? '#c8a86a' : '#251e10'}`, borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: bars === n ? '700' : '400' }}>
                {n}
              </button>
            ))}
            <div style={{ fontSize: '0.75rem', color: '#3a3020' }}>bars</div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '3px', color: '#5a4e38', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Your Line</div>
            <textarea value={inputLine} onChange={e => setInputLine(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) buildBars() }}
              placeholder="Type your opening line here..." rows={3}
              style={{ width: '100%', padding: '1rem 1.2rem', fontSize: '1rem', background: '#181410', border: '1px solid #3a2e1a', borderRadius: '8px', color: '#f0e4c8', fontFamily: 'Georgia, serif', fontStyle: 'italic', boxSizing: 'border-box', resize: 'vertical', lineHeight: '1.6' }} />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.72rem', color: '#3a3020', marginRight: '0.5rem' }}>Try:</span>
            {EXAMPLES.map(ex => (
              <button key={ex} onClick={() => setInputLine(ex)}
                style={{ background: 'none', border: 'none', color: '#5a4e38', fontSize: '0.72rem', cursor: 'pointer', textDecoration: 'underline', marginRight: '0.75rem', fontStyle: 'italic', padding: 0 }}>
                "{ex.substring(0, 30)}..."
              </button>
            ))}
          </div>

          <button onClick={() => buildBars()} disabled={loading || !inputLine.trim()}
            style={{ width: '100%', padding: '1rem', background: loading || !inputLine.trim() ? '#1e1a10' : '#c8a86a', color: loading || !inputLine.trim() ? '#4a4030' : '#0e0c08', border: 'none', borderRadius: '8px', fontSize: '1.05rem', fontWeight: '700', cursor: loading || !inputLine.trim() ? 'not-allowed' : 'pointer', fontFamily: 'Georgia, serif', letterSpacing: '0.5px', marginBottom: '2rem' }}>
            {loading ? 'Building your bars...' : `Build ${bars} Bars →`}
          </button>

          {loading && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ display: 'inline-block', width: '28px', height: '28px', border: '2px solid #2a2010', borderTop: '2px solid #c8a86a', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: '1rem' }} />
              <p style={{ color: '#5a4e38', fontSize: '0.9rem', fontStyle: 'italic' }}>AI is analyzing your rhyme scheme and cadence...</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {error && <div style={{ textAlign: 'center', padding: '1rem', color: '#c87a5a' }}><p>{error}</p></div>}

          {results && !loading && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>

              <div style={{ background: '#130f08', border: '1px solid #251e10', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.65rem', letterSpacing: '3px', color: '#c8a86a', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Rhyme Analysis</div>
                <div style={{ fontSize: '0.88rem', color: '#7a6a4a', lineHeight: '1.7' }}>{results.analysis}</div>
              </div>

              <div style={{ background: '#0e0c08', border: '1px solid #251e10', borderTop: '3px solid #c8a86a', borderRadius: '10px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.65rem', letterSpacing: '3px', color: '#c8a86a', textTransform: 'uppercase', marginBottom: '1rem' }}>Generated Bars — {currentStyleName}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {(results.generated_bars || []).map((bar, i) => (
                    <div key={i} style={{ fontSize: '1.05rem', color: '#f0e4c8', fontStyle: 'italic', lineHeight: '1.7', paddingLeft: '1rem', borderLeft: '2px solid #251e10' }}>{bar}</div>
                  ))}
                </div>
              </div>

              {results.rhyme_words?.length > 0 && (
                <div style={{ background: '#130f08', border: '1px solid #251e10', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.65rem', letterSpacing: '3px', color: '#7aafc8', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Key Rhyme Words Used</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {results.rhyme_words.map(w => (
                      <span key={w} style={{ background: '#1a1a28', border: '1px solid #2a2a40', borderRadius: '4px', padding: '0.3rem 0.75rem', fontSize: '0.88rem', color: '#7aafc8', fontStyle: 'italic' }}>{w}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* MusicAPI Affiliate Banner */}
              <div style={{ background: '#0d0a1a', border: '1px solid #2a1a4a', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '11px', letterSpacing: '3px', color: '#9a50ff', textTransform: 'uppercase', marginBottom: '0.25rem' }}>🎵 Turn Your Bars Into a Real Song</div>
                 <div style={{ color: '#7a6a8a', fontSize: '13px' }}>Add a beat and vocals to your bars with MusicAPI</div>
                </div>
                <a href="https://www.musicapi.ai?via=stephen-kennedy" target="_blank" rel="noopener noreferrer"
                  style={{ background: '#7a00ff', color: '#ffffff', borderRadius: '8px', padding: '0.6rem 1.25rem', fontSize: '13px', fontWeight: '700', fontFamily: 'Georgia, serif', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  Try MusicAPI →
                </a>
              </div>

              <ThemePicker selectedTheme={imageTheme} onSelect={setImageTheme} />
              <FormatPicker selectedFormat={imageFormat} onSelect={setImageFormat} />

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button onClick={continueBuilding}
                  style={{ flex: 1, padding: '0.85rem', background: '#c8a86a', color: '#0e0c08', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
                  Continue Building →
                </button>
                <button onClick={() => saveAsImage(results.generated_bars || [], currentStyleName, currentTheme, currentFormat)}
                  style={{ padding: '0.85rem 1.25rem', background: '#130f08', color: '#c8a86a', border: '1px solid #c8a86a', borderRadius: '8px', fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'Georgia, serif', fontWeight: '700' }}>
                  Save as Image
                </button>
                <button onClick={() => { setResults(null); setInputLine('') }}
                  style={{ padding: '0.85rem 1.25rem', background: '#130f08', color: '#7a6a4a', border: '1px solid #251e10', borderRadius: '8px', fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
                  New Line
                </button>
              </div>
            </div>
          )}

          {session.length > 0 && (
            <div style={{ marginTop: '2.5rem', background: '#0a0906', border: '1px solid #1e1810', borderRadius: '12px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.65rem', letterSpacing: '3px', color: '#5a4e38', textTransform: 'uppercase' }}>Your Lyrics So Far</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => saveAsImage(session, currentStyleName, currentTheme, currentFormat)}
                    style={{ padding: '0.4rem 0.85rem', background: '#1a1510', color: '#c8a86a', border: '1px solid #c8a86a', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
                    Save as Image
                  </button>
                  <button onClick={copySession}
                    style={{ padding: '0.4rem 0.85rem', background: copied ? '#c8a86a' : '#1a1510', color: copied ? '#0e0c08' : '#7a6a4a', border: '1px solid #2a2010', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
                    {copied ? '✓ Copied' : 'Copy All'}
                  </button>
                  <button onClick={clearSession}
                    style={{ padding: '0.4rem 0.85rem', background: '#1a1510', color: '#5a4030', border: '1px solid #2a2010', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer' }}>
                    Clear
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {session.map((line, i) => (
                  <div key={i} style={{ fontSize: '0.95rem', color: i % 2 === 0 ? '#c8b890' : '#f0e4c8', fontStyle: 'italic', lineHeight: '1.7', paddingLeft: '0.75rem', borderLeft: `2px solid ${i % 2 === 0 ? '#251e10' : '#3a2e1a'}` }}>
                    {line}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!results && !loading && session.length === 0 && (
            <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {[
                ['1. Write your line', "Type any opening bar — a hook, a verse line, anything you're working on."],
                ['2. Pick your style', 'Choose trap, boom bap, melodic, aggressive, or storytelling to match your vibe.'],
                ['3. AI builds the bars', 'Claude analyzes your rhyme scheme and cadence, then generates bars that flow naturally.'],
              ].map(([title, desc]) => (
                <div key={title} style={{ background: '#130f08', border: '1px solid #251e10', borderRadius: '8px', padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.7rem', letterSpacing: '2px', color: '#c8a86a', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{title}</div>
                  <div style={{ fontSize: '0.82rem', color: '#5a4e38', lineHeight: '1.6' }}>{desc}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
