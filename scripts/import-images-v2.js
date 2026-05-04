const { createClient } = require('@sanity/client')
const https = require('https')
const http = require('http')
const fs = require('fs')
const path = require('path')
const os = require('os')
const { execSync } = require('child_process')

const TOKEN = 'skOcix5BssjP0wUkfnWbmQhLbuASrcwqZGfHqiBUJeOXQ6D9M11Gs8ZTsclMez8RYUQfMUFA8rna46kDM'
const client = createClient({ projectId: 'nptz7dg5', dataset: 'production', apiVersion: '2024-01-01', token: TOKEN, useCdn: false })

function slugify(str) {
  return str.toLowerCase().trim()
    .replace(/[àáâãä]/g, 'a').replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i').replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u').replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

// 48 entries (row 16+19 merged into one, row 19 skipped as duplicate)
// Each entry can have multiple Dropbox folders whose images are combined
const ALL_PRESS = [
  { pub: 'All you need is color at home.', year: 2026, desc: 'Lannoo Publishers, pp. 1,2,142',           folders: ['https://www.dropbox.com/scl/fo/jp7yglpuwfknoyi381qdj/ADqm5ZrmBA9WXjPIl994KD8?rlkey=kz0kn4mlljvzl1fhvwivrk8s3&dl=1'] },
  { pub: 'Livingetc',                       year: 2025, desc: 'The design trends issue',                  folders: ['https://www.dropbox.com/scl/fo/jrqvq7tmya73es271lzv3/ACd_mmdUWar8vz_KpxROJtw?rlkey=4nkk7ne00sm20smhqie7xv80l&dl=1'] },
  { pub: 'Maison Seta Ambiances',            year: 2024, desc: 'Tous les styles 2024',                    folders: ['https://www.dropbox.com/scl/fo/8nmxbxoozswm98rxt6t3f/AH863g4raM_K07TAoSbYcpM?rlkey=25n7iutc7hwy7g8xbsmfoyvc9&dl=1'] },
  { pub: 'Good Life',                        year: 2024, desc: 'Interieur kultur genuss reisen',          folders: ['https://www.dropbox.com/scl/fo/hycm3azi6bj24zbvzayn9/AJaaXtHmnUmUotcgLtGImN0?rlkey=w9eoh5hn35l8xrc9ol0kxiqby&dl=1'] },
  { pub: 'Abitare 635',                      year: 2024, desc: 'Armonia di stili, pp. 24-33',             folders: ['https://www.dropbox.com/scl/fo/dhsmj9yz8lyznji1xkjnb/AENGCS821fHwACGa0LbUPYE?rlkey=bsl16mdia8bs5qjosjnczmr2u&dl=1'] },
  { pub: 'Wohn! Design',                     year: 2023, desc: 'Aus der reihe tanzen, pp.106-113',        folders: ['https://www.dropbox.com/scl/fo/20qrzfczsgl4amqmmphge/AOV-tqx3vBB-MrxBZmSjYM8?rlkey=54m5d5522o64a0widps5fpzms&dl=1'] },
  { pub: 'IDEAT',                            year: 2023, desc: 'Design & Architecture',                   folders: ['https://www.dropbox.com/scl/fo/rxb31n324qvxoy2i87lh2/ABTtVgkQqpNMJJoDlZyWr0Y?rlkey=0evkfn0szr9w1r5ovnh6r421q&dl=1'] },
  { pub: 'Livingetc',                        year: 2023, desc: 'The big blue, pp. 62-70',                 folders: ['https://www.dropbox.com/scl/fo/rgqrsnurir5bxs4es17zk/AJ8qJhEwUE8oRsiZViVVcFU?rlkey=4lnig39z49lp6ef1et2ga9g43&dl=1'] },
  { pub: 'Raum und wohnen',                  year: 2022, desc: 'Blaue magie, pp. 28-38',                  folders: ['https://www.dropbox.com/scl/fo/1xddfd9xuygwlbunlsrs3/APFuFpJ7kOf8dahVtTTYQW8?rlkey=35p6stzuggeyt7ggung7k3w6t&dl=1'] },
  { pub: 'AD - Architectural Digest',        year: 2017, desc: 'Sotto il cono, pp. 154-161',              folders: ['https://www.dropbox.com/scl/fo/mh3yonh28fg2vrq8knlx4/AFjo88tAv_XysVUFmiXksf8?rlkey=ip2htv96bzkpvrlmlyv6laxzn&dl=1'] },
  { pub: 'Maison Créative',                  year: 2015, desc: "Escale italienne au coeur d'un trullo historique, pp. 112-119", folders: ['https://www.dropbox.com/scl/fo/obixd52fp2e3x85dzn3s3/ACiC3e1UbQis5hTQu0yi4NI?rlkey=eyd6v34fsfekmweenfx93mptp&dl=1'] },
  { pub: 'Maison Créative',                  year: 2015, desc: 'Blue & Bed cubique, pp. 125-128',         folders: ['https://www.dropbox.com/scl/fo/6mkvxqv1jbdnhjmbnl9ni/ACLduG2ZC8tROghk0CmZ2u4?rlkey=srpktr49me2j9gp3qp9c9ytdw&dl=1'] },
  { pub: 'Ville & Casali',                   year: 2015, desc: 'Trulli luminosi, pp. 80-89',              folders: ['https://www.dropbox.com/scl/fo/brywrxx5jrb85wvmdhoap/AHL6ubCKWRgwMdA8vNhh1dc?rlkey=mh0ldeoolqym20r6n1980v8vc&dl=1'] },
  { pub: 'Case & Country',                   year: 2015, desc: 'Vestita di bianco, pp. 50-59',            folders: ['https://www.dropbox.com/scl/fo/lsbzybmo6cugnkxrhifc4/ACXf-jOjblIn8FeEY6yoitk?rlkey=zem5q7pw5fzweeghp4wdpae9y&dl=1'] },
  { pub: 'IDEAT contemporary life',          year: 2015, desc: 'Trésors cachés au fond de la Botte',      folders: ['https://www.dropbox.com/scl/fo/cmbyxmvzpvjey2vzczur4/ACQ40rWDW1hxSl6soJcn05o?rlkey=xwl70ml5s5t16vlgwzgsld56h&dl=1'] },
  // Row 16 + Row 19 merged: same publication/year/desc, different image sets → combined
  { pub: "Maison Côté du Sud",               year: 2014, desc: 'Ruralité au perspective, pp. 78-82',      folders: ['https://www.dropbox.com/scl/fo/ndnuzwoxy2llzs2l4c5od/AIWuukSm1ye9rzJ_149pj3Q?rlkey=dh41yd8vj2uund17ex7lfmb65&dl=1', 'https://www.dropbox.com/scl/fo/xuphwgi21qv49273ob6pp/AAtm85bSsvXEdcGZNhM0g2k?rlkey=vcb1qg6n25d6ydc1ykekzqnzi&dl=1'] },
  { pub: 'Living',                            year: 2014, desc: 'Gemelli diversi, pp. 168-175',           folders: ['https://www.dropbox.com/scl/fo/a5qkdu0etl0gngqe2gzei/AL3UaqBONQMVlOG-mNYrMRk?rlkey=m1siic4zlg7tk7dt1k16vuxck&dl=1'] },
  { pub: 'Case&Stili',                        year: 2013, desc: 'Il restauro sensibile, pp. 77-88',       folders: ['https://www.dropbox.com/scl/fo/mihyzcik2q7afh8qt0t3j/AEsMupqaNqlhUoeKiWcGVaU?rlkey=lcj3e5qreo3xc3geb3bz5s19z&dl=1'] },
  { pub: "Maison Côté du Sud",               year: 2013, desc: 'Design rural, pp. 121-129',               folders: ['https://www.dropbox.com/scl/fo/3x45crjqwafwcrk6wb29e/APLXSkJKVboSThlczF_LgI8?rlkey=n3few8ob1dkn94u6chwhrwly9&dl=1'] },
  { pub: 'Case e Stili',                      year: 2013, desc: 'Secondo natura, pp. 77-88',              folders: ['https://www.dropbox.com/scl/fo/k9fq3g3sq80enlbateqa2/APPgYjvNoGotlvW2W7fv1Qw?rlkey=tm2uengjknnze1is5aie4xvsi&dl=1'] },
  { pub: 'AD - Architectural Digest',        year: 2013, desc: 'Le forme del tempo, pp. 74, 83',          folders: ['https://www.dropbox.com/scl/fo/8iedk0pgjdt0ot5xzapss/AHUCXFTp_JHYZZAlUfzGg9A?rlkey=cufzz6i5xy3rjp4z5mystxcw9&dl=1'] },
  { pub: 'Io Donna',                          year: 2013, desc: 'Salento slow, pp 65-68',                 folders: ['https://www.dropbox.com/scl/fo/stbppvr6xut04a4lo3y9t/AKQmGyGpOaD8fRTbr2VwvNg?rlkey=8p7o5mts7hssookp1w8q5tzkh&dl=1'] },
  { pub: 'Case da Abitare',                   year: 2012, desc: 'Trullo Time, pp. 118-127',               folders: ['https://www.dropbox.com/scl/fo/vzm8c0jjrllbgvrxm664l/AGPy0j9H9jgEhU41S59C_eA?rlkey=vdyg088rbv563t5usbbqw5vgt&dl=1'] },
  { pub: 'Casadi',                            year: 2012, desc: 'Ritiro marino',                          folders: ['https://www.dropbox.com/scl/fo/2nxttzkyl5hpgzigp1256/AJPHTXsJy0HL41w0YP4zifo?rlkey=u6r8lesfxhbw8imqv4drgoyde&dl=1'] },
  { pub: 'Puglia contemporary style',        year: 2011, desc: 'A cisterna to live pp.64-71',             folders: ['https://www.dropbox.com/scl/fo/nvwuw4615qx9y5a8kducm/AEzBSnq7UsTYkXa-aqxIHdk?rlkey=c9idmamzwq20s2fsg7mhq55pf&dl=1'] },
  { pub: 'Trulli Style',                      year: 2011, desc: 'Torretta ostunese pp.46-59',             folders: ['https://www.dropbox.com/scl/fo/sjm002fuoiwwbaq8frf2b/AKOlQAyKUDP20ZyBSFrlths?rlkey=nvrvw4cuqlgmh1gyz5q7r3efb&dl=1'] },
  { pub: 'Trulli Style',                      year: 2011, desc: 'Trullino pp.60-69',                      folders: ['https://www.dropbox.com/scl/fo/74rtluo8iaf3lb22rvo6m/AJPaymMGiepokL36tsjqVQg?rlkey=0cs7s0zrdvcuf69hek1b3e3gs&dl=1'] },
  { pub: 'Trulli Style',                      year: 2011, desc: 'Trulli parade pp. 160-175',              folders: ['https://www.dropbox.com/scl/fo/8s24r224ih81dd03etgz8/ADWY9D7SemFeKHjnq11zc2c?rlkey=vb8w1e141g3ev2lrgkpvx414g&dl=1'] },
  { pub: 'Case & Stili',                      year: 2010, desc: 'Ossimoro, un antico contemporaneo, pp. 47-56', folders: ['https://www.dropbox.com/scl/fo/2x3xwprwj85bfflmci9m1/AP_yM1eNkSEWA2j1Y2qPeSU?rlkey=yoplirsqsz53l0warlh8e8jma&dl=1'] },
  { pub: 'Spaziocasa',                        year: 2010, desc: 'Soluzioni da copiare, camere da letto, p. 123', folders: ['https://www.dropbox.com/scl/fo/mdi48ox5dbnbd07itpubl/APl2JvWTjwykqNlKDK7UlTE?rlkey=0a8ic16axu2j9zxroq0eg4s89&dl=1'] },
  { pub: 'Maison Française',                  year: 2009, desc: 'Rose pour elle, blue pour lui, pp. 136-143', folders: ['https://www.dropbox.com/scl/fo/wkmvroucluzbyqmpe40pm/AJmWXwqPWKQMG54EY02xIpg?rlkey=kx7qnfq33q57mkp4vbg5tpx85&dl=1'] },
  { pub: 'Spaziocasa',                        year: 2009, desc: 'Fermare il tempo, pp. 148-153',          folders: ['https://www.dropbox.com/scl/fo/eekezk0q2zbl0z1n6qpdh/ALdOeI1Pj8RNg6hT20uiKVA?rlkey=zbmv18iuue7jo382m4h97lq91&dl=1'] },
  { pub: 'Progetti',                          year: 2009, desc: 'Pescetrullo tra gli ulivi, pp. 6-15',    folders: ['https://www.dropbox.com/scl/fo/diwtti3wz181fwmbnvka8/AIOFd3c5WjUnqiNWJuvBnGE?rlkey=t4yoj0rghx7bxuvoodugz85fj&dl=1'] },
  { pub: 'Casa Mia Decor',                    year: 2008, desc: 'Passato contemporaneo pp. 100-105 — Casbah monofamiliare, pp. 38-45', folders: ['https://www.dropbox.com/scl/fo/1gw96fmwm3hs30hm37fru/AGevm5EG9EbOlKHequXjWgY?rlkey=xqd3d32xhsv28wuvf8s0mreqf&dl=1'] },
  { pub: 'Domus',                             year: 2008, desc: 'Pescetrullo, pp.72-74',                  folders: ['https://www.dropbox.com/scl/fo/nvab5buiiul29lffv5gyr/AMOJRYeuwVILRHYuhVDmOWM?rlkey=7oc58p1lp8kqqhkqei1gxwvca&dl=1'] },
  { pub: 'La mia casa',                       year: 2008, desc: 'Presente scenico pp.78-85',              folders: ['https://www.dropbox.com/scl/fo/7debwvhbuawz4trcx53wy/AK7AwbO7g9O6zg9kayMVTqY?rlkey=f44su28qb8mj1lgbhdvndbe1s&dl=1'] },
  { pub: 'Gioia Casa',                        year: 2007, desc: 'Gravità 0, pp.112-119',                  folders: ['https://www.dropbox.com/scl/fo/42d1622m7xcnuu5xlu6dv/ANbPj4wiZHgQWkY-pA4cyF4?rlkey=gs3xyzuca43zhef5ap6u8ph1b&dl=1'] },
  { pub: 'AD - Architectural Digest',        year: 2007, desc: "Lo spazio dell'illusione, pp. 96-101",    folders: ['https://www.dropbox.com/scl/fo/x7d43thrr1j8fg18ug92j/ALiFlXHtVHhK3zLElyByDEU?rlkey=7dd5v5btlyacsmxhcc08vfp29&dl=1'] },
  { pub: 'TopLiving',                         year: 2007, desc: 'Villa zwischen Mythos und Moderne, pp. 32-36', folders: ['https://www.dropbox.com/scl/fo/b04vhr3jgjiphculsk6tf/ABHOanspH33Hg5WNnM6xduQ?rlkey=ouctpamoespykd156ic3g1ktp&dl=1'] },
  { pub: 'AD - Architectural Digest',        year: 2006, desc: 'Nella terra degli ulivi — la ristrutturazione di un trullo nel Salento, pp. 232-239', folders: ['https://www.dropbox.com/scl/fo/skwa3p9j352ykbfx903r2/APwmzfavnAGokEaKlx-ehGk?rlkey=3dhygpjq9r9jy4utxvcyd4o71&dl=1'] },
  { pub: 'Stair Scale',                       year: 2006, desc: 'pp. 22-23',                              folders: ['https://www.dropbox.com/scl/fo/8f4plc5oi2ix72i4mbjmo/AHWn1zsQIYrsLQXo4mKtk9o?rlkey=qrghmnfqmiupgu7d4lkn9dvap&dl=1'] },
  { pub: 'AD - Architectural Digest',        year: 2006, desc: 'Cuore di pietra pp. 228-235',             folders: ['https://www.dropbox.com/scl/fo/v6qdid02k0nhk8fecxbzo/ABSsjsrF86bXHA53UQeAdfs?rlkey=b6g8pstjaue91vqwnwx2k7x96&dl=1'] },
  { pub: 'AD - Architectural Digest',        year: 2006, desc: 'Luci a Trastevere, pp 158-163',           folders: ['https://www.dropbox.com/scl/fo/c8pkbxr2aknsuzlr0yk5c/AO_Por1sx9NZ6GnksDi81ww?rlkey=d0zafp4hocikd6umxes4ex6qb&dl=1'] },
  { pub: 'AD - Architectural Digest',        year: 2006, desc: 'Le luci della penombra, pp. 126-133',     folders: ['https://www.dropbox.com/scl/fo/0fg7fisoyrjyonnoh1l1v/AH5JuJqgstHj7S9Ra3y7vNs?rlkey=279cqs179tr81g0rfrspjb61y&dl=1'] },
  { pub: 'AD - Architectural Digest',        year: 2006, desc: 'Nella terra degli ulivi, pp. 232-239',    folders: ['https://www.dropbox.com/scl/fo/gdh10x8bi0rjso6k75xii/AJ4ujS_2HIUrQG_0xXE38D4?rlkey=o81ct52gtg3gg2ukvcuo1z6jn&dl=1'] },
  { pub: 'AD - Architectural Digest',        year: 2005, desc: 'Il sole del moderno, pp. 152-157',        folders: ['https://www.dropbox.com/scl/fo/jk4yumgaqsiepsrqtdl5m/APPbiRRBJVjNEsld35AHJkg?rlkey=9rhiwm3fagx6fey59kerjuor1&dl=1'] },
  { pub: "L'Architettura",                    year: 2004, desc: 'Una residenza tra gli ulivi, pp. 475-479', folders: ['https://www.dropbox.com/scl/fo/ywbvrbjk06fcnb3irg2tr/AFE8h-M2pH3jNGq-jb6lZgc?rlkey=dyw59x70i2izd1hi18y4cbyuo&dl=1'] },
  { pub: "L'Architettura",                    year: 2004, desc: 'Diaframmi colorati nella città, pp. 716-717', folders: ['https://www.dropbox.com/scl/fo/v2qn323kddhhydkex5ca0/AFbKYx2GlFjqj1CYF4GQqk8?rlkey=ja8y3svq9f18hfz96m4arb53w&dl=1'] },
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
  // "Anteprima" (= preview/cover) always first
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
    filename: path.basename(imgPath),
    contentType: mime,
  })
  return asset._id
}

function imageRef(assetId) {
  return { _type: 'image', asset: { _type: 'reference', _ref: assetId } }
}

async function downloadAndGetImages(folders) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'press-'))
  const allImages = []
  try {
    for (let fi = 0; fi < folders.length; fi++) {
      const zipPath = path.join(tmpDir, `folder_${fi}.zip`)
      const extractDir = path.join(tmpDir, `extract_${fi}`)
      fs.mkdirSync(extractDir)
      await downloadToFile(folders[fi], zipPath)
      const imgs = extractAllImages(zipPath, extractDir)
      allImages.push(...imgs)
    }
    return allImages
  } catch (e) {
    fs.rmSync(tmpDir, { recursive: true, force: true })
    throw e
  }
  // Note: tmpDir cleanup done by caller after uploads complete
}

async function main() {
  console.log('=== Deleting all existing press documents ===')
  const existingIds = await client.fetch('*[_type == "press"]._id')
  for (const id of existingIds) await client.delete(id)
  console.log(`  Deleted ${existingIds.length} documents\n`)

  console.log('=== Importing 48 press entries with all images ===\n')
  const usedSlugs = new Set()

  for (let i = 0; i < ALL_PRESS.length; i++) {
    const entry = ALL_PRESS[i]
    const baseSlug = `${slugify(entry.pub)}-${entry.year}`
    let slug = baseSlug; let counter = 2
    while (usedSlugs.has(slug)) slug = `${baseSlug}-${counter++}`
    usedSlugs.add(slug)

    process.stdout.write(`[${i + 1}/48] ${entry.pub} (${entry.year})\n  Downloading... `)

    const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'press-'))
    try {
      const allImgPaths = []
      for (let fi = 0; fi < entry.folders.length; fi++) {
        const zipPath = path.join(tmpRoot, `f${fi}.zip`)
        const exDir = path.join(tmpRoot, `e${fi}`)
        fs.mkdirSync(exDir)
        await downloadToFile(entry.folders[fi], zipPath)
        allImgPaths.push(...extractAllImages(zipPath, exDir))
      }

      const sorted = allImgPaths.sort(naturalSort)
      process.stdout.write(`${sorted.length} images → uploading... `)

      const assetIds = []
      for (const imgPath of sorted) {
        const id = await uploadImage(imgPath)
        assetIds.push(id)
        process.stdout.write('.')
      }

      const doc = {
        _type: 'press',
        publication: entry.pub,
        year: entry.year,
        description: entry.desc,
        slug: { _type: 'slug', current: slug },
        order: i + 1,
        coverImage: imageRef(assetIds[0]),
        images: assetIds.map(id => ({ ...imageRef(id), _key: id.slice(-8) })),
      }
      await client.create(doc)
      console.log(` ✓`)
    } catch (e) {
      console.log(`\n  ERROR: ${e.message}`)
      // Create without images so we don't lose the entry
      const baseSlug2 = slug
      const doc = { _type: 'press', publication: entry.pub, year: entry.year, description: entry.desc, slug: { _type: 'slug', current: baseSlug2 }, order: i + 1 }
      await client.create(doc)
    } finally {
      fs.rmSync(tmpRoot, { recursive: true, force: true })
    }
  }

  console.log('\n✓ All done — 48 press entries imported with full galleries')
}

main().catch((err) => { console.error(err); process.exit(1) })
