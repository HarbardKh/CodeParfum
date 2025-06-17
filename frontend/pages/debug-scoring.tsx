import React, { useState, useEffect } from 'react';
import Head from 'next/head';

interface DebugData {
  success: boolean;
  message: string;
  data: {
    totalParfums: number;
    echantillon: any[];
    reponsesTest: any;
    scoresDetailles: any[];
    problemesPotentiels: string[];
  };
}

const DebugScoringPage: React.FC = () => {
  const [debugData, setDebugData] = useState<DebugData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDebugData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3002/api/conseiller/debug-data');
      const data = await response.json();
      
      if (data.success) {
        setDebugData(data);
        console.log('🔍 Données de debug:', data);
      } else {
        setError(data.message || 'Erreur lors du debug');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error('Erreur debug:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebugData();
  }, []);

  return (
    <>
      <Head>
        <title>Debug Système de Scoring - Chogan</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              🔍 Debug Système de Scoring
            </h1>
            
            <button
              onClick={fetchDebugData}
              disabled={loading}
              className="mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Analyse en cours...' : 'Relancer l\'analyse'}
            </button>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                <strong>Erreur:</strong> {error}
              </div>
            )}

            {debugData && (
              <div className="space-y-6">
                {/* Résumé */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">📊 Résumé</h2>
                  <p><strong>Total parfums:</strong> {debugData.data.totalParfums}</p>
                  <p><strong>Échantillon analysé:</strong> {debugData.data.echantillon.length}</p>
                </div>

                {/* Réponses de test */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">🎯 Réponses de test</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <strong>Familles olfactives:</strong> {debugData.data.reponsesTest.famillesOlfactives.join(', ')}
                    </div>
                    <div>
                      <strong>Notes aimées:</strong> {debugData.data.reponsesTest.notesAimees.join(', ')}
                    </div>
                    <div>
                      <strong>Notes évitées:</strong> {debugData.data.reponsesTest.notesDetestees.join(', ')}
                    </div>
                    <div>
                      <strong>Occasion:</strong> {debugData.data.reponsesTest.occasion}
                    </div>
                    <div>
                      <strong>Genre:</strong> {debugData.data.reponsesTest.genre}
                    </div>
                  </div>
                </div>

                {/* Échantillon de données */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">📦 Échantillon de données</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-4 py-2 text-left">Parfum</th>
                          <th className="px-4 py-2 text-left">Genre</th>
                          <th className="px-4 py-2 text-left">Famille Principale</th>
                          <th className="px-4 py-2 text-left">Occasion</th>
                          <th className="px-4 py-2 text-left">Notes Tête</th>
                        </tr>
                      </thead>
                      <tbody>
                        {debugData.data.echantillon.map((parfum, index) => (
                          <tr key={index} className="border-b">
                            <td className="px-4 py-2">{parfum.numeroParf}</td>
                            <td className="px-4 py-2">{parfum.genre}</td>
                            <td className="px-4 py-2">{parfum.famillePrincipale}</td>
                            <td className="px-4 py-2">{parfum.occasion}</td>
                            <td className="px-4 py-2 text-sm">{parfum.noteTete}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Scores détaillés */}
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">🎯 Scores détaillés</h2>
                  <div className="space-y-4">
                    {debugData.data.scoresDetailles.map((score, index) => (
                      <div key={index} className="bg-white p-4 rounded border">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-semibold">Parfum {score.parfum}</h3>
                          <span className={`px-3 py-1 rounded text-white ${
                            score.score >= 80 ? 'bg-green-500' :
                            score.score >= 60 ? 'bg-blue-500' :
                            score.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}>
                            Score: {score.score}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <strong>Détails du scoring:</strong>
                            <ul className="mt-1">
                              <li>Familles: {score.details.scoreFamilles}</li>
                              <li>Notes aimées: {score.details.scoreNotesAimees}</li>
                              <li>Notes évitées: {score.details.scoreNotesEvitees}</li>
                              <li>Usage: {score.details.scoreUsage}</li>
                              <li>Genre compatible: {score.details.genreCompatible ? '✅' : '❌'}</li>
                            </ul>
                          </div>
                          
                          <div>
                            <strong>Données parfum:</strong>
                            <ul className="mt-1">
                              <li>Genre: {score.donnees.genre}</li>
                              <li>Famille: {score.donnees.famillePrincipale}</li>
                              <li>Occasion: {score.donnees.occasion}</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Problèmes potentiels */}
                <div className="bg-red-50 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">⚠️ Problèmes potentiels</h2>
                  <ul className="list-disc list-inside space-y-1">
                    {debugData.data.problemesPotentiels.map((probleme, index) => (
                      <li key={index}>{probleme}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DebugScoringPage; 