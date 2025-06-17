import { CollectionConfig } from 'payload/types';

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    // Tout le monde peut lire les médias
    read: () => true,
    // Seuls les utilisateurs authentifiés avec le rôle approprié peuvent créer/modifier/supprimer
    create: ({ req }) => req.user?.roles?.includes('admin') || req.user?.roles?.includes('editor'),
    update: ({ req }) => req.user?.roles?.includes('admin') || req.user?.roles?.includes('editor'),
    delete: ({ req }) => req.user?.roles?.includes('admin'),
  },
  upload: {
    staticDir: '../public/uploads',
    staticURL: '/uploads',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1920,
        height: 1080,
        position: 'centre',
      },
    ],
    mimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
      required: false,
    },
  ],
}; 