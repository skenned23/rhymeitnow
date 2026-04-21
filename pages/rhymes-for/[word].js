import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { SiteNav, SiteFooter } from '../../components/Layout'
import wordsContent from '../../data/words-content.json'

export async function getStaticPaths() {
  const words = Object.keys(wordsContent)
  const paths = words.map(word => ({ params: { word } }))
  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const { word } = params
  const content = wordsContent[word] || null
  if (!content) return { notFound: true }

  // Parse static rhyme lists from FAQ answers
  function extractRhymeList(faqAnswer) {
    if (!faqAnswer) return []
    const beforePeriod = faqAnswer.split('.')[0]
    const listPart = beforePeriod.includes(':') ? beforePeriod.split(':')[1] : beforePeriod
    return listPart
      .split(',')
      .map(w => w.trim().toLowerCase().replace(/[^a-z\s-]/g, ''))
      .filter(w => w.length > 0 && w.length < 20)
  }

  const faq = content.faq || []
  const perfectFaq = faq.find(f => f.q && f.q.toLowerCase().includes('perfectly'))
  const nearFaq = faq.find(f => f.q && f.q.toLowerCase().includes('near'))
  const slantFaq = faq.find(f => f.q && f.q.toLowerCase().includes('slant'))

  const staticRhymes = {
    perfect: perfectFaq ? extractRhymeList(perfectFaq.a) : [],
    near: nearFaq ? extractRhymeList(nearFaq.a) : [],
    slant: slantFaq ? extractRhymeList(slantFaq.a) : [],
  }

  return { props: { word, content, staticRhymes } }
}

const CATEGORIES = [
  { key: 'perfect', label: 'Perfect Rhymes', accent: '#c8a86a' },
  { key: 'near', label: 'Near Rhymes', accent: '#7aafc8' },
  { key: 'slant', label: 'Slant Rhymes', accent: '#8dba8a' },
]

const allWords = Object.keys(wordsContent)

function linkifyText(text, currentWord) {
  if (!text) return text
  const escaped = allWords
    .filter(w => w !== currentWord)
    .map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .sort((a, b) => b.length - a.length) // longest first to avoid partial matches
  if (escaped.length === 0) return text
  const pattern = new RegExp(`\\b(${escaped.join('|')})\\b`, 'gi')
  const parts = text.split(pattern)
  return parts.map((part, i) => {
    const lower = part.toLowerCase()
    if (allWords.includes(lower) && lower !== currentWord) {
      return (
        <Link key={i} href={`/rhymes-for/${lower}`}
          style={{ color: '#c8a86a', textDecoration: 'underline', textDecorationColor: '#3a2e1a' }}>
          {part}
        </Link>
      )
    }
    return part
  })
}

export default function RhymesForWord({ word, content, staticRhymes }) {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(null)
  const [inputWord, setInputWord] = useState('')

  const findRhymes = async (w) => {
    const searchWord = w || word
    setLoading(true)
    try {
      const res = await fetch('/api/rhymes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: searchWord }),
      })
      const data = await res.json()
      setResults(data)
    } catch {
      console.error('Failed to fetch rhymes')
    } finally {
      setLoading(false)
    }
  }

  const copyWord = (w) => {
    navigator.clipboard?.writeText(w)
    setCopied(w)
    setTimeout(() => setCopied(null), 1400)
  }

  return (
    <>
      <Head>
        <title>Words That Rhyme With {word} — Perfect, Near & Slant Rhymes | RhymeItNow</title>
        <meta name="description" content={`Find perfect, near, and slant rhymes for "${word}" instantly. Free AI-powered rhyme finder for poets and songwriters. No login required.`} />
        <meta property="og:title" content={`Rhymes for "${word}" | RhymeItNow`} />
        <meta property="og:description" content={content.intro} />
        <link rel="canonical" href={`https://rhymeitnow.com/rhymes-for/${word}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": (content.faq || []).map(f => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": { "@type": "Answer", "text": f.a }
          }))
        })}} />
      </Head>

      <SiteNav />

      <main style={{ maxWidth: '820px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Breadcrumb */}
        <div style={{ fontSize: '13px', color: '#5a4e38', marginBottom: '1.5rem' }}>
          <Link href="/" style={{ color: '#c8a86a', textDecoration: 'none' }}>RhymeItNow</Link>
          <span style={{ margin: '0 0.5rem', color: '#3a3020' }}>→</span>
          <span>Rhymes for "{word}"</span>
        </div>

        {/* H1 */}
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: '700', color: '#f0e4c8', marginBottom: '1rem', letterSpacing: '-0.5px' }}>
          Words That Rhyme With "{word}"
        </h1>

        {/* Intro */}
        <p style={{ fontSize: '1rem', lineHeight: '1.8', color: '#8a7a5a', marginBottom: '2rem', borderLeft: '3px solid #c8a86a', paddingLeft: '1rem' }}>
          {linkifyText(content.intro, word)}
        </p>

        {/* Static Rhyme Lists */}
        {(staticRhymes.perfect.length > 0 || staticRhymes.near.length > 0 || staticRhymes.slant.length > 0) && (
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', color: '#f0e4c8', fontWeight: '700' }}>
              Rhymes for "{word}"
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              {CATEGORIES.map(cat => (
                staticRhymes[cat.key].length > 0 && (
                  <div key={cat.key}>
                    <div style={{ fontSize: '11px', letterSpacing: '2px', color: cat.accent, textTransform: 'uppercase', marginBottom: '0.75rem', borderBottom: `2px solid ${cat.accent}`, paddingBottom: '0.4rem' }}>
                      {cat.label}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {staticRhymes[cat.key].map(w => (
                        allWords.includes(w) && w !== word ? (
                          <Link key={w} href={`/rhymes-for/${w}`}
                            style={{ background: '#1e1a0e', border: `1px solid ${cat.accent}33`, borderRadius: '4px', padding: '4px 10px', fontSize: '13px', color: cat.accent, textDecoration: 'none', fontStyle: 'italic' }}>
                            {w}
                          </Link>
                        ) : (
                          <button key={w} onClick={() => copyWord(w)}
                            style={{ background: copied === w ? cat.accent : '#1e1a0e', color: copied === w ? '#0e0c08' : '#c8b890', border: `1px solid ${copied === w ? cat.accent : '#302818'}`, borderRadius: '4px', padding: '4px 10px', fontSize: '13px', cursor: 'pointer', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                            {copied === w ? '✓' : w}
                          </button>
                        )
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* Tool */}
        <div style={{ background: '#130f08', border: '1px solid #251e10', borderRadius: '12px', padding: '2rem', marginBottom: '2.5rem' }}>
          {!results && !loading && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: '#7a6a4a', marginBottom: '1rem' }}>
                Find rhymes for <em style={{ color: '#c8a86a' }}>"{word}"</em> — or search any word
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', maxWidth: '400px', margin: '0 auto 1rem' }}>
                <input
                  type="text"
                  value={inputWord}
                  onChange={e => setInputWord(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && findRhymes(inputWord || word)}
                  placeholder={word}
                  style={{ flex: 1, padding: '0.75rem 1rem', fontSize: '1rem', background: '#1a1510', border: '1px solid #3a2e1a', borderRadius: '8px', color: '#f0e4c8', fontFamily: 'Georgia, serif' }}
                />
                <button onClick={() => findRhymes(inputWord || word)}
                  style={{ padding: '0.75rem 1.25rem', background: '#c8a86a', color: '#0e0c08', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'Georgia, serif', whiteSpace: 'nowrap' }}>
                  Find →
                </button>
              </div>
            </div>
          )}

          {loading && (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#7a6a4a' }}>
              <div style={{ display: 'inline-block', width: '24px', height: '24px', border: '2px solid #2a2010', borderTop: '2px solid #c8a86a', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.9rem' }}>Finding rhymes...</p>
            </div>
          )}

          {results && !loading && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                {CATEGORIES.map(cat => (
                  <div key={cat.key} style={{ borderTop: `3px solid ${cat.accent}`, paddingTop: '0.75rem' }}>
                    <div style={{ fontSize: '11px', letterSpacing: '2px', color: cat.accent, textTransform: 'uppercase', marginBottom: '0.75rem' }}>{cat.label}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {(results[cat.key] || []).map(w => (
                        <button key={w} onClick={() => copyWord(w)}
                          style={{ background: copied === w ? cat.accent : '#1e1a0e', color: copied === w ? '#0e0c08' : '#c8b890', border: `1px solid ${copied === w ? cat.accent : '#302818'}`, borderRadius: '4px', padding: '4px 10px', fontSize: '13px', cursor: 'pointer', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                          {copied === w ? '✓' : w}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setResults(null)} style={{ background: 'none', border: 'none', color: '#4a4030', fontSize: '12px', cursor: 'pointer', marginTop: '0.5rem' }}>← Search again</button>
            </div>
          )}
        </div>

        {/* Famous Uses */}
        <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#f0e4c8', fontWeight: '700' }}>
          Famous uses of "{word}" in music and poetry
        </h2>
        <div style={{ display: 'grid', gap: '10px', marginBottom: '2.5rem' }}>
          {(content.famous_uses || []).map((use, i) => (
            <div key={i} style={{ background: '#130f08', borderRadius: '8px', padding: '1rem 1.25rem', borderLeft: '3px solid #c8a86a' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#c8a86a', marginBottom: '4px' }}>{use.context}</div>
              <div style={{ fontSize: '14px', color: '#7a6a4a', lineHeight: '1.6' }}>{use.note}</div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#f0e4c8', fontWeight: '700' }}>
          Frequently asked questions
        </h2>
        <div style={{ marginBottom: '2.5rem' }}>
          {(content.faq || []).map((item, i) => (
            <div key={i} style={{ borderBottom: '1px solid #1e1810', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <div style={{ fontWeight: '700', fontSize: '15px', color: '#d8c8a8', marginBottom: '6px' }}>{item.q}</div>
              <div style={{ fontSize: '14px', color: '#7a6a4a', lineHeight: '1.7' }}>
                {linkifyText(item.a, word)}
              </div>
            </div>
          ))}
        </div>

        {/* Pro Tip */}
        {content.pro_tip && (
          <div style={{ background: '#130f08', border: '1px solid #3a2e1a', borderLeft: '4px solid #c8a86a', borderRadius: '10px', padding: '1.25rem 1.5rem', marginBottom: '2.5rem' }}>
            <div style={{ fontSize: '11px', letterSpacing: '3px', color: '#c8a86a', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Songwriter Pro Tip</div>
            <p style={{ fontSize: '14px', color: '#8a7a5a', lineHeight: '1.8', margin: '0' }}>
              {linkifyText(content.pro_tip, word)}
            </p>
          </div>
        )}

        {/* Rap Builder CTA */}
        <div style={{ background: '#130f08', border: '1px solid #251e10', borderRadius: '10px', padding: '1.25rem 1.5rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '3px', color: '#c8a86a', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Ready to write?</div>
            <div style={{ color: '#7a6a4a', fontSize: '14px' }}>Use these rhymes to build rap bars instantly</div>
          </div>
          <Link href="/rap-builder"
            style={{ background: '#c8a86a', color: '#0e0c08', borderRadius: '8px', padding: '0.75rem 1.5rem', fontSize: '14px', fontWeight: '700', fontFamily: 'Georgia, serif', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Try Rap Builder →
          </Link>
        </div>

        {/* Related Words */}
        <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#f0e4c8', fontWeight: '700' }}>
          Related words to explore
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '2.5rem' }}>
          {(content.related || []).map(r => (
            <Link key={r} href={`/rhymes-for/${r}`}
              style={{ background: '#130f08', border: '1px solid #251e10', borderRadius: '20px', padding: '6px 14px', fontSize: '14px', color: '#7a6a4a', textDecoration: 'none', fontStyle: 'italic' }}>
              {r}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '2rem', background: '#130f08', border: '1px solid #251e10', borderRadius: '12px' }}>
          <div style={{ fontSize: '14px', color: '#5a4e38', marginBottom: '0.75rem' }}>Search any word on RhymeItNow</div>
          <Link href="/" style={{ display: 'inline-block', padding: '0.85rem 2rem', background: '#c8a86a', color: '#0e0c08', borderRadius: '8px', fontSize: '15px', fontWeight: '700', textDecoration: 'none', fontFamily: 'Georgia, serif' }}>
            Back to Rhyme Finder →
          </Link>
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
