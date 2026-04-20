// pages/demo.js — Screen recording demo mode (not linked in nav)
import { useState, useEffect, useRef } from 'react'

const DEMO_STYLE = 'emotional'
const DEMO_BARS = '4'

export default function Demo() {
  const [phase, setPhase] = useState('idle') // idle | typing | finding | rhymes | transition | rapping | bars | done
  const [inputWord, setInputWord] = useState('pain')
  const [typedWord, setTypedWord] = useState('')
  const [rhymes, setRhymes] = useState({ perfect: [], near: [], slant: [] })
  const [visibleRhymes, setVisibleRhymes] = useState([])
  const [bars, setBars] = useState('')
  const [visibleBars, setVisibleBars] = useState([])
  const [rapLoading, setRapLoading] = useState(false)
  const timeoutRef = useRef(null)

  const clearT = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }

  const sleep = ms => new Promise(r => setTimeout(r, ms))

  const runDemo = async () => {
    const demoWord = inputWord.trim() || 'pain'
    setPhase('typing')
    setTypedWord('')
    setRhymes({ perfect: [], near: [], slant: [] })
    setVisibleRhymes([])
    setBars('')
    setVisibleBars([])

    // Typewriter effect
    for (let i = 0; i <= demoWord.length; i++) {
      setTypedWord(demoWord.slice(0, i))
      await sleep(150)
    }

    await sleep(800)
    setPhase('finding')

    // Call rhymes API
    try {
      const res = await fetch('/api/rhymes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: demoWord })
      })
      const data = await res.json()
      const perfect = data.perfect || []
      const near = data.near || []
      const slant = data.slant || []
      setRhymes({ perfect, near, slant })
      setPhase('rhymes')

      // Reveal rhymes one by one — slower
      const allRhymes = [
        ...perfect.slice(0, 5).map(w => ({ word: w, type: 'perfect' })),
        ...near.slice(0, 4).map(w => ({ word: w, type: 'near' })),
        ...slant.slice(0, 3).map(w => ({ word: w, type: 'slant' })),
      ]

      for (let i = 0; i < allRhymes.length; i++) {
        await sleep(650)
        setVisibleRhymes(prev => [...prev, allRhymes[i]])
      }

      await sleep(2500)

      // Transition to Rap Builder
      setPhase('transition')
      await sleep(1800)
      setPhase('rapping')
      setRapLoading(true)

      const rapRes = await fetch('/api/rap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: demoWord, style: DEMO_STYLE, bars: DEMO_BARS })
      })
      const rapData = await rapRes.json()
      const barsText = rapData.bars || rapData.rap || ''
      setBars(barsText)
      setRapLoading(false)
      setPhase('bars')

      // Reveal bars line by line — slower
      const lines = barsText.split('\n').filter(l => l.trim())
      for (let i = 0; i < lines.length; i++) {
        await sleep(1100)
        setVisibleBars(prev => [...prev, lines[i]])
      }

      await sleep(2500)
      setPhase('done')

    } catch (err) {
      setPhase('idle')
    }
  }

  const s = {
    page: {
      minHeight: '100vh',
      background: '#080604',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '2rem 1.5rem',
      fontFamily: 'Georgia, serif',
      maxWidth: '420px',
      margin: '0 auto',
    },
    logo: {
      color: '#c8a86a',
      fontSize: '1.1rem',
      letterSpacing: '3px',
      textTransform: 'uppercase',
      marginBottom: '0.25rem',
      fontWeight: '400',
    },
    tagline: {
      color: '#3a3020',
      fontSize: '11px',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      marginBottom: '2.5rem',
    },
    inputBox: {
      width: '100%',
      background: '#120e08',
      border: '1px solid #2a2010',
      borderRadius: '12px',
      padding: '1.25rem 1.5rem',
      marginBottom: '1rem',
      boxSizing: 'border-box',
    },
    label: {
      color: '#5a4e38',
      fontSize: '11px',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      marginBottom: '0.75rem',
      display: 'block',
    },
    wordDisplay: {
      color: '#f0e4c8',
      fontSize: '2.8rem',
      fontWeight: '400',
      letterSpacing: '2px',
      minHeight: '3.5rem',
      display: 'flex',
      alignItems: 'center',
    },
    cursor: {
      display: 'inline-block',
      width: '3px',
      height: '2.8rem',
      background: '#c8a86a',
      marginLeft: '4px',
      animation: 'blink 0.8s infinite',
      verticalAlign: 'middle',
    },
    findBtn: {
      width: '100%',
      padding: '1rem',
      background: phase === 'finding' ? '#6a5835' : '#c8a86a',
      color: '#080604',
      border: 'none',
      borderRadius: '10px',
      fontSize: '1rem',
      fontWeight: '700',
      fontFamily: 'Georgia, serif',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      cursor: 'pointer',
      marginBottom: '1.5rem',
      transition: 'background 0.3s',
    },
    sectionLabel: (type) => ({
      fontSize: '10px',
      letterSpacing: '3px',
      textTransform: 'uppercase',
      color: type === 'perfect' ? '#c8a86a' : type === 'near' ? '#8a7a5a' : '#5a4e38',
      marginBottom: '0.5rem',
      marginTop: '0.75rem',
      display: 'block',
    }),
    rhymeWord: (type) => ({
      display: 'inline-block',
      padding: '0.5rem 1rem',
      margin: '4px',
      borderRadius: '8px',
      fontSize: '1.1rem',
      fontFamily: 'Georgia, serif',
      background: type === 'perfect' ? '#1e1a0e' : type === 'near' ? '#160f08' : '#100c06',
      border: `1px solid ${type === 'perfect' ? '#3a2e1a' : type === 'near' ? '#251e10' : '#1a1508'}`,
      color: type === 'perfect' ? '#c8a86a' : type === 'near' ? '#8a7a5a' : '#5a4e38',
      animation: 'fadeSlideIn 0.4s ease forwards',
    }),
    transitionScreen: {
      textAlign: 'center',
      padding: '3rem 0',
    },
    transLabel: {
      color: '#5a4e38',
      fontSize: '11px',
      letterSpacing: '3px',
      textTransform: 'uppercase',
      marginBottom: '1rem',
    },
    transTitle: {
      color: '#c8a86a',
      fontSize: '1.8rem',
      letterSpacing: '2px',
    },
    rapBox: {
      width: '100%',
      background: '#120e08',
      border: '1px solid #2a2010',
      borderRadius: '12px',
      padding: '1.25rem 1.5rem',
      boxSizing: 'border-box',
      marginBottom: '1rem',
    },
    barLine: {
      color: '#f0e4c8',
      fontSize: '1.05rem',
      lineHeight: '1.8',
      marginBottom: '0.25rem',
      animation: 'fadeSlideIn 0.5s ease forwards',
    },
    startBtn: {
      width: '100%',
      padding: '1.25rem',
      background: 'transparent',
      color: '#c8a86a',
      border: '1px solid #3a2e1a',
      borderRadius: '12px',
      fontSize: '1rem',
      fontWeight: '700',
      fontFamily: 'Georgia, serif',
      letterSpacing: '3px',
      textTransform: 'uppercase',
      cursor: 'pointer',
      marginTop: '1rem',
    },
    loading: {
      color: '#5a4e38',
      fontSize: '13px',
      fontStyle: 'italic',
      textAlign: 'center',
      padding: '1rem 0',
      letterSpacing: '1px',
    },
    doneMsg: {
      textAlign: 'center',
      color: '#c8a86a',
      fontSize: '11px',
      letterSpacing: '3px',
      textTransform: 'uppercase',
      marginTop: '1.5rem',
      paddingTop: '1.5rem',
      borderTop: '1px solid #1a1508',
    }
  }

  const groupedVisible = {
    perfect: visibleRhymes.filter(r => r.type === 'perfect'),
    near: visibleRhymes.filter(r => r.type === 'near'),
    slant: visibleRhymes.filter(r => r.type === 'slant'),
  }

  return (
    <div style={s.page}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeSlideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
      `}</style>

      <div style={s.logo}>RhymeItNow</div>
      <div style={s.tagline}>Find your rhyme</div>

      {/* IDLE */}
      {phase === 'idle' && (
        <>
          <div style={s.inputBox}>
            <span style={s.label}>Enter a word</span>
            <input
              type="text"
              value={inputWord}
              onChange={e => setInputWord(e.target.value)}
              placeholder="pain"
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#f0e4c8',
                fontSize: '2.4rem',
                fontFamily: 'Georgia, serif',
                width: '100%',
                letterSpacing: '2px',
              }}
            />
          </div>
          <button style={s.findBtn} onClick={runDemo}>▶ Start Demo</button>
        </>
      )}

      {/* TYPING + FINDING */}
      {(phase === 'typing' || phase === 'finding') && (
        <>
          <div style={s.inputBox}>
            <span style={s.label}>Enter a word</span>
            <div style={s.wordDisplay}>
              {typedWord}
              <span style={s.cursor} />
            </div>
          </div>
          <button style={s.findBtn} disabled>
            {phase === 'finding' ? 'Finding...' : 'Find Rhymes →'}
          </button>
        </>
      )}

      {/* RHYMES */}
      {phase === 'rhymes' && (
        <>
          <div style={s.inputBox}>
            <span style={s.label}>Rhymes for</span>
            <div style={{ ...s.wordDisplay, fontSize: '2rem' }}>{inputWord || 'pain'}</div>
          </div>

          {groupedVisible.perfect.length > 0 && (
            <div style={{ width: '100%', marginBottom: '0.5rem' }}>
              <span style={s.sectionLabel('perfect')}>Perfect Rhymes</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {groupedVisible.perfect.map((r, i) => (
                  <span key={i} style={s.rhymeWord('perfect')}>{r.word}</span>
                ))}
              </div>
            </div>
          )}
          {groupedVisible.near.length > 0 && (
            <div style={{ width: '100%', marginBottom: '0.5rem' }}>
              <span style={s.sectionLabel('near')}>Near Rhymes</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {groupedVisible.near.map((r, i) => (
                  <span key={i} style={s.rhymeWord('near')}>{r.word}</span>
                ))}
              </div>
            </div>
          )}
          {groupedVisible.slant.length > 0 && (
            <div style={{ width: '100%', marginBottom: '0.5rem' }}>
              <span style={s.sectionLabel('slant')}>Slant Rhymes</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {groupedVisible.slant.map((r, i) => (
                  <span key={i} style={s.rhymeWord('slant')}>{r.word}</span>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* TRANSITION */}
      {phase === 'transition' && (
        <div style={s.transitionScreen}>
          <div style={s.transLabel}>Now try</div>
          <div style={s.transTitle}>Rap Builder</div>
        </div>
      )}

      {/* RAP BUILDER */}
      {(phase === 'rapping' || phase === 'bars' || phase === 'done') && (
        <>
          <div style={s.rapBox}>
            <span style={s.label}>Rap Builder — "{inputWord || 'pain'}" · Emotional · 4 Bars</span>
            {rapLoading && (
              <div style={s.loading}>Building your bars...</div>
            )}
            {visibleBars.map((line, i) => (
              <div key={i} style={s.barLine}>{line}</div>
            ))}
          </div>

          {phase === 'done' && (
            <>
              <div style={s.doneMsg}>rhymeitnow.com</div>
              <button style={s.startBtn} onClick={() => setPhase('idle')}>↺ Try Another Word</button>
            </>
          )}
        </>
      )}
    </div>
  )
}
