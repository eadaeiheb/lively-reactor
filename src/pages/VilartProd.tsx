import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Star, ArrowRight, X } from 'lucide-react';
import VideoBackground from '../components/VideoBackground';
import HeroVideo from '../components/HeroVideo';
import { MediaItem } from '../types/media';

const VilartProd = () => {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const services = [
    {
      title: 'Production Musicale',
      description: 'Services professionnels d\'enregistrement, de mixage et de mastering. Nous créons de la musique originale et aidons les artistes à concrétiser leur vision.',
      features: [
        'Création musicale originale',
        'Enregistrement professionnel',
        'Mixage et mastering',
        'Design sonore',
        'Enregistrement vocal'
      ]
    },
    {
      title: 'Production Vidéo',
      description: 'Clips musicaux, contenu promotionnel et narration visuelle de haute qualité pour artistes et marques.',
      features: [
        'Clips musicaux',
        'Contenu promotionnel',
        'Captation de live',
        'Effets visuels',
        'Étalonnage couleur'
      ]
    },
    {
      title: 'Gestion Créative',
      description: 'Gestion complète d\'artistes et développement de projets créatifs pour atteindre vos objectifs.',
      features: [
        'Management d\'artistes',
        'Planification de projets',
        'Stratégie marketing',
        'Développement de marque',
        'Planification de sorties'
      ]
    },
    {
      title: 'Studio Professionnel',
      description: 'Installations d\'enregistrement à la pointe de la technologie avec équipement professionnel pour un son optimal.',
      features: [
        'Pro Tools HD',
        'Équipement analogique',
        'Microphones haut de gamme',
        'Traitement acoustique',
        'Multiples salles d\'enregistrement'
      ]
    },
  ];

  const portfolio: MediaItem[] = [
    {
      id: 1,
      type: 'video',
      url: "https://player.vimeo.com/external/403619009.sd.mp4?s=51fb1fe1c5a2088f1d811e944e6e1231c1f2b21f&profile_id=164&oauth2_token_id=57447761",
      thumbnail: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
      title: "Music Production",
      description: "Professional studio recording session",
      category: "Studio"
    },
    {
      id: 2,
      type: 'image',
      url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
      thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
      title: "Sound Design",
      description: "Creative sound design project",
      category: "Audio"
    },
    {
      id: 3,
      type: 'video',
      url: "https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d&profile_id=165&oauth2_token_id=57447761",
      thumbnail: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4",
      title: "Live Recording",
      description: "Live music recording session",
      category: "Live"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Martin",
      role: "Artiste",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      quote: "Travailler avec Vilart Production a été une expérience incroyable. Leur attention aux détails et leur approche professionnelle ont permis d'élever ma musique à un autre niveau."
    },
    {
      name: "Michel Chen",
      role: "Producteur Musical",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      quote: "Les installations du studio sont exceptionnelles, et l'expertise de l'équipe en production musicale et vidéo est inégalée. Je recommande vivement !"
    },
    {
      name: "Emma Dubois",
      role: "Artiste Indépendante",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      quote: "Du concept à la réalisation, Vilart m'a aidée à développer ma vision artistique et à créer un contenu qui représente vraiment ma marque."
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <VideoBackground
        videoUrl="https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d&profile_id=165&oauth2_token_id=57447761"
        overlay="bg-black/70"
      >
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center px-4 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <h1 className="text-4xl md:text-7xl font-bold text-white gold-text-shadow">
                Services de Production
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                Services professionnels de production musicale et vidéo pour donner vie à votre vision créative
              </p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <a
                  href="#services"
                  className="px-8 py-4 bg-gold-600 text-black font-semibold rounded-lg hover:bg-gold-500 transition-all duration-300 transform hover:scale-105"
                >
                  Découvrir Nos Services
                </a>
                <a
                  href="#contact"
                  className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
                >
                  Démarrer Votre Projet
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </VideoBackground>

      {/* Featured Video Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-rich-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              Nos Dernières Réalisations
            </h2>
            <p className="text-xl text-white/80">
              Découvrez quelques-unes de nos productions récentes
            </p>
          </motion.div>
          
          <HeroVideo
            thumbnailUrl="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04"
            videoUrl="https://player.vimeo.com/external/403619009.sd.mp4?s=51fb1fe1c5a2088f1d811e944e6e1231c1f2b21f&profile_id=164&oauth2_token_id=57447761"
            title="Vilart Productions Showreel 2024"
            description="Les moments forts de nos productions musicales et vidéo"
          />
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              Nos Services
            </h2>
            <p className="text-xl text-white/80">
              Solutions professionnelles pour vos besoins créatifs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="luxury-card p-8 rounded-xl h-full"
              >
                <h3 className="text-2xl font-bold mb-4 text-white">{service.title}</h3>
                <p className="text-white/80 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-300">
                      <ArrowRight className="h-4 w-4 text-gold-400 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-rich-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              Notre Portfolio
            </h2>
            <p className="text-xl text-white/80">
              Une sélection de nos meilleures réalisations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => setSelectedMedia(item)}
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <div className="w-16 h-16 rounded-full bg-gold-500/90 flex items-center justify-center mb-4">
                      {item.type === 'video' ? (
                        <Play className="w-8 h-8 text-black" />
                      ) : (
                        <ArrowRight className="w-8 h-8 text-black" />
                      )}
                    </div>
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <span className="text-sm text-gold-400">{item.category}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              Témoignages Clients
            </h2>
            <p className="text-xl text-white/80">
              Ce que nos clients disent de leur collaboration avec nous
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="luxury-card p-8 rounded-xl"
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-white">{testimonial.name}</h3>
                    <p className="text-gold-400">{testimonial.role}</p>
                  </div>
                </div>
                <div className="mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="inline-block w-5 h-5 text-gold-400" />
                  ))}
                </div>
                <p className="text-gray-300 italic">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-rich-black">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Prêt à Démarrer Votre Projet ?
            </h2>
            <p className="text-xl text-white/80">
              Créons ensemble quelque chose d'extraordinaire. Contactez-nous pour discuter de votre projet et donner vie à votre vision.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/contact"
                className="px-8 py-4 bg-gold-600 text-black font-semibold rounded-lg hover:bg-gold-500 transition-all duration-300 transform hover:scale-105"
              >
                Nous Contacter
              </a>
              <a
                href="#services"
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
              >
                En Savoir Plus
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Media Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMedia(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-6xl w-full aspect-video rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedMedia.type === 'video' ? (
                <video
                  src={selectedMedia.url}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.title}
                  className="w-full h-full object-contain"
                />
              )}
              <button
                onClick={() => setSelectedMedia(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/80 rounded-full flex items-center justify-center text-white hover:text-gold-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VilartProd;
