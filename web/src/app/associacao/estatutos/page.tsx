import type {Metadata} from 'next'

import {DocumentList} from '@/components/content/document-list'
import {EmptyState} from '@/components/content/empty-state'
import {PageHeader} from '@/components/content/page-header'
import {PortableTextRenderer} from '@/components/content/portable-text'
import {buildMetadata} from '@/lib/metadata'
import {getInstitutionalPage} from '@/sanity/queries/institutional-pages'
import {getSiteSettings} from '@/sanity/queries/site-settings'

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getInstitutionalPage('statutes'), getSiteSettings()])
  return buildMetadata({title: page?.title || 'Estatutos', description: page?.introduction, path: '/associacao/estatutos', seo: page?.seo, siteSettings: settings})
}

export default async function StatutesPage() {
  const page = await getInstitutionalPage('statutes')
  const statutes = page?.documents?.filter((document) => document.category === 'statutes' && document.file?.url) ?? []

  return (
    <>
      <PageHeader eyebrow="Associação" introduction={page?.introduction} title={page?.title || 'Estatutos'} />
      <div className="container-site section-space space-y-10">
        {page?.body?.length ? <div className="max-w-4xl"><PortableTextRenderer value={page.body} /></div> : null}
        {statutes.length ? (
          <section aria-labelledby="statutes-documents-title" className="max-w-4xl">
            <h2 className="mb-6 text-2xl font-extrabold text-brand-navy" id="statutes-documents-title">Documentos oficiais</h2>
            <DocumentList documents={statutes} />
          </section>
        ) : (
          <EmptyState title="Estatutos em preparação" description="O documento oficial será disponibilizado após validação e publicação pela Associação." />
        )}
      </div>
    </>
  )
}
