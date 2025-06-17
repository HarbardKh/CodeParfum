"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Media = void 0;
exports.Media = {
    slug: 'media',
    access: {
        // Tout le monde peut lire les médias
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
