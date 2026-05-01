import { useState } from 'react'
import Head from 'next/head'

const HIGH_TRAFFIC = ['gold', 'war', 'peace', 'stars', 'road', 'broken', 'hot', 'wild', 'run', 'math', 'blood', 'glory', 'faith', 'rise', 'fall', 'stone', 'sky', 'grace', 'shadow', 'stray']

const SYSTEM_PROMPT = `You are a rhyme content expert generating structured JSON for an SEO rhyming dictionary site called RhymeItNow. 

For each word, generate a JSON object with this exact structure (no markdown, no explanation, just valid JSON starting with a comma and the key):

,
  "WORD": {
    "intro": "2-3 sentence intro about the word's use in songwriting/poetry. Mention the rhyme family, genres it appears in, and emotional weight.",
    "famous_uses": [
      { "context": "Song title — Artist", "note": "How this artist used the word and what rhyme technique they employed." },
      { "context": "Song title — Artist", "note": "..." },
      { "context": "Song title — Artist", "note": "..." }
    ],
    "faq": [
      { "q": "What rhymes perfectly with WORD?", "a": "List 10-15 perfect rhymes with brief explanation of their use." },
      { "q": "What are near rhymes for WORD?", "a": "List 8-10 near rhymes with explanation." },
      { "q": "What are slant rhymes for WORD?", "a": "List 6-8 slant rhymes with explanation." },
      { "q": "How do you use WORD in a rap song?", "a": "Practical advice for rappers using this word." },
      { "q": "What is the best rhyme scheme for WORD in poetry?", "a": "Advice on rhyme schemes that work well with this word." }
    ],
    "pro_tip": "One paragraph of advanced, specific advice for songwriters or poets using this word. Include an example lyric snippet.",
    "related": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8"],
    "seo_benefit": "short 4-6 word benefit phrase for this word — e.g. 'for Ballads & Heartbreak Songs' or 'for Rap & Intense Verse' or 'for Country & Folk Lyrics'"
  }

IMPORTANT: Output ONLY valid JSON in this exact format. No extra text. Start with a comma.`

export default function Generator() {
  const [mode, setMode] = useState('single')
  const [singleWord, setSingleWord] = useState('')
  const [batchWords, setBatchWords] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [committing, setCommitting] = useState(false)
  const [commitStatus, setCommitStatus] = useState('')
  const [currentWord, setCurrentWord] = useState('')
  const [wordStatus, setWordStatus] = useState({}) // { word: 'pending' | 'done' | 'error' }
  const [batchList, setBatchList] = useState([])

  const generate = async () => {
    const words = mode === 'single'
      ? [singleWord.trim().toLowerCase()]
      : batchWords.split(/[\n,]+/).map(w => w.trim().toLowerCase()).filter(Boolean)

    if (!words.length || !words[0]) return

    setLoading(true)
    setOutput('')
    setCommitStatus('')
    setBatchList(words)
    const initialStatus = {}
    words.forEach(w => { initialStatus[w] = 'pending' })
    setWordStatus(initialStatus)

    let fullOutput = ''

    for (const word of words) {
      setCurrentWord(word)
      setWordStatus(prev => ({ ...prev, [word]: 'generating' }))
      try {
        const res = await fetch('/api/generate-word', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ word }),
        })
        const data = await res.json()
        if (data.content) {
          fullOutput += '\n' + data.content.trim()
          setOutput(fullOutput.trim())
          setWordStatus(prev => ({ ...prev, [word]: 'done' }))
        }
      } catch (e) {
        fullOutput += `\n// Error generating "${word}"`
        setOutput(fullOutput.trim())
        setWordStatus(prev => ({ ...prev, [word]: 'error' }))
      }
    }

    setLoading(false)
    setCurrentWord('')
  }

  const copyJSON = () => {
    navigator.clipboard?.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const commitToGitHub = async () => {
    if (!output) return
    setCommitting(true)
    setCommitStatus('')
    try {
      const res = await fetch('/api/commit-words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: output }),
      })
      const data = await res.json()
      if (data.success) {
        setCommitStatus('✓ Committed to GitHub successfully')
      } else {
        setCommitStatus('✗ Commit failed: ' + (data.error || 'Unknown error'))
      }
    } catch {
      setCommitStatus('✗ Commit failed — check console')
    }
    setCommitting(false)
  }

  return (
    <>
      <Head>
        <title>RhymeItNow — SEO Page Generator</title>
        <meta name="robots" content="noindex" />
      </Head>

      <main style={{ background: '#0e0c08', minHeight: '100vh', padding: '2rem', fontFamily: 'Georgia, serif', color: '#f0e4c8' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#c8a86a', margin: '0 0 0.25rem' }}>
              RhymeItNow — SEO Page Generator
            </h1>
            <p style={{ fontSize: '0.8rem', color: '#4a4030', margin: 0 }}>Your private tool — not linked in the nav</p>
          </div>

          {/* Instructions */}
          <div style={{ background: '#130f08', border: '1px solid #2a2010', borderRadius: '8px', padding: '1rem 1.25rem', marginBottom: '1.5rem', fontSize: '0.82rem', color: '#7a6a4a', lineHeight: '1.8' }}>
            <ol style={{ margin: 0, paddingLeft: '1.25rem' }}>
              <li>Type a word → Generate → Copy JSON</li>
              <li>Open <code style={{ background: '#1e1a0e', padding: '0.1rem 0.4rem', borderRadius: '3px', color: '#c8a86a' }}>data/words-content.json</code> on GitHub</li>
              <li>Paste before the final <code style={{ background: '#1e1a0e', padding: '0.1rem 0.4rem', borderRadius: '3px', color: '#c8a86a' }}>{'}'}</code> — the comma is already included</li>
              <li>Commit → Vercel deploys → new page live at rhymeitnow.com/rhymes-for/[word]</li>
            </ol>
          </div>

          {/* Mode Toggle */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
            {['single', 'batch'].map(m => (
              <button key={m} onClick={() => setMode(m)}
                style={{ padding: '0.5rem 1.25rem', background: mode === m ? '#c8a86a' : '#1e1a0e', color: mode === m ? '#0e0c08' : '#7a6a4a', border: `1px solid ${mode === m ? '#c8a86a' : '#2a2010'}`, borderRadius: '6px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'Georgia, serif', textTransform: 'capitalize' }}>
                {m === 'single' ? 'Single Word' : 'Batch Mode'}
              </button>
            ))}
          </div>

          {/* Input */}
          {mode === 'single' ? (
            <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem' }}>
              <input
                type="text"
                value={singleWord}
                onChange={e => setSingleWord(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && generate()}
                placeholder="Enter a word..."
                style={{ flex: 1, padding: '0.75rem 1rem', background: '#181410', border: '1px solid #2a2010', borderRadius: '6px', color: '#f0e4c8', fontSize: '1rem', fontFamily: 'Georgia, serif' }}
              />
              <button onClick={generate} disabled={loading || !singleWord.trim()}
                style={{ padding: '0.75rem 1.5rem', background: loading || !singleWord.trim() ? '#1e1a10' : '#c8a86a', color: loading || !singleWord.trim() ? '#4a4030' : '#0e0c08', border: 'none', borderRadius: '6px', fontSize: '0.9rem', fontWeight: '700', cursor: loading || !singleWord.trim() ? 'not-allowed' : 'pointer', fontFamily: 'Georgia, serif', whiteSpace: 'nowrap' }}>
                {loading ? `Generating ${currentWord}...` : 'Generate'}
              </button>
            </div>
          ) : (
            <div style={{ marginBottom: '1rem' }}>
              <textarea
                value={batchWords}
                onChange={e => setBatchWords(e.target.value)}
                placeholder="Enter words separated by commas or new lines&#10;e.g. gold, war, peace, rain, fire"
                rows={4}
                style={{ width: '100%', padding: '0.75rem 1rem', background: '#181410', border: '1px solid #2a2010', borderRadius: '6px', color: '#f0e4c8', fontSize: '0.9rem', fontFamily: 'Georgia, serif', boxSizing: 'border-box', resize: 'vertical' }}
              />
              <button onClick={generate} disabled={loading || !batchWords.trim()}
                style={{ marginTop: '0.5rem', padding: '0.75rem 1.5rem', background: loading || !batchWords.trim() ? '#1e1a10' : '#c8a86a', color: loading || !batchWords.trim() ? '#4a4030' : '#0e0c08', border: 'none', borderRadius: '6px', fontSize: '0.9rem', fontWeight: '700', cursor: loading || !batchWords.trim() ? 'not-allowed' : 'pointer', fontFamily: 'Georgia, serif' }}>
                {loading ? `Generating "${currentWord}"...` : 'Generate Batch'}
              </button>
            </div>
          )}

          {/* Word Progress List */}
          {batchList.length > 0 && (
            <div style={{ background: '#130f08', border: '1px solid #2a2010', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem 1.25rem' }}>
                {batchList.map(w => (
                  <div key={w} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', fontStyle: 'italic' }}>
                    {wordStatus[w] === 'done' && <span style={{ color: '#8dba8a' }}>✓</span>}
                    {wordStatus[w] === 'generating' && <span style={{ color: '#c8a86a' }}>⟳</span>}
                    {wordStatus[w] === 'error' && <span style={{ color: '#c87a5a' }}>✗</span>}
                    {wordStatus[w] === 'pending' && <span style={{ color: '#3a3020' }}>○</span>}
                    <span style={{ color: wordStatus[w] === 'done' ? '#8dba8a' : wordStatus[w] === 'generating' ? '#c8a86a' : wordStatus[w] === 'error' ? '#c87a5a' : '#3a3020' }}>
                      {w}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status */}
          {output && !loading && (
            <p style={{ fontSize: '0.8rem', color: '#8dba8a', marginBottom: '0.5rem' }}>
              Done! Copy the JSON and paste it before the final {'}'} in words-content.json.
            </p>
          )}

          {/* Output */}
          {output && (
            <div style={{ position: 'relative' }}>
              <pre style={{ background: '#0a0906', border: '1px solid #2a2010', borderRadius: '8px', padding: '1.25rem', fontSize: '0.78rem', color: '#9a8a6a', overflowX: 'auto', maxHeight: '420px', overflowY: 'auto', lineHeight: '1.6', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {output}
              </pre>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <button onClick={copyJSON}
                  style={{ padding: '0.6rem 1.25rem', background: copied ? '#8dba8a' : '#1e1a0e', color: copied ? '#0e0c08' : '#c8a86a', border: `1px solid ${copied ? '#8dba8a' : '#3a2e1a'}`, borderRadius: '6px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
                  {copied ? '✓ Copied!' : 'Copy JSON'}
                </button>
                <button onClick={commitToGitHub} disabled={committing}
                  style={{ padding: '0.6rem 1.25rem', background: committing ? '#1e1a10' : '#1e2a1e', color: committing ? '#4a4030' : '#8dba8a', border: '1px solid #2a3a2a', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '700', cursor: committing ? 'not-allowed' : 'pointer', fontFamily: 'Georgia, serif' }}>
                  {committing ? 'Committing...' : 'Commit to GitHub'}
                </button>
                {commitStatus && (
                  <span style={{ fontSize: '0.8rem', color: commitStatus.startsWith('✓') ? '#8dba8a' : '#c87a5a' }}>
                    {commitStatus}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* High traffic targets */}
          <div style={{ marginTop: '3rem', borderTop: '1px solid #1e1810', paddingTop: '1.5rem' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '2px', color: '#3a3020', textTransform: 'uppercase', marginBottom: '0.75rem' }}>High-traffic words to target</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {HIGH_TRAFFIC.map(w => (
                <button key={w} onClick={() => { setMode('single'); setSingleWord(w) }}
                  style={{ background: 'transparent', border: 'none', color: '#5a4e38', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'Georgia, serif', fontStyle: 'italic', padding: '0.1rem 0.3rem' }}>
                  {w}
                </button>
              ))}
            </div>
          </div>

        </div>
      </main>
    </>
  )
}
