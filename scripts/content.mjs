import { readFileSync, readdirSync } from 'node:fs'
import { basename, dirname, resolve } from 'node:path'

const cloudCodes = {
  cirrus: 'Ci', cirrocumulus: 'Cc', cirrostratus: 'Cs', altocumulus: 'Ac',
  altostratus: 'As', nimbostratus: 'Ns', stratocumulus: 'Sc', stratus: 'St',
  cumulus: 'Cu', cumulonimbus: 'Cb',
}

const locales = ['uk', 'en']
const moduleId = 'virtual:weather-atlas'
const photoLink = /^!\[([^\]\n]+)\]\(([^)\n]+\.jpg)\)$/gm
const link = /\[([^\]]+)\]\(([^)]+)\)/g

function required(value, message) {
  if (!value) throw new Error(message)
  return value
}

function localized(locale, en, uk) {
  return locale === 'en' ? en : uk
}

function readCredit(line, locale, file) {
  const [, title, creator] = required(
    line.match(/“([^”]+)” by (.+?)(?=,| \||\. (?:Original|Wikimedia|Cropped|The source))/),
    `Missing photograph title or creator in ${file}`,
  )
  const links = [...line.matchAll(link)].map((match) => match[2])
  const commonsUrl = required(links.find((url) => url.startsWith('https://commons.wikimedia.org/')), `Missing Wikimedia source in ${file}`)
  const flickrUrl = links.find((url) => url.startsWith('https://www.flickr.com/'))
  const sourceUrl = flickrUrl ?? commonsUrl
  const rightsUrl = links.find((url) => url.startsWith('https://creativecommons.org/'))
  let license = line.match(/CC(?: BY(?:-SA)?|0) [\d.]+\d/)?.[0]
  if (line.includes('NOAA employee work')) {
    license = localized(locale, 'U.S. public domain · NOAA employee work', 'Суспільне надбання у США · робота працівника NOAA')
  } else if (!license && line.includes('public domain')) {
    license = localized(locale, 'Public domain · released by the photographer', 'Суспільне надбання · передано фотографом')
  }

  let modifications
  if (line.includes('Original JPEG')) {
    modifications = localized(locale, 'Original JPEG.', 'Оригінальний файл JPEG.')
  } else {
    const width = line.includes('1,280-pixel') ? '1,280' : '960'
    const rendition = localized(locale, `Wikimedia Commons rendition, ${width} pixels wide.`, `Версія Вікісховища завширшки ${width.replace(',', ' ')} пікселів.`)
    const crop = line.match(/\bcropped\b/i)
    if (crop && line.includes('buildings and treetops')) {
      modifications = localized(locale, `${rendition} Cropped to remove buildings and treetops.`, `${rendition} Кадр обрізано, щоб прибрати будівлі й верхівки дерев.`)
    } else if (crop && line.includes('skyline')) {
      modifications = localized(locale, `${rendition} Cropped at the bottom to remove the skyline.`, `${rendition} Нижню частину кадру з лінією горизонту обрізано.`)
    } else if (crop) {
      modifications = localized(locale, `${rendition} Cropped to show only sky.`, `${rendition} Кадр обрізано, щоб залишити лише небо.`)
    } else {
      modifications = rendition
    }
    if (line.includes('neutral-density filter')) {
      modifications += localized(locale, ' A graduated neutral-density filter was used during capture.', ' Під час зйомки використано градієнтний нейтрально-сірий фільтр.')
    }
  }

  const collection = line.includes('NOAA National Weather Service Collection')
    ? localized(locale, 'NOAA National Weather Service Collection', 'Колекція Національної метеорологічної служби NOAA')
    : flickrUrl ? 'Flickr' : localized(locale, 'Wikimedia Commons', 'Вікісховище')
  return { title, creator, collection, sourceUrl, collectionUrl: commonsUrl,
    license: required(license, `Missing license in ${file}`), licenseUrl: rightsUrl ?? commonsUrl, modifications }
}

function parseArticle(markdown, path) {
  const [, title] = required(markdown.match(/^# (.+?)(?: \([^\n]+\))?$/m), `Missing title in ${path}`)
  const photosHeading = required(markdown.match(/^## (?:Photographs|Фотографії)$/m), `Missing photograph heading in ${path}`)
  const beforePhotos = markdown.slice(0, photosHeading.index)
  const afterPhotos = markdown.slice(photosHeading.index + photosHeading[0].length)
  const sections = beforePhotos.replace(/^# [^\n]+\n/, '').trim().split(/^## /m)
    .map((chunk, index) => {
      if (index === 0) return { title: '', paragraphs: chunk.trim().split(/\n\s*\n/).filter(Boolean) }
      const [title, ...body] = chunk.split('\n')
      return { title, paragraphs: body.join('\n').trim().split(/\n\s*\n/).filter(Boolean) }
    }).filter((section) => section.paragraphs.length)
  const references = [...afterPhotos.matchAll(link)].filter((match) => match[2].startsWith('https://'))
    .map(([, label, url]) => ({ label, url }))
  required(references.some(({ url }) => url.startsWith('https://cloudatlas.wmo.int/')), `Missing WMO reference in ${path}`)
  const matches = [...afterPhotos.matchAll(photoLink)]
  required(matches.length === 3, `Expected three localized photographs in ${path}`)
  const photos = matches.map(([image, alt, src], i) => {
    const start = matches[i].index + image.length
    const end = matches[i + 1]?.index ?? afterPhotos.length
    const caption = afterPhotos.slice(start, end).trim().split('\n')[0].replaceAll('**', '')
    required(caption && !/^[#!\[]/.test(caption), `Missing caption for ${src} in ${path}`)
    return { path: resolve(dirname(path), src), alt, caption }
  })
  return { title, sections, photos, references }
}

function readAtlas(root, watch) {
  const read = (path) => {
    watch(path)
    return readFileSync(path, 'utf8')
  }

  return Object.fromEntries(locales.map((locale) => {
    const descriptionsPath = resolve(root, `content/${locale}/README.md`)
    const descriptions = new Map([...read(descriptionsPath).matchAll(/!\[([^\]]+)\]\([^)]*\/photo-selection\/([^/]+)\/[^)]+\)/g)]
      .map(([, description, id]) => [id, description]))
    const articles = Object.entries(cloudCodes).map(([id, code]) => {
      const latin = id[0].toUpperCase() + id.slice(1)
      const folder = resolve(root, 'docs/photo-selection', id)
      const photoFiles = readdirSync(folder).filter((file) => file.endsWith('.jpg')).sort()
      required(photoFiles.length === 3, `Expected three JPEGs in ${folder}`)
      const shortlist = read(resolve(folder, 'README.md'))
      const sourcePhotos = [...shortlist.matchAll(photoLink)]
      required(sourcePhotos.length === 3 && sourcePhotos.every((match, i) => match[2] === photoFiles[i]), `Shortlist photographs do not match ${folder}`)
      const credits = shortlist.split('\n').filter((line) => /“[^”]+” by /.test(line))
      required(credits.length === 3, `Expected three credits in ${folder}`)

      const articlePath = resolve(root, `content/${locale}/clouds/${id}.md`)
      const article = parseArticle(read(articlePath), articlePath)
      const photos = article.photos.map(({ path, ...photo }, i) => {
        const file = photoFiles[i]
        required(path === resolve(folder, file), `Localized photograph order in ${articlePath} does not match the shortlist at ${basename(path)}`)
        watch(path)
        const bytes = readFileSync(path)
        required(bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff, `Invalid JPEG in ${path}`)
        return { ...photo, path, credit: readCredit(credits[i], locale, file) }
      })
      return { ...article, photos, id, latin, code, description: required(descriptions.get(id), `Missing ${id} description in ${descriptionsPath}`) }
    })
    return [locale, articles]
  }))
}

export default function atlasContent() {
  let root
  return {
    name: 'weather-atlas-content',
    configResolved(config) {
      root = config.root
    },
    resolveId(id) {
      if (id === moduleId) return '\0' + moduleId
    },
    load(id) {
      if (id !== '\0' + moduleId) return
      const data = readAtlas(root, (path) => this.addWatchFile(path))
      const assets = new Map()
      for (const articles of Object.values(data)) {
        for (const article of articles) {
          for (const photo of article.photos) {
            if (!assets.has(photo.path)) assets.set(photo.path, assets.size)
            photo.assetIndex = assets.get(photo.path)
            delete photo.path
          }
        }
      }
      const imports = [...assets].map(([path, index]) => `import photo${index} from ${JSON.stringify(path + '?url')};`)
      const photoNames = [...assets.values()].map((index) => `photo${index}`)
      return `${imports.join('\n')}
const photos = [${photoNames.join(',')}];
const data = ${JSON.stringify(data)};
for (const articles of Object.values(data))
  for (const article of articles)
    article.photos = article.photos.map(({ assetIndex, ...photo }) => ({ ...photo, url: photos[assetIndex] }));
export default data;`
    },
  }
}
