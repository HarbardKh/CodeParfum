import type { CollectionConfig } from 'payload/types';

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'titre',
    defaultColumns: ['titre', 'auteur', 'datePublication', 'statut'],
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.roles?.includes('admin') || req.user?.roles?.includes('editor'),
    update: ({ req }) => req.user?.roles?.includes('admin') || req.user?.roles?.includes('editor'),
    delete: ({ req }) => req.user?.roles?.includes('admin'),
  },
  fields: [
    {
      name: 'titre',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL unique pour cet article (ex: conseils-parfums-ete)',
      },
    },
    {
      name: 'contenu',
      type: 'richText',
      required: true,
    },
    {
      name: 'auteur',
      type: 'text',
      required: true,
    },
    {
      name: 'datePublication',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: 'imagePrincipale',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Image principale de l\'article (placeholders utilisés si non disponible)',
      },
    },
    {
      name: 'imagePlaceholder',
      type: 'select',
      options: [
        { label: 'Blog Parfumerie', value: 'blog-parfumerie' },
        { label: 'Conseils Parfums', value: 'conseils-parfums' },
        { label: 'Histoire Parfumerie', value: 'histoire-parfumerie' },
        { label: 'Tendances', value: 'tendances' },
      ],
      defaultValue: 'blog-parfumerie',
      admin: {
        description: 'Type de placeholder à utiliser si l\'image principale n\'est pas disponible',
      },
    },
    {
      name: 'resume',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Courte description de l\'article pour les aperçus',
      },
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'statut',
      type: 'select',
      options: [
        { label: 'Brouillon', value: 'brouillon' },
        { label: 'Publié', value: 'publie' },
        { label: 'Archivé', value: 'archive' },
      ],
      defaultValue: 'brouillon',
      required: true,
    },
    {
      name: 'parfumsAssocies',
      type: 'relationship',
      relationTo: 'parfums',
      hasMany: true,
      admin: {
        description: 'Parfums mentionnés dans cet article',
      },
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'metaTitre',
          type: 'text',
          required: true,
          admin: {
            description: 'Titre pour les moteurs de recherche (max 60 caractères)',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Description pour les moteurs de recherche (max 160 caractères)',
          },
        },
        {
          name: 'motsCles',
          type: 'text',
          required: true,
          admin: {
            description: 'Mots-clés séparés par des virgules',
          },
        },
      ],
    },
    {
      name: 'categorieArticle',
      type: 'select',
      options: [
        { label: 'Conseils', value: 'conseils' },
        { label: 'Tendances', value: 'tendances' },
        { label: 'Histoire', value: 'histoire' },
        { label: 'Nouveautés', value: 'nouveautes' },
        { label: 'Interviews', value: 'interviews' },
      ],
      required: true,
    },
  ],
};

// export default Articles;
