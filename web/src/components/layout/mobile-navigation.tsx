'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useState} from 'react'

import {primaryNavigation} from '@/lib/navigation'
import {Icon} from '@/components/ui/icon'

export function MobileNavigation() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="2xl:hidden">
      <button aria-controls="mobile-navigation" aria-expanded={open} aria-label={open ? 'Fechar menu' : 'Abrir menu'} className="flex min-h-11 min-w-11 items-center justify-center rounded-sm border border-white/25 text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold" onClick={() => setOpen((value) => !value)} type="button">
        <Icon className="h-6 w-6" name={open ? 'close' : 'menu'} />
      </button>
      {open ? (
        <nav aria-label="Navegação móvel" className="absolute inset-x-0 top-full z-50 border-t border-white/15 bg-brand-navy-dark shadow-2xl" id="mobile-navigation">
          <ul className="container-site grid max-h-[calc(100vh-5rem)] overflow-y-auto py-4 sm:grid-cols-2">
            {primaryNavigation.map((item) => (
              <li key={item.href}>
                {'children' in item ? (
                  <details>
                    <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between border-b border-white/10 px-2 py-3 font-semibold text-white hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-brand-gold [&::-webkit-details-marker]:hidden">
                      {item.label}<Icon className="h-4 w-4 rotate-90" name="arrow" />
                    </summary>
                    <ul className="border-b border-white/10 bg-white/5 pl-4">
                      {item.children.map((child) => (
                        <li key={child.href}><Link aria-current={pathname === child.href ? 'page' : undefined} className="block min-h-11 px-2 py-3 text-white transition hover:text-brand-gold-light focus-visible:outline-2 focus-visible:outline-brand-gold" href={child.href} onClick={() => setOpen(false)}>{child.label}</Link></li>
                      ))}
                    </ul>
                  </details>
                ) : (
                  <Link aria-current={pathname === item.href ? 'page' : undefined} className="block min-h-11 border-b border-white/10 px-2 py-3 font-semibold text-white transition hover:bg-white/5 hover:text-brand-gold-light focus-visible:outline-2 focus-visible:outline-brand-gold" href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  )
}
