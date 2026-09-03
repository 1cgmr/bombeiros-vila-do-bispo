import type {Metadata} from 'next'
import {Montserrat, Source_Sans_3} from 'next/font/google'
import type {ReactNode} from 'react'

import {SiteFooter} from '@/components/layout/site-footer'
import {SiteHeader} from '@/components/layout/site-header'
import {defaultSiteName, resolveSiteUrl} from '@/lib/metadata'
import {getContactInformation} from '@/sanity/queries/contact'
import {getSiteSettings} from '@/sanity/queries/site-settings'

import './globals.css'

const headingFont = Montserrat({subsets: ['latin'], variable: '--font-heading', display: 'swap'})
const bodyFont = Source_Sans_3({subsets: ['latin'], variable: '--font-body', display: 'swap'})

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const siteName = settings?.officialName || settings?.shortName || defaultSiteName
  const baseUrl = resolveSiteUrl(settings?.siteUrl)

  return {
    metadataBase: baseUrl ? new URL(baseUrl) : undefined,
    title: {default: settings?.defaultSeo?.metaTitle || siteName, template: `%s | ${siteName}`},
    description: settings?.defaultSeo?.metaDescription || undefined,
    robots: settings?.defaultSeo?.noIndex ? {index: false, follow: false} : undefined,
  }
}

export default async function RootLayout({children}: Readonly<{children: ReactNode}>) {
  const [settings, contact] = await Promise.all([getSiteSettings(), getContactInformation()])
  const siteName = settings?.officialName || defaultSiteName

  return (
    <html className={`${headingFont.variable} ${bodyFont.variable}`} data-scroll-behavior="smooth" lang="pt-PT">
      <body>
        <a className="skip-link" href="#conteudo-principal">Saltar para o conteúdo</a>
        <SiteHeader logo={settings?.logo} name={siteName} shortName={settings?.shortName} />
        <main id="conteudo-principal">{children}</main>
        <SiteFooter address={contact?.address} email={contact?.generalEmail} logo={settings?.logo} name={siteName} socialLinks={contact?.socialLinks} telephone={contact?.telephone} />
      </body>
    </html>
  )
}
