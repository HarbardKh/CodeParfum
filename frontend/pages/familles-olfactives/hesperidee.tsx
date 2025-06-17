import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';

export default function FamilleHesperidee() {
  return (
    <Layout title="Famille Olfactive Hespéridée | CodeParfum.fr">
      {/* Bannière stylisée avec fond dégradé */}
      <div className="relative overflow-hidden bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-600 text-white">
        <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(#ffffff33_1px,transparent_1px)]" style={{ backgroundSize: '20px 20px' }}></div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 font-serif">
              Hespéridée
            </h1>
            <p className="text-xl md:text-2xl text-black leading-relaxed font-medium">
              La vitalité éclatante des agrumes en parfumerie
            </p>
          </motion.div>
        </div>
        
        {/* Vague décorative en bas de la bannière */}
        <div className="absolute bottom-0 left-0 right-0 text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" className="w-full h-auto">
            <path fill="currentColor" fillOpacity="1" d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,74.7C1120,75,1280,53,1360,42.7L1440,32L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <Link href="/familles-olfactives" className="inline-flex items-center text-amber-600 hover:text-amber-800 transition-colors group">
            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-100 mr-3 group-hover:bg-amber-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </span>
            <span className="font-medium">Retour aux familles olfactives</span>
          </Link>
        </div>

        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gradient-to-br from-amber-50 to-orange-50 p-10 md:p-12 rounded-2xl mb-16 shadow-lg relative overflow-hidden"
          >
            <div className="absolute -top-14 -right-14 w-28 h-28 rounded-full bg-amber-100 opacity-70 blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-orange-100 opacity-70 blur-2xl"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-serif text-amber-900 mb-6">L'éclat des agrumes</h2>
              <p className="text-lg md:text-xl leading-relaxed text-amber-950">
                La famille hespéridée, nommée d'après les légendaires jardins des Hespérides, est caractérisée par la fraîcheur solaire des agrumes. Évoquant la Méditerranée et les vergers ensoleillés, elle apporte luminosité, énergie et vivacité à la parfumerie.
              </p>
            </div>
          </motion.div>

          <div className="space-y-24">
            {/* Notes typiques */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-amber-100 relative overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-amber-100 opacity-30 blur-3xl"></div>
              <div className="flex flex-col md:flex-row md:items-start gap-8 relative z-10">
                <div className="md:mr-6 flex-shrink-0">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-200 to-yellow-300 shadow-lg flex items-center justify-center text-4xl mx-auto md:mx-0">
                    🍋
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-serif mb-6 text-amber-800">Notes typiques</h2>
                  <div className="flex flex-wrap gap-3">
                    {['Bergamote', 'Citron', 'Orange amère', 'Pamplemousse', 'Mandarine', 'Cédrat', 'Petit grain', 'Néroli'].map((note, index) => (
                      <span key={index} className="px-4 py-2 bg-amber-50 rounded-full text-amber-800 shadow-sm border border-amber-100 hover:shadow-md transition-shadow">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Pour qui */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 md:p-10 rounded-2xl bg-gradient-to-br from-amber-50 via-amber-50 to-orange-50 shadow-xl relative overflow-hidden"
            >

              <div className="flex flex-col md:flex-row md:items-start gap-8 relative z-10">
                <div className="md:mr-6 flex-shrink-0">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 shadow-lg flex items-center justify-center text-4xl mx-auto md:mx-0">
                    👥
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-serif mb-6 text-amber-800">Pour qui ?</h2>
                  <p className="text-lg text-amber-900">
                    Ces parfums s'adressent aux amateurs de fraîcheur naturelle, d'énergie et de légèreté. Unisexes par excellence, ils séduisent les personnalités dynamiques, optimistes et solaires, ainsi que ceux qui recherchent une signature olfactive rafraîchissante et revigorante.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Quand la porter */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-amber-100 relative overflow-hidden"
            >
              <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-amber-100 opacity-30 blur-3xl"></div>
              <div className="flex flex-col md:flex-row md:items-start gap-8 relative z-10">
                <div className="md:mr-6 flex-shrink-0">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-200 to-yellow-300 shadow-lg flex items-center justify-center text-4xl mx-auto md:mx-0">
                    🕒
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-serif mb-6 text-amber-800">Quand la porter ?</h2>
                  <p className="text-lg text-amber-900">
                    Parfaite pour l'été et les climats chauds, cette famille s'exprime magnifiquement en journée et est idéale pour le bureau, le sport ou les occasions décontractées. Certaines compositions plus sophistiquées, enrichies de notes aromatiques ou boisées, conviennent également aux soirées estivales.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Sous-familles */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 md:p-10 rounded-2xl bg-gradient-to-br from-amber-50 via-amber-50 to-orange-50 shadow-xl relative overflow-hidden"
            >

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-center mb-10">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-200 to-yellow-300 shadow-lg flex items-center justify-center text-4xl mb-4 md:mb-0 md:mr-6">
                    🍊
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif text-amber-800 text-center md:text-left">
                    Sous-familles hespéridées
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "Hespéridé aromatique",
                      description: "Notes de romarin, lavande, thym",
                      icon: "🌿"
                    },
                    {
                      title: "Hespéridé boisé",
                      description: "Notes de vétiver, cèdre, santal",
                      icon: "🌳"
                    },
                    {
                      title: "Eau de Cologne",
                      description: "Composition traditionnelle de citrus rafraîchissants",
                      icon: "💦"
                    },
                    {
                      title: "Hespéridé épicé",
                      description: "Notes de gingembre, cardamome, poivre rose",
                      icon: "🌶️"
                    }
                  ].map((subfamily, index) => (
                    <div key={index} className="bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-amber-100 group">
                      <div className="p-6 md:p-8">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-2xl mr-4 group-hover:bg-amber-200 transition-colors">
                            {subfamily.icon}
                          </div>
                          <h3 className="text-xl font-medium text-amber-800">{subfamily.title}</h3>
                        </div>
                        <p className="text-amber-700">{subfamily.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Ce que cette famille évoque */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-amber-100 relative overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-amber-100 opacity-30 blur-3xl"></div>
              <div className="flex flex-col md:flex-row md:items-start gap-8 relative z-10">
                <div className="md:mr-6 flex-shrink-0">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-200 to-yellow-300 shadow-lg flex items-center justify-center text-4xl mx-auto md:mx-0">
                    💬
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-serif mb-6 text-amber-800">Ce que cette famille évoque</h2>
                  <p className="text-lg text-amber-900">
                    Un verger méditerranéen baigné de soleil, une brise fraîche sur la Côte d'Azur, le pétillement d'un matin d'été. Les hespéridés évoquent la lumière, la joie de vivre et une élégance intemporelle.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Le mot du parfumeur */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-amber-600 to-orange-600 text-white p-8 md:p-10 rounded-2xl shadow-xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff33_1px,transparent_1px)]" style={{ backgroundSize: '20px 20px' }}></div>

              <div className="relative z-10">
                <div className="w-24 h-24 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center mb-8 mx-auto md:mx-0">
                  <span className="text-5xl">✨</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-serif mb-6 md:ml-28 -mt-16 md:text-left text-center">Le mot du parfumeur</h2>
                <blockquote className="text-xl italic font-serif text-white/90 md:ml-28">
                  "Les hespéridés sont l'incarnation de la lumière en parfumerie. Leur zeste pétillant et leur jus acidulé créent une sensation immédiate de bien-être et d'optimisme. Leur fraîcheur fugace nous rappelle que la beauté est souvent éphémère, mais toujours intense."
                </blockquote>
              </div>
            </motion.div>

            {/* CTA pour explorer les parfums */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 md:p-12 rounded-2xl text-center my-16 shadow-xl relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-amber-100 opacity-70 blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-orange-100 opacity-70 blur-3xl"></div>
              <div className="mx-auto relative z-10">
                <div className="w-20 h-20 rounded-full mx-auto mb-8 bg-gradient-to-br from-amber-300 to-orange-300 shadow-lg flex items-center justify-center">
                  <span className="text-4xl">🔍</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-serif mb-6 text-amber-900">Découvrez nos parfums hespéridés</h2>
                <p className="text-lg md:text-xl mb-10 text-amber-800 mx-auto">
                  Explorez notre collection de parfums qui célèbrent l'éclat et la fraîcheur des agrumes, pour une expérience olfactive énergisante et rafraîchissante.
                </p>
                <Link href="/catalogue?famille=hesperidee" className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-full shadow-xl text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-300">
                  <span className="mr-2">Voir les parfums hespéridés</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Section des autres familles */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-32 mb-32"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-center mb-16 text-amber-900">Explorer d'autres familles olfactives</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Florale",
                  description: "Notes de rose, jasmin, fleur d'oranger...",
                  icon: "🌸",
                  href: "/familles-olfactives/florale",
                  color: "pink"
                },
                {
                  title: "Orientale",
                  description: "Notes de vanille, ambre, épices, résines...",
                  icon: "🕌",
                  href: "/familles-olfactives/orientale",
                  color: "amber"
                },
                {
                  title: "Boisée",
                  description: "Notes de cèdre, santal, vétiver, patchouli...",
                  icon: "🌳",
                  href: "/familles-olfactives/boisee",
                  color: "emerald"
                }
              ].map((family, index) => (
                <Link key={index} href={family.href} className="block group">
                  <div className={`bg-gradient-to-br from-${family.color}-50 to-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2 border border-${family.color}-100 h-full`}>
                    <div className="p-8 h-full flex flex-col">
                      <div className={`w-20 h-20 rounded-full bg-${family.color}-100 flex items-center justify-center mb-6 mx-auto group-hover:bg-${family.color}-200 transition-colors duration-300`}>
                        <span className="text-4xl">{family.icon}</span>
                      </div>
                      <h3 className={`text-2xl font-medium mb-4 text-${family.color}-800 text-center`}>{family.title}</h3>
                      <p className="text-gray-600 text-center flex-grow">{family.description}</p>
                      <div className="mt-6 text-center">
                        <span className={`inline-flex items-center text-${family.color}-600 group-hover:text-${family.color}-800 transition-colors`}>
                          Découvrir
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-16">
              <Link href="/guide-conseil/familles-olfactives" className="inline-flex items-center px-8 py-4 border border-amber-300 shadow-lg text-lg font-medium rounded-full text-amber-800 bg-white hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-300 transform hover:scale-105">
                <span>Voir toutes les familles olfactives</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </motion.div>

          {/* Conseiller VIP CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-32 mb-16 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-800 to-indigo-700 rounded-3xl"></div>
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff33_1px,transparent_1px)]" style={{ backgroundSize: '20px 20px' }}></div>

            <div className="relative z-10 text-center p-12 md:p-16">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center mx-auto mb-8"
              >
                <span className="text-6xl">✨</span>
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-serif mb-8 text-white">Quelle famille olfactive vous correspond ?</h2>
              <p className="text-xl mb-10 text-white/90 mx-auto leading-relaxed">
                Utilisez notre conseiller virtuel pour découvrir votre profil olfactif et recevoir des recommandations personnalisées adaptées à vos goûts et à votre personnalité.
              </p>
              <Link href="/conseiller-vip" className="inline-flex items-center px-10 py-5 border border-transparent text-xl font-medium rounded-full shadow-2xl text-purple-900 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-all duration-300 transform hover:scale-105">
                <span className="mr-2 font-semibold">Essayer notre conseiller VIP</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
} 