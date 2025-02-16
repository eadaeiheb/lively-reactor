import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import ParallaxText from '../components/ParallaxText';

const Contact = () => {
  const [progress, setProgress] = useState(0);
  
  const banner = {
    image: '/images/banners/digital-banner.jpg',
    title: 'Digital',
    description: 'Solutions numériques innovantes'
  };

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 100));
    }, 40);

    return () => {
      clearInterval(progressInterval);
    };
  }, []);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="pt-16">
      {/* Hero Section with Single Banner */}
      <div className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/95" />
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${banner.image})` }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)] opacity-60" />
        </motion.div>
        
        <ParallaxText y={[0, -100]}>
          <div className="relative text-center px-4 z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="w-20 h-1 bg-gradient-to-r from-gold-400 to-gold-600 mx-auto rounded-full mb-6" />
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
                Contactez-<span className="text-gold-400">nous</span>
              </h1>
              <div className="w-20 h-1 bg-gradient-to-r from-gold-600 to-gold-400 mx-auto rounded-full mt-6" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300 max-w-2xl mx-auto"
            >
              {banner.description}
            </motion.p>
          </div>
        </ParallaxText>
      </div>

      {/* Contact Form Section */}
      <div className="py-20 px-4 bg-gradient-to-b from-black to-rich-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 gap-12"
          >
            {/* Contact Information */}
            <motion.div variants={itemVariants} className="space-y-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-gold-600 to-gold-400 rounded-lg blur opacity-10 group-hover:opacity-25 transition duration-1000 group-hover:duration-200" />
                <div className="relative bg-black/80 backdrop-blur-xl p-8 rounded-lg border border-gold-500/5">
                  <h2 className="text-2xl font-bold mb-6 text-gold-400">Informations de Contact</h2>
                  <div className="space-y-6">
                    <motion.div
                      whileHover={{ x: 10 }}
                      className="flex items-center space-x-4 group"
                    >
                      <div className="w-12 h-12 bg-gold-500/5 rounded-full flex items-center justify-center group-hover:bg-gold-500/10 transition-colors">
                        <Mail className="h-6 w-6 text-gold-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gold-400">Email</p>
                        <p className="text-gray-400">contact@vilart.com</p>
                      </div>
                    </motion.div>
                    <motion.div
                      whileHover={{ x: 10 }}
                      className="flex items-center space-x-4 group"
                    >
                      <div className="w-12 h-12 bg-gold-500/5 rounded-full flex items-center justify-center group-hover:bg-gold-500/10 transition-colors">
                        <Phone className="h-6 w-6 text-gold-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gold-400">Téléphone</p>
                        <p className="text-gray-400">+1 234 567 890</p>
                      </div>
                    </motion.div>
                    <motion.div
                      whileHover={{ x: 10 }}
                      className="flex items-center space-x-4 group"
                    >
                      <div className="w-12 h-12 bg-gold-500/5 rounded-full flex items-center justify-center group-hover:bg-gold-500/10 transition-colors">
                        <MapPin className="h-6 w-6 text-gold-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gold-400">Adresse</p>
                        <p className="text-gray-400">123 Rue de la Musique, Paris</p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-gold-600 to-gold-400 rounded-lg blur opacity-10 group-hover:opacity-25 transition duration-1000 group-hover:duration-200" />
                <div className="relative bg-black/80 backdrop-blur-xl p-8 rounded-lg border border-gold-500/5">
                  <h2 className="text-2xl font-bold mb-6 text-gold-400">Heures d'Ouverture</h2>
                  <div className="space-y-2 text-gray-400">
                    <p>Lundi - Vendredi: 9h00 - 18h00</p>
                    <p>Samedi: 10h00 - 16h00</p>
                    <p>Dimanche: Fermé</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={itemVariants}>
              <form onSubmit={handleSubmit} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-gold-600 to-gold-400 rounded-lg blur opacity-10 group-hover:opacity-25 transition duration-1000 group-hover:duration-200" />
                <div className="relative bg-black/80 backdrop-blur-xl p-8 rounded-lg border border-gold-500/5">
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2 text-gold-400">
                        Nom
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="w-full px-4 py-3 bg-black/50 border border-gold-500/10 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-colors text-white"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2 text-gold-400">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-3 bg-black/50 border border-gold-500/10 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-colors text-white"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2 text-gold-400">
                        Sujet
                      </label>
                      <select
                        id="subject"
                        className="w-full px-4 py-3 bg-black/50 border border-gold-500/10 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-colors text-white"
                        required
                      >
                        <option value="">Sélectionnez un sujet</option>
                        <option value="production">Production Musicale</option>
                        <option value="events">Organisation d'Événements</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2 text-gold-400">
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={6}
                        className="w-full px-4 py-3 bg-black/50 border border-gold-500/10 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-colors text-white resize-none"
                        required
                      ></textarea>
                    </div>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full px-6 py-3 bg-gradient-to-r from-gold-600 to-gold-500 text-black font-semibold rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 hover:from-gold-500 hover:to-gold-400 ${
                        isSubmitted ? 'bg-green-500' : ''
                      }`}
                    >
                      {isSubmitted ? (
                        <>
                          <CheckCircle2 className="h-5 w-5" />
                          <span>Message Envoyé!</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          <span>Envoyer le Message</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
