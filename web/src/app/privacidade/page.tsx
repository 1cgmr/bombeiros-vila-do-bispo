import type {Metadata} from 'next'

import {InstitutionalPageView} from '@/components/pages/institutional-page'
import {buildMetadata} from '@/lib/metadata'
import {getInstitutionalPage} from '@/sanity/queries/institutional-pages'
import {getSiteSettings} from '@/sanity/queries/site-settings'

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getInstitutionalPage('privacyPolicy'), getSiteSettings()])
  return buildMetadata({title: page?.title || 'Política de Privacidade', description: page?.introduction, path: '/privacidade', seo: page?.seo, siteSettings: settings})
}

export default function PrivacyPage() {
  return <InstitutionalPageView fallbackTitle="Política de Privacidade" pageKey="privacyPolicy" />
}
