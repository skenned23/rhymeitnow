// pages/generator.js  (not linked in nav — your private tool)
import { useState } from 'react'

export default function Generator() {
  const [batchMode, setBatchMode] = useState(false)

  // Single mode state
  const [word, setWord] = useState('')

  // Batch mode state
  const [wordList, setWordList] = useState('')
  const [batchResults, setBatchResults] = useState([]) // [{word, json, status}]
  const [batchProgress, setBatchProgress] = useState('')
  const [batchRunning, setBatchRunning] = useState(false)

  // Shared state
  const [status, setStatus] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  // ── Single mode ──────────────────────────────────────────────
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

  // ── Batch mode ───────────────────────────────────────────────
  const runBatch = async () => {
    const words = wordList
      .split('\n')
      .map(w => w.trim().toLowerCase())
      .filter(w => w.length > 0)

    if (words.length === 0) return

    setBatchRunning(true)
    setBatchResults([])
    setBatchProgress(`Starting batch — ${words.length} words queued...`)

    const results = []

    for (let i = 0; i < words.length; i++) {
      const w = words[i]
      setBatchProgress(`Processing ${i + 1} of ${words.length}: "${w}"...`)

      try {
        const res = await fetch('/api/generate-word', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ word: w }),
        })
        const data = await res.json()
        if (data.error) {
          results.push({ word: w, json: null, status: 'error', message: data.error })
        } else {
          results.push({ word: w, json: data, status: 'ok' })
        }
      } catch (err) {
        results.push({ word: w, json: null, status: 'error', message: err.message })
      }

      setBatchResults([...results])

      // Small delay between calls to avoid rate limiting
      if (i < words.length - 1) {
        await new Promise(r => setTimeout(r, 600))
      }
    }

    const successCount = results.filter(r => r.status === 'ok').length
    const errorCount = results.filter(r => r.status === 'error').length
    setBatchProgress(`Done! ${successCount} succeeded${errorCount > 0 ? `, ${errorCount} failed` : ''}. Copy the block below.`)
    setBatchRunning(false)
  }

  // Build the combined JSON block for batch output
  const buildBatchJSON = () => {
    const successes = batchResults.filter(r => r.status === 'ok')
    if (successes.length === 0) return ''
    // Produce entries as "word": { ... }, ready to paste before final }
    return successes
      .map(r => {
        const inner = JSON.stringify(r.json, null, 2)
        // r.json is already { "word": { ... } } shape — extract inner value
        const parsed = r.json
        const key = Object.keys(parsed)[0]
        return `  "${key}": ${JSON.stringify(parsed[key], null, 2)}`
      })
      .join(',\n')
  }

  const [batchCopied, setBatchCopied] = useState(false)
  const copyBatch = () => {
    const block = buildBatchJSON()
    if (!block) return
    navigator.clipboard?.writeText(block)
    setBatchCopied(true)
    setTimeout(() => setBatchCopied(false), 1500)
  }

  const batchBlock = buildBatchJSON()

  // ── Styles ───────────────────────────────────────────────────
  const s = {
    page: { minHeight: '100vh', background: '#0a0906', color: '#f0e4c8', fontFamily: 'Georgia, serif', padding: '2rem' },
    h1: { color: '#c8a86a', fontSize: '1.4rem', marginBottom: '0.25rem', letterSpacing: '1px' },
    sub: { color: '#5a4e38', fontSize: '0.85rem', marginBottom: '1.5rem' },
    card: { background: '#130f08', border: '1px solid #251e10', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '1.5rem', fontSize: '13px', color: '#7a6a4a', lineHeight: '1.8' },
    label: { color: '#c8a86a' },
    code: { background: '#1e1a0e', padding: '1px 6px', borderRadius: '4px', color: '#c8a86a' },
    toggle: { display: 'flex', gap: '8px', marginBottom: '1.5rem' },
    toggleBtn: (active) => ({
      padding: '0.5rem 1.25rem', fontSize: '13px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Georgia, serif', fontWeight: active ? '700' : '400',
      background: active ? '#c8a86a' : '#1a1510', color: active ? '#0e0c08' : '#7a6a4a', border: active ? 'none' : '1px solid #3a2e1a',
    }),
    input: { flex: 1, padding: '0.75rem 1rem', fontSize: '1rem', background: '#1a1510', border: '1px solid #3a2e1a', borderRadius: '8px', color: '#f0e4c8', fontFamily: 'Georgia, serif', outline: 'none' },
    textarea: { width: '100%', minHeight: '160px', padding: '0.75rem 1rem', fontSize: '0.95rem', background: '#1a1510', border: '1px solid #3a2e1a', borderRadius: '8px', color: '#f0e4c8', fontFamily: 'monospace', outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: '1.8' },
    btn: (disabled, variant = 'primary') => ({
      padding: '0.75rem 1.5rem', background: disabled ? '#6a5835' : variant === 'primary' ? '#c8a86a' : '#1e1a0e',
      color: disabled ? '#0e0c08' : variant === 'primary' ? '#0e0c08' : '#c8a86a',
      border: variant === 'primary' ? 'none' : '1px solid #3a2e1a',
      borderRadius: '8px', fontSize: '0.95rem', fontWeight: '700', cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'Georgia, serif',
    }),
    pre: { background: '#130f08', border: '1px solid #251e10', borderRadius: '10px', padding: '1rem', fontFamily: 'monospace', fontSize: '12px', whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: '420px', overflowY: 'auto', color: '#c8b890', lineHeight: '1.6', marginBottom: '0.75rem' },
    statusOk: { fontSize: '13px', color: '#7a6a4a', marginBottom: '1rem' },
    statusErr: { fontSize: '13px', color: '#c86a6a', marginBottom: '1rem' },
    progress: { fontSize: '13px', color: '#7a6a4a', marginBottom: '1rem', fontStyle: 'italic' },
    resultsTable: { width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '1rem' },
    footer: { marginTop: '2rem', fontSize: '12px', color: '#3a3020', lineHeight: '1.8' },
  }

  return (
    <div style={s.page}>
      <h1 style={s.h1}>RhymeItNow — SEO Page Generator</h1>
      <p style={s.sub}>Your private tool — not linked in the nav</p>

      {/* Instructions */}
      <div style={s.card}>
        {!batchMode ? (
          <>
            <div style={{ marginBottom: '6px' }}><span style={s.label}>1.</span> Type a word → Generate → Copy JSON</div>
            <div style={{ marginBottom: '6px' }}><span style={s.label}>2.</span> Open <code style={s.code}>data/words-content.json</code> on GitHub</div>
            <div style={{ marginBottom: '6px' }}><span style={s.label}>3.</span> Paste before the final <code style={s.code}>{'}'}</code> — add a comma after the previous entry</div>
            <div><span style={s.label}>4.</span> Commit → Vercel deploys → new page live at rhymeitnow.com/rhymes-for/[word]</div>
          </>
        ) : (
          <>
            <div style={{ marginBottom: '6px' }}><span style={s.label}>1.</span> Paste your word list (one word per line) → Generate All</div>
            <div style={{ marginBottom: '6px' }}><span style={s.label}>2.</span> Wait for batch to complete — progress shown below</div>
            <div style={{ marginBottom: '6px' }}><span style={s.label}>3.</span> Copy JSON Block → open <code style={s.code}>data/words-content.json</code> on GitHub</div>
            <div style={{ marginBottom: '6px' }}><span style={s.label}>4.</span> Paste before the final <code style={s.code}>{'}'}</code> — add a comma after the previous entry</div>
            <div><span style={s.label}>5.</span> Commit once → Vercel deploys all new pages at once</div>
          </>
        )}
      </div>

      {/* Mode Toggle */}
      <div style={s.toggle}>
        <button style={s.toggleBtn(!batchMode)} onClick={() => setBatchMode(false)}>Single Word</button>
        <button style={s.toggleBtn(batchMode)} onClick={() => setBatchMode(true)}>Batch Mode</button>
      </div>

      {/* ── SINGLE MODE ── */}
      {!batchMode && (
        <>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
            <input
              type="text"
              value={word}
              onChange={e => setWord(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !loading && generate()}
              placeholder="Try: gold, war, peace, ocean, broken..."
              style={s.input}
            />
            <button onClick={generate} disabled={loading} style={s.btn(loading)}>
              {loading ? 'Working...' : 'Generate'}
            </button>
          </div>

          {status && <p style={status.startsWith('Error') ? s.statusErr : s.statusOk}>{status}</p>}

          {output && (
            <div>
              <pre style={s.pre}>{output}</pre>
              <button onClick={copy} style={s.btn(false, 'secondary')}>
                {copied ? 'Copied!' : 'Copy JSON'}
              </button>
            </div>
          )}
        </>
      )}

      {/* ── BATCH MODE ── */}
      {batchMode && (
        <>
          <textarea
            value={wordList}
            onChange={e => setWordList(e.target.value)}
            placeholder={'love\npain\ntime\nnight\ndream\ngrind\nshine'}
            disabled={batchRunning}
            style={s.textarea}
          />
          <div style={{ display: 'flex', gap: '8px', margin: '0.75rem 0 1rem' }}>
            <button onClick={runBatch} disabled={batchRunning || !wordList.trim()} style={s.btn(batchRunning || !wordList.trim())}>
              {batchRunning ? 'Running...' : 'Generate All'}
            </button>
            {batchBlock && (
              <button onClick={copyBatch} style={s.btn(false, 'secondary')}>
                {batchCopied ? 'Copied!' : 'Copy JSON Block'}
              </button>
            )}
          </div>

          {batchProgress && <p style={s.progress}>{batchProgress}</p>}

          {/* Results table */}
          {batchResults.length > 0 && (
            <table style={s.resultsTable}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', color: '#5a4e38', padding: '4px 8px', borderBottom: '1px solid #251e10' }}>Word</th>
                  <th style={{ textAlign: 'left', color: '#5a4e38', padding: '4px 8px', borderBottom: '1px solid #251e10' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {batchResults.map((r, i) => (
                  <tr key={i}>
                    <td style={{ padding: '4px 8px', color: '#c8b890' }}>{r.word}</td>
                    <td style={{ padding: '4px 8px', color: r.status === 'ok' ? '#6ac86a' : '#c86a6a' }}>
                      {r.status === 'ok' ? '✓ Done' : `✗ ${r.message}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* JSON block preview */}
          {batchBlock && (
            <pre style={s.pre}>{batchBlock}</pre>
          )}
        </>
      )}

      <p style={s.footer}>
        <span style={{ color: '#5a4e38' }}>High-traffic words to target:</span> gold · war · peace · stars · road · broken · lost · wild · run · truth · blood · glory · faith · rise · fall · stone · sky · grace · shadow · wings
      </p>
    </div>
  )
}
