import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as apiService from '../../services/apiService';
import LogService from '../../services/logService';

// Mock pour axios et LogService
jest.mock('../../services/logService');
const mockAxios = new MockAdapter(axios);

describe('apiService', () => {
  // Réinitialiser les mocks avant chaque test
  beforeEach(() => {
    mockAxios.reset();
    jest.clearAllMocks();
    process.env = {
      ...process.env,
      NEXT_PUBLIC_SERVER_URL: 'http://test-api.example.com',
      NEXT_PUBLIC_API_TIMEOUT: '5000',
      NEXT_PUBLIC_MAX_API_RETRIES: '2',
    };
  });

  afterEach(() => {
    process.env = { ...process.env };
  });

  describe('validateApiUrl', () => {
    it('devrait utiliser l\'URL de l\'environnement si elle est valide', () => {
      // Réinitialiser le module pour forcer la réévaluation des variables d'environnement
      jest.resetModules();
      const apiServiceReimport = require('../../services/apiService');
      expect(apiServiceReimport.API_URL).toBe('http://test-api.example.com');
    });

    it('devrait utiliser l\'URL par défaut si l\'URL d\'environnement est manquante', () => {
      // Supprimer la variable d'environnement
      delete process.env.NEXT_PUBLIC_SERVER_URL;
      jest.resetModules();
      
      const apiServiceReimport = require('../../services/apiService');
      expect(apiServiceReimport.API_URL).toBe('http://localhost:3002');
      expect(LogService.warn).toHaveBeenCalledWith(
        expect.stringContaining('n\'est pas défini')
      );
    });

    it('devrait utiliser l\'URL par défaut si l\'URL d\'environnement est invalide', () => {
      process.env.NEXT_PUBLIC_SERVER_URL = 'invalid-url';
      jest.resetModules();
      
      const apiServiceReimport = require('../../services/apiService');
      expect(apiServiceReimport.API_URL).toBe('http://localhost:3002');
      expect(LogService.error).toHaveBeenCalledWith(
        expect.stringContaining('contient une URL invalide'),
        'invalid-url'
      );
    });
  });

  describe('sanitizeErrorDetails', () => {
    it('devrait masquer les informations sensibles dans les objets', () => {
      const sensitiveData = {
        username: 'user123',
        password: 'secret123',
        api_key: 'key-12345',
        data: {
          token: 'sensitive-token',
          regular: 'not-sensitive'
        }
      };

      const sanitized = apiService['sanitizeErrorDetails'](sensitiveData);
      
      expect(sanitized.username).toBe('user123');
      expect(sanitized.password).toBe('[REDACTED]');
      expect(sanitized.api_key).toBe('[REDACTED]');
      expect(sanitized.data.token).toBe('[REDACTED]');
      expect(sanitized.data.regular).toBe('not-sensitive');
    });
  });

  describe('fetchData', () => {
    it('devrait retourner les données correctement en cas de succès', async () => {
      const mockData = { id: 1, name: 'Test' };
      mockAxios.onGet('/api/test').reply(200, mockData);

      const result = await apiService.fetchData('/api/test');
      
      expect(result.data).toEqual(mockData);
      expect(result.error).toBeNull();
    });

    it('devrait gérer les erreurs réseau correctement', async () => {
      mockAxios.onGet('/api/test').networkError();

      const result = await apiService.fetchData('/api/test');
      
      expect(result.data).toBeNull();
      expect(result.error).toHaveProperty('isNetworkError', true);
      expect(result.error?.message).toContain('Impossible de se connecter');
    });

    it('devrait retourner une valeur par défaut en cas d\'erreur si fournie', async () => {
      mockAxios.onGet('/api/test').networkError();
      const defaultValue = { id: 0, name: 'Default' };

      const result = await apiService.fetchData('/api/test', {}, defaultValue);
      
      expect(result.data).toEqual(defaultValue);
      expect(result.error).toHaveProperty('isNetworkError', true);
    });
  });

  describe('Retry mechanism', () => {
    it('devrait réessayer automatiquement en cas d\'erreur réseau', async () => {
      // Échoue la première fois, réussit la deuxième
      mockAxios.onGet('/api/retry-test')
        .replyOnce(500)
        .onGet('/api/retry-test')
        .reply(200, { success: true });

      const result = await apiService.fetchData('/api/retry-test');
      
      expect(result.data).toEqual({ success: true });
      expect(result.error).toBeNull();
      expect(LogService.warn).toHaveBeenCalledWith(
        expect.stringContaining('Tentative 1/2 échouée')
      );
    });

    it('devrait abandonner après le nombre maximal de tentatives', async () => {
      // Échoue toujours
      mockAxios.onGet('/api/fail-test').reply(500);

      const result = await apiService.fetchData('/api/fail-test');
      
      expect(result.data).toBeNull();
      expect(result.error).toHaveProperty('isServerError', true);
      expect(result.error?.retryCount).toBe(2);
      expect(LogService.warn).toHaveBeenCalledTimes(2);
    });
  });
}); 