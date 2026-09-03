import {defineQuery} from 'groq'

import {sanityClient} from '../client'

export const GALLERIES_QUERY = defineQuery(`
  *[_type == "gallery"] | order(date desc, title asc){
    _id,
    title,
    "slug": slug.current,
    date,
    coverImage{
      asset->{_id, url, metadata{dimensions, lqip}},
      alt,
      decorative,
      caption,
      credit,
      crop,
      hotspot
    }
  }
`)

export const GALLERY_BY_SLUG_QUERY = defineQuery(`
  *[_type == "gallery" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    date,
    description,
    coverImage{
      asset->{_id, url, metadata{dimensions, lqip}},
      alt,
      decorative,
      caption,
      credit,
      crop,
      hotspot
    },
    items[]{
      _key,
      image{
        asset->{_id, url, metadata{dimensions, lqip}},
        alt,
        decorative,
        caption,
        credit,
        crop,
        hotspot
      }
    },
    seo
  }
`)

export function getGalleries() {
  return sanityClient.fetch(GALLERIES_QUERY)
}

export function getGalleryBySlug(slug: string) {
  return sanityClient.fetch(GALLERY_BY_SLUG_QUERY, {slug})
}
