import { useState, useRef } from 'react'
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

function saveAsImage(bars, styleName) {
  const canvas = document.createElement('canvas')
  const scale = 2
  const width = 1080
  const padding = 80
  const lineHeight = 52
  const headerHeight = 120
  const footerHeight = 80

  // Wrap lines
  const tempCtx = canvas.getContext('2d')
  tempCtx.font = `italic ${28 * scale}px Georgia, serif`
  const wrappedLines = []
  bars.forEach(bar => {
    const words = bar.split(' ')
    let current = ''
    words.forEach(word => {
      const test = current ? current + ' ' + word : word
      if (tempCtx.measureText(test).width > (width - padding * 2) * scale) {
        if (current) wrappedLines.push(current)
        current = word
      } else {
        current = test
      }
    })
    if (current) wrappedLines.push(current)
  })

  const height = headerHeight + wrappedLines.length * lineHeight + footerHeight + 60

  canvas.width = width * scale
  canvas.height = height * scale
  const ctx = canvas.getContext('2d')
  ctx.scale(scale, scale)

  // Background
  ctx.fillStyle = '#0a0906'
  ctx.fillRect(0, 0, width, height)

  // Gold top bar
  ctx.fillStyle = '#c8a86a'
  ctx.fillRect(0, 0, width, 4)

  // Style label
  ctx.font = `500 11px Georgia, serif`
  ctx.fillStyle = '#5a4e38'
  ctx.letterSpacing = '4px'
  ctx.fillText(styleName.toUpperCase() + ' · AI-GENERATED BARS', padding, 44)

  // Divider
  ctx.strokeStyle = '#251e10'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padding, 62)
  ctx.lineTo(width - padding, 62)
  ctx.stroke()

  // Bars
  ctx.font = `italic 28px Georgia, serif`
  ctx.letterSpacing = '0px'
  wrappedLines.forEach((line, i) => {
    const y = 62 + 48 + i * lineHeight
    const isEven = i % 2 === 0
    ctx.fillStyle = isEven ? '#f0e4c8' : '#c8b890'
    // Left accent
    ctx.fillStyle = '#251e10'
    ctx.fillRect(padding, y - 22, 2, 28)
    ctx.fillStyle = isEven ? '#f0e4c8' : '#c8b890'
    ctx.fillText(line, padding + 16, y)
  })

  // Bottom divider
  const bottomY = 62 + 48 + wrappedLines.length * lineHeight + 20
  ctx.strokeStyle = '#251e10'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padding, bottomY)
  ctx.lineTo(width - padding, bottomY)
  ctx.stroke()

  // Watermark
  ctx.font = `12px Georgia, serif`
  ctx.fillStyle = '#3a3020'
  ctx.letterSpacing = '2px'
  const watermark = 'RHYMEITNOW.COM'
  const wWidth = ctx.measureText(watermark).width
  ctx.fillText(watermark, (width - wWidth) / 2, bottomY + 36)

  // Download
  const link = document.createElement('a')
  link.download = 'my-bars-rhymeitnow.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
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
        body: JSON.stringify({
          line: inputToUse.trim(),
          style,
          bars,
          previousBars: session,
        }),
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
    if (lastBar) {
      setInputLine(lastBar)
      setResults(null)
      buildBars(lastBar)
    }
  }

  const copySession = () => {
    navigator.clipboard?.writeText(session.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const clearSession = () => {
    setSession([])
    setResults(null)
    setInputLine('')
  }

  const useExample = (ex) => {
    setInputLine(ex)
  }

  const currentStyleName = STYLES.find(s => s.id === style)?.label || 'Trap'

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
        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '2.5rem 2rem 1.5rem' }}>
          <div style={{ fontSize: '0.7rem', letterSpacing: '5px', color: '#7a6a4a', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            AI-Powered Rap Tool
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: '700', margin: '0 0 0.5rem', color: '#f0e4c8', letterSpacing: '-1px', lineHeight: 1.1 }}>
            Rap Bar Builder
          </h1>
          <p style={{ color: '#6a5c40', fontSize: '1rem', margin: '0 0 2rem', maxWidth: '480px', display: 'inline-block', lineHeight: 1.6 }}>
            Type a line. AI builds the next bars — matching your rhyme scheme, cadence, and style.
          </p>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem 4rem' }}>

          {/* Style selector */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '3px', color: '#5a4e38', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Style</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {STYLES.map(s => (
                <button key={s.id} onClick={() => setStyle(s.id)}
                  style={{ padding: '0.5rem 1rem', background: style === s.id ? '#c8a86a' : '#130f08', color: style === s.id ? '#0e0c08' : '#7a6a4a', border: `1px solid ${style === s.id ? '#c8a86a' : '#251e10'}`, borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'Georgia, serif', fontWeight: style === s.id ? '700' : '400', transition: 'all 0.15s' }}>
                  {s.label}
                </button>
              ))}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#3a3020', marginTop: '0.5rem' }}>
              {STYLES.find(s => s.id === style)?.desc}
            </div>
          </div>

          {/* Bars selector */}
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

          {/* Input */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '3px', color: '#5a4e38', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Your Line</div>
            <textarea
              value={inputLine}
              onChange={e => setInputLine(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) buildBars() }}
              placeholder="Type your opening line here..."
              rows={3}
              style={{ width: '100%', padding: '1rem 1.2rem', fontSize: '1rem', background: '#181410', border: '1px solid #3a2e1a', borderRadius: '8px', color: '#f0e4c8', fontFamily: 'Georgia, serif', fontStyle: 'italic', boxSizing: 'border-box', resize: 'vertical', lineHeight: '1.6' }}
            />
          </div>

          {/* Examples */}
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.72rem', color: '#3a3020', marginRight: '0.5rem' }}>Try:</span>
            {EXAMPLES.map(ex => (
              <button key={ex} onClick={() => useExample(ex)}
                style={{ background: 'none', border: 'none', color: '#5a4e38', fontSize: '0.72rem', cursor: 'pointer', textDecoration: 'underline', marginRight: '0.75rem', fontStyle: 'italic', padding: 0 }}>
                "{ex.substring(0, 30)}..."
              </button>
            ))}
          </div>

          {/* Build button */}
          <button onClick={() => buildBars()} disabled={loading || !inputLine.trim()}
            style={{ width: '100%', padding: '1rem', background: loading || !inputLine.trim() ? '#1e1a10' : '#c8a86a', color: loading || !inputLine.trim() ? '#4a4030' : '#0e0c08', border: 'none', borderRadius: '8px', fontSize: '1.05rem', fontWeight: '700', cursor: loading || !inputLine.trim() ? 'not-allowed' : 'pointer', fontFamily: 'Georgia, serif', letterSpacing: '0.5px', marginBottom: '2rem', transition: 'all 0.2s' }}>
            {loading ? 'Building your bars...' : `Build ${bars} Bars →`}
          </button>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ display: 'inline-block', width: '28px', height: '28px', border: '2px solid #2a2010', borderTop: '2px solid #c8a86a', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: '1rem' }} />
              <p style={{ color: '#5a4e38', fontSize: '0.9rem', fontStyle: 'italic' }}>AI is analyzing your rhyme scheme and cadence...</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {/* Error */}
          {error && <div style={{ textAlign: 'center', padding: '1rem', color: '#c87a5a' }}><p>{error}</p></div>}

          {/* Results */}
          {results && !loading && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>

              {/* Analysis */}
              <div style={{ background: '#130f08', border: '1px solid #251e10', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.65rem', letterSpacing: '3px', color: '#c8a86a', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Rhyme Analysis</div>
                <div style={{ fontSize: '0.88rem', color: '#7a6a4a', lineHeight: '1.7' }}>{results.analysis}</div>
              </div>

              {/* Generated bars */}
              <div style={{ background: '#0e0c08', border: '1px solid #251e10', borderTop: '3px solid #c8a86a', borderRadius: '10px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.65rem', letterSpacing: '3px', color: '#c8a86a', textTransform: 'uppercase', marginBottom: '1rem' }}>Generated Bars — {STYLES.find(s => s.id === style)?.label}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {(results.generated_bars || []).map((bar, i) => (
                    <div key={i} style={{ fontSize: '1.05rem', color: '#f0e4c8', fontStyle: 'italic', lineHeight: '1.7', paddingLeft: '1rem', borderLeft: '2px solid #251e10' }}>
                      {bar}
                    </div>
                  ))}
                </div>
              </div>

              {/* Rhyme words */}
              {results.rhyme_words && results.rhyme_words.length > 0 && (
                <div style={{ background: '#130f08', border: '1px solid #251e10', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.65rem', letterSpacing: '3px', color: '#7aafc8', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Key Rhyme Words Used</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {results.rhyme_words.map(w => (
                      <span key={w} style={{ background: '#1a1a28', border: '1px solid #2a2a40', borderRadius: '4px', padding: '0.3rem 0.75rem', fontSize: '0.88rem', color: '#7aafc8', fontStyle: 'italic' }}>{w}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button onClick={continueBuilding}
                  style={{ flex: 1, padding: '0.85rem', background: '#c8a86a', color: '#0e0c08', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
                  Continue Building →
                </button>
                <button onClick={() => saveAsImage(results.generated_bars || [], currentStyleName)}
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

          {/* Session / Full lyrics */}
          {session.length > 0 && (
            <div style={{ marginTop: '2.5rem', background: '#0a0906', border: '1px solid #1e1810', borderRadius: '12px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.65rem', letterSpacing: '3px', color: '#5a4e38', textTransform: 'uppercase' }}>Your Lyrics So Far</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => saveAsImage(session, currentStyleName)}
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

          {/* How it works */}
          {!results && !loading && session.length === 0 && (
            <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {[
                ['1. Write your line', 'Type any opening bar — a hook, a verse line, anything you\'re working on.'],
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
