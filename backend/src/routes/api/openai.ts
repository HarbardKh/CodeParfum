import { Request } from 'express';
import { Response, NextFunction } from 'express';
import axios from 'axios';
import { authLimiter } from '../../middleware/rateLimiter';

interface ExtendedRequest extends Request {
  payload?: any;
  body: {
    [key: string]: any;
  };
}

/**
 * Proxy sécurisé pour l'API OpenAI
 * Cette route évite d'exposer la clé API dans le frontend
 */
export const generateConseil = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  try {
    // Vérifier la méthode HTTP
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    // Récupérer les données de la requête
    const { filteredPerfumes, userPrefs } = req.body;

    if (!filteredPerfumes || !userPrefs) {
      return res.status(400).json({ error: 'Données incomplètes pour la génération du conseil' });
    }

    // Extraction des préférences utilisateur
    const parfumHabitude = userPrefs.parfumHabitude || '';
    const familles = userPrefs.familles || [];
    const intensite = userPrefs.intensite || '';
    const occasions = userPrefs.occasions || [];

    // Construction du prompt pour GPT
    const prompt = `
Tu es un expert en parfumerie française. 

===== PRÉFÉRENCES UTILISATEUR =====
- Parfum habituellement utilisé : ${parfumHabitude || 'non spécifié'}
- Familles olfactives préférées : ${familles.join(', ') || 'non spécifié'}
- Intensité recherchée : ${intensite || 'non spécifié'}
- Occasions d'utilisation : ${occasions.join(', ') || 'non spécifié'}

===== PARFUMS SÉLECTIONNÉS =====
Voici EXCLUSIVEMENT les parfums que tu dois recommander (n'en invente pas d'autres) :
${filteredPerfumes.map((p: any) =>
  `- N°${p.reference} | Nom: ${p.name} | Genre: ${p.gender === 'F' ? 'Féminin' : p.gender === 'M' ? 'Masculin' : 'Unisexe'} | 
   Famille: ${p.famille_olfactive} | Intensité: ${p.intensite} | 
   Description: "${p.description.substring(0, 100)}..."`
).join('\n\n')}

===== CONSIGNES DE RÉDACTION =====
1. Introduction personnalisée selon les préférences (ton premium et mystérieux)
2. Présentation de CHAQUE parfum listé ci-dessus, de façon élégante et persuasive
3. Pour chaque parfum mentionne sa référence exacte au format "N°XX" (très important)
4. Ne JAMAIS mentionner d'inspiration de marque ou de parfum connu
5. Conclusion avec invitation à découvrir ces parfums

Ton texte doit être exclusivement en français, with environ 200-300 mots.
    `;

    // Récupérer la clé API depuis les variables d'environnement du serveur
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error('Clé API OpenAI manquante dans les variables d\'environnement');
      return res.status(500).json({ error: 'Configuration du serveur incomplète' });
    }

    // Appel à l'API OpenAI
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { 
            role: 'system', 
            content: 'Tu es un expert en parfumerie et copywriting français. Ta réponse doit être exclusivement en français.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1500
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    if (!response.data || !response.data.choices || !response.data.choices[0]) {
      throw new Error('Réponse invalide de l\'API OpenAI');
    }

    // Extraire le contenu de la réponse
    const content = response.data.choices[0].message.content;

    // Retourner le conseil généré
    return res.status(200).json({ conseil: content });
  } catch (error: any) {
    console.error('Erreur lors de l\'appel à l\'API OpenAI:', error);
    
    // Gérer les différents types d'erreurs
    if (axios.isAxiosError(error) && error.response) {
      return res.status(error.response.status).json({ 
        error: `Erreur OpenAI: ${error.response.data.error?.message || 'Erreur inconnue'}` 
      });
    }
    
    return res.status(500).json({ 
      error: 'Erreur lors de la génération du conseil',
      message: error.message || 'Erreur inconnue'
    });
  }
}; 