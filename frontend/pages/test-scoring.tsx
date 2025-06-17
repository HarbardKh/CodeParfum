import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { ConseillerService } from '../src/services/conseiller';

const TestScoringPage = () => {
  const [resultatsTest, setResultatsTest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lancerTestScoring = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('🧪 Lancement du test de scoring...');
      const resultats = await ConseillerService.testerScoring();
      setResultatsTest(resultats);
      console.log('✅ Test terminé:', resultats);
    } catch (err) {
      console.error('❌ Erreur lors du test:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  };

  const testerAvecDonneesPersonnalisees = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const reponsesTest = {
        famillesOlfactives: ['floral', 'oriental'],
        notesAimees: ['Rose', 'Vanille', 'Jasmin'],
        notesDetestees: ['Patchouli'],
        occasion: 'soirée',
        genre: 'femme'
      };

      console.log('🎯 Test avec données personnalisées:', reponsesTest);
      const resultats = await ConseillerService.obtenirRecommandations(reponsesTest);
      setResultatsTest(resultats);
      console.log('✅ Recommandations reçues:', resultats);
    } catch (err) {
      console.error('❌ Erreur lors du test personnalisé:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              🧪 Test du Système de Scoring
            </h1>
            <p className="text-lg text-gray-600">
              Page de test pour vérifier le fonctionnement du système de scoring des parfums
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Actions de test</h2>
            <div className="space-y-4">
              <button
                onClick={lancerTestScoring}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Test en cours...' : '🔬 Test avec données d\'exemple'}
              </button>
              
              <button
                onClick={testerAvecDonneesPersonnalisees}
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Test en cours...' : '🎯 Test avec recommandations complètes'}
              </button>
            </div>
          </div>

          {isLoading && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-gray-600">Test en cours...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-red-800 mb-2">❌ Erreur</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {resultatsTest && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">📊 Résultats du test</h3>
              
              {resultatsTest.success ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800">✅ Test réussi</h4>
                    <p className="text-green-700">{resultatsTest.message}</p>
                  </div>

                  {resultatsTest.data && (
                    <div className="space-y-4">
                      {/* Statistiques générales */}
                      {resultatsTest.data.statistiques && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-semibold text-blue-800 mb-2">📈 Statistiques</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-600">
                                {resultatsTest.data.statistiques.totalCompatibles}
                              </div>
                              <div className="text-gray-600">Compatibles</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-green-600">
                                {resultatsTest.data.statistiques.categories?.parfaites || 0}
                              </div>
                              <div className="text-gray-600">Parfaites</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-600">
                                {resultatsTest.data.statistiques.categories?.bonnes || 0}
                              </div>
                              <div className="text-gray-600">Bonnes</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-purple-600">
                                {resultatsTest.data.statistiques.scoreMoyen}
                              </div>
                              <div className="text-gray-600">Score moyen</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Recommandations */}
                      {resultatsTest.data.recommendations && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-800 mb-3">
                            🎯 Top {resultatsTest.data.recommendations.length} Recommandations
                          </h4>
                          <div className="space-y-3">
                            {resultatsTest.data.recommendations.slice(0, 5).map((rec: any, index: number) => (
                              <div key={index} className="bg-white p-3 rounded border">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h5 className="font-medium text-gray-900">
                                      {rec.parfum.inspiration || `Parfum ${rec.parfum.numeroParf}`}
                                    </h5>
                                    <p className="text-sm text-gray-600">
                                      {rec.parfum.famillePrincipale} • {rec.parfum.genre === 'F' ? 'Femme' : rec.parfum.genre === 'H' ? 'Homme' : 'Mixte'}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-lg font-bold text-purple-600">
                                      {rec.score}/100
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {rec.niveau}
                                    </div>
                                  </div>
                                </div>
                                
                                {rec.details && (
                                  <div className="mt-2 text-xs text-gray-600 grid grid-cols-4 gap-2">
                                    <div>Familles: {rec.details.scoreFamilles}</div>
                                    <div>Notes+: {rec.details.scoreNotesAimees}</div>
                                    <div>Notes-: {rec.details.scoreNotesEvitees}</div>
                                    <div>Usage: {rec.details.scoreUsage}</div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Données brutes pour debug */}
                      <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <summary className="font-semibold text-gray-800 cursor-pointer">
                          🔍 Données brutes (debug)
                        </summary>
                        <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto">
                          {JSON.stringify(resultatsTest, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800">❌ Test échoué</h4>
                  <p className="text-red-700">{resultatsTest.message}</p>
                  {resultatsTest.error && (
                    <pre className="mt-2 text-xs bg-red-100 p-2 rounded">
                      {resultatsTest.error}
                    </pre>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TestScoringPage; 