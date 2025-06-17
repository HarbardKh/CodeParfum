import { CollectionConfig } from 'payload/types';

export const Marques: CollectionConfig = {
  slug: 'marques',
  admin: {
    useAsTitle: 'nom',
    defaultColumns: ['nom', 'pays', 'anneeCreation'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'nom',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'pays',
      type: 'text',
    },
    {
      name: 'anneeCreation',
      type: 'number',
    },
    {
      name: 'siteWeb',
      type: 'text',
      admin: {
        description: 'URL du site officiel de la marque',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL unique pour cette marque (ex: dior, chanel)',
      },
    },
  ],
};

export default Marques; 