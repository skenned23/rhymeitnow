import Head from 'next/head'
import { SiteNav, SiteFooter } from '../components/Layout'

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy — RhymeItNow</title>
        <meta name="description" content="Privacy policy for RhymeItNow.com" />
      </Head>
      <SiteNav />
      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '3rem 1.5rem', fontSize: '0.95rem', lineHeight: '1.8', color: '#8a7a5a' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#f0e4c8', marginBottom: '0.5rem' }}>Privacy Policy</h1>
        <p style={{ color: '#4a4030', marginBottom: '2rem', fontSize: '0.85rem' }}>Last updated: January 2025</p>

        {[
          ['Information We Collect', 'RhymeItNow does not require you to create an account. We collect minimal data: search queries you submit (to generate rhymes), and standard server logs including IP addresses and browser information. We do not collect names, email addresses, or personal information unless you contact us directly.'],
          ['How We Use Your Information', 'Search queries are used solely to generate rhyme results via our AI system. We do not store your search history permanently. Server logs are used for site maintenance and security purposes only.'],
          ['Cookies and Analytics', 'We use standard analytics tools to understand how visitors use our site. This may include cookies. You can disable cookies in your browser settings without affecting your ability to use RhymeItNow.'],
          ['Advertising', 'RhymeItNow may display advertisements through Google AdSense. Google may use cookies to show ads based on your prior visits to our site and other sites. You can opt out of personalized advertising by visiting Google\'s Ad Settings.'],
          ['Third Party Services', 'We use the Anthropic API to power our rhyme-finding tool. Search queries are processed by Anthropic\'s systems. Please review Anthropic\'s privacy policy for information on how they handle data.'],
          ['Children\'s Privacy', 'RhymeItNow is not directed at children under 13. We do not knowingly collect personal information from children under 13.'],
          ['Changes to This Policy', 'We may update this Privacy Policy from time to time. We will notify users of significant changes by posting the new policy on this page with an updated date.'],
          ['Contact Us', 'If you have questions about this Privacy Policy, please contact us through our Contact page.'],
        ].map(([title, text]) => (
          <div key={title} style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.1rem', color: '#c8b890', fontWeight: '700', marginBottom: '0.5rem' }}>{title}</h2>
            <p>{text}</p>
          </div>
        ))}
      </main>
      <SiteFooter />
    </>
  )
}
