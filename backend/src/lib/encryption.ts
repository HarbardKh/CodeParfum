/**
 * Utilitaires de chiffrement pour données sensibles
 * 
 * Fournit des fonctions pour chiffrer et déchiffrer des données sensibles
 * en utilisant des algorithmes sécurisés.
 */

import crypto from 'crypto';

// Clé de chiffrement dérivée à partir de PAYLOAD_SECRET
// Ne jamais utiliser directement PAYLOAD_SECRET pour le chiffrement
const getEncryptionKey = () => {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error('PAYLOAD_SECRET doit être défini pour utiliser le chiffrement');
  }
  
  // Dériver une clé de 32 octets (256 bits) à partir de PAYLOAD_SECRET
  return crypto.createHash('sha256')
    .update(String(process.env.PAYLOAD_SECRET))
    .digest();
};

// IV (Initialization Vector) unique pour chaque opération de chiffrement
const generateIV = () => crypto.randomBytes(16);

/**
 * Chiffre des données sensibles
 * @param text Texte à chiffrer
 * @returns Objet contenant les données chiffrées et l'IV en format hexadécimal
 */
export const encrypt = (text: string): { encrypted: string; iv: string } => {
  // Génère un IV aléatoire
  const iv = generateIV();
  
  // Crée un chiffreur avec l'algorithme AES-256-CBC
  const cipher = crypto.createCipheriv('aes-256-cbc', getEncryptionKey(), iv);
  
  // Chiffre les données
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return {
    encrypted,
    iv: iv.toString('hex')
  };
};

/**
 * Déchiffre des données sensibles
 * @param encrypted Données chiffrées en format hexadécimal
 * @param iv IV utilisé pour le chiffrement, en format hexadécimal
 * @returns Texte déchiffré
 */
export const decrypt = (encrypted: string, iv: string): string => {
  // Convertit l'IV du format hexadécimal en Buffer
  const ivBuffer = Buffer.from(iv, 'hex');
  
  // Crée un déchiffreur avec l'algorithme AES-256-CBC
  const decipher = crypto.createDecipheriv('aes-256-cbc', getEncryptionKey(), ivBuffer);
  
  // Déchiffre les données
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};

/**
 * Hache une valeur (pour les tokens de réinitialisation, etc.)
 * @param value Valeur à hacher
 * @returns Hachage en format hexadécimal
 */
export const hash = (value: string): string => {
  return crypto.createHash('sha256')
    .update(value)
    .digest('hex');
};

/**
 * Masque une partie d'une chaîne pour l'affichage
 * @param value Valeur à masquer
 * @param visibleStart Nombre de caractères visibles au début
 * @param visibleEnd Nombre de caractères visibles à la fin
 * @returns Valeur partiellement masquée
 */
export const maskString = (
  value: string,
  visibleStart = 2,
  visibleEnd = 2
): string => {
  if (!value) return '';
  if (value.length <= visibleStart + visibleEnd) return value;
  
  const start = value.substring(0, visibleStart);
  const end = value.substring(value.length - visibleEnd);
  const masked = '*'.repeat(Math.min(value.length - visibleStart - visibleEnd, 5));
  
  return `${start}${masked}${end}`;
};
