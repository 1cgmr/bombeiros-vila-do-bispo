import Link from 'next/link'

import {primaryNavigation} from '@/lib/navigation'
import {SanityImage, type SanityImageValue} from '@/components/content/sanity-image'
import {Icon} from '@/components/ui/icon'

import {MobileNavigation} from './mobile-navigation'

export function SiteHeader({name, shortName, logo}: {name: string; shortName?: string | null; logo?: SanityImageValue}) {
  return (
    <header className="relative z-40 bg-brand-navy text-white shadow-lg">
      <div className="mx-auto flex min-h-20 w-[min(calc(100%_-_2rem),96rem)] items-center justify-between gap-5 py-3">
        <Link aria-label={`${name} — página inicial`} className="group flex min-w-0 items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold" href="/">
          {logo?.asset?.url ? (
            <SanityImage className="h-16 w-48 shrink-0 object-contain sm:h-20 sm:w-60" fit="max" height={160} image={logo} sizes="(max-width: 639px) 192px, 240px" width={480} />
          ) : (
            <span aria-hidden="true" className="grid h-13 w-13 shrink-0 place-items-center border-2 border-brand-gold text-xs font-black tracking-wider text-brand-gold">BV</span>
          )}
          <span className="hidden min-w-0 max-w-72 leading-tight min-[480px]:block">
            <span className="block text-[0.64rem] font-bold uppercase tracking-[0.18em] text-brand-gold-light">Associação Humanitária</span>
            <span className="mt-1 block text-sm font-black uppercase tracking-[0.035em] sm:text-[0.95rem]">{shortName || name}</span>
          </span>
        </Link>

        <nav aria-label="Navegação principal" className="hidden 2xl:block">
          <ul className="flex items-center gap-0.5">
            {primaryNavigation.map((item) => (
              <li key={item.href}>
                {'children' in item ? (
                  <details className="group relative">
                    <summary className="flex cursor-pointer list-none items-center gap-1 whitespace-nowrap rounded-sm px-2.5 py-3 text-[0.74rem] font-bold uppercase leading-none tracking-[0.025em] text-white/90 transition hover:bg-white/8 hover:text-brand-gold-light focus-visible:outline-2 focus-visible:outline-brand-gold [&::-webkit-details-marker]:hidden">
                      {item.label}<Icon className="h-3 w-3 rotate-90 transition group-open:-rotate-90" name="arrow" />
                    </summary>
                    <ul className="absolute left-0 top-full z-50 min-w-52 rounded-sm border border-white/10 bg-brand-navy-dark py-2 shadow-2xl">
                      {item.children.map((child) => (
                        <li key={child.href}><Link className="block px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/8 hover:text-brand-gold-light focus-visible:outline-2 focus-visible:outline-brand-gold" href={child.href}>{child.label}</Link></li>
                      ))}
                    </ul>
                  </details>
                ) : (
                  <Link className="block whitespace-nowrap rounded-sm px-2.5 py-3 text-[0.74rem] font-bold uppercase leading-none tracking-[0.025em] text-white/90 transition hover:bg-white/8 hover:text-brand-gold-light focus-visible:outline-2 focus-visible:outline-brand-gold" href={item.href}>{item.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <a aria-label="Ligar 112 em caso de emergência" className="hidden min-h-11 items-center gap-2 rounded-sm bg-emergency-red px-4 py-2 text-sm font-black uppercase tracking-wide text-white transition hover:bg-emergency-red-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:flex" href="tel:112">
            <Icon className="h-5 w-5" name="phone" />
            <span><span className="block text-[0.58rem] font-semibold leading-none">Emergência</span><span className="text-lg leading-none">112</span></span>
          </a>
          <MobileNavigation />
        </div>
      </div>
    </header>
  )
}
