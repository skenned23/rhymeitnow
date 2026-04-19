import Head from 'next/head'
import { SiteNav, SiteFooter } from '../components/Layout'

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact RhymeItNow</title>
        <meta name="description" content="Get in touch with the RhymeItNow team. Questions, feedback, or suggestions welcome." />
        <link rel="canonical" href="https://rhymeitnow.com/contact" />
      </Head>

      <SiteNav />

      <main style={{ maxWidth: '560px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ fontSize: '0.7rem', letterSpacing: '4px', color: '#7a6a4a', textTransform: 'uppercase', marginBottom: '1rem' }}>Get In Touch</div>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#f0e4c8', marginBottom: '1rem' }}>Contact Us</h1>
        <p style={{ fontSize: '1rem', lineHeight: '1.8', color: '#7a6a4a', marginBottom: '2.5rem' }}>
          Have a question, suggestion, or found a bug? We'd love to hear from you. RhymeItNow is built by a small team that genuinely cares about making the best rhyme finder on the web.
        </p>

        <div style={{ background: '#130f08', border: '1px solid #251e10', borderRadius: '10px', padding: '2rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '2px', color: '#7a6a4a', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Your Name</label>
            <input type="text" placeholder="Your name" style={{ width: '100%', padding: '0.75rem 1rem', background: '#1a1510', border: '1px solid #3a2e1a', borderRadius: '6px', color: '#f0e4c8', fontSize: '0.95rem', fontFamily: 'Georgia, serif', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '2px', color: '#7a6a4a', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Email Address</label>
            <input type="email" placeholder="your@email.com" style={{ width: '100%', padding: '0.75rem 1rem', background: '#1a1510', border: '1px solid #3a2e1a', borderRadius: '6px', color: '#f0e4c8', fontSize: '0.95rem', fontFamily: 'Georgia, serif', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '2px', color: '#7a6a4a', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Message</label>
            <textarea placeholder="Your message..." rows={5} style={{ width: '100%', padding: '0.75rem 1rem', background: '#1a1510', border: '1px solid #3a2e1a', borderRadius: '6px', color: '#f0e4c8', fontSize: '0.95rem', fontFamily: 'Georgia, serif', boxSizing: 'border-box', resize: 'vertical' }} />
          </div>
          <button style={{ width: '100%', padding: '0.85rem', background: '#c8a86a', color: '#0e0c08', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
            Send Message
          </button>
        </div>

        <p style={{ fontSize: '0.8rem', color: '#3a3020', marginTop: '1.5rem', textAlign: 'center' }}>
          We typically respond within 1-2 business days.
        </p>
      </main>

      <SiteFooter />
    </>
  )
}
