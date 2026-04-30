// pages/api/commit-words.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { content } = req.body
  if (!content) return res.status(400).json({ error: 'No content provided' })

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN
  const REPO = 'skenned23/rhymeitnow'
  const FILE_PATH = 'data/words-content.json'
  const BASE = `https://api.github.com/repos/${REPO}`

  try {
    // 1. Get file SHA and download URL
    const metaRes = await fetch(`${BASE}/contents/${FILE_PATH}`, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
      },
    })
    const metaData = await metaRes.json()
    const sha = metaData.sha
    const downloadUrl = metaData.download_url

    // 2. Fetch actual content via download_url (no size limit)
    const rawRes = await fetch(downloadUrl, {
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
    })
    const currentContent = await rawRes.text()

    // 3. Insert before final closing }
    const trimmed = currentContent.trimEnd()
    const lastBrace = trimmed.lastIndexOf('}')
    if (lastBrace === -1) {
      return res.status(500).json({ error: 'Could not find closing brace in words-content.json' })
    }

    const newContent = trimmed.slice(0, lastBrace) + content.trim() + '\n}'

    // 4. Commit updated file
    const updateRes = await fetch(`${BASE}/contents/${FILE_PATH}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Add word entries via generator`,
        content: Buffer.from(newContent).toString('base64'),
        sha,
      }),
    })

    const updateData = await updateRes.json()
    if (updateData.commit) {
      res.status(200).json({ success: true, commit: updateData.commit.sha })
    } else {
      res.status(500).json({ error: updateData.message || 'GitHub update failed' })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
