import { generateConseil, UserPreferences, Perfume } from '../../services/conseilService';
import * as apiService from '../../services/apiService';
import LogService from '../../services/logService';

// Mock des dépendances
jest.mock('../../services/apiService');
jest.mock('../../services/logService');

describe('conseilService', () => {
  // Réinitialiser les mocks avant chaque test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Données de test
  const mockPerfumes: Perfume[] = [
    {
      id: '1',
      name: 'Parfum Test 1',
      reference: 'REF001',
      gender: 'Homme',
      famille_olfactive: 'Boisé',
      intensite: 'Forte',
      description: 'Description du parfum test 1'
    },
    {
      id: '2',
      name: 'Parfum Test 2',
      reference: 'REF002',
      gender: 'Femme',
      famille_olfactive: 'Floral',
      intensite: 'Moyenne',
      description: 'Description du parfum test 2'
    }
  ];

  const mockUserPrefs: UserPreferences = {
    parfumHabitude: 'Boisé',
    familles: ['Boisé', 'Oriental'],
    intensite: 'Forte',
    occasions: ['Soirée']
  };

  describe('validateInputs', () => {
    it('devrait rejeter une liste de parfums vide', async () => {
      const result = await generateConseil([], mockUserPrefs);
      
      expect(result.conseil).toBeUndefined();
      expect(result.error).toContain('Aucun parfum sélectionné');
      expect(LogService.warn).toHaveBeenCalled();
    });

    it('devrait rejeter une liste de plus de 8 parfums', async () => {
      // Créer 9 parfums (dépasse la limite de 8)
      const tooManyPerfumes = Array(9).fill(null).map((_, index) => ({
        ...mockPerfumes[0],
        id: `${index}`,
        reference: `REF00${index}`
      }));
      
      const result = await generateConseil(tooManyPerfumes, mockUserPrefs);
      
      expect(result.conseil).toBeUndefined();
      expect(result.error).toContain('Trop de parfums');
      expect(LogService.warn).toHaveBeenCalled();
    });

    it('devrait rejeter des parfums avec des informations manquantes', async () => {
      const invalidPerfumes = [
        { ...mockPerfumes[0], reference: '' }
      ];
      
      const result = await generateConseil(invalidPerfumes, mockUserPrefs);
      
      expect(result.conseil).toBeUndefined();
      expect(result.error).toContain('Informations de parfum incomplètes');
    });

    it('devrait rejeter des préférences utilisateur invalides', async () => {
      const result = await generateConseil(mockPerfumes, null as any);
      
      expect(result.conseil).toBeUndefined();
      expect(result.error).toContain('Préférences utilisateur invalides');
    });
  });

  describe('generateConseil', () => {
    it('devrait tronquer les descriptions longues des parfums', async () => {
      // Mock de postData pour capturer les données envoyées
      const postDataMock = jest.spyOn(apiService, 'postData').mockResolvedValueOnce({
        data: { conseil: 'Conseil test' },
        error: null
      });
      
      // Parfum avec une description de plus de 100 caractères
      const perfumeWithLongDesc = {
        ...mockPerfumes[0],
        description: 'a'.repeat(150)
      };
      
      await generateConseil([perfumeWithLongDesc], mockUserPrefs);
      
      // Vérifier que les données envoyées ont une description tronquée
      const sentData = postDataMock.mock.calls[0][1];
      expect(sentData.filteredPerfumes[0].description.length).toBe(100);
    });

    it('devrait retourner le conseil en cas de succès', async () => {
      // Mock de postData pour simuler une réponse réussie
      jest.spyOn(apiService, 'postData').mockResolvedValueOnce({
        data: { conseil: 'Conseil personnalisé test' },
        error: null
      });
      
      const result = await generateConseil(mockPerfumes, mockUserPrefs);
      
      expect(result.conseil).toBe('Conseil personnalisé test');
      expect(result.error).toBeUndefined();
      expect(LogService.info).toHaveBeenCalledWith('Conseil personnalisé généré avec succès');
    });

    it('devrait réessayer en cas d\'erreur réseau', async () => {
      // Mock de postData pour simuler une erreur réseau puis une réussite
      jest.spyOn(apiService, 'postData')
        .mockResolvedValueOnce({
          data: null,
          error: { 
            status: 0, 
            message: 'Erreur réseau', 
            isNetworkError: true 
          }
        })
        .mockResolvedValueOnce({
          data: { conseil: 'Conseil après retry' },
          error: null
        });
      
      const result = await generateConseil(mockPerfumes, mockUserPrefs);
      
      expect(result.conseil).toBe('Conseil après retry');
      expect(result.error).toBeUndefined();
      expect(LogService.warn).toHaveBeenCalledWith(expect.stringContaining('Tentative 1/2'));
    });

    it('devrait abandonner après le nombre maximal de tentatives', async () => {
      // Mock de postData pour simuler des erreurs réseau persistantes
      jest.spyOn(apiService, 'postData').mockResolvedValue({
        data: null,
        error: { 
          status: 0, 
          message: 'Erreur réseau', 
          isNetworkError: true 
        }
      });
      
      const result = await generateConseil(mockPerfumes, mockUserPrefs);
      
      expect(result.conseil).toBeUndefined();
      expect(result.error).toContain('Échec de la génération du conseil après');
      expect(LogService.warn).toHaveBeenCalledTimes(2); // 2 tentatives de retry
    });

    it('ne devrait pas réessayer pour les erreurs non-réseau', async () => {
      // Mock de postData pour simuler une erreur de validation (400)
      jest.spyOn(apiService, 'postData').mockResolvedValueOnce({
        data: null,
        error: { 
          status: 400, 
          message: 'Erreur de validation' 
        }
      });
      
      const result = await generateConseil(mockPerfumes, mockUserPrefs);
      
      expect(result.conseil).toBeUndefined();
      expect(result.error).toBe('Erreur de validation');
      expect(LogService.error).toHaveBeenCalled();
      expect(LogService.warn).not.toHaveBeenCalled(); // Pas de retry
    });
  });
}); 