import type {Metadata} from 'next'
import type {ReactNode} from 'react'

import './globals.css'

export const metadata: Metadata = {
  title: 'Bombeiros Voluntários de Vila do Bispo — Em desenvolvimento',
  description: 'Fundação técnica do futuro website institucional.',
}

export default function RootLayout({children}: Readonly<{children: ReactNode}>) {
  return (
    <html lang="pt-PT">
      <body>{children}</body>
    </html>
  )
}
