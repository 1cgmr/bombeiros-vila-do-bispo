import {Icon, type IconName} from '@/components/ui/icon'

export type ContentVisualVariant =
  | 'community'
  | 'emergency'
  | 'fire'
  | 'general'
  | 'institutional'
  | 'prevention'
  | 'training'
  | 'transport'
  | 'vehicle'

const iconByVariant: Record<ContentVisualVariant, IconName> = {
  community: 'community',
  emergency: 'shield',
  fire: 'fire',
  general: 'shield',
  institutional: 'building',
  prevention: 'fire',
  training: 'training',
  transport: 'vehicle',
  vehicle: 'vehicle',
}

export function ContentVisual({variant = 'general'}: {variant?: ContentVisualVariant | null}) {
  const safeVariant = variant && variant in iconByVariant ? variant : 'general'

  return (
    <div
      aria-hidden="true"
      className="relative grid h-full place-items-center overflow-hidden bg-[linear-gradient(135deg,var(--brand-navy),#153d60)] text-brand-gold"
    >
      <div className="absolute -right-10 -top-12 h-40 w-40 rotate-12 border-[2.25rem] border-white/4" />
      <div className="absolute -bottom-16 -left-12 h-44 w-44 rounded-full border-[2rem] border-brand-gold/8" />
      <span className="relative grid h-24 w-24 place-items-center rounded-full border border-brand-gold/30 bg-brand-navy-dark/35 shadow-[0_12px_35px_rgb(0_0_0_/_0.18)]">
        <Icon className="h-13 w-13" name={iconByVariant[safeVariant]} />
      </span>
    </div>
  )
}
