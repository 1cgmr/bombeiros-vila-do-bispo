import type {Metadata} from 'next'
import Link from 'next/link'

import {DocumentList} from '@/components/content/document-list'
import {EmptyState} from '@/components/content/empty-state'
import {PageHeader} from '@/components/content/page-header'
import {PortableTextRenderer} from '@/components/content/portable-text'
import {SanityImage} from '@/components/content/sanity-image'
import {Icon} from '@/components/ui/icon'
import {buildMetadata} from '@/lib/metadata'
import {getInstitutionalPage} from '@/sanity/queries/institutional-pages'
import {getSiteSettings} from '@/sanity/queries/site-settings'

const sections = [
  {title: 'Estatutos', href: '/associacao/estatutos', description: 'Consulte a informação e os documentos oficiais da Associação.', icon: 'document'},
  {title: 'Órgãos Sociais', href: '/associacao/orgaos-sociais', description: 'Conheça a composição dos órgãos sociais publicada pela Associação.', icon: 'community'},
] as const

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getInstitutionalPage('association'), getSiteSettings()])
  return buildMetadata({title: page?.title || 'Associação', description: page?.introduction, path: '/associacao', seo: page?.seo, siteSettings: settings})
}

export default async function AssociationPage() {
  const page = await getInstitutionalPage('association')

  return (
    <>
      <PageHeader introduction={page?.introduction} title={page?.title || 'Associação'} />
      <div className="container-site section-space space-y-16">
        <section aria-labelledby="president-message-title" className="rounded-sm border-l-4 border-brand-gold bg-white p-6 sm:p-8">
          <h2 className="text-2xl font-extrabold text-brand-navy" id="president-message-title">Mensagem do Presidente</h2>
          {page?.presidentMessage?.length ? (
            <PortableTextRenderer value={page.presidentMessage} />
          ) : (
            <p className="mt-4 text-muted-text">Mensagem em preparação. O texto será publicado após aprovação.</p>
          )}
        </section>

        {page ? (
          <section aria-label="Apresentação da Associação" className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div>
              <PortableTextRenderer value={page.body} />
              {page.documents?.length ? <section className="mt-14"><h2 className="mb-6 text-2xl font-extrabold text-brand-navy">Documentos relacionados</h2><DocumentList documents={page.documents} /></section> : null}
            </div>
            {page.featuredImage?.asset?.url ? <aside><SanityImage className="h-auto w-full rounded-sm object-cover" height={800} image={page.featuredImage} sizes="(max-width: 1024px) 100vw, 352px" width={600} /></aside> : null}
          </section>
        ) : <EmptyState />}

        <nav aria-label="Secções da Associação" className="grid gap-5 md:grid-cols-2">
          {sections.map((section) => (
            <Link className="group rounded-sm border border-neutral-border bg-white p-6 transition hover:border-brand-gold hover:bg-brand-gold-pale focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold" href={section.href} key={section.href}>
              <span className="grid h-12 w-12 place-items-center bg-brand-navy text-white"><Icon className="h-6 w-6" name={section.icon} /></span>
              <span className="mt-5 block text-2xl font-bold text-brand-navy">{section.title}</span>
              <span className="mt-2 block text-muted-text">{section.description}</span>
              <span className="mt-5 inline-flex items-center gap-2 font-bold text-brand-navy">Saber mais <Icon className="h-4 w-4 transition group-hover:translate-x-1" name="arrow" /></span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}
