# Système de Scoring Intelligent - Conseiller Virtuel Chogan

## Vue d'ensemble

Le système de scoring intelligent a été implémenté selon le plan détaillé pour automatiser les recommandations de parfums basées sur les préférences utilisateur. Il analyse les réponses du questionnaire en 4 étapes et calcule un score de compatibilité pour chaque parfum de la base de données.

## Architecture

### Backend (`backend/src/`)

#### 1. Moteur de Scoring (`lib/parfum-scoring.ts`)
- **Classe principale** : `ParfumScoringEngine`
- **Algorithme** : Score sur 100 points selon 5 critères
- **Filtrage strict** : Exclusion par genre incompatible
- **Optimisations** : Tri et catégorisation automatiques

#### 2. API Endpoints (`routes/api/conseiller.ts`)
- `POST /api/conseiller/recommandations` : Analyse complète des préférences
- `GET /api/conseiller/test-scoring` : Test avec données d'exemple
- **Sécurité** : Protection CSRF, rate limiting, validation

#### 3. Intégration Routes (`routes/index.ts`)
- Routes ajoutées au système principal
- Middleware de sécurité appliqué
- Gestion des erreurs centralisée

### Frontend (`frontend/src/`)

#### 1. Service API (`services/conseiller.ts`)
- **ConseillerService** : Communication avec l'API backend
- **Gestion CSRF** : Récupération automatique des tokens
- **Formatage** : Utilitaires pour l'affichage des données
- **Types TypeScript** : Interfaces complètes

#### 2. Composant Résultats (`components/conseiller/ResultatsScoring.tsx`)
- **Affichage interactif** : Cartes de parfums avec scores
- **Modal détaillée** : Analyse complète de compatibilité
- **Animations** : Framer Motion pour l'UX
- **Responsive** : Design adaptatif mobile/desktop

#### 3. Intégration Questionnaire (`pages/conseillerVIP.tsx`)
- **Workflow complet** : Choix → Questionnaire → Scoring → Résultats
- **États React** : Gestion des données et du loading
- **Gestion d'erreurs** : Feedback utilisateur en cas de problème

## Algorithme de Scoring

### Critères d'évaluation (Total : 100 points)

1. **Familles Olfactives** (max 30 points)
   - +15 points par famille correspondante (max 2)
   - -10 points si aucune correspondance

2. **Notes Aimées** (max 30 points)
   - +6 points par note aimée présente
   - +6 bonus si 3+ notes aimées correspondent

3. **Notes à Éviter** (max -20 points)
   - -10 points si 1 note à éviter présente
   - -15 points si 2 notes à éviter présentes
   - -20 points si 3+ notes à éviter présentes

4. **Usage/Occasion** (max 10 points)
   - +10 points si usage correspond exactement
   - +5 points si usage compatible secondairement

5. **Genre** (Filtrage strict)
   - Exclusion automatique des parfums incompatibles
   - Homme : exclut les parfums Femme
   - Femme : exclut les parfums Homme
   - Mixte : uniquement les parfums Unisexe

### Barème d'interprétation

- **80-100** : Parfait pour vous (🎯)
- **60-79** : Très bon choix (👍)
- **40-59** : Choix acceptable (👌)
- **< 40** : Moins adapté (🤔)

## Utilisation

### 1. Questionnaire Utilisateur
```typescript
interface QuestionnaireReponses {
  famillesOlfactives: string[];  // 1-3 familles
  notesAimees: string[];         // 1-5 notes
  notesDetestees: string[];      // 1-5 notes
  occasion: string;              // Usage principal
  genre: string;                 // Homme/Femme/Mixte
}
```

### 2. Appel API
```typescript
const resultats = await ConseillerService.obtenirRecommandations(reponses);
```

### 3. Affichage Résultats
```typescript
<ResultatsScoring
  resultats={resultats}
  reponses={reponses}
  onRetour={retourAuQuestionnaire}
  onRecommencer={recommencerConseiller}
/>
```

## Tests

### Page de Test
- **URL** : `/test-scoring`
- **Fonctions** : Test avec données d'exemple et données personnalisées
- **Debug** : Affichage des données brutes et statistiques

### Tests Backend
```bash
# Test simple
GET /api/conseiller/test-scoring

# Test complet
POST /api/conseiller/recommandations
Content-Type: application/json
{
  "famillesOlfactives": ["floral", "oriental"],
  "notesAimees": ["Rose", "Vanille"],
  "notesDetestees": ["Patchouli"],
  "occasion": "soirée",
  "genre": "femme"
}
```

## Exemple de Calcul

### Profil Utilisateur
- **Familles** : Florale, Orientale
- **Notes aimées** : Jasmin, Vanille, Rose
- **Notes évitées** : Patchouli
- **Usage** : Rendez-vous
- **Genre** : Femme

### Parfum Analysé
- **Familles** : Florale, Fruitée
- **Notes** : Jasmin, Rose, Ambre
- **Genre** : Femme
- **Usage** : Rendez-vous, Quotidien

### Calcul du Score
- **Famille florale** : +15 points
- **Jasmin** : +6 points
- **Rose** : +6 points
- **Patchouli absent** : 0 points
- **Usage rendez-vous** : +10 points
- **Bonus 2+ notes aimées** : +6 points

**Score total** : 43/100 → Choix acceptable

## Optimisations Futures

1. **Boost manuel** : Parfums stars selon les ventes
2. **Machine Learning** : Amélioration des correspondances
3. **Filtrage stock** : Exclusion automatique des ruptures
4. **Personnalisation** : Historique des préférences utilisateur
5. **API GPT** : Génération de descriptions personnalisées

## Monitoring

### Logs Backend
- Nombre de parfums analysés
- Distribution des scores
- Temps de traitement
- Erreurs de scoring

### Métriques Frontend
- Taux de conversion questionnaire
- Satisfaction des recommandations
- Temps de session
- Abandons par étape

## Maintenance

### Mise à jour des données
- Synchronisation avec PayloadCMS
- Vérification des familles olfactives
- Validation des notes et occasions

### Performance
- Cache des résultats fréquents
- Optimisation des requêtes DB
- Pagination des résultats

---

**Status** : ✅ Implémenté et fonctionnel
**Version** : 1.0
**Date** : Décembre 2024 