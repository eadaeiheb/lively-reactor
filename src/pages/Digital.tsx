import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Digital = () => {
  const services = [
    {
      title: "Design Graphique",
      description: "Création d'identités visuelles uniques, logos et supports marketing qui captivent votre audience.",
      features: ["Identité visuelle", "Logos", "Chartes graphiques", "Supports marketing"]
    },
    {
      title: "Marketing Digital",
      description: "Stratégies de marketing digital pour accroître votre visibilité et atteindre votre public cible.",
      features: ["SEO", "Publicités en ligne", "Marketing de contenu", "Analyse de données"]
    },
    {
      title: "Branding",
      description: "Développement de l'identité de marque pour une image cohérente et mémorable.",
      features: ["Logo design", "Charte graphique", "Naming", "Storytelling"]
    }
  ];

  const testimonials = [
    {
      name: "Jean Dupont",
      company: "Entreprise ABC",
      quote: "L'équipe de Vilart Production a transformé notre présence en ligne. Nous avons constaté une augmentation significative de notre chiffre d'affaires."
    },
    {
      name: "Sophie Martin",
      company: "Startup XYZ",
      quote: "Grâce à leur expertise en marketing digital, nous avons pu atteindre notre public cible et développer notre notoriété."
    }
  ];

  const stats = [
    { number: "150+", label: "Projets Réalisés" },
    { number: "98%", label: "Clients Satisfaits" },
    { number: "15+", label: "Années d'Expérience" },
    { number: "24/7", label: "Support Client" }
  ];

  return (
    <div className="bg-black text-white">
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-bold mb-8"
          >
            Solutions Digitales
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-xl md:text-2xl text-white/80 mb-12"
          >
            Boostez votre présence en ligne avec nos services digitaux sur mesure
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          >
            <a
              href="/contact"
              className="inline-flex items-center px-8 py-3 bg-gold-400 text-black hover:bg-gold-300 transition-all duration-300 rounded-full text-lg font-medium"
            >
              Contactez-nous
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-rich-black to-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Nos Services
            </h2>
            <p className="text-xl text-white/80">
              Des solutions digitales adaptées à vos besoins
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative group h-full"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-gold-600 to-gold-400 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                <div className="relative luxury-card p-8 rounded-xl hover:transform hover:scale-105 transition-all duration-300 flex flex-col h-full">
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-white/80 mb-8">{service.description}</p>
                  <ul className="space-y-3 mb-8 flex-grow">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-white/70">
                        <motion.span
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.2 + idx * 0.1 }}
                          className="w-2 h-2 bg-gold-400 rounded-full mr-3 flex-shrink-0"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/contact"
                    className="inline-flex items-center text-gold-400 hover:text-gold-300 group mt-auto"
                  >
                    En savoir plus
                    <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-2 transition-transform" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Témoignages
            </h2>
            <p className="text-xl text-white/80">
              Ce que nos clients disent de nous
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.3 }}
                className="luxury-card p-8 rounded-xl"
              >
                <p className="text-lg italic mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="ml-4">
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-white/60">{testimonial.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-t from-rich-black to-black">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-8"
          >
            Prêt à transformer votre présence digitale ?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-white/80 mb-12"
          >
            Contactez-nous dès aujourd'hui pour discuter de vos projets
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <a
              href="/contact"
              className="inline-flex items-center px-8 py-3 bg-gold-400 text-black hover:bg-gold-300 transition-all duration-300 rounded-full text-lg font-medium"
            >
              Contactez-nous
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Digital;
