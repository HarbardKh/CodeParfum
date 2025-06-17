# 🧪 Guide des Tests

## Introduction

Ce document décrit le système de tests mis en place pour le frontend de CodeParfum.fr. Les tests sont essentiels pour garantir la fiabilité et la robustesse de notre application, en particulier pour les fonctionnalités critiques comme les appels API et la gestion des erreurs.

## Installation et configuration

Le projet utilise Jest et Testing Library pour les tests unitaires et d'intégration.

### Dépendances principales:

- **Jest**: Framework de test principal
- **ts-jest**: Support pour TypeScript
- **@testing-library/react**: Utilitaires pour tester les composants React
- **axios-mock-adapter**: Pour mocker les appels axios dans les tests

### Configuration:

La configuration Jest se trouve dans:
- `jest.config.js`: Configuration principale de Jest
- `setupTests.js`: Configuration globale exécutée avant chaque test

## Exécution des tests

```bash
# Exécuter tous les tests
npm test

# Exécuter les tests en mode watch (pratique pendant le développement)
npm run test:watch

# Générer un rapport de couverture
npm run test:coverage
```

## Structure des tests

Les tests suivent une structure en miroir de l'application, dans le dossier `src/__tests__/`:

```
src/
├── __tests__/
│   ├── components/
│   │   └── [tests des composants]
│   └── services/
│       ├── apiService.test.ts
│       └── conseilService.test.ts
```

## Tests des services API

### apiService.test.ts

Ce fichier teste le service API central, notamment:

1. **Validation des variables d'environnement**:
   - Gestion de l'URL API manquante ou invalide
   - Valeurs par défaut sécurisées

2. **Sanitization des données sensibles**:
   - Masquage des informations comme les mots de passe et API keys

3. **Mécanisme de retry**:
   - Retry automatique sur les erreurs réseau
   - Backoff exponentiel
   - Abandon après le nombre maximum de tentatives

### conseilService.test.ts

Tests pour le service de conseils personnalisés:

1. **Validation des entrées**:
   - Rejet des listes de parfums vides ou trop grandes (>8)
   - Validation des données parfums et préférences utilisateur

2. **Préparation des données**:
   - Troncature des descriptions trop longues
   - Sélection des champs pertinents uniquement

3. **Gestion des erreurs et retry**:
   - Retry sur erreurs réseau/timeout
   - Abandon après les tentatives maximum
   - Pas de retry sur erreurs de validation (4xx)

## Bonnes pratiques

1. **Isolation**: Chaque test doit être indépendant et ne pas affecter les autres tests
2. **Mocks**: Utiliser des mocks pour les dépendances externes (API, localStorage, etc.)
3. **Couverture**: Viser une couverture de code élevée pour les fonctions critiques
4. **Test AAA**: Suivre le pattern Arrange-Act-Assert
   ```typescript
   // Arrange (préparer les données et mocks)
   const mockData = { ... };
   mockAxios.onGet('/api/test').reply(200, mockData);
   
   // Act (exécuter l'action à tester)
   const result = await apiService.fetchData('/api/test');
   
   // Assert (vérifier les résultats)
   expect(result.data).toEqual(mockData);
   ```

## Ajout de nouveaux tests

Pour ajouter de nouveaux tests:

1. Créer un fichier `.test.ts` ou `.test.tsx` correspondant au fichier testé
2. Importer les fonctions/composants à tester
3. Utiliser `describe()` pour regrouper les tests liés
4. Utiliser `it()` ou `test()` pour chaque cas de test individuel
5. Utiliser `expect()` pour les assertions

Exemple:
```typescript
import { myFunction } from '../path/to/file';

describe('myFunction', () => {
  it('devrait retourner X quand Y', () => {
    const result = myFunction(Y);
    expect(result).toBe(X);
  });
});
```

## CI/CD

Les tests sont automatiquement exécutés dans le pipeline CI lors des pull requests. Une pull request ne peut être fusionnée que si tous les tests passent. 