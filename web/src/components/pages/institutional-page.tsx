import {DocumentList} from '@/components/content/document-list'
import {EmptyState} from '@/components/content/empty-state'
import {PageHeader} from '@/components/content/page-header'
import {PortableTextRenderer} from '@/components/content/portable-text'
import {SanityImage} from '@/components/content/sanity-image'
import {getInstitutionalPage, type InstitutionalPageKey} from '@/sanity/queries/institutional-pages'

export async function InstitutionalPageView({pageKey, fallbackTitle}: {pageKey: InstitutionalPageKey; fallbackTitle: string}) {
  const page = await getInstitutionalPage(pageKey)

  return (
    <>
      <PageHeader introduction={page?.introduction} title={page?.title || fallbackTitle} />
      <div className="container-site section-space">
        {page ? (
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div><PortableTextRenderer value={page.body} />{page.documents?.length ? <section className="mt-14"><h2 className="mb-6 text-2xl font-extrabold text-brand-navy">Documentos relacionados</h2><DocumentList documents={page.documents} /></section> : null}</div>
            {page.featuredImage?.asset?.url ? <aside><SanityImage className="h-auto w-full rounded-sm object-cover" height={800} image={page.featuredImage} sizes="(max-width: 1024px) 100vw, 352px" width={600} /></aside> : null}
          </div>
        ) : <EmptyState />}
      </div>
    </>
  )
}
