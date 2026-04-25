import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { SiteNav, SiteFooter } from '../components/Layout'

const EXAMPLES = ['moon', 'fire', 'dream', 'rain', 'time', 'love', 'night', 'gold']

const CLUSTERS = {
  pain: ['rain', 'gain', 'heart', 'sorrow', 'chain', 'flame'],
  love: ['heart', 'above', 'dove', 'soul', 'hope', 'dream'],
  fire: ['desire', 'night', 'burn', 'rain', 'storm', 'light'],
  night: ['light', 'dream', 'dark', 'moon', 'star', 'fire'],
  dream: ['hope', 'sleep', 'soul', 'mind', 'wish', 'night'],
  heart: ['love', 'soul', 'pain', 'start', 'apart', 'art'],
  time: ['rhyme', 'climb', 'life', 'mind', 'find', 'prime'],
  rain: ['pain', 'chain', 'gain', 'train', 'plain', 'brain'],
  soul: ['whole', 'goal', 'roll', 'heart', 'mind', 'life'],
  home: ['roam', 'alone', 'road', 'heart', 'soul', 'bone'],
  moon: ['soon', 'tune', 'night', 'star', 'dream', 'sky'],
  gold: ['bold', 'cold', 'hold', 'soul', 'old', 'told'],
  hope: ['cope', 'rope', 'soul', 'dream', 'faith', 'light'],
  fear: ['tear', 'near', 'clear', 'year', 'dark', 'heart'],
}

const CATEGORIES = [
  { key: 'perfect', label: 'Perfect Rhymes', sub: 'Exact sound match', accent: '#c8a86a' },
  { key: 'near', label: 'Near Rhymes', sub: 'Close but not exact', accent: '#7aafc8' },
  { key: 'slant', label: 'Slant Rhymes', sub: 'Partial sound match', accent: '#8dba8a' },
]

const POPULAR = ['love', 'moon', 'fire', 'rain', 'time', 'night', 'dream', 'heart', 'soul', 'star', 'home', 'life', 'hope', 'pain', 'sky']

const TOOLS = [
  {
    href: '/rap-builder',
    icon: '🎤',
    label: 'Rap Builder',
    desc: 'Type a line. AI builds the next bars matching your rhyme scheme and style.',
    accent: '#c8a86a',
    cta: 'Build Bars →',
  },
  {
    href: '/poetry-builder',
    icon: '✦',
    label: 'Poetry Builder',
    desc: 'Write sonnets, haiku, ballads, and free verse with elevated AI-powered language.',
    accent: '#9a7abf',
    cta: 'Write Verse →',
  },
  {
    href: '/freestyle',
    icon: '🎙️',
    label: 'Freestyle Challenge',
    desc: 'Practice freestyle rhyming with AI prompts. Build your flow one word at a time.',
    accent: '#7aafc8',
    cta: 'Start Freestyle →',
  },
]

export default function Home() {
  const router = useRouter()
  const [word, setWord] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(null)
  const [copiedAll, setCopiedAll] = useState(null)
  const [searchedWord, setSearchedWord] = useState('')
  const [placeholder, setPlaceholder] = useState(EXAMPLES[0])

  useEffect(() => {
    let i = 0
    const t = setInterval(() => {
      i = (i + 1) % EXAMPLES.length
      setPlaceholder(EXAMPLES[i])
    }, 2200)
    return () => clearInterval(t)
  }, [])

  const findRhymes = async (searchWord) => {
    const w = (searchWord || word).trim()
    if (!w) return
    setLoading(true)
    setError(null)
    setResults(null)
    setSearchedWord(w)
    try {
      const res = await fetch('/api/rhymes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: w }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResults(data)
    } catch {
      setError('Could not find rhymes right now. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (router.query.word) {
      const w = router.query.word
      setWord(w)
      findRhymes(w)
    }
  }, [router.query.word])

  const copyWord = (w) => {
    navigator.clipboard?.writeText(w)
    setCopied(w)
    setTimeout(() => setCopied(null), 1400)
  }

  const copyAll = (categoryKey, words) => {
    const text = words.join(', ')
    navigator.clipboard?.writeText(text)
    setCopiedAll(categoryKey)
    setTimeout(() => setCopiedAll(null), 1600)
  }

  return (
    <>
      <Head>
        <title>RhymeItNow — Free AI-Powered Rhyme Finder for Poets & Songwriters</title>
        <meta name="description" content="Free AI rhyming dictionary for poets, songwriters, and rappers. Find perfect, near, and slant rhymes instantly. Smarter than RhymeZone. No login required." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="RhymeItNow — Free AI Rhyme Finder" />
        <meta property="og:description" content="Perfect, near, and slant rhymes — instantly. Smarter than a rhyming dictionary." />
        <link rel="canonical" href="https://rhymeitnow.com" />
      </Head>

      <SiteNav />

      <main>
        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '3rem 2rem 2rem' }}>
          <div style={{ fontSize: '0.7rem', letterSpacing: '5px', color: '#7a6a4a', textTransform: 'uppercase', marginBottom: '1rem' }}>
            AI-Powered Rhyme Finder — Free Forever
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '700', margin: '0 0 0.5rem', color: '#f0e4c8', letterSpacing: '-1.5px', lineHeight: 1.1 }}>
            Find the Perfect Rhyme
          </h1>
          <p style={{ color: '#6a5c40', fontSize: '1rem', margin: '0 0 2.5rem', maxWidth: '500px', display: 'inline-block', lineHeight: 1.6 }}>
            Perfect, near, and slant rhymes for poets, songwriters, and word lovers. Smarter than a rhyming dictionary.
          </p>

          {/* Search */}
          <div style={{ maxWidth: '520px', margin: '0 auto 1.25rem', display: 'flex', gap: '0.6rem' }}>
            <input
              type="text"
              value={word}
              onChange={e => setWord(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && findRhymes()}
              placeholder={`Try "${placeholder}"...`}
              style={{ flex: 1, padding: '0.9rem 1.2rem', fontSize: '1.1rem', background: '#181410', border: '1px solid #3a2e1a', borderRadius: '8px', color: '#f0e4c8', fontFamily: 'Georgia, serif', boxSizing: 'border-box' }}
            />
            <button
              onClick={() => findRhymes()}
              disabled={loading || !word.trim()}
              style={{ padding: '0.9rem 1.6rem', background: loading || !word.trim() ? '#1e1a10' : '#c8a86a', color: loading || !word.trim() ? '#4a4030' : '#0e0c08', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '700', cursor: loading || !word.trim() ? 'not-allowed' : 'pointer', fontFamily: 'Georgia, serif', whiteSpace: 'nowrap' }}
            >
              {loading ? 'Finding...' : 'Find Rhymes →'}
            </button>
          </div>

          {/* Example chips */}
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: '#4a4030', alignSelf: 'center' }}>
              {searchedWord && CLUSTERS[searchedWord.toLowerCase()] ? 'Related:' : 'Try:'}
            </span>
            {(searchedWord && CLUSTERS[searchedWord.toLowerCase()]
              ? CLUSTERS[searchedWord.toLowerCase()]
              : EXAMPLES
            ).map(ex => (
              <button key={ex} onClick={() => { setWord(ex); findRhymes(ex) }}
                style={{ background: '#181410', color: '#9a8a6a', border: '1px solid #2e2518', borderRadius: '20px', padding: '0.3rem 0.85rem', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <div style={{ display: 'inline-block', width: '28px', height: '28px', border: '2px solid #2a2010', borderTop: '2px solid #c8a86a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: '#5a4e38', marginTop: '1rem', fontSize: '0.9rem' }}>Finding rhymes for <em>"{searchedWord}"</em>...</p>
          </div>
        )}

        {/* Error */}
        {error && <div style={{ textAlign: 'center', padding: '2rem', color: '#c87a5a' }}><p>{error}</p></div>}

        {/* Results */}
        {results && !loading && (
          <div style={{ padding: '0.5rem 1.5rem 3rem', maxWidth: '960px', margin: '0 auto' }} className="fade-in">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'inline-block', background: '#181410', border: '1px solid #3a2e1a', borderRadius: '30px', padding: '0.5rem 1.5rem' }}>
                <span style={{ color: '#7a6a4a', fontSize: '0.9rem' }}>Rhymes for </span>
                <span style={{ color: '#c8a86a', fontSize: '1.05rem', fontStyle: 'italic', fontWeight: '700' }}>"{searchedWord}"</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              {CATEGORIES.map(cat => {
                const words = results[cat.key] || []
                return (
                  <div key={cat.key} style={{ background: '#130f08', border: '1px solid #251e10', borderTop: `3px solid ${cat.accent}`, borderRadius: '10px', padding: '1.5rem' }}>
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ fontSize: '0.65rem', letterSpacing: '4px', color: cat.accent, textTransform: 'uppercase', marginBottom: '0.2rem' }}>{cat.label}</div>
                      <div style={{ fontSize: '0.78rem', color: '#4a4030' }}>{cat.sub}</div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                      {words.map(w => (
                        <div key={w} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                          <Link href={`/rhymes-for/${w.toLowerCase()}`}
                            style={{ background: '#1e1a0e', color: '#c8b890', border: `1px solid #302818`, borderRadius: '5px', padding: '0.38rem 0.75rem', fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'Georgia, serif', fontStyle: 'italic', textDecoration: 'none', display: 'inline-block' }}>
                            {w}
                          </Link>
                          <button onClick={() => copyWord(w)}
                            title="Copy"
                            style={{ background: copied === w ? cat.accent : 'transparent', color: copied === w ? '#0e0c08' : '#5a4e38', border: 'none', borderRadius: '3px', padding: '0.2rem 0.3rem', fontSize: '0.65rem', cursor: 'pointer', marginLeft: '2px' }}>
                            {copied === w ? '✓' : '⧉'}
                          </button>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #1e1810', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.72rem', color: '#3a3020' }}>
                        {words.length} rhymes found
                      </span>
                      {words.length > 0 && (
                        <button
                          onClick={() => copyAll(cat.key, words)}
                          style={{ background: copiedAll === cat.key ? cat.accent : 'transparent', color: copiedAll === cat.key ? '#0e0c08' : '#5a4e38', border: `1px solid ${copiedAll === cat.key ? cat.accent : '#2a2010'}`, borderRadius: '5px', padding: '0.25rem 0.65rem', fontSize: '0.7rem', cursor: 'pointer', fontFamily: 'Georgia, serif', letterSpacing: '1px', textTransform: 'uppercase', transition: 'all 0.2s' }}>
                          {copiedAll === cat.key ? '✓ Copied!' : 'Copy All'}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            <p style={{ textAlign: 'center', color: '#3a3020', fontSize: '0.78rem', marginTop: '1.5rem' }}>Click any word to explore its rhymes — or copy it directly</p>

            {/* Rap Builder CTA */}
            <div style={{ marginTop: '2rem', background: '#130f08', border: '1px solid #3a2e1a', borderRadius: '10px', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.7rem', letterSpacing: '3px', color: '#c8a86a', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Ready to write?</div>
                <div style={{ color: '#7a6a4a', fontSize: '0.9rem' }}>Use these rhymes to build rap bars instantly</div>
              </div>
              <Link href="/rap-builder"
                style={{ background: '#c8a86a', color: '#0e0c08', border: 'none', borderRadius: '8px', padding: '0.75rem 1.5rem', fontSize: '0.9rem', fontWeight: '700', fontFamily: 'Georgia, serif', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                Try Rap Builder →
              </Link>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!results && !loading && !error && (
          <div style={{ textAlign: 'center', padding: '2rem 2rem 3rem', color: '#251e10' }}>
            <div style={{ fontSize: '3rem', letterSpacing: '1rem', marginBottom: '1.5rem' }}>✦ ✦ ✦</div>
            <p style={{ maxWidth: '400px', margin: '0 auto', fontSize: '0.9rem', lineHeight: '1.8', color: '#3a3020', fontStyle: 'italic' }}>
              "The poet's work is finding the word that holds everything else in place."
            </p>
          </div>
        )}

        {/* Popular searches */}
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 1.5rem 3rem' }}>
          <div style={{ borderTop: '1px solid #1e1810', paddingTop: '2rem' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '3px', color: '#4a4030', textTransform: 'uppercase', marginBottom: '1rem', textAlign: 'center' }}>Popular rhyme searches</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
              {POPULAR.map(w => (
                <Link key={w} href={`/rhymes-for/${w}`}
                  style={{ background: '#130f08', border: '1px solid #251e10', borderRadius: '20px', padding: '0.35rem 0.9rem', fontSize: '0.82rem', color: '#7a6a4a', fontStyle: 'italic', textDecoration: 'none' }}>
                  rhymes for {w}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Tool CTAs */}
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem 3rem' }}>
          <div style={{ borderTop: '1px solid #1e1810', paddingTop: '2rem', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '3px', color: '#4a4030', textTransform: 'uppercase', marginBottom: '1.5rem', textAlign: 'center' }}>Creative Writing Tools</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {TOOLS.map(tool => (
                <div key={tool.href} style={{ background: '#130f08', border: `1px solid #251e10`, borderTop: `3px solid ${tool.accent}`, borderRadius: '10px', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ fontSize: '0.7rem', letterSpacing: '3px', color: tool.accent, textTransform: 'uppercase' }}>{tool.icon} {tool.label}</div>
                  <div style={{ fontSize: '0.85rem', color: '#7a6a4a', lineHeight: '1.6', flex: 1 }}>{tool.desc}</div>
                  <Link href={tool.href}
                    style={{ display: 'inline-block', background: tool.accent, color: '#0e0c08', borderRadius: '6px', padding: '0.6rem 1.25rem', fontSize: '0.85rem', fontWeight: '700', fontFamily: 'Georgia, serif', textDecoration: 'none', textAlign: 'center' }}>
                    {tool.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div style={{ background: '#0a0906', borderTop: '1px solid #1e1810', padding: '2.5rem 2rem' }}>
          <div style={{ maxWidth: '760px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.4rem', textAlign: 'center', color: '#f0e4c8', marginBottom: '2rem', fontWeight: '700' }}>
              Smarter than a rhyming dictionary
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              {[
                ['Perfect Rhymes', 'Exact sound matches — the gold standard for traditional verse and structured poetry.'],
                ['Near Rhymes', 'Close-but-not-exact matches, popular in modern pop songwriting and spoken word.'],
                ['Slant Rhymes', 'Loose, unexpected pairings used by artists like Kendrick Lamar and Emily Dickinson.'],
              ].map(([title, desc]) => (
                <div key={title} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', letterSpacing: '2px', color: '#c8a86a', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{title}</div>
                  <div style={{ fontSize: '0.85rem', color: '#5a4e38', lineHeight: '1.6' }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
