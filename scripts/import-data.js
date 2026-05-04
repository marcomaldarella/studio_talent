const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'nptz7dg5',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skOcix5BssjP0wUkfnWbmQhLbuASrcwqZGfHqiBUJeOXQ6D9M11Gs8ZTsclMez8RYUQfMUFA8rna46kDM',
  useCdn: false,
})

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[àáâãä]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const PRESS_DATA = [
  { publication: 'All you need is color at home.', year: 2026, description: 'Lannoo Publishers, pp. 1,2,142' },
  { publication: 'Livingetc', year: 2025, description: 'The design trends issue' },
  { publication: 'Maison Seta Ambiances', year: 2024, description: 'Tous les styles 2024' },
  { publication: 'Good Life', year: 2024, description: 'Interieur kultur genuss reisen' },
  { publication: 'Abitare 635', year: 2024, description: 'Armonia di stili, pp. 24-33' },
  { publication: 'Wohn! Design', year: 2023, description: 'Aus der reihe tanzen, pp.106-113' },
  { publication: 'IDEAT', year: 2023, description: 'Design & Architecture' },
  { publication: 'Livingetc', year: 2023, description: 'The big blue, pp. 62-70' },
  { publication: 'Raum und wohnen', year: 2022, description: 'Blaue magie, pp. 28-38' },
  { publication: 'AD - Architectural Digest', year: 2017, description: 'Sotto il cono, pp. 154-161' },
  { publication: 'Maison Créative', year: 2015, description: "Escale italienne au coeur d'un trullo historique, pp. 112-119" },
  { publication: 'Maison Créative', year: 2015, description: 'Blue & Bed cubique, pp. 125-128' },
  { publication: 'Ville & Casali', year: 2015, description: 'Trulli luminosi, pp. 80-89' },
  { publication: 'Case & Country', year: 2015, description: 'Vestita di bianco, pp. 50-59' },
  { publication: 'IDEAT contemporary life', year: 2015, description: "Trésors cachés au fond de la Botte" },
  { publication: "Maison Côté du Sud", year: 2014, description: 'Ruralité au perspective, pp. 78-82' },
  { publication: 'Living', year: 2014, description: 'Gemelli diversi, pp. 168-175' },
  { publication: 'Case&Stili', year: 2013, description: 'Il restauro sensibile, pp. 77-88' },
  { publication: "Maison Côté du Sud", year: 2013, description: 'Design rural, pp. 121-129' },
  { publication: 'Case e Stili', year: 2013, description: 'Secondo natura, pp. 77-88' },
  { publication: 'AD - Architectural Digest', year: 2013, description: 'Le forme del tempo, pp. 74, 83' },
  { publication: 'Io Donna', year: 2013, description: 'Salento slow, pp 65-68' },
  { publication: 'Case da Abitare', year: 2012, description: 'Trullo Time, pp. 118-127' },
  { publication: 'Casadi', year: 2012, description: 'Ritiro marino' },
  { publication: 'Puglia contemporary style', year: 2011, description: 'A cisterna to live pp.64-71' },
  { publication: 'Trulli Style', year: 2011, description: 'Torretta ostunese pp.46-59' },
  { publication: 'Trulli Style', year: 2011, description: 'Trullino pp.60-69' },
  { publication: 'Trulli Style', year: 2011, description: 'Trulli parade pp. 160-175' },
  { publication: 'Case & Stili', year: 2010, description: 'Ossimoro, un antico contemporaneo, pp. 47-56' },
  { publication: 'Spaziocasa', year: 2010, description: 'Soluzioni da copiare, camere da letto, p. 123' },
  { publication: 'Maison Française', year: 2009, description: 'Rose pour elle, blue pour lui, pp. 136-143' },
  { publication: 'Spaziocasa', year: 2009, description: 'Fermare il tempo, pp. 148-153' },
  { publication: 'Progetti', year: 2009, description: 'Pescetrullo tra gli ulivi, pp. 6-15' },
  { publication: 'Casa Mia Decor', year: 2008, description: 'Passato contemporaneo pp. 100-105 — Casbah monofamiliare, pp. 38-45' },
  { publication: 'Domus', year: 2008, description: 'Pescetrullo, pp.72-74' },
  { publication: 'La mia casa', year: 2008, description: 'Presente scenico pp.78-85' },
  { publication: 'Gioia Casa', year: 2007, description: 'Gravità 0, pp.112-119' },
  { publication: 'AD - Architectural Digest', year: 2007, description: "Lo spazio dell'illusione, pp. 96-101" },
  { publication: 'TopLiving', year: 2007, description: 'Villa zwischen Mythos und Moderne, pp. 32-36' },
  { publication: 'AD - Architectural Digest', year: 2006, description: 'Nella terra degli ulivi — la ristrutturazione di un trullo nel Salento, pp. 232-239' },
  { publication: 'Stair Scale', year: 2006, description: 'pp. 22-23' },
  { publication: 'AD - Architectural Digest', year: 2006, description: 'Cuore di pietra pp. 228-235' },
  { publication: 'AD - Architectural Digest', year: 2006, description: 'Luci a Trastevere, pp 158-163' },
  { publication: 'AD - Architectural Digest', year: 2006, description: 'Le luci della penombra, pp. 126-133' },
  { publication: 'AD - Architectural Digest', year: 2005, description: 'Il sole del moderno, pp. 152-157' },
  { publication: "L'Architettura", year: 2004, description: 'Una residenza tra gli ulivi, pp. 475-479' },
  { publication: "L'Architettura", year: 2004, description: 'Diaframmi colorati nella città, pp. 716-717' },
]

const PROJECTS_DATA = [
  { title: 'Motel Milano', year: 2023, category: 'Creative Studio', city: 'Milano' },
]

async function main() {
  console.log('=== Deleting existing press entries ===')
  const existingPressIds = await client.fetch('*[_type == "press"]._id')
  for (const id of existingPressIds) {
    await client.delete(id)
    console.log('  deleted:', id)
  }

  console.log('\n=== Deleting existing projects ===')
  const existingProjectIds = await client.fetch('*[_type == "project"]._id')
  for (const id of existingProjectIds) {
    await client.delete(id)
    console.log('  deleted:', id)
  }

  console.log('\n=== Importing press entries ===')
  const usedSlugs = new Set()
  for (let i = 0; i < PRESS_DATA.length; i++) {
    const item = PRESS_DATA[i]
    let baseSlug = `${slugify(item.publication)}-${item.year}`
    let slug = baseSlug
    let counter = 2
    while (usedSlugs.has(slug)) {
      slug = `${baseSlug}-${counter++}`
    }
    usedSlugs.add(slug)

    await client.create({
      _type: 'press',
      publication: item.publication,
      year: item.year,
      description: item.description,
      slug: { _type: 'slug', current: slug },
      order: i + 1,
    })
    console.log(`  [${i + 1}/${PRESS_DATA.length}] ${item.publication} (${item.year}) → ${slug}`)
  }

  console.log('\n=== Importing projects ===')
  for (const proj of PROJECTS_DATA) {
    const slug = slugify(proj.title)
    await client.create({
      _type: 'project',
      title: proj.title,
      slug: { _type: 'slug', current: slug },
      year: proj.year,
      category: proj.category,
      city: proj.city,
      featured: false,
    })
    console.log(`  ${proj.title} → ${slug}`)
  }

  console.log('\n✓ Import complete')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
