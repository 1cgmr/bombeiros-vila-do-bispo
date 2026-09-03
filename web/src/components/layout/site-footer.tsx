import Link from 'next/link'

import {formatAddress, type AddressValue} from '@/lib/content'
import {footerNavigation} from '@/lib/navigation'
import {SanityImage, type SanityImageValue} from '@/components/content/sanity-image'
import {Icon} from '@/components/ui/icon'

type SocialLink = {platform?: string | null; label?: string | null; url?: string | null}

export function SiteFooter({name, logo, address, email, telephone, socialLinks}: {name: string; logo?: SanityImageValue; address?: AddressValue; email?: string | null; telephone?: string | null; socialLinks?: SocialLink[] | null}) {
  const addressLines = formatAddress(address ?? null)
  const publishedSocials = socialLinks?.filter((item) => item.url?.startsWith('https://')) ?? []

  return (
    <footer className="bg-brand-navy-dark text-white">
      <div className="border-b border-white/10">
        <div className="container-site grid gap-10 py-14 md:grid-cols-[1.1fr_1.5fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              {logo?.asset?.url ? <SanityImage className="h-16 w-16 object-contain" height={128} image={logo} sizes="64px" width={128} /> : <span aria-hidden="true" className="grid h-14 w-14 place-items-center border-2 border-brand-gold text-xs font-black text-brand-gold">BV</span>}
              <p className="max-w-64 font-black uppercase leading-tight tracking-wide">{name}</p>
            </div>
            <a className="mt-6 inline-flex min-h-11 items-center gap-3 rounded-sm bg-emergency-red px-4 py-2 font-bold transition hover:bg-emergency-red-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" href="tel:112"><Icon className="h-5 w-5" name="phone" /><span>Em caso de emergência, ligue 112</span></a>
          </div>

          <nav aria-label="Navegação no rodapé">
            <h2 className="footer-title">Navegação</h2>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
              {footerNavigation.map((item) => <li key={item.href}><Link className="inline-flex min-h-9 items-center text-white/78 transition hover:text-brand-gold-light focus-visible:outline-2 focus-visible:outline-brand-gold" href={item.href}>{item.label}</Link></li>)}
            </ul>
          </nav>

          <div>
            <h2 className="footer-title">Contactos</h2>
            <div className="space-y-3 text-sm text-white/78">
              {telephone ? <a className="flex min-h-9 items-center gap-2 hover:text-brand-gold-light" href={`tel:${telephone.replace(/[^+\d]/g, '')}`}><Icon className="h-4 w-4 shrink-0" name="phone" />{telephone}</a> : null}
              {email ? <a className="flex min-h-9 items-center gap-2 break-all hover:text-brand-gold-light" href={`mailto:${email}`}><Icon className="h-4 w-4 shrink-0" name="mail" />{email}</a> : null}
              {addressLines.length ? <div className="flex gap-2"><Icon className="mt-1 h-4 w-4 shrink-0" name="location" /><address className="not-italic">{addressLines.map((line) => <span className="block" key={line}>{line}</span>)}</address></div> : null}
            </div>
            {publishedSocials.length ? <ul aria-label="Redes sociais" className="mt-5 flex flex-wrap gap-3">{publishedSocials.map((social) => <li key={social.url}><a className="inline-flex min-h-11 items-center rounded-sm border border-white/25 px-3 text-sm font-bold hover:border-brand-gold hover:text-brand-gold-light focus-visible:outline-2 focus-visible:outline-brand-gold" href={social.url || undefined} rel="noopener noreferrer" target="_blank">{social.label || social.platform}</a></li>)}</ul> : null}
          </div>
        </div>
      </div>
      <div className="container-site flex flex-col gap-2 py-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {name}</p>
        <p>Conteúdo institucional gerido pela Associação.</p>
      </div>
    </footer>
  )
}
