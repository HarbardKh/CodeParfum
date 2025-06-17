import { useEffect } from 'react';
import { useRouter } from 'next/router';

// Ce composant redirige simplement vers la page conseillerVIP principale
export default function ConseillerVIPRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirection côté client vers la page conseillerVIP
    router.push('/conseillerVIP');
  }, [router]);

  // Retourne un composant de chargement en attendant la redirection
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Redirection en cours...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
}

// Également ajouter la redirection côté serveur
export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/conseillerVIP',
      permanent: true,
    },
  };
} 