import type {Metadata} from 'next'

import {EmptyState} from '@/components/content/empty-state'
import {PageHeader} from '@/components/content/page-header'
import {PortableTextRenderer} from '@/components/content/portable-text'
import {SanityImage} from '@/components/content/sanity-image'
import {buildMetadata} from '@/lib/metadata'
import {getGoverningBodies} from '@/sanity/queries/governance'
import {getInstitutionalPage} from '@/sanity/queries/institutional-pages'
import {getSiteSettings} from '@/sanity/queries/site-settings'

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getInstitutionalPage('socialBodies'), getSiteSettings()])
  return buildMetadata({title: page?.title || 'Órgãos Sociais', description: page?.introduction, path: '/associacao/orgaos-sociais', seo: page?.seo, siteSettings: settings})
}

export default async function SocialBodiesPage() {
  const [page, bodies] = await Promise.all([getInstitutionalPage('socialBodies'), getGoverningBodies('governingBody')])
  const publishedBodies = bodies.filter((body) => body.isPlaceholder || body.roles?.some((role) => role.person?.publicName))

  return (
    <>
      <PageHeader eyebrow="Associação" introduction={page?.introduction} title={page?.title || 'Órgãos Sociais'} />
      <div className="container-site section-space space-y-12">
        {page?.body?.length ? <div className="max-w-4xl"><PortableTextRenderer value={page.body} /></div> : null}
        {publishedBodies.length ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {publishedBodies.map((body) => (
              <section className="rounded-sm border border-neutral-border bg-white p-6" key={body._id}>
                <h2 className="text-2xl font-bold text-brand-navy">{body.title}</h2>
                {body.isPlaceholder ? <p className="mt-3 inline-block rounded-sm bg-brand-gold-pale px-3 py-1 text-sm font-bold text-brand-navy">Exemplo provisório · por validar</p> : null}
                <PortableTextRenderer value={body.description} />
                {!body.isPlaceholder ? <ul className="mt-5 divide-y divide-neutral-border">
                  {body.roles?.filter((role) => role.person?.publicName).map((role) => (
                    <li className="flex items-center gap-4 py-4" key={role._key}>
                      {role.person?.photograph?.asset?.url ? <SanityImage className="h-14 w-14 rounded-full object-cover" height={112} image={role.person.photograph} sizes="56px" width={112} /> : null}
                      <span><strong className="block text-brand-navy">{role.person?.publicName}</strong><span className="text-sm text-muted-text">{role.roleTitle}</span>{role.publicNote ? <span className="block text-sm text-muted-text">{role.publicNote}</span> : null}</span>
                    </li>
                  ))}
                </ul> : null}
              </section>
            ))}
          </div>
        ) : (
          <EmptyState title="Composição em preparação" description="A composição dos órgãos sociais será publicada após confirmação pela Associação." />
        )}
      </div>
    </>
  )
}
