import type { Parfum } from '../payload-types';

export interface QuestionnaireReponses {
  famillesOlfactives: string[];
  notesAimees: string[];
  notesDetestees: string[];
  genre: string;
}

export interface ParfumAvecScore {
  parfum: Parfum;
  score: number;
  details: {
    scoreFamilles: number;
    scoreNotes: number;
    filtreGenre: boolean;
  };
}

/**
 * Moteur de scoring pour les recommandations de parfums.
 * Score total sur 100 points.
 * - Filtre Genre: Éliminatoire.
 * - Score Familles: max 40 points.
 * - Score Notes: max 60 points (incluant pénalités).
 */
export class ParfumScoringEngine {

  /**
   * Orchestrateur principal du calcul de score.
   */
  static calculerScore(parfum: Parfum, reponses: QuestionnaireReponses): ParfumAvecScore {
    const details = {
      scoreFamilles: 0,
      scoreNotes: 0,
      filtreGenre: false,
    };

    // 1. Filtre éliminatoire par genre
    if (!this.verifierGenreCompatible(parfum, reponses.genre)) {
      return { parfum, score: 0, details };
    }
    details.filtreGenre = true;

    // 2. Calcul du score des familles olfactives (max 40 pts)
    details.scoreFamilles = this.calculerScoreFamilles(parfum, reponses.famillesOlfactives);

    // 3. Calcul du score des notes (max 60 pts, incluant pénalités)
    details.scoreNotes = this.calculerScoreNotes(parfum, reponses.notesAimees, reponses.notesDetestees);

    const scoreTotal = details.scoreFamilles + details.scoreNotes;

    return {
      parfum,
      score: Math.max(0, Math.min(100, Math.round(scoreTotal))), // Score final entre 0 et 100
      details,
    };
  }

  /**
   * Filtre strict par genre.
   */
  private static verifierGenreCompatible(parfum: Parfum, genreRecherche: string): boolean {
    const genreParfum = parfum.genre?.toUpperCase();
    switch (genreRecherche) {
      case 'homme':
        return genreParfum !== 'F'; // Exclut les parfums purement Femme
      case 'femme':
        return genreParfum !== 'H'; // Exclut les parfums purement Homme
      case 'mixte':
        return genreParfum === 'U'; // Uniquement les parfums Unisexe
      default:
        return true; // Si pas de genre spécifié, on n'exclut rien
    }
  }

  /**
   * Calcule le score basé sur les familles principale et secondaire.
   * Max 40 points.
   */
  private static calculerScoreFamilles(parfum: Parfum, famillesPreferees: string[]): number {
    let score = 0;
    const famillesNormalisees = famillesPreferees.map(f => f.toLowerCase().trim());

    const famillePrincipale = parfum.famillePrincipale?.toLowerCase().trim();
    const familleSecondaire = parfum.familleSecondaire?.toLowerCase().trim();

    // +25 points pour la famille principale
    if (famillePrincipale && famillesNormalisees.includes(famillePrincipale)) {
      score += 25;
    }

    // +15 points pour la famille secondaire
    if (familleSecondaire && famillesNormalisees.includes(familleSecondaire)) {
      score += 15;
    }

    return score;
  }

  /**
   * Calcule le score basé sur les notes aimées et détestées.
   * Score pondéré par type de note (tête, coeur, fond).
   * Max 60 points.
   */
  private static calculerScoreNotes(parfum: Parfum, notesAimees: string[], notesDetestees: string[]): number {
    let score = 0;
    const notesAimeesNorm = notesAimees.map(n => n.toLowerCase().trim());
    const notesDetesteesNorm = notesDetestees.map(n => n.toLowerCase().trim());

    const notesTete = this.parseAndNormalizeNotes(parfum.noteTete);
    const notesCoeur = this.parseAndNormalizeNotes(parfum.noteCoeur);
    const notesFond = this.parseAndNormalizeNotes(parfum.noteFond);

    // --- Score notes aimées ---
    const scoreTete = notesTete.filter(note => notesAimeesNorm.includes(note)).length * 3;
    const scoreCoeur = notesCoeur.filter(note => notesAimeesNorm.includes(note)).length * 5;
    const scoreFond = notesFond.filter(note => notesAimeesNorm.includes(note)).length * 5;
    
    score += scoreTete + scoreCoeur + scoreFond;

    // --- Pénalité notes détestées ---
    const penaliteTete = notesTete.filter(note => notesDetesteesNorm.includes(note)).length * 10;
    const penaliteCoeur = notesCoeur.filter(note => notesDetesteesNorm.includes(note)).length * 10;
    const penaliteFond = notesFond.filter(note => notesDetesteesNorm.includes(note)).length * 10;
    
    const totalPenalite = Math.min(20, penaliteTete + penaliteCoeur + penaliteFond); // Malus max de -20
    score -= totalPenalite;

    return Math.min(60, score); // Plafonnement à 60 points pour les notes
  }

  /**
   * Transforme une chaîne de notes en un tableau de notes normalisées.
   * Ex: "Citron, Menthe - Rose" -> ['citron', 'menthe', 'rose']
   */
  private static parseAndNormalizeNotes(notesString: string | null | undefined): string[] {
    if (!notesString) return [];
    return notesString
      .split(/[,/–-]/) // Sépare par virgule, slash, tiret long et court
      .map(note => note.trim().toLowerCase())
      .filter(note => note.length > 0);
  }

  /**
   * Trie les parfums par score décroissant et applique un seuil.
   */
  static trierParfumsParScore(
    parfumsAvecScore: ParfumAvecScore[],
    seuilMinimum: number = 40,
    limite: number = 10
  ): ParfumAvecScore[] {
    return parfumsAvecScore
      .filter(p => p.score >= seuilMinimum)
      .sort((a, b) => b.score - a.score)
      .slice(0, limite);
  }

  /**
   * Catégorise les recommandations en niveaux de pertinence.
   */
  static categoriserRecommandations(parfumsAvecScore: ParfumAvecScore[]): {
    parfaites: ParfumAvecScore[]; // >= 80
    bonnes: ParfumAvecScore[];   // 60-79
    faibles: ParfumAvecScore[];  // 40-59
    inadaptees: ParfumAvecScore[];// < 40
  } {
    const parfaites = parfumsAvecScore.filter(p => p.score >= 80);
    const bonnes = parfumsAvecScore.filter(p => p.score >= 60 && p.score < 80);
    const faibles = parfumsAvecScore.filter(p => p.score >= 40 && p.score < 60);
    const inadaptees = parfumsAvecScore.filter(p => p.score < 40);

    return { parfaites, bonnes, faibles, inadaptees };
  }
}