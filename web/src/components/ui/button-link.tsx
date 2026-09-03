import Link from 'next/link'
import type {ReactNode} from 'react'

import type {CallToActionValue} from '@/lib/content'
import {getCallToActionHref} from '@/lib/content'

const variants = {
  gold: 'bg-brand-gold text-brand-navy-dark hover:bg-brand-gold-light focus-visible:outline-brand-gold-light',
  light: 'border border-white/55 bg-white/10 text-white hover:bg-white hover:text-brand-navy-dark focus-visible:outline-white',
  emergency: 'bg-emergency-red text-white hover:bg-emergency-red-hover focus-visible:outline-white',
  navy: 'bg-brand-navy text-white hover:bg-brand-navy-dark focus-visible:outline-brand-gold',
  outline: 'border border-brand-navy/25 text-brand-navy hover:border-brand-gold hover:bg-brand-gold-pale focus-visible:outline-brand-gold',
} as const

export function ButtonLink({
  href,
  children,
  variant = 'gold',
  className = '',
  ariaLabel,
}: {
  href: string
  children: ReactNode
  variant?: keyof typeof variants
  className?: string
  ariaLabel?: string
}) {
  const external = href.startsWith('https://')
  const nonHttp = href.startsWith('tel:') || href.startsWith('mailto:')
  const classes = `inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-5 py-3 text-sm font-bold uppercase tracking-[0.06em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-3 ${variants[variant]} ${className}`

  if (external || nonHttp) {
    return <a aria-label={ariaLabel} className={classes} href={href} rel={external ? 'noopener noreferrer' : undefined} target={external ? '_blank' : undefined}>{children}</a>
  }

  return <Link aria-label={ariaLabel} className={classes} href={href}>{children}</Link>
}

export function CmsButton({callToAction, fallback, className}: {callToAction: CallToActionValue; fallback?: {label: string; href: string; ariaLabel?: string; variant?: keyof typeof variants}; className?: string}) {
  const href = getCallToActionHref(callToAction) ?? fallback?.href
  const label = callToAction?.label ?? fallback?.label
  if (!href || !label) return null

  const variant = callToAction?.style === 'emergency' ? 'emergency' : callToAction?.style === 'secondary' ? 'light' : fallback?.variant ?? 'gold'
  return <ButtonLink ariaLabel={callToAction?.accessibleLabel ?? fallback?.ariaLabel} className={className} href={href} variant={variant}>{label}</ButtonLink>
}
