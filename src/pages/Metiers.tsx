
import { motion } from "framer-motion";

const metiers = [
  {
    title: 'Médical',
    image: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c',
    description: 'Blouses, uniformes et accessoires pour les professionnels de santé',
    categories: ['Blouses', 'Uniformes', 'Chaussures', 'Accessoires'],
    gradient: 'linear-gradient(109.6deg, rgba(223,234,247,1) 11.2%, rgba(244,248,252,1) 91.1%)',
    color: 'text-blue-600'
  },
  {
    title: 'Industrie',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    description: 'Équipements de protection et vêtements techniques pour l\'industrie',
    categories: ['EPI', 'Combinaisons', 'Chaussures de sécurité', 'Gants'],
    gradient: 'linear-gradient(90deg, hsla(29, 92%, 70%, 1) 0%, hsla(0, 87%, 73%, 1) 100%)',
    color: 'text-orange-600'
  },
  {
    title: 'Bâtiment',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd',
    description: 'Tenues professionnelles adaptées aux métiers du BTP',
    categories: ['Vestes', 'Pantalons', 'Casques', 'Accessoires'],
    gradient: 'linear-gradient(90deg, hsla(46, 73%, 75%, 1) 0%, hsla(176, 73%, 88%, 1) 100%)',
    color: 'text-yellow-600'
  },
  {
    title: 'Restauration',
    image: 'https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf',
    description: 'Tenues élégantes et pratiques pour la restauration',
    categories: ['Vestes de cuisine', 'Tabliers', 'Pantalons', 'Toques'],
    gradient: 'linear-gradient(90deg, hsla(24, 100%, 83%, 1) 0%, hsla(341, 91%, 68%, 1) 100%)',
    color: 'text-red-600'
  },
  {
    title: 'Sécurité',
    image: 'https://images.unsplash.com/photo-1587578016785-bea53a782ea8',
    description: 'Équipements professionnels pour les agents de sécurité',
    categories: ['Uniformes', 'Chaussures', 'Accessoires', 'Protection'],
    gradient: 'linear-gradient(90deg, hsla(221, 45%, 73%, 1) 0%, hsla(220, 78%, 29%, 1) 100%)',
    color: 'text-gray-600'
  },
  {
    title: 'Transport',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d',
    description: 'Tenues adaptées aux professionnels du transport',
    categories: ['Uniformes', 'Vestes', 'Accessoires', 'Chaussures'],
    gradient: 'linear-gradient(90deg, hsla(139, 70%, 75%, 1) 0%, hsla(63, 90%, 76%, 1) 100%)',
    color: 'text-green-600'
  }
];

const Metiers = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1582719478250-c89cae4dc85b)',
            filter: 'brightness(0.7)'
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative container mx-auto h-full flex flex-col justify-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
          >
            Nos Métiers
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/90 max-w-2xl"
          >
            Des solutions professionnelles adaptées à chaque secteur d'activité
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {metiers.map((metier, index) => (
            <motion.div
              key={metier.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative h-[280px] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              style={{ width: '100%', maxWidth: '200px', margin: '0 auto' }}
            >
              {/* Gradient Background */}
              <div 
                className="absolute inset-0 opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: metier.gradient }}
              />
              
              {/* Content Container */}
              <div className="relative h-full flex flex-col">
                {/* Image */}
                <div className="flex-1 p-4 flex items-center justify-center">
                  <img 
                    src={metier.image} 
                    alt={metier.title}
                    className="w-24 h-24 object-cover rounded-full shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                
                {/* Text Content */}
                <div className="p-4 text-center bg-white/90 backdrop-blur-sm">
                  <h3 className={`text-lg font-bold mb-1 ${metier.color}`}>
                    {metier.title}
                  </h3>
                  <div className="flex flex-wrap justify-center gap-1">
                    {metier.categories.slice(0, 2).map((category) => (
                      <span 
                        key={category}
                        className="px-2 py-0.5 text-[10px] bg-white/80 text-gray-700 rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Metiers;
