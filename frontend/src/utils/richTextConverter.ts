/**
 * Utilitaire pour convertir le format de texte riche de PayloadCMS/Slate en texte simple
 * ou en éléments React valides.
 */

/**
 * Convertit un champ de texte riche PayloadCMS en chaîne de texte simple
 * @param richText - Le contenu de texte riche au format PayloadCMS/Slate
 * @returns Une chaîne de texte simple ou une chaîne vide si l'entrée est invalide
 */
export const richTextToPlainText = (richText: any): string => {
  // Si l'entrée est déjà une chaîne, la retourner directement
  if (typeof richText === 'string') return richText;
  
  // Si l'entrée est null, undefined ou pas un tableau, retourner une chaîne vide
  if (!richText || !Array.isArray(richText)) return '';

  // Parcourir tous les blocs du texte riche et extraire le texte
  return richText.map(block => {
    // Si le bloc a des enfants, extraire le texte de chaque enfant
    if (block.children && Array.isArray(block.children)) {
      return block.children.map((child: any) => {
        // Si l'enfant a une propriété text, la retourner
        if (child.text) return child.text;
        // Sinon, essayer de convertir l'enfant en chaîne (peut être récursif)
        return richTextToPlainText(child.children || '');
      }).join('');
    }
    
    // Si le bloc a directement une propriété text, la retourner
    if (block.text) return block.text;
    
    // Retourner une chaîne vide comme fallback
    return '';
  }).join('\n');
};

/**
 * Vérifie si une valeur est au format rich text de PayloadCMS
 * @param value - La valeur à vérifier
 * @returns true si la valeur semble être au format rich text
 */
export const isRichText = (value: any): boolean => {
  return Array.isArray(value) && 
         value.length > 0 && 
         typeof value[0] === 'object' && 
         value[0] !== null &&
         Array.isArray(value[0].children);
};

/**
 * Fonction utilitaire pour sanitiser récursivement les objets contenant des champs rich text
 * @param obj - L'objet à sanitiser
 * @returns L'objet sanitisé avec les champs rich text convertis en texte simple
 */
export const sanitizeRichTextFields = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj;
  
  // Si c'est un tableau, sanitiser chaque élément
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeRichTextFields(item));
  }
  
  // Créer un nouvel objet pour stocker les propriétés sanitisées
  const sanitized: any = {};
  
  // Parcourir toutes les propriétés de l'objet
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      
      // Si la propriété est un rich text, la convertir en texte simple
      if (isRichText(value)) {
        sanitized[key] = richTextToPlainText(value);
      } 
      // Si la propriété est un objet ou un tableau, la sanitiser récursivement
      else if (value && typeof value === 'object') {
        sanitized[key] = sanitizeRichTextFields(value);
      } 
      // Sinon, conserver la valeur telle quelle
      else {
        sanitized[key] = value;
      }
    }
  }
  
  return sanitized;
};
