const { createClient } = require('@sanity/client')
const https = require('https')
const http = require('http')
const fs = require('fs')
const path = require('path')
const os = require('os')
const { execSync } = require('child_process')

const TOKEN = 'skOcix5BssjP0wUkfnWbmQhLbuASrcwqZGfHqiBUJeOXQ6D9M11Gs8ZTsclMez8RYUQfMUFA8rna46kDM'
const client = createClient({ projectId: 'nptz7dg5', dataset: 'production', apiVersion: '2024-01-01', token: TOKEN, useCdn: false })

// Entries that failed image upload (created without images)
const RETRY = [
  { pub: 'IDEAT contemporary life', year: 2015, slug: 'ideat-contemporary-life-2015', dropbox: 'https://www.dropbox.com/scl/fo/cmbyxmvzpvjey2vzczur4/ACQ40rWDW1hxSl6soJcn05o?rlkey=xwl70ml5s5t16vlgwzgsld56h&dl=1' },
  { pub: 'Case&Stili',               year: 2013, slug: 'case-stili-2013',               dropbox: 'https://www.dropbox.com/scl/fo/mihyzcik2q7afh8qt0t3j/AEsMupqaNqlhUoeKiWcGVaU?rlkey=lcj3e5qreo3xc3geb3bz5s19z&dl=1' },
  { pub: 'Spaziocasa',               year: 2009, slug: 'spaziocasa-2009',               dropbox: 'https://www.dropbox.com/scl/fo/eekezk0q2zbl0z1n6qpdh/ALdOeI1Pj8RNg6hT20uiKVA?rlkey=zbmv18iuue7jo382m4h97lq91&dl=1' },
  { pub: 'Progetti',                 year: 2009, slug: 'progetti-2009',                 dropbox: 'https://www.dropbox.com/scl/fo/diwtti3wz181fwmbnvka8/AIOFd3c5WjUnqiNWJuvBnGE?rlkey=t4yoj0rghx7bxuvoodugz85fj&dl=1' },
  { pub: 'La mia casa',              year: 2008, slug: 'la-mia-casa-2008',              dropbox: 'https://www.dropbox.com/scl/fo/7debwvhbuawz4trcx53wy/AK7AwbO7g9O6zg9kayMVTqY?rlkey=f44su28qb8mj1lgbhdvndbe1s&dl=1' },
]

function downloadToFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http
    const file = fs.createWriteStream(destPath)
    const req = proto.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close(); try { fs.unlinkSync(destPath) } catch {}
        return downloadToFile(res.headers.location, destPath).then(resolve).catch(reject)
      }
      res.pipe(file)
      file.on('finish', () => { file.close(); resolve() })
    })
    req.on('error', (err) => { try { fs.unlinkSync(destPath) } catch {}; reject(err) })
  })
}

function naturalSort(a, b) {
  const aName = path.basename(a).toLowerCase()
  const bName = path.basename(b).toLowerCase()
  if (aName.includes('anteprima')) return -1
  if (bName.includes('anteprima')) return 1
  return aName.localeCompare(bName, undefined, { numeric: true, sensitivity: 'base' })
}

function extractAllImages(zipPath, destDir) {
  execSync(`unzip -o "${zipPath}" -d "${destDir}" 2>/dev/null || true`)
  const all = []
  function walk(dir) {
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f)
      if (fs.statSync(full).isDirectory()) { walk(full); continue }
      if (/\.(jpg|jpeg|png|gif|webp)$/i.test(f)) all.push(full)
    }
  }
  walk(destDir)
  return all.sort(naturalSort)
}

async function uploadImage(imgPath) {
  const ext = path.extname(imgPath).slice(1).toLowerCase()
  const mime = (ext === 'jpg' || ext === 'jpeg') ? 'image/jpeg' : (ext === 'png' ? 'image/png' : `image/${ext}`)
  const asset = await client.assets.upload('image', fs.createReadStream(imgPath), {
    filename: path.basename(imgPath), contentType: mime,
  })
  return asset._id
}

function imageRef(assetId) {
  return { _type: 'image', asset: { _type: 'reference', _ref: assetId } }
}

async function main() {
  for (const entry of RETRY) {
    // Find the existing document by slug
    const doc = await client.fetch(`*[_type == "press" && slug.current == $slug][0]{_id}`, { slug: entry.slug })
    if (!doc) { console.log(`NOT FOUND: ${entry.slug}`); continue }

    process.stdout.write(`Retrying ${entry.pub} (${entry.year})... `)
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'retry-'))
    try {
      const zipPath = path.join(tmpDir, 'f.zip')
      const exDir = path.join(tmpDir, 'ex')
      fs.mkdirSync(exDir)
      await downloadToFile(entry.dropbox, zipPath)
      const imgs = extractAllImages(zipPath, exDir)
      process.stdout.write(`${imgs.length} images → uploading... `)
      const assetIds = []
      for (const imgPath of imgs) {
        const id = await uploadImage(imgPath)
        assetIds.push(id)
        process.stdout.write('.')
      }
      await client.patch(doc._id).set({
        coverImage: imageRef(assetIds[0]),
        images: assetIds.map(id => ({ ...imageRef(id), _key: id.slice(-8) })),
      }).commit()
      console.log(' ✓')
    } catch (e) {
      console.log(`\n  ERROR: ${e.message}`)
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true })
    }
  }
  console.log('✓ Retry complete')
}

main().catch(console.error)
