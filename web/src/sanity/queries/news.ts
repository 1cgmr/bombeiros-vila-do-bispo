import {defineQuery} from 'groq'

import {sanityClient} from '../client'

export const NEWS_ARTICLES_QUERY = defineQuery(`
  *[_type == "newsArticle" && publicationDate <= now()]
    | order(publicationDate desc) [0...$limit]{
      _id,
      title,
      "slug": slug.current,
      excerpt,
      publicationDate,
      fallbackVisual,
      mainImage{
        asset->{_id, url, metadata{dimensions, lqip}},
        alt,
        decorative,
        caption,
        credit,
        crop,
        hotspot
      },
      categories[]->{_id, name, "slug": slug.current}
    }
`)

export const NEWS_ARTICLE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "newsArticle" && slug.current == $slug && publicationDate <= now()][0]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publicationDate,
    fallbackVisual,
    mainImage{
      asset->{_id, url, metadata{dimensions, lqip}},
      alt,
      decorative,
      caption,
      credit,
      crop,
      hotspot
    },
    body,
    categories[]->{_id, name, "slug": slug.current},
    author->{
      _id,
      publicName,
      photograph{
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

export const NEWS_CATEGORIES_QUERY = defineQuery(`
  *[_type == "newsCategory"] | order(name asc){
    _id,
    name,
    "slug": slug.current,
    description
  }
`)

export function getNewsArticles(limit = 12) {
  return sanityClient.fetch(NEWS_ARTICLES_QUERY, {limit})
}

export function getNewsArticleBySlug(slug: string) {
  return sanityClient.fetch(NEWS_ARTICLE_BY_SLUG_QUERY, {slug})
}

export function getNewsCategories() {
  return sanityClient.fetch(NEWS_CATEGORIES_QUERY)
}
