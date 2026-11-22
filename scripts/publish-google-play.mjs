import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'

const { GITHUB_REF_NAME: tag, PLAY_VERSION_CODE: code, PLAY_ACCESS_TOKEN: token } = process.env
if (!tag || !/^\d+$/.test(code ?? '') || !token) {
  throw new Error('Expected a release tag, a version code and a Play access token')
}
const bundle = await readFile('cloud-atlas.aab')
const digest = createHash('sha256').update(bundle).digest('hex')
const host = 'https://androidpublisher.googleapis.com'
const path = '/androidpublisher/v3/applications/app.practicalmeteorology.atlas/edits'

async function request(method, url, body) {
  const binary = Buffer.isBuffer(body)
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': binary ? 'application/octet-stream' : 'application/json',
    },
    body: binary ? body : JSON.stringify(body),
  })
  const text = await response.text()
  if (!response.ok) throw new Error(`Play ${method} ${response.status}: ${text}`)
  return text ? JSON.parse(text) : undefined
}

const edit = await request('POST', host + path, {})
const editPath = `${path}/${encodeURIComponent(edit.id)}`
const editUrl = host + editPath
let committed = false
try {
  const track = await request('GET', editUrl + '/tracks/production')
  const releases = track.releases ?? []
  if (releases.some(r => r.versionCodes?.some(v => Number(v) > Number(code)))) {
    throw new Error('Production already contains a newer version. Check the tag and Play Console.')
  }
  const { bundles = [] } = await request('GET', editUrl + '/bundles')
  const existing = bundles.find(b => String(b.versionCode) === code)
  if (existing && existing.sha256 !== digest) {
    throw new Error('Play already has a different bundle for this version code. Use a new tag.')
  }

  if (existing && releases.some(r => r.status === 'completed' && r.versionCodes?.includes(code))) {
    console.log(`${tag} is already assigned to the full production rollout.`)
  } else {
    if (!existing) {
      const uploaded = await request('POST', `${host}/upload${editPath}/bundles?uploadType=media`, bundle)
      if (String(uploaded.versionCode) !== code || uploaded.sha256 !== digest) {
        throw new Error('The uploaded version code or SHA-256 differs from the signed artifact.')
      }
    }
    await request('PUT', editUrl + '/tracks/production', {
      track: 'production',
      releases: [{ name: tag, versionCodes: [code], status: 'completed' }],
    })
    await request('POST', editUrl + ':commit?changesInReviewBehavior=ERROR_IF_IN_REVIEW')
    committed = true
    console.log(`Submitted ${tag} for production review with full rollout after approval.`)
  }
} finally {
  if (!committed) {
    await request('DELETE', editUrl).catch(error => console.warn('Edit cleanup:', error.message))
  }
}
