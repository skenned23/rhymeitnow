// pages/generator.js  (not linked in nav — your private tool)
import { useState } from 'react'

export default function Generator() {
  const [word, setWord] = useState('')
  const [status, setStatus] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const generate = async () => {
    if (!word.trim()) return
    setLoading(true)
    setOutput('')
    setStatus('Generating content for "' + word.trim() + '"...')
    try {
      const res = await fetch('/api/generate-word', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: word.trim() }),
      })
      const data = await res.json()
      if (data.error) {
        setStatus('Error: ' + data.error)
      } else {
        setOutput(JSON.stringify(data, null, 2))
        setStatus('Done! Copy the JSON and paste it into words-content.json on GitHub.')
      }
    } catch (err) {
      setStatus('Error: ' + err.message)
    }
    setLoading(false)
  }

  const copy = () => {
    navigator.clipboard?.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0906', color: '#f0e4c8', fontFamily: 'Georgia, serif', padding: '2rem' }}>
      <h1 style={{ color: '#c8a86a', fontSize: '1.4rem', marginBottom: '0.25rem', letterSpacing: '1px' }}>RhymeItNow — SEO Page Generator</h1>
      <p style={{ color: '#5a4e38', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Your private tool — not linked in the nav</p>

      <div style={{ background: '#130f08', border: '1px solid #251e10', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '1.5rem', fontSize: '13px', color: '#7a6a4a', lineHeight: '1.8' }}>
        <div style={{ marginBottom: '6px' }}><span style={{ color: '#c8a86a' }}>1.</span> Type a word → Generate → Copy JSON</div>
        <div style={{ marginBottom: '6px' }}><span style={{ color: '#c8a86a' }}>2.</span> Open <code style={{ background: '#1e1a0e', padding: '1px 6px', borderRadius: '4px', color: '#c8a86a' }}>data/words-content.json</code> on GitHub</div>
        <div style={{ marginBottom: '6px' }}><span style={{ color: '#c8a86a' }}>3.</span> Paste before the final <code style={{ background: '#1e1a0e', padding: '1px 6px', borderRadius: '4px', color: '#c8a86a' }}>{'}'}</code> — add a comma after the previous entry</div>
        <div><span style={{ color: '#c8a86a' }}>4.</span> Commit → Vercel deploys → new page live at rhymeitnow.com/rhymes-for/[word]</div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
        <input
          type="text"
          value={word}
          onChange={e => setWord(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !loading && generate()}
          placeholder="Try: gold, war, peace, ocean, broken..."
          style={{ flex: 1, padding: '0.75rem 1rem', fontSize: '1rem', background: '#1a1510', border: '1px solid #3a2e1a', borderRadius: '8px', color: '#f0e4c8', fontFamily: 'Georgia, serif', outline: 'none' }}
        />
        <button
          onClick={generate}
          disabled={loading}
          style={{ padding: '0.75rem 1.5rem', background: loading ? '#6a5835' : '#c8a86a', color: '#0e0c08', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Georgia, serif' }}>
          {loading ? 'Working...' : 'Generate'}
        </button>
      </div>

      {status && <p style={{ fontSize: '13px', color: status.startsWith('Error') ? '#c86a6a' : '#7a6a4a', marginBottom: '1rem' }}>{status}</p>}

      {output && (
        <div>
          <pre style={{ background: '#130f08', border: '1px solid #251e10', borderRadius: '10px', padding: '1rem', fontFamily: 'monospace', fontSize: '12px', whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: '420px', overflowY: 'auto', color: '#c8b890', lineHeight: '1.6', marginBottom: '0.75rem' }}>
            {output}
          </pre>
          <button
            onClick={copy}
            style={{ padding: '0.65rem 1.5rem', background: copied ? '#c8a86a' : '#1e1a0e', color: copied ? '#0e0c08' : '#c8a86a', border: '1px solid #3a2e1a', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
            {copied ? 'Copied!' : 'Copy JSON'}
          </button>
        </div>
      )}

      <p style={{ marginTop: '2rem', fontSize: '12px', color: '#3a3020', lineHeight: '1.8' }}>
        <span style={{ color: '#5a4e38' }}>High-traffic words to target:</span> gold · war · peace · stars · road · broken · lost · wild · run · truth · blood · glory · faith · rise · fall · stone · sky · grace · shadow · wings
      </p>
    </div>
  )
}

