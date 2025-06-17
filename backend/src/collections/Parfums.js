"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parfums = void 0;
exports.Parfums = {
    slug: 'parfums',
    admin: {
        useAsTitle: 'numeroParf',
        defaultColumns: ['numeroParf', 'inspiration', 'genre', 'familleOlfactive', 'prix'],
    },
    access: {
        // Tout le monde peut lire les parfums
        read: function () { return true; },
        // Seuls les utilisateurs authentifiés avec le rôle approprié peuvent créer/modifier/supprimer
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
        // Champs principaux - alignés sur les noms exacts du CSV
        {
            name: 'numeroParf',
            type: 'text',
            required: true,
            unique: true,
            admin: {
                description: 'Numéro de référence unique pour ce parfum (Pour utilisateur et Database)',
            },
        },
        {
            name: 'inspiration',
            type: 'text',
            required: true,
            admin: {
                description: 'Inspiration du parfum (ne pas utiliser publiquement - Pour Database uniquement)',
                condition: function (data) { return true; }, // Visible uniquement dans le backend
            },
        },
        {
            name: 'genre',
            type: 'select',
            options: [
                { label: 'Femme', value: 'F' },
                { label: 'Homme', value: 'H' },
                { label: 'Unisexe', value: 'U' },
            ],
            required: true,
            admin: {
                description: 'Genre du parfum (Pour utilisateur et Database)',
            },
        },
        {
            name: 'formatParDefaut',
            type: 'select',
            options: [
                { label: '70ml', value: '70ml' },
                { label: '30ml', value: '30ml' },
                { label: '15ml', value: '15ml' },
                { label: '5x15ml', value: '5x15ml' },
            ],
            defaultValue: '70ml',
            required: true,
            admin: {
                description: 'Format affiché par défaut sur la fiche produit',
            },
        },
        {
            name: 'familleOlfactive',
            type: 'relationship',
            relationTo: 'familles-olfactives',
            required: true,
            admin: {
                description: 'Famille olfactive principale du parfum (Pour utilisateur et Database)',
            },
        },
        {
            name: 'famillePrincipale',
            type: 'text',
            required: true,
            admin: {
                description: 'Famille principale (Pour Database uniquement)',
            },
        },
        {
            name: 'familleSecondaire',
            type: 'text',
            required: true,
            admin: {
                description: 'Famille secondaire (Pour Database uniquement)',
            },
        },
        {
            name: 'intensite',
            type: 'select',
            options: [
                { label: 'Légère', value: 'Légère' },
                { label: 'Moyenne', value: 'Moyenne' },
                { label: 'Forte', value: 'Forte' },
            ],
            required: true,
            admin: {
                description: 'Intensité du parfum (Pour utilisateur et Database)',
            },
        },
        {
            name: 'occasion',
            type: 'text',
            required: false,
            admin: {
                description: 'Occasions idéales pour porter ce parfum (Pour utilisateur et Database)',
            },
        },
        // Notes olfactives - format texte brut comme dans le CSV
        {
            name: 'noteTete',
            type: 'text',
            required: false,
            admin: {
                description: 'Notes de tête du parfum (Pour utilisateur et Database)',
            },
        },
        {
            name: 'noteCoeur',
            type: 'text',
            required: false,
            admin: {
                description: 'Notes de coeur du parfum (Pour utilisateur et Database)',
            },
        },
        {
            name: 'noteFond',
            type: 'text',
            required: false,
            admin: {
                description: 'Notes de fond du parfum (Pour utilisateur et Database)',
            },
        },
        // Description et contenus additionnels
        {
            name: 'description1',
            type: 'textarea',
            required: true,
            admin: {
                description: 'Description principale du parfum (Pour utilisateur et Database)',
            },
        },
        {
            name: 'description',
            type: 'richText',
            required: false,
            admin: {
                description: 'Description détaillée avec mise en forme (Pour utilisateur et Database)',
            },
        },
        {
            name: 'aPropos',
            type: 'textarea',
            required: false,
            admin: {
                description: 'À propos de ce parfum (Pour utilisateur et Database)',
            },
        },
        {
            name: 'ConseilExpertise',
            type: 'textarea',
            required: false,
            admin: {
                description: 'Conseil & Expertise sur le parfum (Pour utilisateur et Database)',
            },
        },
        // Champ image géré manuellement
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
            required: false,
            admin: {
                description: 'Image du parfum (ajout manuel uniquement)',
            },
        },
        // Champs nécessaires pour le fonctionnement du site
        {
            name: 'prix',
            type: 'number',
            required: true,
            min: 0,
            admin: {
                description: 'Prix du parfum (prix de référence de la taille 70ml)',
            },
        },
        // Variantes du parfum (différentes contenances, prix et références)
        {
            name: 'variantes',
            type: 'array',
            admin: {
                description: 'Différentes variantes du parfum (contenances, prix, références)',
            },
            fields: [
                {
                    name: 'volume',
                    type: 'select',
                    options: [
                        { label: '70ml', value: '70ml' },
                        { label: '30ml', value: '30ml' },
                        { label: '15ml', value: '15ml' },
                        { label: '5x15ml', value: '5x15ml' },
                    ],
                    required: true,
                    admin: {
                        description: 'Contenance du parfum',
                    },
                },
                {
                    name: 'prix',
                    type: 'number',
                    required: true,
                    min: 0,
                    admin: {
                        description: 'Prix de cette variante',
                    },
                },
                {
                    name: 'ref',
                    type: 'text',
                    required: true,
                    admin: {
                        description: 'Référence unique pour cette variante',
                    },
                }
            ],
        },
        {
            name: 'slug',
            type: 'text',
            required: true,
            unique: true,
            admin: {
                description: 'URL unique pour ce parfum (ex: parfum-123)',
            },
        },
    ],
};
// export default Parfums; 
