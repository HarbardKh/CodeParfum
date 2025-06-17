import type { Parfum, FamillesOlfactive } from '../payload-types';

export interface QuestionnaireReponses {
  famillesOlfactives: string[]; // IDs des familles préférées (1-3)
  notesAimees: string[]; // Notes aimées (1-5) 
  notesDetestees: string[]; // Notes à éviter (1-5)
  genre: string; // Genre recherché (homme/femme/mixte)
}

export interface ParfumAvecScore {
  parfum: Parfum;
  score: number;
  details: {
    scoreFamilles: number;
    scoreNotesAimees: number;
    scoreNotesEvitees: number;
    scoreUsage: number;
    genreCompatible: boolean;
  };
}

/**
 * Système de scoring intelligent pour recommandations de parfums
 * Score sur 100 points selon le plan:
 * - Familles olfactives: max 30 points
 * - Notes aimées: max 30 points
 * - Notes à éviter: max -20 points (pénalité)
 * - Usage: max 10 points
 * - Genre: filtrage strict (exclusion)
 */
export class ParfumScoringEngine {
  
  /**
   * Calcule le score d'un parfum selon les préférences utilisateur
   */
  static calculerScore(
    parfum: Parfum, 
    reponses: QuestionnaireReponses, 
    familleData?: FamillesOlfactive
  ): ParfumAvecScore {
    
    // 1. Vérification genre (filtrage strict)
    const genreCompatible = this.verifierGenreCompatible(parfum, reponses.genre);
    if (!genreCompatible) {
      return {
        parfum,
        score: 0,
        details: {
          scoreFamilles: 0,
          scoreNotesAimees: 0,
          scoreNotesEvitees: 0,
          scoreUsage: 0,
          genreCompatible: false
        }
      };
    }

    // 2. Score familles olfactives (max 30 points)
    const scoreFamilles = this.calculerScoreFamilles(parfum, reponses.famillesOlfactives, familleData);
    
    // 3. Score notes aimées (max 30 points)
    const scoreNotesAimees = this.calculerScoreNotesAimees(parfum, reponses.notesAimees);
    
    // 4. Score notes à éviter (max -20 points)
    const scoreNotesEvitees = this.calculerScoreNotesEvitees(parfum, reponses.notesDetestees);
    
    // 5. Score usage - désactivé car plus d'occasion dans le questionnaire
    const scoreUsage = 0;
    
    const scoreTotal = Math.max(0, scoreFamilles + scoreNotesAimees + scoreNotesEvitees + scoreUsage);
    
    return {
      parfum,
      score: Math.min(100, scoreTotal), // Plafonnement à 100
      details: {
        scoreFamilles,
        scoreNotesAimees,
        scoreNotesEvitees,
        scoreUsage,
        genreCompatible: true
      }
    };
  }

  /**
   * Filtrage strict par genre selon le plan
   */
  private static verifierGenreCompatible(parfum: Parfum, genreRecherche: string): boolean {
    const genreParfum = parfum.genre;
    
    switch (genreRecherche) {
      case 'homme':
        return genreParfum !== 'F'; // Exclure les parfums femme
      case 'femme':
        return genreParfum !== 'H'; // Exclure les parfums homme  
      case 'mixte':
        return genreParfum === 'U'; // Uniquement les parfums mixtes
      default:
        return true;
    }
  }

  /**
   * Score familles olfactives (max 30 points)
   * +15 points par famille correspondante (max 2)
   * -10 points si aucune correspondance
   */
  private static calculerScoreFamilles(
    parfum: Parfum, 
    famillesPreferees: string[], 
    familleData?: FamillesOlfactive
  ): number {
    const famillesParfum = [parfum.famillePrincipale, parfum.familleSecondaire]
      .filter(f => f && f.trim() !== '')
      .map(f => f.toLowerCase().trim());
    
    let correspondances = 0;
    
    // Mapping des familles pour améliorer les correspondances
    const familleMapping: {[key: string]: string[]} = {
      'floral': ['floral', 'florale', 'fleur', 'rose', 'jasmin', 'muguet'],
      'florale': ['floral', 'florale', 'fleur', 'rose', 'jasmin', 'muguet'],
      'oriental': ['oriental', 'orientale', 'épicé', 'vanille', 'ambre', 'ambré', 'ambrée'],
      'orientale': ['oriental', 'orientale', 'épicé', 'vanille', 'ambre', 'ambré', 'ambrée'],
      'boisé': ['boisé', 'boisée', 'bois', 'cèdre', 'santal'],
      'boisée': ['boisé', 'boisée', 'bois', 'cèdre', 'santal'],
      'hespéridé': ['hespéridé', 'hespéridée', 'agrume', 'citrus', 'bergamote', 'citron'],
      'hespéridée': ['hespéridé', 'hespéridée', 'agrume', 'citrus', 'bergamote', 'citron'],
      'frais': ['frais', 'fraîche', 'aquatique', 'marin', 'ozonic'],
      'fraîche': ['frais', 'fraîche', 'aquatique', 'marin', 'ozonic'],
      'fougere': ['fougère', 'fougere', 'aromatique', 'lavande', 'herbes'],
      'fougère': ['fougère', 'fougere', 'aromatique', 'lavande', 'herbes'],
      'aromatique': ['aromatique', 'fougère', 'fougere', 'herbes', 'lavande', 'thym', 'basilic'],
      'fruité': ['fruité', 'fruitée', 'fruit', 'pomme', 'pêche', 'poire']
    };
    
    for (const famillePref of famillesPreferees) {
      const famillePrefNorm = famillePref.toLowerCase().trim();
      
      // Obtenir les synonymes de la famille préférée
      const synonymes = familleMapping[famillePrefNorm] || [famillePrefNorm];
      
      // Vérification famille principale/secondaire avec synonymes
      for (const synonyme of synonymes) {
        if (famillesParfum.some(fp => fp.includes(synonyme) || synonyme.includes(fp))) {
          correspondances++;
          break; // Une seule correspondance par famille préférée
        }
      }
      
      // Vérification avec les données de famille olfactive si disponible
      if (familleData && typeof parfum.familleOlfactive === 'object') {
        const nomFamilleParfum = (parfum.familleOlfactive as FamillesOlfactive).nom?.toLowerCase();
        if (nomFamilleParfum) {
          for (const synonyme of synonymes) {
            if (nomFamilleParfum.includes(synonyme) || synonyme.includes(nomFamilleParfum)) {
              correspondances++;
              break;
            }
          }
        }
      }
    }
    
    correspondances = Math.min(2, correspondances); // Max 2 correspondances
    
    if (correspondances === 0) {
      return -10; // Pénalité aucune correspondance
    }
    
    return correspondances * 15; // 15 points par correspondance
  }

  /**
   * Score notes aimées (max 30 points)
   * +6 points par note aimée présente
   * +6 bonus si 3+ notes aimées présentes
   */
  private static calculerScoreNotesAimees(parfum: Parfum, notesAimees: string[]): number {
    if (notesAimees.length === 0) return 0;
    
    const notesParfum = this.extraireNotesParfum(parfum);
    let notesCorrespondantes = 0;
    
    for (const noteAimee of notesAimees) {
      const noteNorm = noteAimee.toLowerCase().trim();
      if (notesParfum.some(np => np.includes(noteNorm) || noteNorm.includes(np))) {
        notesCorrespondantes++;
      }
    }
    
    let score = notesCorrespondantes * 6;
    
    // Bonus si 3+ notes aimées correspondent
    if (notesCorrespondantes >= 3) {
      score += 6;
    }
    
    return Math.min(30, score); // Plafonnement à 30
  }

  /**
   * Score notes à éviter (max -20 points de pénalité)
   * -10 points si 1 note à éviter présente
   * -15 points si 2 notes à éviter présentes  
   * -20 points si 3+ notes à éviter présentes
   */
  private static calculerScoreNotesEvitees(parfum: Parfum, notesDetestees: string[]): number {
    if (notesDetestees.length === 0) return 0;
    
    const notesParfum = this.extraireNotesParfum(parfum);
    let notesEviteesPresentes = 0;
    
    for (const noteDetestee of notesDetestees) {
      const noteNorm = noteDetestee.toLowerCase().trim();
      if (notesParfum.some(np => np.includes(noteNorm) || noteNorm.includes(np))) {
        notesEviteesPresentes++;
      }
    }
    
    if (notesEviteesPresentes === 0) return 0;
    if (notesEviteesPresentes === 1) return -10;
    if (notesEviteesPresentes === 2) return -15;
    return -20; // 3+ notes à éviter
  }

  /**
   * Extrait toutes les notes d'un parfum (tête, cœur, fond)
   */
  private static extraireNotesParfum(parfum: Parfum): string[] {
    const notes: string[] = [];
    
    if (parfum.noteTete) {
      notes.push(...this.parseNotes(parfum.noteTete));
    }
    if (parfum.noteCoeur) {
      notes.push(...this.parseNotes(parfum.noteCoeur));
    }
    if (parfum.noteFond) {
      notes.push(...this.parseNotes(parfum.noteFond));
    }
    
    return notes.map(n => n.toLowerCase().trim());
  }

  /**
   * Parse les notes depuis une chaîne de caractères
   */
  private static parseNotes(notesString: string): string[] {
    if (!notesString || notesString.trim() === '') return [];
    
    return notesString
      .split(/[,;\/\-]/) // Séparateurs multiples
      .map(note => note.trim())
      .filter(note => note.length > 0);
  }

  /**
   * Trie et filtre les parfums selon les scores
   * Retourne uniquement les parfums avec score >= seuilMinimum
   */
  static trierParfumsParScore(
    parfumsAvecScore: ParfumAvecScore[], 
    seuilMinimum: number = 60,
    limite: number = 10
  ): ParfumAvecScore[] {
    return parfumsAvecScore
      .filter(p => p.score >= seuilMinimum)
      .sort((a, b) => b.score - a.score)
      .slice(0, limite);
  }

  /**
   * Catégorise les parfums par niveau de recommandation
   */
  static categoriserRecommandations(parfumsAvecScore: ParfumAvecScore[]): {
    parfaites: ParfumAvecScore[]; // 80-100
    bonnes: ParfumAvecScore[]; // 60-79  
    faibles: ParfumAvecScore[]; // 40-59
    inadaptees: ParfumAvecScore[]; // < 40
  } {
    return {
      parfaites: parfumsAvecScore.filter(p => p.score >= 80),
      bonnes: parfumsAvecScore.filter(p => p.score >= 60 && p.score < 80),
      faibles: parfumsAvecScore.filter(p => p.score >= 40 && p.score < 60),
      inadaptees: parfumsAvecScore.filter(p => p.score < 40)
    };
  }
}