
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
    <div className="pt-16">
      {/* Hero Section with Gradient Overlay */}
      <div className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/banners/digital-banner.jpg')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#222222] via-[#1a1a1a]/90 to-[#1a1a1a]" />
        <ParallaxText y={[0, -50]}>
          <div className="relative z-10 text-center px-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold mb-6 text-[#FFD700]"
            >
              Services Digitaux
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300 max-w-2xl mx-auto"
            >
              Transformez votre vision en réalité numérique avec nos solutions créatives et innovantes
            </motion.p>
          </div>
        </ParallaxText>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-[#222222]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-[#1a1a1a] rounded-lg border border-[#FFD700]/10"
              >
                <h3 className="text-3xl md:text-4xl font-bold text-[#FFD700]">
                  {stat.number}
                </h3>
                <p className="text-gray-400 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid with Modern Design */}
      <div className="py-20 px-4 bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#FFD700] mb-6">
              Nos Services Digitaux
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto">
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
                className="relative h-full"
              >
                <div className="bg-[#222222] p-8 rounded-lg border border-[#FFD700]/10 hover:border-[#FFD700]/30 transition-all duration-300 h-full flex flex-col">
                  <h3 className="text-xl font-bold text-[#FFD700] mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 mb-6 flex-grow">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-400">
                        <Check className="h-4 w-4 mr-2 text-[#FFD700]" />
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

      {/* CTA Section with Modern Design */}
      <div className="py-20 px-4 bg-[#222222]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="bg-[#1a1a1a] p-12 rounded-lg border border-[#FFD700]/10">
              <h2 className="text-3xl font-bold text-[#FFD700] mb-6">
                Prêt à Démarrer Votre Projet Digital ?
              </h2>
              <p className="text-gray-400 mb-8">
                Contactez-nous pour discuter de vos besoins et découvrir comment nous pouvons vous aider à atteindre vos objectifs.
              </p>
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#FFD700] text-black font-semibold rounded-lg hover:bg-[#FFD700]/90 transition-all duration-300"
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
