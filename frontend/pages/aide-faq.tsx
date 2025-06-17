import Layout from '@/components/layout/Layout';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Interface pour les questions et réponses
interface FaqItem {
  question: string;
  answer: string;
}

// Données organisées par catégories
const faqData: Record<string, FaqItem[]> = {
  "Parfums": [
    {
      question: "Quelle est la différence entre vos parfums et les parfums de marque ?",
      answer: "Nos parfums sont fabriqués avec des ingrédients de haute qualité et une concentration élevée (20-25%) d'huiles essentielles, similaire aux parfums de marque. La principale différence est que nous utilisons un modèle de distribution direct, ce qui nous permet d'offrir des prix plus accessibles tout en maintenant une qualité exceptionnelle."
    },
    {
      question: "Combien de temps durent vos parfums sur la peau ?",
      answer: "Grâce à leur concentration élevée en huiles essentielles (20-25%), nos parfums offrent une tenue longue durée de 6 à 8 heures en moyenne. Certaines notes de fond peuvent persister jusqu'à 24 heures. La tenue peut varier selon le type de peau, l'hydratation et les conditions environnementales."
    },
    {
      question: "Comment choisir le parfum qui me convient ?",
      answer: "Nous vous recommandons d'utiliser notre guide de conseil en ligne qui vous aide à trouver les parfums correspondant à vos préférences olfactives. Vous pouvez également commander des échantillons pour tester plusieurs parfums avant de faire votre choix final. N'hésitez pas à nous contacter pour un conseil personnalisé."
    },
    {
      question: "Vos parfums sont-ils testés sur les animaux ?",
      answer: "Non, aucun de nos parfums n'est testé sur les animaux. Nous sommes fermement engagés dans une démarche éthique et respectueuse du bien-être animal."
    }
  ],
  "Commandes": [
    {
      question: "Quel est le délai de livraison ?",
      answer: "Nos commandes sont généralement traitées sous 24 à 48h. Le délai de livraison varie ensuite selon le mode d'expédition choisi : 2-3 jours ouvrés pour la livraison standard en France métropolitaine, 1-2 jours ouvrés pour la livraison express. Pour l'international, comptez 5 à 10 jours ouvrés selon la destination."
    },
    {
      question: "Quels sont les modes de paiement acceptés ?",
      answer: "Nous acceptons les paiements par carte bancaire (Visa, Mastercard), PayPal, et virement bancaire. Tous nos paiements sont sécurisés pour garantir la protection de vos données."
    },
    {
      question: "Comment suivre ma commande ?",
      answer: "Dès l'expédition de votre commande, vous recevrez un email contenant un numéro de suivi et un lien vous permettant de suivre votre colis en temps réel sur le site du transporteur."
    },
    {
      question: "Puis-je modifier ou annuler ma commande ?",
      answer: "Vous pouvez modifier ou annuler votre commande tant qu'elle n'a pas été expédiée. Pour cela, contactez-nous dès que possible par email à service-client@latelierolfactifprive.fr ou par téléphone au 01 23 45 67 89."
    }
  ],
  "Retours": [
    {
      question: "Quelle est votre politique de retour ?",
      answer: "Nous acceptons les retours dans un délai de 14 jours suivant la réception de votre commande. Les produits doivent être non ouverts, non utilisés et dans leur emballage d'origine. Les frais de retour sont à la charge du client sauf en cas de produit défectueux ou d'erreur de notre part."
    },
    {
      question: "Comment effectuer un retour ?",
      answer: "Pour effectuer un retour, connectez-vous à votre compte client et suivez la procédure de retour, ou contactez notre service client par email. Nous vous communiquerons alors les instructions détaillées et l'adresse de retour. Une fois le colis reçu et vérifié, nous procéderons au remboursement."
    },
    {
      question: "Dans quel délai serai-je remboursé(e) ?",
      answer: "Une fois votre retour reçu et vérifié, le remboursement est généralement traité sous 3 à 5 jours ouvrés. Le délai de réception du remboursement sur votre compte dépend ensuite de votre banque (généralement 3 à 10 jours ouvrés supplémentaires)."
    },
    {
      question: "Que faire si j'ai reçu un produit défectueux ?",
      answer: "Si vous avez reçu un produit défectueux, contactez-nous immédiatement par email avec des photos du produit et une description du problème. Nous vous proposerons soit un remplacement, soit un remboursement complet incluant les frais de retour."
    }
  ],
  "Abonnement": [
    {
      question: "Comment fonctionne l'abonnement découverte ?",
      answer: "Notre abonnement découverte vous permet de recevoir chaque mois un nouveau parfum sélectionné selon vos préférences. Lors de votre inscription, vous remplissez un profil olfactif qui nous permet de personnaliser vos envois. Vous pouvez suspendre ou annuler votre abonnement à tout moment."
    },
    {
      question: "Puis-je choisir les parfums que je reçois avec l'abonnement ?",
      answer: "Bien que les parfums soient principalement sélectionnés en fonction de votre profil olfactif, vous avez la possibilité de consulter la sélection du mois à venir et de la modifier si elle ne vous convient pas, ou de la sauter pour ce mois-là."
    },
    {
      question: "Comment modifier ou annuler mon abonnement ?",
      answer: "Vous pouvez gérer votre abonnement à tout moment en vous connectant à votre espace client. Vous y trouverez les options pour modifier vos préférences, suspendre temporairement ou annuler définitivement votre abonnement. Les modifications doivent être effectuées au moins 5 jours avant la date de renouvellement."
    },
    {
      question: "L'abonnement inclut-il des avantages exclusifs ?",
      answer: "Oui, les abonnés bénéficient de nombreux avantages : prix préférentiel sur les parfums, accès anticipé aux nouvelles collections, cadeaux surprises réguliers, et remises exclusives sur l'ensemble du catalogue. Vous recevez également un guide personnalisé avec chaque envoi."
    }
  ]
};

// Animation des sections
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface TabProps {
  selected: boolean;
}

interface DisclosureProps {
  open: boolean;
}

export default function FAQ() {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const categories = Object.keys(faqData);

  return (
    <Layout title="Aide & FAQ - CodeParfum.fr">
      <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* En-tête */}
          <FadeIn>
            <div className="text-center mb-16">
              <h1 className="text-4xl font-serif font-bold text-primary-900 mb-4">
                Centre d'Aide et FAQ
              </h1>
              <p className="text-lg text-primary-600 max-w-3xl mx-auto">
                Retrouvez les réponses aux questions fréquemment posées et découvrez comment nous pouvons vous aider.
              </p>
            </div>
          </FadeIn>

          {/* Recherche - Fonctionnalité à implémenter ultérieurement */}
          <FadeIn delay={0.1}>
            <div className="max-w-xl mx-auto mb-12">
              <div className="relative">
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-full py-3 px-6 pl-12 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Rechercher une question..."
                />
                <div className="absolute inset-y-0 left-4 flex items-center">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Onglets et FAQ */}
          <FadeIn delay={0.2}>
            <div className="max-w-4xl mx-auto">
              <Tab.Group selectedIndex={selectedCategory} onChange={setSelectedCategory}>
                <Tab.List className="flex space-x-2 rounded-xl bg-primary-50 p-1">
                  {categories.map((category) => (
                    <Tab
                      key={category}
                      className={({ selected }: TabProps) =>
                        classNames(
                          'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                          'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                          selected
                            ? 'bg-white text-blue-700 shadow'
                            : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                        )
                      }
                    >
                      {category}
                    </Tab>
                  ))}
                </Tab.List>

                <Tab.Panels className="mt-6">
                  {categories.map((category, idx) => (
                    <Tab.Panel
                      key={idx}
                      className="rounded-xl bg-white p-3"
                    >
                      <ul className="space-y-4">
                        {faqData[category].map((faq, index) => (
                          <li key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <Disclosure>
                              {({ open }: DisclosureProps) => (
                                <>
                                  <Disclosure.Button className="flex w-full justify-between bg-white px-4 py-4 text-left text-sm font-medium text-primary-900 hover:bg-primary-50 focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75">
                                    <span className="text-base font-medium">{faq.question}</span>
                                    <ChevronDownIcon
                                      className={`${
                                        open ? 'rotate-180 transform' : ''
                                      } h-5 w-5 text-primary-500`}
                                    />
                                  </Disclosure.Button>
                                  <Transition
                                    enter="transition duration-100 ease-out"
                                    enterFrom="transform scale-95 opacity-0"
                                    enterTo="transform scale-100 opacity-100"
                                    leave="transition duration-75 ease-out"
                                    leaveFrom="transform scale-100 opacity-100"
                                    leaveTo="transform scale-95 opacity-0"
                                  >
                                    <Disclosure.Panel className="px-4 pt-1 pb-4 text-gray-600">
                                      {faq.answer}
                                    </Disclosure.Panel>
                                  </Transition>
                                </>
                              )}
                            </Disclosure>
                          </li>
                        ))}
                      </ul>
                    </Tab.Panel>
                  ))}
                </Tab.Panels>
              </Tab.Group>
            </div>
          </FadeIn>

          {/* Contact supplémentaire */}
          <FadeIn delay={0.3}>
            <div className="mt-20 text-center">
              <h2 className="text-2xl font-serif font-medium text-primary-900 mb-4">
                Vous n'avez pas trouvé votre réponse ?
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Notre équipe de service client est disponible pour répondre à toutes vos questions 
                et vous aider dans votre parcours d'achat.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" 
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  Nous contacter
                </Link>
                <a href="tel:+33123456789"
                  className="inline-flex items-center justify-center px-5 py-3 border border-primary-600 text-base font-medium rounded-md shadow-sm text-primary-600 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  Appeler le service client
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </Layout>
  );
} 