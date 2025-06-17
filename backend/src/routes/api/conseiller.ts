import { Request, Response } from 'express';
import payload from 'payload';
import { ParfumScoringEngine, QuestionnaireReponses, ParfumAvecScore } from '../../lib/parfum-scoring';
import type { Parfum, FamillesOlfactive } from '../../payload-types';

interface ExtendedRequest extends Request {
  payload?: typeof payload;
}

/**
 * Endpoint de debug pour analyser les données et comprendre les problèmes de scoring
 * GET /api/conseiller/debug-data
 */
export const debugData = async (req: ExtendedRequest, res: Response) => {
  try {
    if (!req.payload) {
      return res.status(500).json({ error: 'Payload non initialisé' });
    }

    console.log('🔍 DEBUG: Analyse des données de parfums');

    // Récupérer quelques parfums pour analyse
    const parfumsResult = await req.payload.find({
      collection: 'parfums',
      limit: 5,
      depth: 2
    });

    const analyseDonnees = parfumsResult.docs.map((parfum: any) => {
      return {
        id: parfum.id,
        numeroParf: parfum.numeroParf,
        genre: parfum.genre,
        famillePrincipale: parfum.famillePrincipale,
        familleSecondaire: parfum.familleSecondaire,
        familleOlfactive: typeof parfum.familleOlfactive === 'object' ? 
          parfum.familleOlfactive?.nom : parfum.familleOlfactive,
        occasion: parfum.occasion,
        noteTete: parfum.noteTete?.substring(0, 50) + '...',
        noteCoeur: parfum.noteCoeur?.substring(0, 50) + '...',
        noteFond: parfum.noteFond?.substring(0, 50) + '...',
        inspiration: parfum.inspiration?.substring(0, 50) + '...'
      };
    });

    // Test avec des données réalistes
    const reponsesTest: QuestionnaireReponses = {
      famillesOlfactives: ['Florale'], // Correspond à ce que l'utilisateur a choisi
      notesAimees: ['Fleur d\'oranger', 'Jasmin'],
      notesDetestees: ['Violette'],
      genre: 'femme'
    };

    console.log('🎯 Test avec réponses utilisateur réelles:', reponsesTest);

    // Calculer les scores pour ces parfums
    const scoresDetailles = parfumsResult.docs.map((parfum: any) => {
      let familleData: FamillesOlfactive | undefined;
      if (typeof parfum.familleOlfactive === 'object' && parfum.familleOlfactive !== null) {
        familleData = parfum.familleOlfactive as FamillesOlfactive;
      }

      const scoring = ParfumScoringEngine.calculerScore(parfum as Parfum, reponsesTest, familleData);
      
      return {
        parfum: parfum.numeroParf,
        score: scoring.score,
        details: scoring.details,
        donnees: {
          genre: parfum.genre,
          famillePrincipale: parfum.famillePrincipale,
          familleSecondaire: parfum.familleSecondaire,
          occasion: parfum.occasion,
          noteTete: parfum.noteTete,
          noteCoeur: parfum.noteCoeur,
          noteFond: parfum.noteFond
        }
      };
    });

    res.json({
      success: true,
      message: 'Analyse des données de debug',
      data: {
        totalParfums: parfumsResult.totalDocs,
        echantillon: analyseDonnees,
        reponsesTest,
        scoresDetailles,
        problemesPotentiels: [
          'Vérifier si les familles olfactives correspondent',
          'Vérifier si les notes sont bien parsées',
          'Vérifier le filtrage par genre'
        ]
      }
    });

  } catch (error) {
    console.error('Erreur debug:', error);
    res.status(500).json({ error: (error as Error).message });
  }
};

/**
 * Endpoint pour obtenir des recommandations de parfums basées sur le questionnaire
 * POST /api/conseiller/recommandations
 */
export const getRecommandations = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log('🎯 Début du scoring des parfums - Conseiller Virtuel');
    
    if (!req.payload) {
      return res.status(500).json({
        success: false,
        message: 'Payload non initialisé',
        error: 'Configuration incorrecte'
      });
    }

    // Validation des données d'entrée
    const reponses: QuestionnaireReponses = req.body;
    
    if (!reponses.famillesOlfactives || !reponses.genre) {
      return res.status(400).json({
        success: false,
        message: 'Données du questionnaire incomplètes',
        error: 'famillesOlfactives et genre sont requis'
      });
    }

    console.log('📊 Réponses questionnaire reçues:', {
      famillesOlfactives: reponses.famillesOlfactives,
      notesAimees: reponses.notesAimees || [],
      notesDetestees: reponses.notesDetestees || [],
      genre: reponses.genre
    });

    // 1. Récupérer tous les parfums disponibles
    const parfumsResult = await req.payload.find({
      collection: 'parfums',
      limit: 0, // Récupérer tous les parfums
      depth: 2 // Peupler les relations
    });

    console.log(`📦 ${parfumsResult.totalDocs} parfums trouvés dans la base`);

    if (parfumsResult.totalDocs === 0) {
      return res.status(404).json({
        success: false,
        message: 'Aucun parfum trouvé dans la base de données',
        recommendations: []
      });
    }

    // 2. Filtrer d'abord par genre pour optimiser
    const parfumsFiltres = (parfumsResult.docs as unknown as Parfum[]).filter(parfum => {
      const genreParfum = parfum.genre;
      switch (reponses.genre) {
        case 'homme':
          return genreParfum !== 'F'; // Exclure les parfums femme
        case 'femme':
          return genreParfum !== 'H'; // Exclure les parfums homme  
        case 'mixte':
          return genreParfum === 'U'; // Uniquement les parfums mixtes
        default:
          return true;
      }
    });

    console.log(`🎯 Après filtrage genre: ${parfumsFiltres.length} parfums compatibles sur ${parfumsResult.totalDocs}`);

    // 3. Calculer les scores pour chaque parfum compatible
    const parfumsAvecScore: ParfumAvecScore[] = [];
    let parfumsCompatibles = 0;
    let parfumsIncompatibles = 0;
    let scoresDebug: any[] = [];

    for (const parfum of parfumsFiltres) {
      try {
        // Obtenir les données de famille olfactive si c'est un objet populé
        let familleData: FamillesOlfactive | undefined;
        if (typeof parfum.familleOlfactive === 'object' && parfum.familleOlfactive !== null) {
          familleData = parfum.familleOlfactive as FamillesOlfactive;
        }

        const scoring = ParfumScoringEngine.calculerScore(parfum, reponses, familleData);
        parfumsAvecScore.push(scoring);

        // Debug pour les premiers parfums
        if (scoresDebug.length < 5) {
          scoresDebug.push({
            parfum: parfum.numeroParf,
            score: scoring.score,
            details: scoring.details,
            donnees: {
              genre: parfum.genre,
              famillePrincipale: parfum.famillePrincipale,
              familleSecondaire: parfum.familleSecondaire,
              occasion: parfum.occasion,
              noteTete: parfum.noteTete?.substring(0, 100),
              noteCoeur: parfum.noteCoeur?.substring(0, 100),
              noteFond: parfum.noteFond?.substring(0, 100)
            }
          });
        }

        if (scoring.details.genreCompatible) {
          parfumsCompatibles++;
        } else {
          parfumsIncompatibles++;
        }

      } catch (error) {
        console.error(`Erreur scoring parfum ${parfum.numeroParf}:`, error);
        // Continuer avec les autres parfums
      }
    }

    console.log(`🎯 Résultats scoring: ${parfumsCompatibles} compatibles, ${parfumsIncompatibles} incompatibles`);
    console.log('🔍 Échantillon scores debug:', scoresDebug);

    // 3. Trier et filtrer les meilleurs parfums
    const meilleursParfums = ParfumScoringEngine.trierParfumsParScore(
      parfumsAvecScore, 
      15, // Seuil minimum raisonnable
      10 // Top 10 seulement
    );

    // 4. Catégoriser les recommandations
    const categories = ParfumScoringEngine.categoriserRecommandations(parfumsAvecScore);

    console.log('📈 Répartition des scores:', {
      parfaites: categories.parfaites.length,
      bonnes: categories.bonnes.length,
      faibles: categories.faibles.length,
      inadaptees: categories.inadaptees.length,
      scoreMoyen: meilleursParfums.length > 0 ? 
        Math.round(meilleursParfums.reduce((sum, p) => sum + p.score, 0) / meilleursParfums.length) : 0
    });

    // 5. Préparer la réponse avec moins d'informations pour l'utilisateur
    const response = {
      success: true,
      message: `Analyse terminée`,
      data: {
        recommendations: meilleursParfums.slice(0, 10).map(item => ({
          parfum: {
            id: item.parfum.id,
            numeroParf: item.parfum.numeroParf,
            inspiration: item.parfum.inspiration,
            genre: item.parfum.genre,
            intensite: item.parfum.intensite,
            prix: item.parfum.prix,
            slug: item.parfum.slug,
            image: item.parfum.image,
            description1: item.parfum.description1,
            famillePrincipale: item.parfum.famillePrincipale,
            familleSecondaire: item.parfum.familleSecondaire,
            occasion: item.parfum.occasion,
            noteTete: item.parfum.noteTete,
            noteCoeur: item.parfum.noteCoeur,
            noteFond: item.parfum.noteFond,
            aPropos: item.parfum.aPropos,
            ConseilExpertise: item.parfum.ConseilExpertise
          },
          score: item.score,
          niveau: item.score >= 80 ? 'parfait' : 
                  item.score >= 60 ? 'bon' : 
                  item.score >= 40 ? 'acceptable' : 'faible',
          details: item.details
        })),
        statistiques: {
          totalAnalyses: parfumsResult.totalDocs,
          totalCompatibles: parfumsCompatibles,
          categories: {
            parfaites: categories.parfaites.length,
            bonnes: categories.bonnes.length,
            acceptables: categories.faibles.length
          },
          scoreMoyen: meilleursParfums.length > 0 ? 
            Math.round(meilleursParfums.reduce((sum, p) => sum + p.score, 0) / meilleursParfums.length) : 0
        },
        preferences: {
          famillesOlfactives: reponses.famillesOlfactives,
          notesAimees: reponses.notesAimees || [],
          notesEvitees: reponses.notesDetestees || [],
          genre: reponses.genre
        }
      }
    };

    console.log('✅ Recommandations générées avec succès');
    res.status(200).json(response);

  } catch (error) {
    console.error('Erreur lors de la génération des recommandations:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne lors du calcul des recommandations',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Erreur interne'
    });
  }
};

/**
 * Endpoint pour tester le système de scoring avec des données d'exemple
 * GET /api/conseiller/test-scoring
 */
export const testScoring = async (req: ExtendedRequest, res: Response) => {
  try {
    if (!req.payload) {
      return res.status(500).json({
        success: false,
        message: 'Payload non initialisé'
      });
    }

    // Données de test selon l'exemple du plan
    const reponsesTest: QuestionnaireReponses = {
      famillesOlfactives: ['floral', 'oriental'],
      notesAimees: ['Jasmin', 'Vanille', 'Rose'],
      notesDetestees: ['Patchouli'],
      genre: 'femme'
    };

    console.log('🧪 Test du système de scoring avec données d\'exemple');

    // Récupérer quelques parfums pour le test
    const parfumsTest = await req.payload.find({
      collection: 'parfums',
      limit: 10,
      depth: 2
    });

    if (parfumsTest.totalDocs === 0) {
      return res.status(404).json({
        success: false,
        message: 'Aucun parfum pour le test'
      });
    }

    const resultatsTest = (parfumsTest.docs as unknown as Parfum[]).map(parfum => {
      let familleData: FamillesOlfactive | undefined;
      if (typeof parfum.familleOlfactive === 'object' && parfum.familleOlfactive !== null) {
        familleData = parfum.familleOlfactive as FamillesOlfactive;
      }

      return ParfumScoringEngine.calculerScore(parfum, reponsesTest, familleData);
    });

    const meilleurs = ParfumScoringEngine.trierParfumsParScore(resultatsTest, 0, 10);

    res.status(200).json({
      success: true,
      message: 'Test du scoring réalisé',
      data: {
        reponsesTest,
        resultats: meilleurs.map(r => ({
          parfum: r.parfum.numeroParf,
          inspiration: r.parfum.inspiration,
          score: r.score,
          details: r.details
        }))
      }
    });

  } catch (error) {
    console.error('Erreur lors du test de scoring:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du test',
      error: (error as Error).message
    });
  }
}; 