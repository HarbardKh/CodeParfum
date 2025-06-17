import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

// Types pour le formulaire Smart Order
interface FormData {
  email: string;
  name: string;  // prénom
  surname: string;  // nom de famille
  country: string;
  shippingAddress: string;
  postalCode: string;
  province: string;
  town: string;
  diallingCode: string;  // indicatif téléphonique
  phone: string;
}

export default function SmartOrderPage() {
  const router = useRouter();
  const { cart, totalPrice, clearCart } = useCart();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    surname: '',
    country: 'France',
    shippingAddress: '',
    postalCode: '',
    province: '',
    town: '',
    diallingCode: '+33',
    phone: '',
  });
  
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Vérifier si le panier est vide
  useEffect(() => {
    if (cart.length === 0) {
      router.push('/panier');
    }
  }, [cart, router]);

  // Gérer les changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name as keyof FormData]: value }));
    // Effacer l'erreur lorsque l'utilisateur modifie le champ
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name as keyof FormData]: undefined }));
    }
  };

  // Valider le formulaire Smart Order
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    // Validation des champs obligatoires du Smart Order
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    if (!formData.name.trim()) newErrors.name = 'Le prénom est requis';
    if (!formData.surname.trim()) newErrors.surname = 'Le nom est requis';
    // Le pays est toujours 'France'
    if (!formData.shippingAddress.trim()) newErrors.shippingAddress = 'L\'adresse est requise';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Le code postal est requis';
    if (!formData.province.trim()) newErrors.province = 'Le département est requis';
    if (!formData.town.trim()) newErrors.town = 'La ville est requise';
    // L'indicatif est toujours '+33'
    if (!formData.phone.trim()) newErrors.phone = 'Le téléphone est requis';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumettre la commande et rediriger vers Chogan
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    
    // Simuler l'envoi des données au formulaire Smart Order de Chogan
    setIsLoading(true);
    setTimeout(() => {
      // Construction de l'URL de redirection vers le site Chogan avec votre lien affilié
      // Note: Ceci est un exemple - remplacez URL_CHOGAN_SMART_ORDER et VOTRE_LIEN_AFFILIE par les valeurs réelles
      const choganSmartOrderUrl = 'https://chogan.it/smart-order'; // À remplacer par l'URL réelle
      const affiliateLink = 'votre-code-affilié'; // À remplacer par votre code affilié réel
      
      // Création des paramètres pour l'URL
      const params = new URLSearchParams({
        email: formData.email,
        name: formData.name,
        surname: formData.surname,
        country: formData.country,
        shippingAddress: formData.shippingAddress,
        postalCode: formData.postalCode,
        province: formData.province,
        town: formData.town,
        diallingCode: formData.diallingCode,
        phone: formData.phone,
        affiliate: affiliateLink,
        // Inclure les informations du panier
        items: JSON.stringify(cart.map(item => ({ id: item.id, quantity: item.quantity })))
      });
      
      // Effacer le panier après la commande
      clearCart();
      
      // Redirection vers Chogan avec les données du formulaire
      // Note: Dans un environnement de production, il serait préférable d'utiliser une API côté serveur pour sécuriser cette transmission
      const redirectUrl = `${choganSmartOrderUrl}?${params.toString()}`;
      router.push(redirectUrl);
    }, 1500);
  };

  // Formatter les prix en euros
  const formatPrice = (price: number) => {
    return price.toFixed(2).replace('.', ',') + ' €';
  };

  return (
    <Layout title="Smart Order - Codeparfum">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-primary-900 mb-8">Smart Order Chogan</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Informations Smart Order</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="md:col-span-1">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      E-MAIL *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        errors.email ? 'border-red-300' : ''
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-1">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      PRÉNOM *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        errors.name ? 'border-red-300' : ''
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-1">
                    <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-1">
                      NOM *
                    </label>
                    <input
                      type="text"
                      id="surname"
                      name="surname"
                      value={formData.surname}
                      onChange={handleChange}
                      className={`block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        errors.surname ? 'border-red-300' : ''
                      }`}
                    />
                    {errors.surname && (
                      <p className="mt-1 text-sm text-red-600">{errors.surname}</p>
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    PAYS *
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value="France"
                    readOnly
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-gray-100"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="md:col-span-3">
                    <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700 mb-1">
                      ADRESSE DE LIVRAISON *
                    </label>
                    <input
                      type="text"
                      id="shippingAddress"
                      name="shippingAddress"
                      value={formData.shippingAddress}
                      onChange={handleChange}
                      className={`block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        errors.shippingAddress ? 'border-red-300' : ''
                      }`}
                    />
                    {errors.shippingAddress && (
                      <p className="mt-1 text-sm text-red-600">{errors.shippingAddress}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-1">
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                      CODE POSTAL *
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className={`block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        errors.postalCode ? 'border-red-300' : ''
                      }`}
                    />
                    {errors.postalCode && (
                      <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="md:col-span-1">
                    <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">
                      DÉPARTEMENT *
                    </label>
                    <select
                      id="province"
                      name="province"
                      value={formData.province}
                      onChange={handleChange}
                      className={`block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        errors.province ? 'border-red-300' : ''
                      }`}
                    >
                      <option value="">Sélectionnez...</option>
                      <option value="01">01 - Ain</option>
                      <option value="02">02 - Aisne</option>
                      <option value="03">03 - Allier</option>
                      <option value="04">04 - Alpes-de-Haute-Provence</option>
                      <option value="05">05 - Hautes-Alpes</option>
                      <option value="06">06 - Alpes-Maritimes</option>
                      <option value="07">07 - Ardèche</option>
                      <option value="08">08 - Ardennes</option>
                      <option value="09">09 - Ariège</option>
                      <option value="10">10 - Aube</option>
                      <option value="11">11 - Aude</option>
                      <option value="12">12 - Aveyron</option>
                      <option value="13">13 - Bouches-du-Rhône</option>
                      <option value="14">14 - Calvados</option>
                      <option value="15">15 - Cantal</option>
                      <option value="16">16 - Charente</option>
                      <option value="17">17 - Charente-Maritime</option>
                      <option value="18">18 - Cher</option>
                      <option value="19">19 - Corrèze</option>
                      <option value="2A">2A - Corse-du-Sud</option>
                      <option value="2B">2B - Haute-Corse</option>
                      <option value="21">21 - Côte-d'Or</option>
                      <option value="22">22 - Côtes-d'Armor</option>
                      <option value="23">23 - Creuse</option>
                      <option value="24">24 - Dordogne</option>
                      <option value="25">25 - Doubs</option>
                      <option value="26">26 - Drôme</option>
                      <option value="27">27 - Eure</option>
                      <option value="28">28 - Eure-et-Loir</option>
                      <option value="29">29 - Finistère</option>
                      <option value="30">30 - Gard</option>
                      <option value="31">31 - Haute-Garonne</option>
                      <option value="32">32 - Gers</option>
                      <option value="33">33 - Gironde</option>
                      <option value="34">34 - Hérault</option>
                      <option value="35">35 - Ille-et-Vilaine</option>
                      <option value="36">36 - Indre</option>
                      <option value="37">37 - Indre-et-Loire</option>
                      <option value="38">38 - Isère</option>
                      <option value="39">39 - Jura</option>
                      <option value="40">40 - Landes</option>
                      <option value="41">41 - Loir-et-Cher</option>
                      <option value="42">42 - Loire</option>
                      <option value="43">43 - Haute-Loire</option>
                      <option value="44">44 - Loire-Atlantique</option>
                      <option value="45">45 - Loiret</option>
                      <option value="46">46 - Lot</option>
                      <option value="47">47 - Lot-et-Garonne</option>
                      <option value="48">48 - Lozère</option>
                      <option value="49">49 - Maine-et-Loire</option>
                      <option value="50">50 - Manche</option>
                      <option value="51">51 - Marne</option>
                      <option value="52">52 - Haute-Marne</option>
                      <option value="53">53 - Mayenne</option>
                      <option value="54">54 - Meurthe-et-Moselle</option>
                      <option value="55">55 - Meuse</option>
                      <option value="56">56 - Morbihan</option>
                      <option value="57">57 - Moselle</option>
                      <option value="58">58 - Nièvre</option>
                      <option value="59">59 - Nord</option>
                      <option value="60">60 - Oise</option>
                      <option value="61">61 - Orne</option>
                      <option value="62">62 - Pas-de-Calais</option>
                      <option value="63">63 - Puy-de-Dôme</option>
                      <option value="64">64 - Pyrénées-Atlantiques</option>
                      <option value="65">65 - Hautes-Pyrénées</option>
                      <option value="66">66 - Pyrénées-Orientales</option>
                      <option value="67">67 - Bas-Rhin</option>
                      <option value="68">68 - Haut-Rhin</option>
                      <option value="69">69 - Rhône</option>
                      <option value="70">70 - Haute-Saône</option>
                      <option value="71">71 - Saône-et-Loire</option>
                      <option value="72">72 - Sarthe</option>
                      <option value="73">73 - Savoie</option>
                      <option value="74">74 - Haute-Savoie</option>
                      <option value="75">75 - Paris</option>
                      <option value="76">76 - Seine-Maritime</option>
                      <option value="77">77 - Seine-et-Marne</option>
                      <option value="78">78 - Yvelines</option>
                      <option value="79">79 - Deux-Sèvres</option>
                      <option value="80">80 - Somme</option>
                      <option value="81">81 - Tarn</option>
                      <option value="82">82 - Tarn-et-Garonne</option>
                      <option value="83">83 - Var</option>
                      <option value="84">84 - Vaucluse</option>
                      <option value="85">85 - Vendée</option>
                      <option value="86">86 - Vienne</option>
                      <option value="87">87 - Haute-Vienne</option>
                      <option value="88">88 - Vosges</option>
                      <option value="89">89 - Yonne</option>
                      <option value="90">90 - Territoire de Belfort</option>
                      <option value="91">91 - Essonne</option>
                      <option value="92">92 - Hauts-de-Seine</option>
                      <option value="93">93 - Seine-Saint-Denis</option>
                      <option value="94">94 - Val-de-Marne</option>
                      <option value="95">95 - Val-d'Oise</option>
                      <option value="971">971 - Guadeloupe</option>
                      <option value="972">972 - Martinique</option>
                      <option value="973">973 - Guyane</option>
                      <option value="974">974 - La Réunion</option>
                      <option value="976">976 - Mayotte</option>
                    </select>
                    {errors.province && (
                      <p className="mt-1 text-sm text-red-600">{errors.province}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-1">
                    <label htmlFor="town" className="block text-sm font-medium text-gray-700 mb-1">
                      VILLE *
                    </label>
                    <input
                      type="text"
                      id="town"
                      name="town"
                      value={formData.town}
                      onChange={handleChange}
                      className={`block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        errors.town ? 'border-red-300' : ''
                      }`}
                    />
                    {errors.town && (
                      <p className="mt-1 text-sm text-red-600">{errors.town}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="md:col-span-1">
                    <label htmlFor="diallingCode" className="block text-sm font-medium text-gray-700 mb-1">
                      INDICATIF *
                    </label>
                    <input
                      type="text"
                      id="diallingCode"
                      name="diallingCode"
                      value="+33 (France)"
                      readOnly
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-gray-100"
                    />
                  </div>
                  
                  <div className="md:col-span-3">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      TÉLÉPHONE *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Ex: 0612345678"
                      className={`block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        errors.phone ? 'border-red-300' : ''
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center mt-6 text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Vos informations sont transmises de façon sécurisée à Chogan pour traiter votre commande via Smart Order.
                </div>
                
                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Redirection vers Chogan Smart Order...
                      </>
                    ) : (
                      'SAVE AND CONTINUE'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Résumé de la commande */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Résumé de la commande</h2>
              
              <div className="space-y-4 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4 pb-2">
                <div className="flex justify-between">
                  <p className="text-base font-medium text-gray-900">Total</p>
                  <p className="text-base font-medium text-primary-600">{formatPrice(totalPrice)}</p>
                </div>
              </div>
              
              <div className="mt-6 bg-gray-50 rounded-md p-4 text-sm text-gray-600">
                <p className="mb-2">
                  <strong>Smart Order Chogan</strong>
                </p>
                <p className="mb-2">
                  Après avoir complété ce formulaire, vous serez redirigé vers le site de Chogan pour finaliser votre paiement.
                </p>
                <p>
                  Vos informations seront transmises à notre système Smart Order pour traitement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
