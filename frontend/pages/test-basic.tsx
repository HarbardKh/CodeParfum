import React from 'react';
import Head from 'next/head';

export default function TestBasic() {
  return (
    <div>
      <Head>
        <title>Test basique</title>
      </Head>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Page de test basique</h1>
        <p>Cette page ne contient aucun composant personnalisé ou dépendance complexe.</p>
        <p>Si cette page s'affiche correctement, le problème vient probablement d'un composant personnalisé.</p>
        
        <div style={{ margin: '20px 0', padding: '20px', border: '1px solid #eee' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>Parfums statiques</h2>
          <ul>
            {['Parfum A', 'Parfum B', 'Parfum C'].map((parfum, index) => (
              <li key={index} style={{ margin: '8px 0' }}>{parfum}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 