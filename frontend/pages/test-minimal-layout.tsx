import React from 'react';
import MinimalLayout from '../components/MinimalLayout';

export default function TestMinimalLayout() {
  return (
    <MinimalLayout title="Test avec layout minimal">
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Test avec layout minimal</h1>
      <p>Cette page utilise un composant de layout minimal sans fonctionnalités complexes.</p>
      
      <div style={{ marginTop: '30px', padding: '15px', border: '1px solid #eee' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Liste d'éléments simples</h2>
        <ul>
          {['Élément 1', 'Élément 2', 'Élément 3'].map((item, index) => (
            <li key={index} style={{ margin: '5px 0' }}>{item}</li>
          ))}
        </ul>
      </div>
    </MinimalLayout>
  );
} 