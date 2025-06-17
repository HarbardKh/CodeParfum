/**
 * Script de test pour vérifier les améliorations de sécurité
 * 
 * Exécuter avec: npx ts-node src/scripts/security-check.ts
 */
import axios from 'axios';
import { setTimeout } from 'timers/promises';

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://projet-chogan-mvp.onrender.com'
  : 'http://localhost:3000';

const runTests = async () => {
  console.log('\n🔒 TEST DES AMÉLIORATIONS DE SÉCURITÉ 🔒\n');
  console.log(`API URL: ${API_URL}\n`);

  try {
    // Test 1: Route health - devrait fonctionner
    console.log('🧪 Test 1: Vérification de la route health...');
    const healthResponse = await axios.get(`${API_URL}/api/health`);
    console.log('✅ Route health OK:', healthResponse.data);
  } catch (error: any) {
    console.error('❌ Erreur route health:', error.response?.data || error.message);
  }

  try {
    // Test 2: Route sécurité sans token (devrait échouer avec 401)
    console.log('\n🧪 Test 2: Test route sécurité sans token (devrait échouer)...');
    await axios.get(`${API_URL}/api/security-check`);
    console.error('❌ ÉCHEC: La route devrait rejeter les requêtes sans token!');
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      console.log('✅ Protection OK: Rejet correct avec statut 401');
    } else {
      console.error('❌ Erreur inattendue:', error.response?.data || error.message);
    }
  }
  
  try {
    // Test 3: Route sécurité avec token valide
    console.log('\n🧪 Test 3: Test route sécurité avec token valide...');
    const securityResponse = await axios.get(`${API_URL}/api/security-check?token=valid-check`);
    console.log('✅ Route sécurité OK avec token:', securityResponse.data);
  } catch (error: any) {
    console.error('❌ Erreur route sécurité avec token:', error.response?.data || error.message);
  }

  try {
    // Test 4: Test de rate limiting
    console.log('\n🧪 Test 4: Test de rate limiting (10 requêtes rapides)...');
    
    // Type pour les résultats des requêtes
    type RequestResult = {
      status?: number;
      response?: { status?: number };
      isAxiosError?: boolean;
      data?: any;
    };
    
    // Créer un tableau de promesses typées
    const requests: Promise<RequestResult>[] = [];
    
    for (let i = 0; i < 10; i++) {
      // Convertir explicitement le résultat en RequestResult
      const request: Promise<RequestResult> = axios.get(`${API_URL}/api/health`)
        .then(response => ({
          status: response.status,
          data: response.data
        }))
        .catch((e): RequestResult => ({
          response: { status: e.response?.status },
          isAxiosError: true
        }));
        
      requests.push(request);
      // Petit délai pour ne pas surcharger
      await setTimeout(50);
    }
    
    const results = await Promise.all(requests);
    const success = results.filter(r => r.status === 200).length;
    const limited = results.filter(r => r.response?.status === 429).length;
    
    console.log(`Résultats: ${success} succès, ${limited} limitées par rate limiter`);
    console.log('Note: En environnement de développement, le rate limiter est moins strict');
  } catch (error: any) {
    console.error('❌ Erreur test rate limiting:', error.message);
  }

  console.log('\n📝 VÉRIFICATION DES EN-TÊTES HTTP 📝');

  try {
    // Test 5: Vérification des en-têtes de sécurité
    console.log('\n🧪 Test 5: Vérification des en-têtes de sécurité...');
    const response = await axios.get(`${API_URL}/api/health`, {
      validateStatus: () => true
    });
    
    const securityHeaders = [
      'x-content-type-options',
      'x-frame-options',
      'strict-transport-security',
      'x-xss-protection',
      'referrer-policy',
      'content-security-policy',
    ];
    
    console.log('En-têtes reçus:');
    const headersFound: string[] = [];
    
    for (const header of securityHeaders) {
      if (response.headers[header]) {
        headersFound.push(header);
        console.log(`✅ ${header}: ${response.headers[header]}`);
      } else {
        console.log(`❌ ${header}: Non trouvé`);
      }
    }
    
    console.log(`\nBilan: ${headersFound.length}/${securityHeaders.length} en-têtes de sécurité configurés`);
    console.log('Note: En production, davantage d\'en-têtes devraient être présents');
    
  } catch (error: any) {
    console.error('❌ Erreur vérification en-têtes:', error.message);
  }

  console.log('\n🎯 TESTS TERMINÉS 🎯');
};

runTests().catch(console.error);
