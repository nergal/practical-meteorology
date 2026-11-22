import content from 'virtual:weather-atlas'

export const locales = ['uk', 'en'] as const
export type Locale = (typeof locales)[number]

export interface PhotoCredit {
  title: string
  creator: string
  collection: string
  sourceUrl: string
  collectionUrl?: string
  license: string
  licenseUrl: string
  modifications: string
}

export interface AtlasPhoto {
  url: string
  alt: string
  caption: string
  credit: PhotoCredit
}

export interface AtlasArticle {
  id: string
  title: string
  latin: string
  code: string
  description: string
  sections: { title: string; paragraphs: string[] }[]
  photos: AtlasPhoto[]
  references: { label: string; url: string }[]
}

export const atlas: Record<Locale, AtlasArticle[]> = content
