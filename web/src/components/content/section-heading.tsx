import type {ReactNode} from 'react'

export function SectionHeading({label, title, action, align = 'left'}: {label?: string | null; title: string; action?: ReactNode; align?: 'left' | 'center'}) {
  return (
    <div className={`mb-10 flex flex-col gap-5 ${align === 'center' ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between'}`}>
      <div>
        {label ? <p className="section-label mb-3">{label}</p> : null}
        <h2 className="section-title">{title}</h2>
      </div>
      {action}
    </div>
  )
}
