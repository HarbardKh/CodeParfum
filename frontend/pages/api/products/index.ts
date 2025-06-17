import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// URL du backend PayloadCMS
const PAYLOAD_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3002';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Paramètres de requête
    const { limit = 10, page = 1, genre, family, priceMax, priceMin, sort = '-createdAt' } = req.query;
    
    // Construction des filtres
    const where: any = {};
    
    if (genre) {
      where.genre = {
        equals: genre,
      };
    }
    
    if (family) {
      where.family = {
        equals: family,
      };
    }
    
    if (priceMin || priceMax) {
      where.prix = {};
      
      if (priceMin) {
        where.prix.greater_than_equal = Number(priceMin);
      }
      
      if (priceMax) {
        where.prix.less_than_equal = Number(priceMax);
      }
    }
    
    // Récupération des parfums depuis l'API backend
    const response = await axios.get(`${PAYLOAD_URL}/api/parfums`, {
      params: {
        where: JSON.stringify(where),
        limit: Number(limit),
        page: Number(page),
        sort: sort as string,
        depth: 1
      }
    });
    
    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Erreur API :', error);
    return res.status(error?.response?.status || 500).json({ 
      error: 'Erreur lors de la récupération des produits',
      message: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
} 