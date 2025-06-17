"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("payload/config");
var path_1 = require("path");
var db_mongodb_1 = require("@payloadcms/db-mongodb");
var bundler_webpack_1 = require("@payloadcms/bundler-webpack");
var richtext_slate_1 = require("@payloadcms/richtext-slate");
// Collections
var Parfums_1 = require("./src/collections/Parfums");
var FamillesOlfactives_1 = require("./src/collections/FamillesOlfactives");
var Media_1 = require("./src/collections/Media");
var Articles_1 = require("./src/collections/Articles");
var Users_1 = require("./src/collections/Users");
// Globals
var SiteConfig_1 = require("./src/globals/SiteConfig");
exports.default = (0, config_1.buildConfig)({
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3002',
    admin: {
        user: 'users',
        bundler: (0, bundler_webpack_1.webpackBundler)(),
        meta: {
            titleSuffix: '- L\'Atelier Olfactif Privé',
            favicon: '/favicon.ico',
            ogImage: '/images/og-image.jpg',
        },
    },
    editor: (0, richtext_slate_1.slateEditor)({}),
    db: (0, db_mongodb_1.mongooseAdapter)({
        url: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/atelier-olfactif',
    }),
    collections: [
        Users_1.Users,
        Parfums_1.Parfums,
        FamillesOlfactives_1.FamillesOlfactives,
        Media_1.Media,
        Articles_1.Articles
    ],
    globals: [
        SiteConfig_1.SiteConfig,
    ],
    typescript: {
        outputFile: path_1.default.resolve(__dirname, 'src/payload-types.ts'),
    },
    graphQL: {
        schemaOutputFile: path_1.default.resolve(__dirname, 'src/payload-schema.graphql'),
    },
    // Active le support ISR pour Next.js
    cors: ['http://localhost:3002', 'http://127.0.0.1:3002', process.env.NEXT_PUBLIC_SITE_URL || ''].filter(Boolean),
    csrf: ['http://localhost:3002', 'http://127.0.0.1:3002', process.env.NEXT_PUBLIC_SITE_URL || ''].filter(Boolean),
});
