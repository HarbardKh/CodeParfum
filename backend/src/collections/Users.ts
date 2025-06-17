import { CollectionConfig } from 'payload/types';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    // Seuls les administrateurs peuvent lire la liste complète des utilisateurs
    read: ({ req }) => {
      // Les utilisateurs connectés peuvent voir leur propre profil
      if (req.user) {
        if (req.user.roles?.includes('admin')) {
          return true; // Les admin peuvent tout voir
        }
        // Les utilisateurs non-admin peuvent uniquement voir leur propre profil
        return {
          id: {
            equals: req.user.id,
          },
        };
      }
      return false; // Les utilisateurs non connectés ne peuvent rien voir
    },
    // Seuls les administrateurs peuvent créer de nouveaux utilisateurs
    create: ({ req }) => req.user?.roles?.includes('admin'),
    // La mise à jour est limitée selon le rôle
    update: ({ req }) => {
      if (!req.user) return false;
      if (req.user.roles?.includes('admin')) return true;
      // Un utilisateur peut mettre à jour son propre profil, mais pas les autres
      return {
        id: {
          equals: req.user.id,
        },
      };
    },
    // Seuls les administrateurs peuvent supprimer des utilisateurs
    delete: ({ req }) => req.user?.roles?.includes('admin'),
  },
  fields: [
    // Email added by default
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['editor'],
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Editor',
          value: 'editor',
        },
      ],
      access: {
        create: ({ req }) => req.user?.roles?.includes('admin'),
        update: ({ req }) => req.user?.roles?.includes('admin'),
      },
    },
  ],
};
