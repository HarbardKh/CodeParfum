import { buildConfig } from 'payload/config';
import path from 'path';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { webpackBundler } from '@payloadcms/bundler-webpack';
import { slateEditor } from '@payloadcms/richtext-slate';

// Collections
import { Parfums } from './src/collections/Parfums';
import { FamillesOlfactives } from './src/collections/FamillesOlfactives';
import { Media } from './src/collections/Media';
import { Articles } from './src/collections/Articles';
import { Users } from './src/collections/Users';

// Globals
import { SiteConfig } from './src/globals/SiteConfig';

export default buildConfig({
  // En production (sur Render), utiliser l'URL de production
  // En développement, utiliser localhost:3002
  serverURL: process.env.RENDER_EXTERNAL_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3002',
  admin: {
    user: 'users',
    bundler: webpackBundler(),
    meta: {
      titleSuffix: '- L\'Atelier Olfactif Privé',
      favicon: '/favicon.ico',
      ogImage: '/images/og-image.jpg',
    },
  },
  editor: slateEditor({}),
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || process.env.MONGODB_URL || process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/atelier-olfactif',
  }),
  collections: [
    Users,
    Parfums,
    FamillesOlfactives,
    Media,
    Articles
  ],
  globals: [
    SiteConfig,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'src/payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'src/payload-schema.graphql'),
  },
  // Active le support ISR pour Next.js
  cors: ['http://localhost:3002', 'http://127.0.0.1:3002', process.env.NEXT_PUBLIC_SITE_URL || ''].filter(Boolean => Boolean),
  csrf: ['http://localhost:3002', 'http://127.0.0.1:3002', process.env.NEXT_PUBLIC_SITE_URL || ''].filter(Boolean => Boolean),
}); 