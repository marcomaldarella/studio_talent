export interface Project {
  _id: string
  title: string
  slug: { current: string }
  year: number
  category: string
  client?: string
  description?: string
  coverImage?: string
  images?: string[]
  tags?: string[]
  featured?: boolean
}

export interface SiteSettings {
  studioName: string
  tagline?: string
  bio?: string
  email?: string
  instagram?: string
  logo?: string
}
