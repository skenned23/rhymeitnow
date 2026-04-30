// pages/api/commit-words.js
// Appends new word JSON into data/words-content.json on GitHub

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { content } = req.body
  if (!content) return res.status(400).json({ error: 'No content provided' })

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN
  const REPO = 'skenned23/rhymeitnow'
  const FILE_PATH = 'data/words-content.json'
  const API_URL = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`

  try {
    // 1. Get current file
    const getRes = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
      },
    })
    const fileData = await getRes.json()
    const sha = fileData.sha
    const currentContent = Buffer.from(fileData.content, 'base64').toString('utf8')

    // 2. Insert new content before the final closing }
    const trimmed = currentContent.trimEnd()
const lastBrace = trimmed.lastIndexOf('}')
    if (lastBrace === -1) {
      return res.status(500).json({ error: 'Could not find closing brace in words-content.json' })
    }

    const newContent = trimmed.slice(0, lastBrace) + content.trim() + '\n}'

    // 3. Commit updated file
    const updateRes = await fetch(API_URL, {
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
