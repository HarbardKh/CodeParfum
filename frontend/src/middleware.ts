import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Récupère la réponse
  const response = NextResponse.next();
  
  // Ajout d'en-têtes de sécurité supplémentaires
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  
  return response;
}

// Applique le middleware à toutes les routes
export const config = {
  matcher: '/:path*',
};
