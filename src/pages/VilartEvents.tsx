import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Star, ArrowRight, X, Calendar, MapPin, Ticket } from 'lucide-react';
import VideoBackground from '../components/VideoBackground';
import HeroVideo from '../components/HeroVideo';
import { MediaItem } from '../types/media';

const upcomingEvents = [
  {
    id: 1,
    title: "Festival International de Jazz",
    date: "15-17 Juillet 2024",
    location: "Tunis, Tunisie",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
    description: "Trois jours de jazz avec des artistes internationaux",
    price: "À partir de 80 DT"
  },
  {
    id: 2,
    title: "Soirée Corporate Excellence",
    date: "25 Août 2024",
    location: "Hôtel Four Seasons, Gammarth",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865",
    description: "Une soirée exclusive dédiée aux leaders d'entreprise",
    price: "Sur invitation"
  },
  {
    id: 3,
    title: "Festival Électro Beach",
    date: "10 Septembre 2024",
    location: "Hammamet, Tunisie",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
    description: "Le plus grand événement électro de l'année",
    price: "À partir de 120 DT"
  }
];

const VilartEvents = () => {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const services = [
    {
      title: 'Event Planning',
      description: 'Comprehensive event planning and management services for unforgettable experiences.',
      features: [
        'Concept development',
        'Venue selection',
        'Vendor coordination',
        'Timeline management',
        'On-site coordination'
      ]
    },
    {
      title: 'Concert Production',
      description: 'Full-scale concert and festival organization with professional sound and lighting.',
      features: [
        'Artist booking',
        'Stage design',
        'Sound engineering',
        'Lighting design',
        'Technical production'
      ]
    },
    {
      title: 'Technical Production',
      description: 'State-of-the-art sound, lighting, and stage management for any event size.',
      features: [
        'Sound systems',
        'Lighting equipment',
        'Stage setup',
        'Video projection',
        'Technical staff'
      ]
    },
    {
      title: 'Private Events',
      description: 'Customized solutions for corporate events, weddings, and private celebrations.',
      features: [
        'Corporate events',
        'Private parties',
        'Wedding production',
        'Brand activations',
        'VIP experiences'
      ]
    },
  ];

  const portfolio: MediaItem[] = [
    {
      id: 1,
      type: 'video',
      url: "https://player.vimeo.com/external/403619009.sd.mp4?s=51fb1fe1c5a2088f1d811e944e6e1231c1f2b21f&profile_id=164&oauth2_token_id=57447761",
      thumbnail: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
      title: "Summer Festival",
      description: "An amazing summer festival experience",
      category: "Festival"
    },
    {
      id: 2,
      type: 'image',
      url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
      thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
      title: "Corporate Event",
      description: "Professional corporate event production",
      category: "Corporate"
    },
    {
      id: 3,
      type: 'video',
      url: "https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d&profile_id=165&oauth2_token_id=57447761",
      thumbnail: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4",
      title: "Private Concert",
      description: "Exclusive private concert event",
      category: "Concert"
    }
  ];

  const testimonials = [
    {
      name: "David Wilson",
      role: "Event Organizer",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      quote: "Vilart Events transformed our corporate gathering into an unforgettable experience. Their attention to detail was impressive."
    },
    {
      name: "Lisa Thompson",
      role: "Festival Director",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      quote: "Working with Vilart Events made our festival a huge success. Their technical expertise and organization were outstanding."
    },
    {
      name: "James Rodriguez",
      role: "Corporate Client",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      quote: "The team's professionalism and creativity exceeded our expectations. They delivered a perfect corporate event."
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <VideoBackground
        videoUrl="https://player.vimeo.com/external/451776276.sd.mp4?s=2e4be06fb91c7a572aa2b74b26c72bfed800c583&profile_id=165&oauth2_token_id=57447761"
        overlay="bg-black/60"
      >
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center px-4 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white">
                Évènementiel
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-light">
                Créateurs d'expériences uniques et mémorables
              </p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <a
                  href="#upcoming"
                  className="px-8 py-4 bg-gold-600 text-black font-semibold rounded-lg hover:bg-gold-500 transition-all duration-300"
                >
                  Événements à venir
                </a>
                <a
                  href="#contact"
                  className="px-8 py-4 border border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  Nous contacter
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </VideoBackground>

      {/* Upcoming Events Section */}
      <section id="upcoming" className="py-20 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              Événements à Venir
            </h2>
            <p className="text-xl text-white/80">
              Découvrez nos prochains événements exclusifs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-rich-black rounded-xl overflow-hidden border border-gold-600/20 group hover:border-gold-600/40 transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gold-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">{event.date}</span>
                    </div>
                    <div className="flex items-center text-gold-400">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    <div className="flex items-center text-gold-400">
                      <Ticket className="w-4 h-4 mr-2" />
                      <span className="text-sm">{event.price}</span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{event.description}</p>
                  <button className="w-full py-2 bg-gold-600/20 text-gold-400 rounded hover:bg-gold-600/30 transition-colors duration-300">
                    En savoir plus
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
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
              Our Services
            </h2>
            <p className="text-xl text-white/80">
              Comprehensive event solutions for any occasion
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
              Event Portfolio
            </h2>
            <p className="text-xl text-white/80">
              Highlights from our past events
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
              Client Testimonials
            </h2>
            <p className="text-xl text-white/80">
              What our clients say about our events
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
              Ready to Plan Your Event?
            </h2>
            <p className="text-xl text-white/80">
              Let us help you create an unforgettable experience. Contact us to start planning your next event.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/contact"
                className="px-8 py-4 bg-gold-600 text-black font-semibold rounded-lg hover:bg-gold-500 transition-all duration-300 transform hover:scale-105"
              >
                Get Started
              </a>
              <a
                href="#services"
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
              >
                Learn More
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

export default VilartEvents;
