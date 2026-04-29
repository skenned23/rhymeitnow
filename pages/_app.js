import '../styles/globals.css'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Script from 'next/script'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-G9J2CD6H48"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-G9J2CD6H48');
        `}
      </Script>
      <Script
        src="https://analytics.ahrefs.com/analytics.js"
        data-key="97nNRRzi2WQAW7rKzjrUSg"
        strategy="afterInteractive"
      />
      <Component {...pageProps} />
      <Analytics />
      <SpeedInsights />
    </>
  )
}
