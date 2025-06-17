"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FamillesOlfactives = void 0;
exports.FamillesOlfactives = {
    slug: 'familles-olfactives',
    admin: {
        useAsTitle: 'nom',
        defaultColumns: ['nom', 'slug', 'notesTypiques'],
    },
    access: {
        read: function () { return true; },
        create: function (_a) {
            var _b, _c, _d, _e;
            var req = _a.req;
            return ((_c = (_b = req.user) === null || _b === void 0 ? void 0 : _b.roles) === null || _c === void 0 ? void 0 : _c.includes('admin')) || ((_e = (_d = req.user) === null || _d === void 0 ? void 0 : _d.roles) === null || _e === void 0 ? void 0 : _e.includes('editor'));
        },
        update: function (_a) {
            var _b, _c, _d, _e;
            var req = _a.req;
            return ((_c = (_b = req.user) === null || _b === void 0 ? void 0 : _b.roles) === null || _c === void 0 ? void 0 : _c.includes('admin')) || ((_e = (_d = req.user) === null || _d === void 0 ? void 0 : _d.roles) === null || _e === void 0 ? void 0 : _e.includes('editor'));
        },
        delete: function (_a) {
            var _b, _c;
            var req = _a.req;
            return (_c = (_b = req.user) === null || _b === void 0 ? void 0 : _b.roles) === null || _c === void 0 ? void 0 : _c.includes('admin');
        },
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
            required: true,
        },
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
            required: false,
            admin: {
                description: 'Image représentative de la famille olfactive (placeholders utilisés si non disponible)',
            },
        },
        {
            name: 'imagePlaceholder',
            type: 'select',
            options: [
                { label: 'Florale', value: 'florale' },
                { label: 'Boisée', value: 'boisee' },
                { label: 'Orientale', value: 'orientale' },
                { label: 'Fruitée', value: 'fruitee' },
                { label: 'Aromatique', value: 'aromatique' },
                { label: 'Hespéridée', value: 'hesperidee' },
                { label: 'Chyprée', value: 'chypree' },
                { label: 'Fougère', value: 'fougere' },
            ],
            admin: {
                description: 'Type de placeholder à utiliser si l\'image n\'est pas disponible',
            },
        },
        {
            name: 'notesTypiques',
            type: 'text',
            required: true,
            admin: {
                description: 'Notes typiques de cette famille olfactive, séparées par des virgules',
            }
        },
        {
            name: 'pourQui',
            type: 'textarea',
            required: true,
            admin: {
                description: 'Description du public cible pour cette famille olfactive',
            }
        },
        {
            name: 'quandPorter',
            type: 'textarea',
            required: true,
            admin: {
                description: 'Moments idéaux pour porter cette famille de parfum',
            }
        },
        {
            name: 'sousFamilles',
            type: 'array',
            fields: [
                {
                    name: 'nom',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'description',
                    type: 'text',
                }
            ]
        },
        {
            name: 'evocation',
            type: 'textarea',
            required: true,
            admin: {
                description: 'Ce que cette famille olfactive évoque',
            }
        },
        {
            name: 'motParfumeur',
            type: 'textarea',
            required: true,
            admin: {
                description: 'Citation ou mot du parfumeur sur cette famille',
            }
        },
        {
            name: 'genre',
            type: 'select',
            options: [
                { label: 'Masculin', value: 'masculin' },
                { label: 'Féminin', value: 'feminin' },
                { label: 'Mixte', value: 'mixte' },
            ],
            defaultValue: 'mixte',
            required: true,
        },
        {
            name: 'saison',
            type: 'select',
            options: [
                { label: 'Toutes saisons', value: 'toutes' },
                { label: 'Printemps', value: 'printemps' },
                { label: 'Été', value: 'ete' },
                { label: 'Automne', value: 'automne' },
                { label: 'Hiver', value: 'hiver' },
                { label: 'Printemps/Été', value: 'printemps-ete' },
                { label: 'Automne/Hiver', value: 'automne-hiver' },
            ],
            defaultValue: 'toutes',
            required: true,
        },
        {
            name: 'intensite',
            type: 'select',
            options: [
                { label: 'Légère', value: 'legere' },
                { label: 'Modérée', value: 'moderee' },
                { label: 'Intense', value: 'intense' },
                { label: 'Très intense', value: 'tres-intense' },
            ],
            defaultValue: 'moderee',
            required: true,
        },
        {
            name: 'ordre',
            type: 'number',
            admin: {
                description: 'Ordre d\'affichage sur la page (1 apparaît en premier)',
            },
            defaultValue: 99,
        },
        {
            name: 'slug',
            type: 'text',
            required: true,
            unique: true,
            admin: {
                description: 'URL unique pour cette famille olfactive (ex: agrumes, boisee)',
            },
        },
    ],
};
