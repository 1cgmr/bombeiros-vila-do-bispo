import type {Metadata} from 'next'

import {InstitutionalPageView} from '@/components/pages/institutional-page'
import {buildMetadata} from '@/lib/metadata'
import {getInstitutionalPage} from '@/sanity/queries/institutional-pages'
import {getSiteSettings} from '@/sanity/queries/site-settings'

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getInstitutionalPage('association'), getSiteSettings()])
  return buildMetadata({title: page?.title || 'Associação', description: page?.introduction, path: '/associacao', seo: page?.seo, siteSettings: settings})
}

export default function AssociationPage() {
  return <InstitutionalPageView fallbackTitle="Associação" pageKey="association" />
}
