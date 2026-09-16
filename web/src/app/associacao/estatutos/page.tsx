import type {Metadata} from 'next'

import {DocumentList} from '@/components/content/document-list'
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
  const examples = page?.statutesExamples?.filter((example) => example.title && example.text) ?? []

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
        ) : examples.length ? (
          <section aria-labelledby="statutes-examples-title" className="max-w-4xl">
            <h2 className="mb-6 text-2xl font-extrabold text-brand-navy" id="statutes-examples-title">Exemplos de artigos dos Estatutos</h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {examples.map((example) => (
                <li className="rounded-sm border border-neutral-border bg-white p-6" key={example._key}>
                  <h3 className="text-xl font-bold text-brand-navy">{example.title}</h3>
                  <span className="mt-3 inline-block rounded-sm bg-brand-gold-pale px-3 py-1 text-sm font-bold text-brand-navy">Exemplo provisório</span>
                  <p className="mt-4 whitespace-pre-line text-muted-text">{example.text}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </>
  )
}
