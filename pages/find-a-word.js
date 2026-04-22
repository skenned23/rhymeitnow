import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'

const EXAMPLE_PROMPTS = [
  "The smell of rain on dry earth",
  "Almost remembering something but not quite",
  "The urge to squeeze something unbearably cute",
  "Feeling nostalgic for a time you never lived",
  "The eerie calm before a storm",
  "When a word loses meaning from repeating it too much",
  "The sadness of a moment you know you'll forget",
  "Being the only one awake at 3am",
]

const PLACEHOLDERS = [
  "Find a word…",
  "Need a word…",
  "What's the word for…",
  "There's a word for that…",
]

export default function FindAWord() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('')
  const [isTypingPlaceholder, setIsTypingPlaceholder] = useState(true)
  const inputRef = useRef(null)

  // Animate placeholder
  useEffect(() => {
    const target = PLACEHOLDERS[placeholderIndex]
    let i = 0
    let timeout

    if (isTypingPlaceholder) {
      const type = () => {
        if (i <= target.length) {
          setDisplayedPlaceholder(target.slice(0, i))
          i++
          timeout = setTimeout(type, 60)
        } else {
          setTimeout(() => setIsTypingPlaceholder(false), 1800)
        }
      }
      type()
    } else {
      const erase = () => {
        if (i >= 0) {
          setDisplayedPlaceholder(target.slice(0, i))
          i--
          timeout = setTimeout(erase, 30)
        } else {
          setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length)
          setIsTypingPlaceholder(true)
        }
      }
      i = target.length
      erase()
    }

    return () => clearTimeout(timeout)
  }, [placeholderIndex, isTypingPlaceholder])

  const search = async (q) => {
    const searchQuery = q || query
    if (!searchQuery.trim()) return

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `You are a master lexicographer and word finder. The user is looking for a specific word or concept. Give them the BEST word that fits.

User's description: "${searchQuery}"

Respond ONLY with a valid JSON object in this exact format, no markdown, no preamble:
{
  "word": "the word",
  "pronunciation": "phonetic pronunciation e.g. peh-TRI-kor",
  "part_of_speech": "noun / verb / adjective / etc",
  "origin": "Language of origin e.g. Greek, Latin, Japanese",
  "definition": "A clear, vivid definition in 1-2 sentences",
  "example": "A compelling example sentence using the word naturally",
  "why_it_fits": "A brief explanation of why this word perfectly captures what they described",
  "also_consider": ["alternative_word_1", "alternative_word_2", "alternative_word_3"]
}`
            }
          ]
        })
      })

      const data = await response.json()
      const text = data.content?.[0]?.text || ''
      const clean = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      setResult(parsed)
    } catch (err) {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePromptClick = (prompt) => {
    setQuery(prompt)
    search(prompt)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') search()
  }

  return (
    <>
      <Head>
        <title>Find a Word — RhymeItNow</title>
        <meta name="description" content="Describe any concept, feeling, or idea and instantly find the perfect word. AI-powered word finder for writers, poets, and songwriters." />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background: #0d0d0d;
          color: #e8dcc8;
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
        }

        .page {
          max-width: 780px;
          margin: 0 auto;
          padding: 60px 24px 120px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #9a8a70;
          font-size: 13px;
          text-decoration: none;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.05em;
          margin-bottom: 56px;
          transition: color 0.2s;
        }
        .back-link:hover { color: #c9a84c; }

        .header { margin-bottom: 48px; }

        .label {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.2em;
          color: #c9a84c;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(36px, 6vw, 56px);
          font-weight: 700;
          line-height: 1.1;
          color: #f0e6d0;
          margin-bottom: 16px;
        }

        .subtitle {
          font-size: 16px;
          color: #7a6e5e;
          line-height: 1.6;
          font-weight: 300;
        }

        .search-wrap {
          position: relative;
          margin-bottom: 20px;
        }

        .search-input {
          width: 100%;
          background: #161410;
          border: 1px solid #2a2520;
          border-radius: 4px;
          padding: 20px 130px 20px 24px;
          font-size: 17px;
          color: #e8dcc8;
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          outline: none;
          transition: border-color 0.2s;
          line-height: 1.5;
        }
        .search-input::placeholder { color: #4a4035; }
        .search-input:focus { border-color: #c9a84c; }

        .search-btn {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          background: #c9a84c;
          color: #0d0d0d;
          border: none;
          border-radius: 3px;
          padding: 10px 20px;
          font-size: 13px;
          font-weight: 600;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .search-btn:hover { background: #e0be6a; }
        .search-btn:disabled { background: #3a3025; color: #6a5a40; cursor: not-allowed; }

        .prompts-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.15em;
          color: #4a4035;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .prompts {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 56px;
        }

        .prompt-chip {
          background: transparent;
          border: 1px solid #2a2520;
          border-radius: 2px;
          padding: 7px 14px;
          font-size: 13px;
          color: #7a6e5e;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-style: italic;
          transition: all 0.2s;
        }
        .prompt-chip:hover {
          border-color: #c9a84c;
          color: #c9a84c;
          background: #1a1610;
        }

        /* Loading */
        .loading {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 40px 0;
          color: #7a6e5e;
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          letter-spacing: 0.1em;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 1px solid #2a2520;
          border-top-color: #c9a84c;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Result */
        .result {
          animation: fadeUp 0.4s ease;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .result-card {
          border: 1px solid #2a2520;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 16px;
        }

        .result-header {
          background: #161410;
          padding: 32px 36px;
          border-bottom: 1px solid #2a2520;
        }

        .word-main {
          font-family: 'Playfair Display', serif;
          font-size: clamp(42px, 8vw, 72px);
          font-weight: 700;
          color: #f0e6d0;
          line-height: 1;
          margin-bottom: 12px;
        }

        .word-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .pronunciation {
          font-family: 'DM Mono', monospace;
          font-size: 14px;
          color: #c9a84c;
          letter-spacing: 0.05em;
        }

        .pos-badge {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #4a4035;
          border: 1px solid #2a2520;
          padding: 3px 10px;
          border-radius: 2px;
        }

        .origin-badge {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #4a4035;
        }

        .result-body {
          padding: 32px 36px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .result-section-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #4a4035;
          margin-bottom: 8px;
        }

        .definition {
          font-size: 17px;
          line-height: 1.7;
          color: #c8bca8;
          font-weight: 300;
        }

        .example-sentence {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 16px;
          line-height: 1.7;
          color: #9a8a70;
          border-left: 2px solid #2a2520;
          padding-left: 20px;
        }

        .why-it-fits {
          font-size: 14px;
          line-height: 1.7;
          color: #7a6e5e;
          background: #111009;
          padding: 16px 20px;
          border-radius: 3px;
          border: 1px solid #1e1c14;
        }

        .also-consider {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .alt-word {
          background: transparent;
          border: 1px solid #2a2520;
          border-radius: 2px;
          padding: 6px 14px;
          font-size: 13px;
          color: #7a6e5e;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }
        .alt-word:hover {
          border-color: #c9a84c;
          color: #c9a84c;
        }

        .error {
          color: #8a5a4a;
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          padding: 20px 0;
        }

        .divider {
          height: 1px;
          background: #1a1610;
          margin: 4px 0;
        }
      `}</style>

      <div className="page">
        <a href="/" className="back-link">← RhymeItNow</a>

        <div className="header">
          <div className="label">Word Finder</div>
          <h1 className="title">There's a word<br />for that.</h1>
          <p className="subtitle">Describe any feeling, concept, or idea.<br />We'll find the exact word you're looking for.</p>
        </div>

        <div className="search-wrap">
          <input
            ref={inputRef}
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={displayedPlaceholder}
          />
          <button
            className="search-btn"
            onClick={() => search()}
            disabled={loading || !query.trim()}
          >
            {loading ? 'Finding…' : 'Find Word'}
          </button>
        </div>

        <div className="prompts-label">Try one of these</div>
        <div className="prompts">
          {EXAMPLE_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              className="prompt-chip"
              onClick={() => handlePromptClick(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>

        {loading && (
          <div className="loading">
            <div className="spinner" />
            Searching the lexicon…
          </div>
        )}

        {error && <div className="error">{error}</div>}

        {result && !loading && (
          <div className="result">
            <div className="result-card">
              <div className="result-header">
                <div className="word-main">{result.word}</div>
                <div className="word-meta">
                  {result.pronunciation && (
                    <span className="pronunciation">/{result.pronunciation}/</span>
                  )}
                  {result.part_of_speech && (
                    <span className="pos-badge">{result.part_of_speech}</span>
                  )}
                  {result.origin && (
                    <span className="origin-badge">from {result.origin}</span>
                  )}
                </div>
              </div>

              <div className="result-body">
                <div>
                  <div className="result-section-label">Definition</div>
                  <div className="definition">{result.definition}</div>
                </div>

                <div>
                  <div className="result-section-label">Example</div>
                  <div className="example-sentence">"{result.example}"</div>
                </div>

                {result.why_it_fits && (
                  <div>
                    <div className="result-section-label">Why it fits</div>
                    <div className="why-it-fits">{result.why_it_fits}</div>
                  </div>
                )}

                {result.also_consider?.length > 0 && (
                  <div>
                    <div className="result-section-label">Also consider</div>
                    <div className="also-consider">
                      {result.also_consider.map((w) => (
                        <button
                          key={w}
                          className="alt-word"
                          onClick={() => { setQuery(w); search(w); }}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
