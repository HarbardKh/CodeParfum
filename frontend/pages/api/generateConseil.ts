import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

/**
 * @deprecated Cette route est dépréciée et sera supprimée prochainement.
 * Utilisez directement le service conseilService.ts qui appelle l'API backend sécurisée.
 * Elle est maintenue pour compatibilité mais n'utilise plus directement OpenAI.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Récupérer les parfums filtrés et les préférences utilisateur
    const { filteredPerfumes, userPrefs } = req.body;

    if (!filteredPerfumes || !userPrefs) {
      return res.status(400).json({ error: 'Données incomplètes pour la génération du conseil' });
    }

    // URL du backend
    const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3002';
    
    // Utiliser le backend comme proxy pour l'API OpenAI
    const response = await axios.post(
      `${backendUrl}/api/generate-conseil`,
      {
        filteredPerfumes,
        userPrefs
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Retourner le conseil généré
    return res.status(200).json({ conseil: response.data.conseil });
  } catch (error) {
    console.error('Erreur lors de l\'appel au backend:', error);
    
    // Gérer les différents types d'erreurs
    if (axios.isAxiosError(error) && error.response) {
      return res.status(error.response.status).json({ 
        error: `Erreur: ${error.response.data.error || 'Erreur inconnue'}` 
      });
    }
    
    return res.status(500).json({ error: 'Erreur lors de la génération du conseil' });
  }
} 