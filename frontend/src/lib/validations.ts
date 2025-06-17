/**
 * Validation schemas using Zod
 * 
 * Ce fichier contient les schémas de validation pour les formulaires côté client
 * Ces validations sont complémentaires aux validations serveur
 */

import { z } from 'zod';

// Messages d'erreur personnalisés en français
const errorMessages = {
  required: 'Ce champ est requis',
  email: 'Format d\'email invalide',
  min: (min: number) => `Minimum ${min} caractères requis`,
  max: (max: number) => `Maximum ${max} caractères autorisés`,
  numeric: 'Ce champ doit contenir uniquement des chiffres',
  phone: 'Format de téléphone invalide',
  postal: 'Format de code postal invalide',
};

// Validation d'un email
export const emailSchema = z.string()
  .email({ message: errorMessages.email })
  .min(5, { message: errorMessages.min(5) })
  .max(100, { message: errorMessages.max(100) });

// Validation d'un mot de passe (règles de sécurité)
export const passwordSchema = z.string()
  .min(8, { message: errorMessages.min(8) })
  .max(100, { message: errorMessages.max(100) })
  .refine(
    (password) => /[A-Z]/.test(password),
    { message: 'Le mot de passe doit contenir au moins une majuscule' }
  )
  .refine(
    (password) => /[a-z]/.test(password),
    { message: 'Le mot de passe doit contenir au moins une minuscule' }
  )
  .refine(
    (password) => /[0-9]/.test(password),
    { message: 'Le mot de passe doit contenir au moins un chiffre' }
  )
  .refine(
    (password) => /[^A-Za-z0-9]/.test(password),
    { message: 'Le mot de passe doit contenir au moins un caractère spécial' }
  );

// Validation d'un numéro de téléphone français
export const phoneSchema = z.string()
  .min(10, { message: errorMessages.min(10) })
  .max(20, { message: errorMessages.max(20) })
  .refine(
    (phone) => /^(\+33|0)[1-9](\d{2}){4}$/.test(phone.replace(/\s/g, '')),
    { message: errorMessages.phone }
  );

// Validation d'un code postal français
export const postalCodeSchema = z.string()
  .length(5, { message: 'Le code postal doit contenir exactement 5 chiffres' })
  .refine(
    (code) => /^\d{5}$/.test(code),
    { message: errorMessages.postal }
  );

// Schéma complet pour la connexion
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: errorMessages.required }),
});

// Schéma pour l'inscription
export const registerSchema = z.object({
  firstName: z.string().min(1, { message: errorMessages.required }),
  lastName: z.string().min(1, { message: errorMessages.required }),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Vous devez accepter les conditions d\'utilisation'
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

// Schéma pour le formulaire de contact
export const contactSchema = z.object({
  name: z.string().min(1, { message: errorMessages.required }),
  email: emailSchema,
  phone: z.string().optional(),
  message: z.string().min(10, { message: errorMessages.min(10) }).max(1000, { message: errorMessages.max(1000) }),
});

// Schéma pour les paramètres de recherche de parfums
export const searchParamsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.string().optional(),
  search: z.string().optional(),
  genre: z.string().optional(),
  famille: z.string().optional(),
});

// Schéma pour un token CSRF
export const csrfTokenSchema = z.object({
  csrfToken: z.string().min(1, { message: 'Token CSRF invalide' }),
});
