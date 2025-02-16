
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import ParallaxText from '../components/ParallaxText';

const Digital = () => {
  const services = [
    {
      title: "Design Graphique",
      description: "Création d'identités visuelles uniques, logos et supports marketing qui captivent votre audience.",
      features: ["Identité visuelle", "Logos", "Chartes graphiques", "Supports marketing"]
    },
    {
      title: "Applications Mobiles",
      description: "Développement d'applications mobiles innovantes pour iOS et Android, offrant une expérience utilisateur exceptionnelle.",
      features: ["iOS & Android", "UX/UI Design", "Performance", "Maintenance"]
    },
    {
      title: "Sites Web",
      description: "Conception et développement de sites web responsifs et modernes qui reflètent votre image de marque.",
      features: ["Sites vitrines", "E-commerce", "Blogs", "Applications web"]
    },
    {
      title: "UI/UX Design",
      description: "Création d'interfaces intuitives et d'expériences utilisateur fluides pour vos projets digitaux.",
      features: ["Wireframes", "Prototypes", "Tests utilisateurs", "Design system"]
    },
    {
      title: "Branding Digital",
      description: "Développement de votre présence en ligne avec une stratégie de marque cohérente et impactante.",
      features: ["Stratégie digitale", "Réseaux sociaux", "Content marketing", "SEO"]
    },
    {
      title: "Développement Sur Mesure",
      description: "Solutions techniques personnalisées pour répondre à vos besoins spécifiques.",
      features: ["Architecture", "APIs", "Intégration", "Sécurité"]
    }
  ];

  const stats = [
    { number: "150+", label: "Projets Réalisés" },
    { number: "98%", label: "Clients Satisfaits" },
    { number: "15+", label: "Années d'Expérience" },
    { number: "24/7", label: "Support Client" }
  ];

  return (
    <div className="min-h-screen bg-rich-black">
      {/* Hero Section with Banner */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/banners/digital-banner.jpg')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-rich-black via-rich-black/95 to-rich-black" />
        <div className="relative z-10 container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gold-400">
              Services Digitaux
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-8">
              Transformez votre vision en réalité numérique avec nos solutions créatives et innovantes
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <button className="px-8 py-3 bg-gold-600 text-black font-semibold rounded-lg hover:bg-gold-500 transition-all duration-300">
                Nos Services
              </button>
              <button className="px-8 py-3 border border-gold-400 text-gold-400 font-semibold rounded-lg hover:bg-gold-400/10 transition-all duration-300">
                Contactez-nous
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-black/50 backdrop-blur-sm border-y border-gold-400/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-black/40 rounded-lg border border-gold-400/10 hover:border-gold-400/20 transition-colors"
              >
                <h3 className="text-3xl md:text-4xl font-bold text-gold-400 mb-2">
                  {stat.number}
                </h3>
                <p className="text-white/70">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gold-400 mb-6">
              Nos Services Digitaux
            </h2>
            <p className="text-white/80 max-w-3xl mx-auto">
              De la conception à la réalisation, nous vous accompagnons dans tous vos projets digitaux avec expertise et créativité.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="h-full bg-black/40 p-8 rounded-lg border border-gold-400/10 hover:border-gold-400/30 transition-all duration-300">
                  <h3 className="text-xl font-bold text-gold-400 mb-4">
                    {service.title}
                  </h3>
                  <p className="text-white/70 mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-white/60 group-hover:text-white/70 transition-colors">
                        <Check className="h-4 w-4 mr-2 text-gold-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="max-w-4xl mx-auto text-center bg-black/40 p-12 rounded-lg border border-gold-400/10">
              <h2 className="text-3xl font-bold text-gold-400 mb-6">
                Prêt à Démarrer Votre Projet Digital ?
              </h2>
              <p className="text-white/80 mb-8">
                Contactez-nous pour discuter de vos besoins et découvrir comment nous pouvons vous aider à atteindre vos objectifs.
              </p>
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gold-600 text-black font-semibold rounded-lg hover:bg-gold-500 transition-all duration-300"
              >
                Contactez-Nous
                <ArrowRight className="h-5 w-5" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Digital;
