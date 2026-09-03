import type {Metadata} from 'next'

import {ContactSummary} from '@/components/content/contact-summary'
import {NewsCard} from '@/components/content/news-card'
import {PortableTextRenderer} from '@/components/content/portable-text'
import {SanityImage} from '@/components/content/sanity-image'
import {SectionHeading} from '@/components/content/section-heading'
import {ServiceCard} from '@/components/content/service-card'
import {ButtonLink, CmsButton} from '@/components/ui/button-link'
import {Icon} from '@/components/ui/icon'
import {buildMetadata} from '@/lib/metadata'
import {getContactInformation} from '@/sanity/queries/contact'
import {getHomepage} from '@/sanity/queries/homepage'
import {getNewsArticles} from '@/sanity/queries/news'
import {getServices} from '@/sanity/queries/services'
import {getSiteSettings} from '@/sanity/queries/site-settings'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  const [homepage, settings] = await Promise.all([getHomepage(), getSiteSettings()])
  return buildMetadata({title: 'Início', seo: homepage?.seo, siteSettings: settings})
}

function HighlightedHeadline({headline, highlightedFragment}: {headline: string; highlightedFragment?: string | null}) {
  if (!highlightedFragment || !headline.includes(highlightedFragment)) return <>{headline}</>
  const [before, ...after] = headline.split(highlightedFragment)
  return <>{before}<span className="text-brand-gold-light">{highlightedFragment}</span>{after.join(highlightedFragment)}</>
}

export default async function Home() {
  const [homepage, services, articles, contact] = await Promise.all([
    getHomepage(),
    getServices(),
    getNewsArticles(6),
    getContactInformation(),
  ])

  const featuredServices = homepage?.featuredServices?.length ? homepage.featuredServices : services.slice(0, 6)
  const newsCount = homepage?.latestNews?.itemCount ?? 3
  const latestArticles = articles.slice(0, newsCount)
  const hero = homepage?.hero
  const hasHeroContent = Boolean(hero?.headline || hero?.description || hero?.image?.asset?.url)
  const mission = homepage?.mission
  const hasMission = Boolean(mission?.title || mission?.body?.length || mission?.image?.asset?.url)

  return (
    <>
      <section className="relative isolate min-h-[39rem] overflow-hidden bg-brand-navy text-white sm:min-h-[43rem]">
        {hero?.image?.asset?.url ? <SanityImage className="absolute inset-0 -z-20 h-full w-full object-cover" height={1000} image={hero.image} priority sizes="100vw" width={1800} /> : null}
        <div aria-hidden="true" className={`absolute inset-0 -z-10 ${hero?.image?.asset?.url ? 'bg-[linear-gradient(90deg,rgba(5,23,42,.96)_0%,rgba(5,23,42,.78)_52%,rgba(5,23,42,.28)_100%)]' : 'bg-[radial-gradient(circle_at_80%_30%,#164c75_0%,transparent_38%),linear-gradient(135deg,var(--brand-navy),var(--brand-navy-dark))]'}`} />
        <div aria-hidden="true" className="absolute -bottom-36 -right-20 -z-10 h-96 w-96 rotate-12 border-[5rem] border-white/3" />
        <div className="container-site flex min-h-[39rem] items-center py-20 sm:min-h-[43rem]">
          <div className="max-w-3xl">
            <p className="mb-5 text-xs font-extrabold uppercase tracking-[.22em] text-brand-gold-light">Associação Humanitária</p>
            <h1 className="text-4xl font-black leading-[1.04] tracking-tight text-balance sm:text-6xl lg:text-7xl">
              {hero?.headline ? <HighlightedHeadline headline={hero.headline} highlightedFragment={hero.highlightedFragment} /> : 'Bombeiros Voluntários de Vila do Bispo'}
            </h1>
            {hero?.description ? <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80 sm:text-xl">{hero.description}</p> : !hasHeroContent ? <p className="mt-6 max-w-xl text-lg leading-8 text-white/72">Conteúdo institucional em preparação para publicação.</p> : null}
            <div className="mt-9 flex flex-wrap gap-3">
              <CmsButton callToAction={hero?.emergencyCta} fallback={{label: 'Emergência 112', href: 'tel:112', ariaLabel: 'Ligar 112 em caso de emergência', variant: 'emergency'}} />
              <CmsButton callToAction={hero?.recruitmentCta} fallback={{label: 'Quero ser bombeiro', href: '/recrutamento', variant: 'gold'}} />
              <CmsButton callToAction={hero?.supportCta} fallback={{label: 'Sócios e apoio', href: '/socios-e-apoio', variant: 'light'}} />
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Ações principais" className="relative z-10 -mt-8">
        <div className="container-site grid overflow-hidden rounded-sm shadow-2xl md:grid-cols-3">
          <a className="group flex min-h-32 items-center gap-5 bg-emergency-red px-6 py-7 text-white transition hover:bg-emergency-red-hover focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-white" href="tel:112"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/14"><Icon className="h-6 w-6" name="phone" /></span><span><strong className="block text-lg">Emergência</strong><span className="text-3xl font-black">112</span><span className="block text-sm text-white/78">Contacto telefónico de emergência</span></span></a>
          <a className="group flex min-h-32 items-center gap-5 bg-brand-gold px-6 py-7 text-brand-navy-dark transition hover:bg-brand-gold-light focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-brand-navy" href="/recrutamento"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-navy/9"><Icon className="h-6 w-6" name="shield" /></span><span><strong className="block text-lg">Quero ser bombeiro</strong><span className="text-sm opacity-75">Informação sobre recrutamento</span></span></a>
          <a className="group flex min-h-32 items-center gap-5 bg-white px-6 py-7 text-brand-navy transition hover:bg-brand-gold-pale focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-brand-gold-dark" href="/socios-e-apoio"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-gold-pale"><Icon className="h-6 w-6 text-brand-gold-dark" name="heart" /></span><span><strong className="block text-lg">Sócios e apoio</strong><span className="text-sm text-muted-text">Conhecer formas de participação</span></span></a>
        </div>
      </section>

      {homepage?.statistics?.length ? (
        <section aria-label="Indicadores oficiais" className="pt-14">
          <div className="container-site grid divide-y divide-brand-navy/10 border-y border-brand-navy/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {homepage.statistics.map((statistic) => <div className="px-5 py-8 text-center" key={statistic._key}><p className="text-4xl font-black tracking-tight text-brand-navy">{statistic.value}{statistic.suffix}</p>{statistic.label ? <p className="mt-2 text-sm font-bold uppercase tracking-wide text-muted-text">{statistic.label}</p> : null}</div>)}
          </div>
        </section>
      ) : null}

      {hasMission ? (
        <section className="section-space">
          <div className="container-site grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="relative min-h-80 overflow-hidden rounded-sm bg-brand-navy sm:min-h-[30rem]">
              {mission?.image?.asset?.url ? <SanityImage className="absolute inset-0 h-full w-full object-cover" height={900} image={mission.image} sizes="(max-width: 1024px) 100vw, 50vw" width={1000} /> : <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(135deg,#164c75,var(--brand-navy-dark))]" />}
              <div aria-hidden="true" className="absolute bottom-0 left-0 h-2 w-2/3 bg-brand-gold" />
            </div>
            <div>
              {mission?.sectionLabel ? <p className="section-label mb-4">{mission.sectionLabel}</p> : null}
              {mission?.title ? <h2 className="section-title">{mission.title}</h2> : null}
              <PortableTextRenderer className="mt-6" value={mission?.body} />
              <ButtonLink className="mt-6" href="/associacao" variant="navy">Conhecer a Associação <Icon className="h-4 w-4" name="arrow" /></ButtonLink>
            </div>
          </div>
        </section>
      ) : null}

      {featuredServices.length ? (
        <section className="section-space bg-white">
          <div className="container-site">
            <SectionHeading action={<ButtonLink href="/servicos" variant="outline">Ver todos os serviços</ButtonLink>} label="Ao serviço da comunidade" title="Serviços" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{featuredServices.map((service) => <ServiceCard key={service._id} service={service} />)}</div>
          </div>
        </section>
      ) : null}

      {latestArticles.length ? (
        <section className="section-space">
          <div className="container-site">
            <SectionHeading action={<ButtonLink href="/noticias" variant="outline">Todas as notícias</ButtonLink>} label={homepage?.latestNews?.sectionLabel || 'Atualidade'} title={homepage?.latestNews?.title || 'Notícias e atividades'} />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{latestArticles.map((article) => <NewsCard article={article} key={article._id} />)}</div>
          </div>
        </section>
      ) : null}

      <section className="bg-brand-gold text-brand-navy-dark">
        <div className="container-site flex flex-col gap-7 py-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-extrabold uppercase tracking-[.18em]">{homepage?.supportSection?.sectionLabel || 'Participação'}</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{homepage?.supportSection?.title || 'Sócios e apoio'}</h2>
            {homepage?.supportSection?.description ? <p className="mt-3 text-lg leading-7 opacity-80">{homepage.supportSection.description}</p> : null}
          </div>
          <CmsButton callToAction={homepage?.supportSection?.cta} fallback={{label: 'Conhecer formas de apoio', href: '/socios-e-apoio', variant: 'navy'}} />
        </div>
      </section>

      <ContactSummary address={contact?.address} directionsUrl={contact?.directionsMapUrl} email={contact?.generalEmail} telephone={contact?.telephone} />
    </>
  )
}
