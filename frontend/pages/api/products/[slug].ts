import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// URL du backend PayloadCMS
const PAYLOAD_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3002';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { slug } = req.query;
    
    if (!slug || typeof slug !== 'string') {
      return res.status(400).json({ error: 'Paramètre slug manquant ou invalide' });
    }
    
    // Récupération du parfum par son slug depuis l'API backend
    const response = await axios.get(`${PAYLOAD_URL}/api/parfums`, {
      params: {
        where: JSON.stringify({
          slug: {
            equals: slug
          }
        }),
        depth: 2 // Pour récupérer les informations liées (familles, etc.)
      }
    });
    
    const parfums = response.data;
    
    if (!parfums.docs || !parfums.docs.length) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    return res.status(200).json(parfums.docs[0]);
  } catch (error: any) {
    console.error('Erreur API :', error);
    return res.status(error?.response?.status || 500).json({ 
      error: 'Erreur lors de la récupération du produit',
      message: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
} 