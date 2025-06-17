import { Request } from 'express';
import { Response, NextFunction } from 'express';
import payload from 'payload';

interface ExtendedRequest extends Request {
  payload?: typeof payload;
  query: {
    [key: string]: any;
  };
}

/**
 * Route API personnalisée pour retourner les parfums
 * Accessible via /api/parfums
 * 
 * REMARQUE IMPORTANTE SUR LE FILTRAGE PAR GENRE:
 * ---------------------------------------------
 * Le filtrage par genre posait problème auparavant car:
 * 1. Les genres étaient encodés de manière incohérente (H/Homme, F/Femme)
 * 2. Un test forcé dans le code écrasait le filtre genre
 * 3. La structure du filtre MongoDB n'était pas correctement appliquée
 * 
 * La solution a été double:
 * 1. Implémenter un filtrage client-side fiable dans le frontend
 * 2. Améliorer la robustesse du filtrage backend comme dans ce fichier
 */
export const getParfums = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  try {
    console.log("\n\n********************************************************");
    console.log("*                APPEL API PARFUMS                     *");
    console.log("* URL: " + req.originalUrl);
    if (req.query.genre) {
      console.log("* FILTRE GENRE: " + req.query.genre);
    }
    console.log("********************************************************\n\n");
    
    // SOLUTION TEMPORAIRE: Si nous sommes en mode comptage de genres, court-circuiter la logique normale
    if (req.query.count_genres === 'true') {
      if (!req.payload) {
        return res.status(500).json({
          message: 'Payload non initialisé',
          error: 'Configuration incorrecte'
        });
      }
      
      console.log("Mode comptage des genres activé - récupération de tous les parfums sans filtrage");
      
      // Récupérer tous les parfums sans aucun filtrage
      const allParfums = await req.payload.find({
        collection: 'parfums',
        limit: 300, // Récupérer un grand nombre pour être sûr d'avoir tous les parfums
      });
      
      console.log(`Nombre total de parfums trouvés: ${allParfums.totalDocs}`);
      
      // Compter les genres
      const genreCount: {[key: string]: number} = {};
      const parGenre: {[key: string]: any[]} = {};
      
      allParfums.docs.forEach((doc: any) => {
        const g = doc.genre || 'undefined';
        genreCount[g] = (genreCount[g] || 0) + 1;
        
        // Stocker les parfums par genre pour l'analyse
        if (!parGenre[g]) parGenre[g] = [];
        parGenre[g].push({
          id: doc.id,
          nom: doc.nom,
          numeroParf: doc.numeroParf,
          genre: doc.genre
        });
      });
      
      console.log("Distribution des genres:", genreCount);
      
      // Retourner le résultat du comptage
      return res.status(200).json({
        message: "Comptage des genres effectué avec succès",
        totalParfums: allParfums.totalDocs,
        genreCount,
        echantillons: {
          homme: parGenre['H']?.slice(0, 5) || [],
          femme: parGenre['F']?.slice(0, 5) || []
        }
      });
    }
    
    // Récupérer les paramètres de base
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 100;
    const sort = req.query.sort || '-createdAt';
    
    console.log(`Page: ${page}, Limit: ${limit}, Sort: ${sort}`);
    
    // Construction directe de l'objet findParams
    const findParams: any = {
      collection: 'parfums',
      sort: sort as string,
      limit: limit,
      page: page,
      depth: 1,
      where: {} // On initialise un objet where vide
    };
    
    // FILTRAGE SIMPLIFIÉ - Application directe des filtres sans variables intermédiaires
    if (req.query.genre) {
      console.log(`\n\n===== FILTRE GENRE DÉTECTÉ: "${req.query.genre}" =====`);
      console.log(`URL complète de la requête: ${req.originalUrl}`);
      
      // *** LOGS DÉTAILLÉS DU FILTRE ***
      const genreValue = req.query.genre as string;
      console.log(`Valeur exacte du genre à filtrer: "${genreValue}"`);
      
      // Si le genre est vide, on ne filtre pas
      if (genreValue && genreValue !== 'undefined' && genreValue !== 'null') {
        // Formater le filtre exactement comme il sera envoyé à MongoDB
        findParams.where.genre = { equals: genreValue };
        console.log(`Filtre genre final envoyé à la DB: ${JSON.stringify(findParams.where.genre)}`);
      } else {
        console.log("Genre vide ou invalide, pas de filtrage appliqué");
      }
    }
    
    // *** TEST FORCÉ - DÉSACTIVÉ ***
    // Ce code était la cause principale du problème de filtrage
    // Il écrasait tous les filtres pour toujours mettre genre="F"
    // findParams.where.genre = { equals: 'F' };
    // console.log("TEST FORCÉ: Filtrage sur genre='F' uniquement");
    
    if (req.query.familleOlfactive) {
      console.log(`Filtre famille: "${req.query.familleOlfactive}"`);
      findParams.where.familleOlfactive = { equals: req.query.familleOlfactive };
    }
    
    if (req.query.nouveaute === 'true') {
      console.log(`Filtre nouveauté: true`);
      findParams.where.nouveaute = { equals: true };
    }
    
    if (req.query.search) {
      console.log(`Recherche: "${req.query.search}"`);
      findParams.where.inspiration = { contains: req.query.search };
    }
    
    console.log("Filtres finaux:");
    console.log(JSON.stringify(findParams.where, null, 2));
    
    // Exécution de la requête
    if (!req.payload) {
      return res.status(500).json({
        message: 'Payload non initialisé',
        error: 'Configuration incorrecte'
      });
    }
    
    // **** VÉRIFICATION DU MODÈLE AVANT REQUÊTE ****
    // Obtenir le modèle pour vérifier la définition du champ genre
    try {
      const collectionConfig = await req.payload.collections['parfums'].config;
      if (collectionConfig && collectionConfig.fields) {
        const genreField = collectionConfig.fields.find((field: any) => field.name === 'genre');
        if (genreField) {
          console.log("\nDéfinition du champ genre dans le modèle:", JSON.stringify(genreField, null, 2));
        } else {
          console.log("\nAttention: Champ genre non trouvé dans le modèle!");
        }
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du modèle:", error);
    }
    
    // Effectuer la requête avec les filtres
    console.log("\nExécution de la requête avec findParams:", JSON.stringify(findParams, null, 2));
    const parfums = await req.payload.find(findParams);
    
    // *** LOGS DÉTAILLÉS DES RÉSULTATS ***
    console.log(`\n===== RÉSULTATS DE LA REQUÊTE =====`);
    console.log(`Total docs: ${parfums.totalDocs}, Page: ${parfums.page}/${parfums.totalPages}`);
    
    // Vérifiez les genres des 10 premiers résultats
    if (parfums.docs.length > 0) {
      console.log("Échantillon des résultats (10 premiers):");
      parfums.docs.slice(0, 10).forEach((doc: any, i: number) => {
        console.log(`${i+1}. ID: ${doc.id}, Genre: ${doc.genre}, NumeroParf: ${doc.numeroParf}`);
      });
      
      // Comptage des genres dans les résultats
      const genreCount: {[key: string]: number} = {};
      parfums.docs.forEach((doc: any) => {
        const g = doc.genre || 'undefined';
        genreCount[g] = (genreCount[g] || 0) + 1;
      });
      console.log("Distribution des genres dans les résultats:", genreCount);
      
      // SOLUTION DE SECOURS - Filtrage manuel côté serveur si MongoDB ne filtre pas correctement
      // Si un filtre de genre est appliqué mais les résultats contiennent d'autres genres
      if (findParams.where.genre && Object.keys(genreCount).length > 1) {
        console.log("\n⚠️ ALERTE: Filtrage par genre inefficace! Résultats mixtes détectés!");
        
        // Filtrage manuel côté serveur si le filtrage MongoDB ne fonctionne pas
        if (req.query.genre && parfums.docs.length > 0) {
          console.log("Tentative de filtrage manuel côté serveur...");
          const genreValue = req.query.genre as string;
          const filteredDocs = parfums.docs.filter((doc: any) => doc.genre === genreValue);
          
          console.log(`Filtrage manuel: ${filteredDocs.length} sur ${parfums.docs.length} documents correspondent au genre '${genreValue}'`);
          
          // Appliquer le filtrage manuel
          const originalTotal = parfums.totalDocs;
          parfums.docs = filteredDocs;
          parfums.totalDocs = filteredDocs.length;
          parfums.totalPages = Math.ceil(filteredDocs.length / limit);
          parfums.page = Math.min(page, parfums.totalPages || 1);
          
          console.log(`Résultat après filtrage manuel: ${parfums.totalDocs} docs sur ${originalTotal} original`);
        }
      }
    }
    
    // Transformation des données pour l'affichage si nécessaire
    const transformedParfums = parfums.docs.map((parfum: any) => {
      if (!parfum.image && parfum.imagePlaceholder) {
        parfum.placeholderUrl = `/images/placeholders/${parfum.imagePlaceholder}.jpg`;
      }
      return parfum;
    });
    
    console.log("======== FIN DE LA REQUÊTE ========\n");
    
    // Retour de la réponse
    return res.status(200).json({
      ...parfums,
      docs: transformedParfums,
    });
  } catch (error: any) {
    console.error('Erreur lors de la récupération des parfums:', error);
    return res.status(500).json({
      message: 'Erreur lors de la récupération des parfums',
      error: error.message || 'Erreur inconnue',
    });
  }
};
