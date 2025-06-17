/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Désactiver trailingSlash pour éviter les problèmes de routing
  trailingSlash: false,
  // Configuration des en-têtes de sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options', 
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: process.env.NODE_ENV === 'production' ? 
                   "default-src 'self'; " +
                   "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
                   "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                   "img-src 'self' data: https://projet-chogan-mvp.onrender.com; " +
                   "font-src 'self' https://fonts.gstatic.com; " +
                   "connect-src 'self' https://projet-chogan-mvp.onrender.com; " +
                   "frame-src 'none'; " +
                   "object-src 'none';" :
                   ""
          },
        ],
      },
    ];
  },
  // Configuration améliorée des images
  images: {
    // Domaines autorisés pour les images externes - utilisation des variables d'environnement
    domains: process.env.IMAGE_DOMAINS 
      ? process.env.IMAGE_DOMAINS.split(',') 
      : ['localhost', '127.0.0.1', 'projet-chogan-mvp.onrender.com', 'projet-chogan-b9ba147e8-harbardkhs-projects.vercel.app'],
    
    // Modèles de chemins distants plus précis
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3002',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'projet-chogan-mvp.onrender.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.chogan.fr',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.vercel.app',
        pathname: '/**',
      }
    ],
    
    // TEMPORAIRE: Désactiver l'optimisation des images pour résoudre les erreurs 422
    unoptimized: true,
    
    // Configuration des formats d'image
    formats: ['image/webp', 'image/avif'],
    
    // Configuration du cache d'images
    deviceSizes: [320, 480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    
    // Dossier de sortie des images optimisées
    path: '/_next/image',
    
    // Désactiver le comportement de chargement progressif par défaut
    // pour que nous puissions le contrôler avec notre composant SafeImage
    loader: 'default',
    loaderFile: '',
    
    // Minimiser l'impact sur le bundle size
    minimumCacheTTL: 60,
    
    // Gérer correctement les erreurs d'image
    dangerouslyAllowSVG: false,
  },
  // Configurer le dossier des pages
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Configuration pour PayloadCMS
  webpack: (config) => {
    config.module.rules.push({
      test: /\.json$/,
      type: 'json',
    });
    
    // Requis pour PayloadCMS
    config.externals = [...(config.externals || []), 'canvas', 'jsdom'];
    
    return config;
  },
  // Configuration pour les routes API de PayloadCMS
  async rewrites() {
    return [
      {
        source: '/admin/:path*',
        destination: '/api/payload/admin/:path*',
      },
      {
        source: '/api/payload/:path*',
        destination: '/api/payload/:path*',
      },
    ];
  },
  // Les variables d'environnement sont gérées par les fichiers .env et .env.production
  // ou via la console Vercel pour la production
}

module.exports = nextConfig
