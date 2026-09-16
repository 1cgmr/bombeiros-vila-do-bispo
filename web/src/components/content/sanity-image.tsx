import type {SanityImageSource} from '@sanity/image-url'
import Image from 'next/image'

import {urlForImage} from '@/sanity/image'

export type SanityImageValue = {
  asset?: {url?: string | null; metadata?: {lqip?: string | null; dimensions?: {aspectRatio?: number | null} | null} | null} | null
  alt?: string | null
  decorative?: boolean | null
  caption?: string | null
  credit?: string | null
  crop?: unknown
  hotspot?: unknown
} | null

export function SanityImage({
  image,
  className = '',
  sizes,
  priority = false,
  fit = 'crop',
  width = 1200,
  height = 800,
}: {
  image: SanityImageValue
  className?: string
  sizes: string
  priority?: boolean
  fit?: 'crop' | 'max'
  width?: number
  height?: number
}) {
  if (!image?.asset?.url) return null

  const imageUrl = urlForImage(image as SanityImageSource).width(width).quality(84)
  const src = fit === 'max' ? imageUrl.fit('max').url() : imageUrl.height(height).fit('crop').url()
  const decorative = Boolean(image.decorative)
  const alt = decorative ? '' : image.alt?.trim() || ''

  return (
    <Image
      alt={alt}
      blurDataURL={image.asset.metadata?.lqip || undefined}
      className={className}
      height={height}
      placeholder={image.asset.metadata?.lqip ? 'blur' : 'empty'}
      priority={priority}
      sizes={sizes}
      src={src}
      width={width}
    />
  )
}
