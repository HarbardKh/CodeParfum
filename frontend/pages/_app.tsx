import "../styles/globals.css";
import type { AppProps } from "next/app";
import { CartProvider } from '@/context/CartContext';
import Head from 'next/head';
import { Montserrat, Playfair_Display, Inter } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={`${montserrat.variable} ${playfair.variable} ${inter.variable} font-sans`}>
        <Component {...pageProps} />
      </main>
    </CartProvider>
  )
} 