import { defineField, defineType } from 'sanity'

export const pressSchema = defineType({
  name: 'press',
  title: 'Press',
  type: 'document',
  fields: [
    defineField({
      name: 'publication',
      title: 'Publication',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description / Headline',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'publication', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image (shown on hover)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'images',
      title: 'Gallery Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'link',
      title: 'Article URL',
      type: 'url',
    }),
    defineField({
      name: 'order',
      title: 'Sort Order',
      type: 'number',
      initialValue: 99,
    }),
  ],
  preview: {
    select: { title: 'publication', subtitle: 'year', media: 'coverImage' },
  },
})
