import Link from 'next/link'

import {primaryNavigation} from '@/lib/navigation'
import {SanityImage, type SanityImageValue} from '@/components/content/sanity-image'
import {Icon} from '@/components/ui/icon'

import {MobileNavigation} from './mobile-navigation'

export function SiteHeader({name, shortName, logo}: {name: string; shortName?: string | null; logo?: SanityImageValue}) {
  return (
    <header className="relative z-40 bg-brand-navy text-white shadow-lg">
      <div className="container-site flex min-h-20 items-center justify-between gap-5 py-3">
        <Link aria-label={`${name} — página inicial`} className="group flex min-w-0 items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold" href="/">
          {logo?.asset?.url ? (
            <SanityImage className="h-14 w-14 shrink-0 object-contain" height={112} image={logo} sizes="56px" width={112} />
          ) : (
            <span aria-hidden="true" className="grid h-13 w-13 shrink-0 place-items-center border-2 border-brand-gold text-xs font-black tracking-wider text-brand-gold">BV</span>
          )}
          <span className="min-w-0 leading-tight">
            <span className="block text-[0.64rem] font-bold uppercase tracking-[0.18em] text-brand-gold-light">Associação Humanitária</span>
            <span className="mt-1 block max-w-64 text-sm font-black uppercase tracking-[0.04em] sm:text-base">{shortName || name}</span>
          </span>
        </Link>

        <nav aria-label="Navegação principal" className="hidden xl:block">
          <ul className="flex items-center gap-0.5">
            {primaryNavigation.map((item) => <li key={item.href}><Link className="block rounded-sm px-2.5 py-3 text-[0.72rem] font-bold uppercase tracking-[0.035em] text-white/90 transition hover:bg-white/8 hover:text-brand-gold-light focus-visible:outline-2 focus-visible:outline-brand-gold" href={item.href}>{item.label}</Link></li>)}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <a aria-label="Ligar 112 em caso de emergência" className="hidden min-h-11 items-center gap-2 rounded-sm bg-emergency-red px-4 py-2 text-sm font-black uppercase tracking-wide text-white transition hover:bg-emergency-red-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:flex" href="tel:112">
            <Icon className="h-5 w-5" name="phone" />
            <span><span className="block text-[0.58rem] font-semibold leading-none">Emergência</span><span className="text-lg leading-none">112</span></span>
          </a>
          <MobileNavigation />
        </div>
      </div>
    </header>
  )
}
