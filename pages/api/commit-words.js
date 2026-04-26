// pages/api/commit-words.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { newWords } = req.body
  if (!newWords || typeof newWords !== 'object') return res.status(400).json({ error: 'newWords object required' })

  const token = process.env.GITHUB_TOKEN
  if (!token) return res.status(500).json({ error: 'GITHUB_TOKEN not configured' })

  const owner = 'skenned23'
  const repo = 'rhymeitnow'
  const path = 'data/words-content.json'
  const apiBase = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`

  try {
    // 1. Get current file (need SHA + content)
    const getRes = await fetch(apiBase, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
      },
    })
    const getJson = await getRes.json()
    if (!getRes.ok) return res.status(500).json({ error: 'Failed to fetch file: ' + getJson.message })

    const sha = getJson.sha
    const currentContent = JSON.parse(Buffer.from(getJson.content, 'base64').toString('utf8'))

    // 2. Merge new words in
    const merged = { ...currentContent, ...newWords }

    // 3. Commit back
    const newContent = Buffer.from(JSON.stringify(merged, null, 2)).toString('base64')
    const wordList = Object.keys(newWords).join(', ')

    const putRes = await fetch(apiBase, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Add words: ${wordList}`,
        content: newContent,
        sha: sha,
      }),
    })
    const putJson = await putRes.json()
    if (!putRes.ok) return res.status(500).json({ error: 'Commit failed: ' + putJson.message })

    return res.status(200).json({ success: true, committed: Object.keys(newWords) })
  } catch (err) {
    console.error('Commit error:', err)
    return res.status(500).json({ error: err.message })
  }
}
