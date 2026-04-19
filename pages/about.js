import Head from 'next/head'
import { SiteNav, SiteFooter } from '../components/Layout'

export default function About() {
  return (
    <>
      <Head>
        <title>About RhymeItNow — The Story Behind the Smarter Rhyme Finder</title>
        <meta name="description" content="RhymeItNow was built for poets, songwriters, and word lovers who deserve better than a 1990s rhyming dictionary. Free, AI-powered, and built with care." />
        <link rel="canonical" href="https://rhymeitnow.com/about" />
      </Head>

      <SiteNav />

      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '3rem 1.5rem' }}>

        <div style={{ fontSize: '0.7rem', letterSpacing: '4px', color: '#7a6a4a', textTransform: 'uppercase', marginBottom: '1rem' }}>Our Story</div>

        <h1 style={{ fontSize: '2.2rem', fontWeight: '700', color: '#f0e4c8', marginBottom: '2rem', letterSpacing: '-0.5px' }}>
          About RhymeItNow
        </h1>

        <div style={{ fontSize: '1rem', lineHeight: '1.9', color: '#8a7a5a' }}>

          <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: '#c8b890', fontStyle: 'italic' }}>
            We built RhymeItNow because we were tired of RhymeZone.
          </p>

          <p style={{ marginBottom: '1.5rem' }}>
            That probably sounds harsh — RhymeZone has been around since 1996, and honestly, it deserves respect for lasting that long. But when you sit down to write lyrics and pull up the same clunky interface that hasn't changed in decades, something clicks. The internet has changed. Creative tools have changed. Why was the best rhyme finder on the web still running on 1990s design logic?
          </p>

          <p style={{ marginBottom: '1.5rem' }}>
            RhymeItNow is our answer to that question.
          </p>

          <div style={{ borderLeft: '3px solid #c8a86a', paddingLeft: '1.25rem', margin: '2rem 0', color: '#c8b890', fontStyle: 'italic', fontSize: '1.05rem', lineHeight: '1.8' }}>
            "Finding the right rhyme isn't about picking the first word on a list. It's about finding the word that holds everything else in place."
          </div>

          <h2 style={{ fontSize: '1.3rem', color: '#f0e4c8', fontWeight: '700', margin: '2rem 0 1rem' }}>
            What makes a good rhyme finder?
          </h2>

          <p style={{ marginBottom: '1.5rem' }}>
            Most rhyme tools give you a flat list of words and call it done. But anyone who has written a song, a poem, or even a birthday card knows that rhyming isn't binary. There are perfect rhymes — words that lock together exactly. There are near rhymes — words that almost fit, with just enough difference to feel intentional. And there are slant rhymes — the loose, unexpected pairings that modern songwriters use to keep things from feeling too neat.
          </p>

          <p style={{ marginBottom: '1.5rem' }}>
            RhymeItNow separates all three clearly, so you can see your options and make a real creative choice. Not just a list. A toolkit. Powered by AI that understands the nuance between sound and meaning.
          </p>

          <h2 style={{ fontSize: '1.3rem', color: '#f0e4c8', fontWeight: '700', margin: '2rem 0 1rem' }}>
            Who is this for?
          </h2>

          <div style={{ marginBottom: '1.5rem' }}>
            {[
              'Songwriters who need a word fast, in the middle of a session.',
              'Poets who want to explore the edges of a sound without losing the meaning.',
              'Students writing their first rhyming poem for class.',
              'Scrabble and word game players hunting for that perfect play.',
              'Anyone who has ever stared at a half-finished lyric and felt stuck.',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.6rem', alignItems: 'flex-start' }}>
                <span style={{ color: '#c8a86a', marginTop: '0.1rem', flexShrink: 0 }}>✦</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: '1.3rem', color: '#f0e4c8', fontWeight: '700', margin: '2rem 0 1rem' }}>
            The tool is free. It will stay free.
          </h2>

          <p style={{ marginBottom: '1.5rem' }}>
            No account required. No word limits. No premium tier hiding the good results. Good creative tools should be accessible to everyone — that's the whole point of building this.
          </p>

          <div style={{ background: '#130f08', border: '1px solid #251e10', borderRadius: '10px', padding: '1.5rem', marginTop: '2.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '3px', color: '#c8a86a', textTransform: 'uppercase', marginBottom: '0.5rem' }}>RhymeItNow</div>
            <div style={{ fontSize: '0.9rem', color: '#5a4e38' }}>Built for poets, songwriters, and word lovers everywhere.</div>
          </div>
        </div>

      </main>

      <SiteFooter />
    </>
  )
}
