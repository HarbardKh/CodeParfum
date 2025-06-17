// Mocks pour l'environnement Next.js
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    query: {},
    pathname: '',
    route: '',
    asPath: '',
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
  }),
}));

// Mock des variables d'environnement
process.env = {
  ...process.env,
  // Valeurs de test par défaut
  NEXT_PUBLIC_SERVER_URL: 'http://localhost:3002',
  NEXT_PUBLIC_LOG_LEVEL: '0',
};

// Extensions Jest globales
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
})); 