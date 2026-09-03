import {formatAddress, type AddressValue} from '@/lib/content'
import {ButtonLink} from '@/components/ui/button-link'
import {Icon} from '@/components/ui/icon'

export function ContactSummary({address, email, telephone, directionsUrl}: {address?: AddressValue; email?: string | null; telephone?: string | null; directionsUrl?: string | null}) {
  const lines = formatAddress(address ?? null)
  const hasContact = Boolean(lines.length || email || telephone)

  return (
    <section className="bg-brand-navy text-white">
      <div className="container-site grid gap-8 py-12 lg:grid-cols-[.75fr_1.4fr] lg:items-center">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[.18em] text-brand-gold-light">Emergência</p>
          <a aria-label="Ligar 112 em caso de emergência" className="mt-2 inline-flex items-baseline gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" href="tel:112"><span className="text-xl font-bold">Ligue</span><span className="text-6xl font-black tracking-tight text-white">112</span></a>
          <p className="mt-1 text-sm text-white/70">O website não substitui o contacto telefónico de emergência.</p>
        </div>
        {hasContact ? (
          <div className="grid gap-5 border-t border-white/15 pt-7 sm:grid-cols-2 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <div className="space-y-3">
              {telephone ? <a className="flex min-h-11 items-center gap-3 font-semibold hover:text-brand-gold-light" href={`tel:${telephone.replace(/[^+\d]/g, '')}`}><Icon className="h-5 w-5 text-brand-gold-light" name="phone" />{telephone}</a> : null}
              {email ? <a className="flex min-h-11 items-center gap-3 break-all font-semibold hover:text-brand-gold-light" href={`mailto:${email}`}><Icon className="h-5 w-5 shrink-0 text-brand-gold-light" name="mail" />{email}</a> : null}
            </div>
            <div>
              {lines.length ? <div className="flex gap-3 text-white/80"><Icon className="mt-1 h-5 w-5 shrink-0 text-brand-gold-light" name="location" /><address className="not-italic">{lines.map((line) => <span className="block" key={line}>{line}</span>)}</address></div> : null}
              {directionsUrl?.startsWith('https://') ? <ButtonLink className="mt-4" href={directionsUrl} variant="light">Como chegar</ButtonLink> : null}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
