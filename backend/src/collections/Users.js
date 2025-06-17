"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
exports.Users = {
    slug: 'users',
    auth: true,
    admin: {
        useAsTitle: 'email',
    },
    access: {
        // Seuls les administrateurs peuvent lire la liste complète des utilisateurs
        read: function (_a) {
            var _b;
            var req = _a.req;
            // Les utilisateurs connectés peuvent voir leur propre profil
            if (req.user) {
                if ((_b = req.user.roles) === null || _b === void 0 ? void 0 : _b.includes('admin')) {
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
        create: function (_a) {
            var _b, _c;
            var req = _a.req;
            return (_c = (_b = req.user) === null || _b === void 0 ? void 0 : _b.roles) === null || _c === void 0 ? void 0 : _c.includes('admin');
        },
        // La mise à jour est limitée selon le rôle
        update: function (_a) {
            var _b;
            var req = _a.req;
            if (!req.user)
                return false;
            if ((_b = req.user.roles) === null || _b === void 0 ? void 0 : _b.includes('admin'))
                return true;
            // Un utilisateur peut mettre à jour son propre profil, mais pas les autres
            return {
                id: {
                    equals: req.user.id,
                },
            };
        },
        // Seuls les administrateurs peuvent supprimer des utilisateurs
        delete: function (_a) {
            var _b, _c;
            var req = _a.req;
            return (_c = (_b = req.user) === null || _b === void 0 ? void 0 : _b.roles) === null || _c === void 0 ? void 0 : _c.includes('admin');
        },
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
                create: function (_a) {
                    var _b, _c;
                    var req = _a.req;
                    return (_c = (_b = req.user) === null || _b === void 0 ? void 0 : _b.roles) === null || _c === void 0 ? void 0 : _c.includes('admin');
                },
                update: function (_a) {
                    var _b, _c;
                    var req = _a.req;
                    return (_c = (_b = req.user) === null || _b === void 0 ? void 0 : _b.roles) === null || _c === void 0 ? void 0 : _c.includes('admin');
                },
            },
        },
    ],
};
