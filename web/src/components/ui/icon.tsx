import type {SVGProps} from 'react'

export type IconName =
  | 'arrow'
  | 'building'
  | 'calendar'
  | 'close'
  | 'community'
  | 'document'
  | 'fire'
  | 'heart'
  | 'location'
  | 'mail'
  | 'menu'
  | 'phone'
  | 'shield'
  | 'training'
  | 'vehicle'

export function Icon({name, ...props}: SVGProps<SVGSVGElement> & {name: IconName}) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <path d="m9 18 6-6-6-6" />,
    building: <><path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6M8 10h.01M12 10h.01M16 10h.01" /></>,
    calendar: <><path d="M8 2v4M16 2v4M3 10h18" /><rect x="3" y="4" width="18" height="17" rx="2" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    community: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    document: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h6" /></>,
    fire: <path d="M12 22c4 0 7-2.7 7-7.1 0-3.2-1.8-5.8-5.3-8.7.2 2.5-1 4.2-2.3 5.2.1-3.8-1.8-6.5-4.1-8.4.1 3.9-2.3 6-2.3 10.9C5 18.4 8 22 12 22Zm0-2c-1.8 0-3-1.3-3-3.1 0-1.5.8-2.6 2.1-3.8 0 1.3.6 2.2 1.3 2.8.4-1 .9-1.8 1.6-2.5.7 1.1 1 2.2 1 3.4 0 1.9-1.2 3.2-3 3.2Z" />,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
    location: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    mail: <><rect x="2.5" y="4.5" width="19" height="15" rx="2" /><path d="m3 6 9 7 9-7" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.4 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />,
    training: <><path d="m2 10 10-5 10 5-10 5L2 10Z" /><path d="M6 12.5V17c3.2 2.5 8.8 2.5 12 0v-4.5M22 10v6" /></>,
    vehicle: <><path d="M3 17V8h11v9M14 11h4l3 3v3h-7M6 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM17 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM6 8V5h5v3" /></>,
  }

  return (
    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" {...props}>
      {paths[name]}
    </svg>
  )
}
