import type {Metadata} from 'next'

import {InstitutionalPageView} from '@/components/pages/institutional-page'
import {buildMetadata} from '@/lib/metadata'
import {getInstitutionalPage} from '@/sanity/queries/institutional-pages'
import {getSiteSettings} from '@/sanity/queries/site-settings'

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getInstitutionalPage('accessibilityStatement'), getSiteSettings()])
  return buildMetadata({title: page?.title || 'Declaração de Acessibilidade', description: page?.introduction, path: '/acessibilidade', seo: page?.seo, siteSettings: settings})
}

export default function AccessibilityPage() {
  return <InstitutionalPageView fallbackTitle="Declaração de Acessibilidade" pageKey="accessibilityStatement" />
}
