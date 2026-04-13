export const ALL_PROJECTS_QUERY = `*[_type == "project"] | order(year desc) {
  _id,
  title,
  slug,
  year,
  category,
  "coverImage": coverImage.asset->url,
  featured
}`

export const FEATURED_PROJECTS_QUERY = `*[_type == "project" && featured == true] | order(year desc) [0...6] {
  _id,
  title,
  slug,
  year,
  category,
  "coverImage": coverImage.asset->url
}`

export const PROJECT_BY_SLUG_QUERY = `*[_type == "project" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  year,
  category,
  client,
  description,
  "coverImage": coverImage.asset->url,
  "images": images[].asset->url,
  tags
}`

export const ALL_PRESS_QUERY = `*[_type == "press"] | order(order asc, year desc) {
  _id,
  publication,
  year,
  description,
  "coverImage": coverImage.asset->url,
  link
}`

export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0] {
  studioName,
  tagline,
  bio,
  email,
  instagram,
  "logo": logo.asset->url
}`
