"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteConfig = void 0;
exports.SiteConfig = {
    slug: 'site-config',
    access: {
        read: function () { return true; },
        update: function (_a) {
            var _b, _c;
            var req = _a.req;
            return (_c = (_b = req.user) === null || _b === void 0 ? void 0 : _b.roles) === null || _c === void 0 ? void 0 : _c.includes('admin');
        },
    },
    fields: [
        {
            name: 'siteName',
            label: 'Nom du site',
            type: 'text',
            required: true,
            defaultValue: 'L\'Atelier Olfactif Privé',
        },
        {
            name: 'siteDescription',
            label: 'Description du site',
            type: 'textarea',
            required: true,
            defaultValue: 'Découvrez des parfums d\'exception à des prix accessibles.',
        },
        {
            name: 'slogan',
            label: 'Slogan principal',
            type: 'text',
            required: true,
            defaultValue: 'Découvrez nos parfums d\'exception, créés avec passion et expertise',
        },
        {
            name: 'descriptionAccueil',
            label: 'Description page d\'accueil',
            type: 'textarea',
            required: false,
            defaultValue: 'Des fragrances uniques pour des moments inoubliables, à des prix accessibles',
        },
        {
            name: 'miseEnAvant',
            label: 'Section mise en avant',
            type: 'group',
            fields: [
                {
                    name: 'titre',
                    label: 'Titre de la section',
                    type: 'text',
                    required: true,
                    defaultValue: 'Nos parfums d\'exception',
                },
                {
                    name: 'description',
                    label: 'Description de la section',
                    type: 'textarea',
                    required: true,
                    defaultValue: 'Chaque parfum de notre collection est une invitation au voyage, une émotion à porter.',
                },
            ],
        },
        {
            name: 'logoHeader',
            label: 'Logo Header',
            type: 'upload',
            relationTo: 'media',
            required: false,
        },
        {
            name: 'social',
            label: 'Réseaux sociaux',
            type: 'array',
            fields: [
                {
                    name: 'platform',
                    label: 'Plateforme',
                    type: 'select',
                    options: [
                        { label: 'Facebook', value: 'facebook' },
                        { label: 'Instagram', value: 'instagram' },
                        { label: 'Twitter', value: 'twitter' },
                        { label: 'LinkedIn', value: 'linkedin' },
                        { label: 'YouTube', value: 'youtube' },
                        { label: 'TikTok', value: 'tiktok' },
                    ],
                    required: true,
                },
                {
                    name: 'url',
                    label: 'URL',
                    type: 'text',
                    required: true,
                },
            ],
        },
        {
            name: 'contactInfo',
            label: 'Informations de contact',
            type: 'group',
            fields: [
                {
                    name: 'email',
                    label: 'Email',
                    type: 'email',
                    required: false,
                },
                {
                    name: 'phone',
                    label: 'Téléphone',
                    type: 'text',
                    required: false,
                },
                {
                    name: 'address',
                    label: 'Adresse',
                    type: 'textarea',
                    required: false,
                },
            ],
        },
        {
            name: 'footerLinks',
            label: 'Liens du pied de page',
            type: 'array',
            fields: [
                {
                    name: 'label',
                    label: 'Libellé',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'url',
                    label: 'URL',
                    type: 'text',
                    required: true,
                },
            ],
        },
    ],
};
