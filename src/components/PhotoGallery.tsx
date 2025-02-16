import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Dialog, DialogContent } from "./ui/dialog";

const allPhotos = [
  {
    id: 1,
    type: 'image',
    url: "/Vitaprod/ON THE WAY 🔥 👀 __comingsoon _fbk _vilartprod(JPG)_1.jpg",
    thumbnail: "/Vitaprod/ON THE WAY 🔥 👀 __comingsoon _fbk _vilartprod(JPG)_1.jpg",
    title: "On The Way",
    description: "Coming soon teaser - FBK project"
  },
  {
    id: 2,
    type: 'image',
    url: "/Vitaprod/ON THE WAY 🔥 👀 __comingsoon _fbk _vilartprod(JPG)_4.jpg",
    thumbnail: "/Vitaprod/ON THE WAY 🔥 👀 __comingsoon _fbk _vilartprod(JPG)_4.jpg",
    title: "Production Setup",
    description: "Professional recording equipment"
  },
  {
    id: 3,
    type: 'image',
    url: "/Vitaprod/ON THE WAY 🔥 👀 __comingsoon _fbk _vilartprod(JPG)_5.jpg",
    thumbnail: "/Vitaprod/ON THE WAY 🔥 👀 __comingsoon _fbk _vilartprod(JPG)_5.jpg",
    title: "Studio Session",
    description: "Professional recording session"
  },
  {
    id: 4,
    type: 'image',
    url: "/Vitaprod/Some snaps from the next project featuring _f.b.k_official ✨️ _Enjoyable shoot _ loved the outcome ⚡️_Cinematography _ Edit _ _og__visuals 👽🁟1.webp",
    thumbnail: "/Vitaprod/Some snaps from the next project featuring _f.b.k_official ✨️ _Enjoyable shoot _ loved the outcome ⚡️_Cinematography _ Edit _ _og__visuals 👽🁟1.webp",
    title: "FBK Official Project",
    description: "Behind the scenes photography"
  },
  {
    id: 5,
    type: 'image',
    url: "/Vitaprod/Some snaps from the next project featuring _f.b.k_official ✨️ _Enjoyable shoot _ loved the outcome ⚡️_Cinematography _ Edit _ _og__visuals 👽🁟2.webp",
    thumbnail: "/Vitaprod/Some snaps from the next project featuring _f.b.k_official ✨️ _Enjoyable shoot _ loved the outcome ⚡️_Cinematography _ Edit _ _og__visuals 👽🁟2.webp",
    title: "Visual Production",
    description: "Creative direction and cinematography"
  },
  {
    id: 6,
    type: 'image',
    url: "/Vitaprod/Some snaps from the next project featuring _f.b.k_official ✨️ _Enjoyable shoot _ loved the outcome ⚡️_Cinematography _ Edit _ _og__visuals 👽🁟3.webp",
    thumbnail: "/Vitaprod/Some snaps from the next project featuring _f.b.k_official ✨️ _Enjoyable shoot _ loved the outcome ⚡️_Cinematography _ Edit _ _og__visuals 👽🁟3.webp",
    title: "Studio Magic",
    description: "Professional photography session"
  },
  {
    id: 7,
    type: 'image',
    url: "/Vitaprod/حين تنبض الشوارع بإيقاعات الحياة و الموسيقى 🎶_نستناوكم نهار 20 جانفي ضمن فعاليات أيام(.jpg",
    thumbnail: "/Vitaprod/حين تنبض الشوارع بإيقاعات الحياة و الموسيقى 🎶_نستناوكم نهار 20 جانفي ضمن فعاليات أيام(.jpg",
    title: "Street Rhythms",
    description: "Live music event - January 20th"
  },
  {
    id: 8,
    type: 'image',
    url: "/Vitaprod/شارع الحبيب بورقيبة 🥹 شكرا على اللحظات التي لا تنسى ❤️❤️_مالها إلا البداية .. ولنا _1.jpg",
    thumbnail: "/Vitaprod/شارع الحبيب بورقيبة 🥹 شكرا على اللحظات التي لا تنسى ❤️❤️_مالها إلا البداية .. ولنا _1.jpg",
    title: "Habib Bourguiba Avenue",
    description: "Unforgettable moments"
  }
];

const PhotoGallery = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [galleryPhotos, setGalleryPhotos] = useState(allPhotos);

  useEffect(() => {
    // Shuffle the photos on component mount
    const shuffledPhotos = [...allPhotos].sort(() => Math.random() - 0.5);
    setGalleryPhotos(shuffledPhotos);
  }, []);

  const handlePrevious = () => {
    setSelectedPhoto((current) => 
      current === 0 ? galleryPhotos.length - 1 : current! - 1
    );
  };

  const handleNext = () => {
    setSelectedPhoto((current) => 
      current === galleryPhotos.length - 1 ? 0 : current! + 1
    );
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhoto === null) return;
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setSelectedPhoto(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto]);

  return (
    <section className="py-20 bg-gradient-to-b from-black to-rich-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            Notre Galerie
          </h2>
          <p className="text-xl text-white/80">
            Un aperçu de nos réalisations
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative aspect-square cursor-pointer group"
              onClick={() => setSelectedPhoto(index)}
            >
              <div className="absolute inset-0 rounded-lg overflow-hidden bg-rich-black">
                <motion.img
                  src={photo.thumbnail}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                  whileHover={{ scale: 1.1 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-semibold text-gold-400">{photo.title}</h3>
                    <p className="text-sm text-white/80">{photo.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Dialog open={selectedPhoto !== null} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0 bg-black/95 border-none">
          {selectedPhoto !== null && (
            <div className="relative w-full h-full flex items-center justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhoto(null);
                }}
                className="absolute right-4 top-4 z-50 text-gold-400 hover:text-gold-300 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>

              <motion.button
                className="absolute left-4 z-50 text-gold-400 hover:text-gold-300 transition-colors md:left-8"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="h-8 w-8 md:h-12 md:w-12" />
              </motion.button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedPhoto}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full flex items-center justify-center p-4 md:p-8"
                >
                  <motion.img
                    src={galleryPhotos[selectedPhoto].url}
                    alt={galleryPhotos[selectedPhoto].title}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  />
                </motion.div>
              </AnimatePresence>

              <motion.button
                className="absolute right-4 z-50 text-gold-400 hover:text-gold-300 transition-colors md:right-8"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="h-8 w-8 md:h-12 md:w-12" />
              </motion.button>

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                <motion.h2 
                  className="text-xl md:text-2xl font-bold text-gold-400"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {galleryPhotos[selectedPhoto].title}
                </motion.h2>
                <motion.p 
                  className="text-white/80 mt-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {galleryPhotos[selectedPhoto].description}
                </motion.p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default PhotoGallery;
