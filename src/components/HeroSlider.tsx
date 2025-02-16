
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1920&q=80",
    title: "Solutions Digitales",
    description: "Innovations technologiques pour votre entreprise"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1920&q=80",
    title: "Production Web",
    description: "Développement et design sur mesure"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=80",
    title: "Expertise Technique",
    description: "Solutions professionnelles adaptées"
  }
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setProgress(0);
    }, 7000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 100));
    }, 70); // 7000ms / 100 steps = 70ms per step

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${slides[currentSlide].image})`,
              filter: 'brightness(0.6)'
            }}
          />
          <div className="absolute inset-0 bg-black/50" />
          
          <div className="relative h-full flex flex-col items-center justify-center text-center z-10">
            {/* Logo */}
            <motion.img 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              src="/images/logos/logo-light.png"
              alt="Logo"
              className="w-56 md:w-64 mb-12 gold-glow"
            />
            
            <div className="max-w-4xl mx-auto px-4">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-6xl md:text-8xl font-bold mb-6 text-white tracking-tight gold-text-shadow"
              >
                {slides[currentSlide].title}
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-xl md:text-2xl text-white/90 mb-12 tracking-wide max-w-2xl mx-auto"
              >
                {slides[currentSlide].description}
              </motion.p>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              >
                <Button
                  className="bg-gold-500 hover:bg-gold-600 text-black px-10 py-3.5 text-lg font-semibold tracking-wide rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-64 sm:w-auto border border-gold-400"
                >
                  Découvrir
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-gold-400 text-gold-400 hover:bg-gold-500/10 px-10 py-3.5 text-lg font-semibold tracking-wide rounded-lg backdrop-blur-sm transition-all duration-300 transform hover:scale-105 w-64 sm:w-auto hover:text-gold-300 hover:border-gold-300"
                >
                  En savoir plus
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Loading Bar */}
      <div className="absolute bottom-8 left-8 z-20">
        <div className="bg-white/20 w-32 h-1 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gold-400"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <div className="text-gold-400 text-sm mt-2 font-medium tracking-wide">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
