# RhymeItNow — rhymeitnow.com

AI-powered rhyme finder for poets, songwriters, and word lovers..

## Setup Instructions  

### 1. Add your Anthropic API Key in Vercel
- Go to your Vercel dashboard
- Click your project → Settings → Environment Variables
- Add: ANTHROPIC_API_KEY = (your key from console.anthropic.com)
- Redeploy the project

### 2. Add more word pages
- Run the RhymeItNow Generator tool in Claude
- Export the JSON file
- Replace /data/words-content.json with the new file
- Push to GitHub — Vercel redeploys automatically

### 3. Connect your domain
- In Vercel: Settings → Domains → Add rhymeitnow.com
- Copy the DNS values Vercel gives you
- Paste them into Namecheap DNS settings

## Project Structure
```
pages/
  index.js              - Homepage with rhyme tool
  about.js              - About page
  contact.js            - Contact page
  privacy.js            - Privacy policy
  terms.js              - Terms of use
  rhymes-for/[word].js  - Auto-generated SEO pages
  api/rhymes.js         - Server-side API (keeps key secret)
components/
  Layout.js             - Nav and footer used on all pages
data/
  words-content.json    - SEO page content (expand with generator)
styles/
  globals.css           - Global styles
```

## Built with
- Next.js 14
- Anthropic Claude API
- Deployed on Vercel (free)
