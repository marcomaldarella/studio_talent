const https = require('https')
const http = require('http')
const fs = require('fs')
const path = require('path')
const os = require('os')
const { execSync } = require('child_process')

const ALL_PRESS = [
  { pub: 'All you need is color at home.', year: 2026, dropbox: 'https://www.dropbox.com/scl/fo/jp7yglpuwfknoyi381qdj/ADqm5ZrmBA9WXjPIl994KD8?rlkey=kz0kn4mlljvzl1fhvwivrk8s3&dl=1' },
  { pub: 'Livingetc',                       year: 2025, dropbox: 'https://www.dropbox.com/scl/fo/jrqvq7tmya73es271lzv3/ACd_mmdUWar8vz_KpxROJtw?rlkey=4nkk7ne00sm20smhqie7xv80l&dl=1' },
  { pub: 'Maison Seta Ambiances',            year: 2024, dropbox: 'https://www.dropbox.com/scl/fo/8nmxbxoozswm98rxt6t3f/AH863g4raM_K07TAoSbYcpM?rlkey=25n7iutc7hwy7g8xbsmfoyvc9&dl=1' },
  { pub: 'Good Life',                        year: 2024, dropbox: 'https://www.dropbox.com/scl/fo/hycm3azi6bj24zbvzayn9/AJaaXtHmnUmUotcgLtGImN0?rlkey=w9eoh5hn35l8xrc9ol0kxiqby&dl=1' },
  { pub: 'Abitare 635',                      year: 2024, dropbox: 'https://www.dropbox.com/scl/fo/dhsmj9yz8lyznji1xkjnb/AENGCS821fHwACGa0LbUPYE?rlkey=bsl16mdia8bs5qjosjnczmr2u&dl=1' },
  { pub: 'Wohn! Design',                     year: 2023, dropbox: 'https://www.dropbox.com/scl/fo/20qrzfczsgl4amqmmphge/AOV-tqx3vBB-MrxBZmSjYM8?rlkey=54m5d5522o64a0widps5fpzms&dl=1' },
  { pub: 'IDEAT',                            year: 2023, dropbox: 'https://www.dropbox.com/scl/fo/rxb31n324qvxoy2i87lh2/ABTtVgkQqpNMJJoDlZyWr0Y?rlkey=0evkfn0szr9w1r5ovnh6r421q&dl=1' },
  { pub: 'Livingetc',                        year: 2023, dropbox: 'https://www.dropbox.com/scl/fo/rgqrsnurir5bxs4es17zk/AJ8qJhEwUE8oRsiZViVVcFU?rlkey=4lnig39z49lp6ef1et2ga9g43&dl=1' },
  { pub: 'Raum und wohnen',                  year: 2022, dropbox: 'https://www.dropbox.com/scl/fo/1xddfd9xuygwlbunlsrs3/APFuFpJ7kOf8dahVtTTYQW8?rlkey=35p6stzuggeyt7ggung7k3w6t&dl=1' },
  { pub: 'AD - Architectural Digest',        year: 2017, dropbox: 'https://www.dropbox.com/scl/fo/mh3yonh28fg2vrq8knlx4/AFjo88tAv_XysVUFmiXksf8?rlkey=ip2htv96bzkpvrlmlyv6laxzn&dl=1' },
  { pub: 'Maison Créative',                  year: 2015, desc: 'Escale', dropbox: 'https://www.dropbox.com/scl/fo/obixd52fp2e3x85dzn3s3/ACiC3e1UbQis5hTQu0yi4NI?rlkey=eyd6v34fsfekmweenfx93mptp&dl=1' },
  { pub: 'Maison Créative',                  year: 2015, desc: 'Blue & Bed', dropbox: 'https://www.dropbox.com/scl/fo/6mkvxqv1jbdnhjmbnl9ni/ACLduG2ZC8tROghk0CmZ2u4?rlkey=srpktr49me2j9gp3qp9c9ytdw&dl=1' },
  { pub: 'Ville & Casali',                   year: 2015, dropbox: 'https://www.dropbox.com/scl/fo/brywrxx5jrb85wvmdhoap/AHL6ubCKWRgwMdA8vNhh1dc?rlkey=mh0ldeoolqym20r6n1980v8vc&dl=1' },
  { pub: 'Case & Country',                   year: 2015, dropbox: 'https://www.dropbox.com/scl/fo/lsbzybmo6cugnkxrhifc4/ACXf-jOjblIn8FeEY6yoitk?rlkey=zem5q7pw5fzweeghp4wdpae9y&dl=1' },
  { pub: 'IDEAT contemporary life',          year: 2015, dropbox: 'https://www.dropbox.com/scl/fo/cmbyxmvzpvjey2vzczur4/ACQ40rWDW1hxSl6soJcn05o?rlkey=xwl70ml5s5t16vlgwzgsld56h&dl=1' },
  { pub: "Maison Côté du Sud",               year: 2014, desc: 'I', dropbox: 'https://www.dropbox.com/scl/fo/ndnuzwoxy2llzs2l4c5od/AIWuukSm1ye9rzJ_149pj3Q?rlkey=dh41yd8vj2uund17ex7lfmb65&dl=1' },
  { pub: 'Living',                            year: 2014, dropbox: 'https://www.dropbox.com/scl/fo/a5qkdu0etl0gngqe2gzei/AL3UaqBONQMVlOG-mNYrMRk?rlkey=m1siic4zlg7tk7dt1k16vuxck&dl=1' },
  { pub: 'Case&Stili',                        year: 2013, dropbox: 'https://www.dropbox.com/scl/fo/mihyzcik2q7afh8qt0t3j/AEsMupqaNqlhUoeKiWcGVaU?rlkey=lcj3e5qreo3xc3geb3bz5s19z&dl=1' },
  { pub: "Maison Côté du Sud",               year: 2014, desc: 'II', dropbox: 'https://www.dropbox.com/scl/fo/xuphwgi21qv49273ob6pp/AAtm85bSsvXEdcGZNhM0g2k?rlkey=vcb1qg6n25d6ydc1ykekzqnzi&dl=1' },
  { pub: "Maison Côté du Sud",               year: 2013, dropbox: 'https://www.dropbox.com/scl/fo/3x45crjqwafwcrk6wb29e/APLXSkJKVboSThlczF_LgI8?rlkey=n3few8ob1dkn94u6chwhrwly9&dl=1' },
  { pub: 'Case e Stili',                      year: 2013, dropbox: 'https://www.dropbox.com/scl/fo/k9fq3g3sq80enlbateqa2/APPgYjvNoGotlvW2W7fv1Qw?rlkey=tm2uengjknnze1is5aie4xvsi&dl=1' },
  { pub: 'AD - Architectural Digest',        year: 2013, dropbox: 'https://www.dropbox.com/scl/fo/8iedk0pgjdt0ot5xzapss/AHUCXFTp_JHYZZAlUfzGg9A?rlkey=cufzz6i5xy3rjp4z5mystxcw9&dl=1' },
  { pub: 'Io Donna',                          year: 2013, dropbox: 'https://www.dropbox.com/scl/fo/stbppvr6xut04a4lo3y9t/AKQmGyGpOaD8fRTbr2VwvNg?rlkey=8p7o5mts7hssookp1w8q5tzkh&dl=1' },
  { pub: 'Case da Abitare',                   year: 2012, dropbox: 'https://www.dropbox.com/scl/fo/vzm8c0jjrllbgvrxm664l/AGPy0j9H9jgEhU41S59C_eA?rlkey=vdyg088rbv563t5usbbqw5vgt&dl=1' },
  { pub: 'Casadi',                            year: 2012, dropbox: 'https://www.dropbox.com/scl/fo/2nxttzkyl5hpgzigp1256/AJPHTXsJy0HL41w0YP4zifo?rlkey=u6r8lesfxhbw8imqv4drgoyde&dl=1' },
  { pub: 'Puglia contemporary style',        year: 2011, dropbox: 'https://www.dropbox.com/scl/fo/nvwuw4615qx9y5a8kducm/AEzBSnq7UsTYkXa-aqxIHdk?rlkey=c9idmamzwq20s2fsg7mhq55pf&dl=1' },
  { pub: 'Trulli Style',                      year: 2011, desc: 'Torretta', dropbox: 'https://www.dropbox.com/scl/fo/sjm002fuoiwwbaq8frf2b/AKOlQAyKUDP20ZyBSFrlths?rlkey=nvrvw4cuqlgmh1gyz5q7r3efb&dl=1' },
  { pub: 'Trulli Style',                      year: 2011, desc: 'Trullino', dropbox: 'https://www.dropbox.com/scl/fo/74rtluo8iaf3lb22rvo6m/AJPaymMGiepokL36tsjqVQg?rlkey=0cs7s0zrdvcuf69hek1b3e3gs&dl=1' },
  { pub: 'Trulli Style',                      year: 2011, desc: 'Parade', dropbox: 'https://www.dropbox.com/scl/fo/8s24r224ih81dd03etgz8/ADWY9D7SemFeKHjnq11zc2c?rlkey=vb8w1e141g3ev2lrgkpvx414g&dl=1' },
  { pub: 'Case & Stili',                      year: 2010, dropbox: 'https://www.dropbox.com/scl/fo/2x3xwprwj85bfflmci9m1/AP_yM1eNkSEWA2j1Y2qPeSU?rlkey=yoplirsqsz53l0warlh8e8jma&dl=1' },
  { pub: 'Spaziocasa',                        year: 2010, dropbox: 'https://www.dropbox.com/scl/fo/mdi48ox5dbnbd07itpubl/APl2JvWTjwykqNlKDK7UlTE?rlkey=0a8ic16axu2j9zxroq0eg4s89&dl=1' },
  { pub: 'Maison Française',                  year: 2009, dropbox: 'https://www.dropbox.com/scl/fo/wkmvroucluzbyqmpe40pm/AJmWXwqPWKQMG54EY02xIpg?rlkey=kx7qnfq33q57mkp4vbg5tpx85&dl=1' },
  { pub: 'Spaziocasa',                        year: 2009, dropbox: 'https://www.dropbox.com/scl/fo/eekezk0q2zbl0z1n6qpdh/ALdOeI1Pj8RNg6hT20uiKVA?rlkey=zbmv18iuue7jo382m4h97lq91&dl=1' },
  { pub: 'Progetti',                          year: 2009, dropbox: 'https://www.dropbox.com/scl/fo/diwtti3wz181fwmbnvka8/AIOFd3c5WjUnqiNWJuvBnGE?rlkey=t4yoj0rghx7bxuvoodugz85fj&dl=1' },
  { pub: 'Casa Mia Decor',                    year: 2008, dropbox: 'https://www.dropbox.com/scl/fo/1gw96fmwm3hs30hm37fru/AGevm5EG9EbOlKHequXjWgY?rlkey=xqd3d32xhsv28wuvf8s0mreqf&dl=1' },
  { pub: 'Domus',                             year: 2008, dropbox: 'https://www.dropbox.com/scl/fo/nvab5buiiul29lffv5gyr/AMOJRYeuwVILRHYuhVDmOWM?rlkey=7oc58p1lp8kqqhkqei1gxwvca&dl=1' },
  { pub: 'La mia casa',                       year: 2008, dropbox: 'https://www.dropbox.com/scl/fo/7debwvhbuawz4trcx53wy/AK7AwbO7g9O6zg9kayMVTqY?rlkey=f44su28qb8mj1lgbhdvndbe1s&dl=1' },
  { pub: 'Gioia Casa',                        year: 2007, dropbox: 'https://www.dropbox.com/scl/fo/42d1622m7xcnuu5xlu6dv/ANbPj4wiZHgQWkY-pA4cyF4?rlkey=gs3xyzuca43zhef5ap6u8ph1b&dl=1' },
  { pub: 'AD - Architectural Digest',        year: 2007, dropbox: 'https://www.dropbox.com/scl/fo/x7d43thrr1j8fg18ug92j/ALiFlXHtVHhK3zLElyByDEU?rlkey=7dd5v5btlyacsmxhcc08vfp29&dl=1' },
  { pub: 'TopLiving',                         year: 2007, dropbox: 'https://www.dropbox.com/scl/fo/b04vhr3jgjiphculsk6tf/ABHOanspH33Hg5WNnM6xduQ?rlkey=ouctpamoespykd156ic3g1ktp&dl=1' },
  { pub: 'AD - Architectural Digest',        year: 2006, desc: 'Nella terra (ristrutturazione)', dropbox: 'https://www.dropbox.com/scl/fo/skwa3p9j352ykbfx903r2/APwmzfavnAGokEaKlx-ehGk?rlkey=3dhygpjq9r9jy4utxvcyd4o71&dl=1' },
  { pub: 'Stair Scale',                       year: 2006, dropbox: 'https://www.dropbox.com/scl/fo/8f4plc5oi2ix72i4mbjmo/AHWn1zsQIYrsLQXo4mKtk9o?rlkey=qrghmnfqmiupgu7d4lkn9dvap&dl=1' },
  { pub: 'AD - Architectural Digest',        year: 2006, desc: 'Cuore di pietra', dropbox: 'https://www.dropbox.com/scl/fo/v6qdid02k0nhk8fecxbzo/ABSsjsrF86bXHA53UQeAdfs?rlkey=b6g8pstjaue91vqwnwx2k7x96&dl=1' },
  { pub: 'AD - Architectural Digest',        year: 2006, desc: 'Luci Trastevere', dropbox: 'https://www.dropbox.com/scl/fo/c8pkbxr2aknsuzlr0yk5c/AO_Por1sx9NZ6GnksDi81ww?rlkey=d0zafp4hocikd6umxes4ex6qb&dl=1' },
  { pub: 'AD - Architectural Digest',        year: 2006, desc: 'Luci penombra', dropbox: 'https://www.dropbox.com/scl/fo/0fg7fisoyrjyonnoh1l1v/AH5JuJqgstHj7S9Ra3y7vNs?rlkey=279cqs179tr81g0rfrspjb61y&dl=1' },
  { pub: 'AD - Architectural Digest',        year: 2006, desc: 'Nella terra', dropbox: 'https://www.dropbox.com/scl/fo/gdh10x8bi0rjso6k75xii/AJ4ujS_2HIUrQG_0xXE38D4?rlkey=o81ct52gtg3gg2ukvcuo1z6jn&dl=1' },
  { pub: 'AD - Architectural Digest',        year: 2005, dropbox: 'https://www.dropbox.com/scl/fo/jk4yumgaqsiepsrqtdl5m/APPbiRRBJVjNEsld35AHJkg?rlkey=9rhiwm3fagx6fey59kerjuor1&dl=1' },
  { pub: "L'Architettura",                    year: 2004, desc: 'Una residenza', dropbox: 'https://www.dropbox.com/scl/fo/ywbvrbjk06fcnb3irg2tr/AFE8h-M2pH3jNGq-jb6lZgc?rlkey=dyw59x70i2izd1hi18y4cbyuo&dl=1' },
  { pub: "L'Architettura",                    year: 2004, desc: 'Diaframmi', dropbox: 'https://www.dropbox.com/scl/fo/v2qn323kddhhydkex5ca0/AFbKYx2GlFjqj1CYF4GQqk8?rlkey=ja8y3svq9f18hfz96m4arb53w&dl=1' },
]

function downloadToFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http
    const file = fs.createWriteStream(destPath)
    const req = proto.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close()
        try { fs.unlinkSync(destPath) } catch {}
        return downloadToFile(res.headers.location, destPath).then(resolve).catch(reject)
      }
      res.pipe(file)
      file.on('finish', () => { file.close(); resolve() })
    })
    req.on('error', (err) => { try { fs.unlinkSync(destPath) } catch {}; reject(err) })
  })
}

async function listZipImages(url, label) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'check-'))
  const zipPath = path.join(tmpDir, 'f.zip')
  try {
    await downloadToFile(url, zipPath)
    const out = execSync(`unzip -l "${zipPath}" 2>/dev/null`).toString()
    const images = out.split('\n')
      .filter(l => /\.(jpg|jpeg|png|gif|webp)/i.test(l))
      .map(l => l.trim().split(/\s+/).slice(-1)[0])
      .filter(Boolean)
    console.log(`[${label}] ${images.length} image(s): ${images.map(f => path.basename(f)).join(', ')}`)
    return images.length
  } catch (e) {
    console.log(`[${label}] ERROR: ${e.message}`)
    return 0
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  }
}

async function main() {
  console.log('Checking all 49 Dropbox folders...\n')
  let multiCount = 0
  for (let i = 0; i < ALL_PRESS.length; i++) {
    const e = ALL_PRESS[i]
    const label = `${i+1}/49 ${e.pub} ${e.year}${e.desc ? ' — '+e.desc : ''}`
    const n = await listZipImages(e.dropbox, label)
    if (n > 1) multiCount++
  }
  console.log(`\n${multiCount} entries have multiple images`)
}

main().catch(console.error)
