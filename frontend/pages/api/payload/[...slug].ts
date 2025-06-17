import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { IncomingMessage } from 'http';

// URL du backend PayloadCMS
const PAYLOAD_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3002';

// Cette route API gère toutes les requêtes pour PayloadCMS en les transmettant au backend
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Construire l'URL cible
    const targetUrl = `${PAYLOAD_URL}${req.url?.replace(/^\/api\/payload/, '/api') || ''}`;
    
    // Préparer les options de la requête
    const options = {
      method: req.method,
      headers: {
        ...req.headers,
        // Supprimer les en-têtes spécifiques à Next.js qui pourraient causer des problèmes
        host: new URL(PAYLOAD_URL).host,
      } as any,
      data: req.body,
      responseType: 'stream' as const,
    };
    
    // Supprimer les en-têtes qui peuvent causer des conflits
    delete options.headers.host;
    delete options.headers.connection;
    
    // Effectuer la requête au backend PayloadCMS
    const response = await axios(targetUrl, options);
    
    // Transférer les en-têtes de réponse
    Object.entries(response.headers).forEach(([key, value]) => {
      res.setHeader(key, value as string);
    });
    
    // Définir le statut HTTP et envoyer le corps de la réponse
    res.status(response.status);
    response.data.pipe(res);
  } catch (error: any) {
    console.error('Erreur dans l\'API route Payload:', error);
    res.status(error?.response?.status || 500).json({ 
      error: 'Erreur serveur', 
      message: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
}

// Configurer bodyParser pour supporter les requêtes multipart pour l'upload de fichiers
export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
}; 