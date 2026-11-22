declare module 'virtual:weather-atlas' {
  const content: Record<import('./atlas').Locale, import('./atlas').AtlasArticle[]>
  export default content
}
