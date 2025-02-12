
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Star, StarHalf } from "lucide-react";
import { categoriesContent } from "@/config/categoryContent";

const VetementsCuisine = () => {
  const content = categoriesContent['vetements-cuisine'];
  const [sortBy, setSortBy] = useState("recommended");

  const getBadgeStyle = (type: 'promo' | 'destockage' | 'new') => {
    switch (type) {
      case 'promo':
        return 'bg-red-600';
      case 'destockage':
        return 'bg-blue-600';
      case 'new':
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  const renderStars = (score: number) => {
    const stars = [];
    const fullStars = Math.floor(score);
    const hasHalfStar = score % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    const remainingStars = 5 - Math.ceil(score);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gray-100">
        <div className="container mx-auto py-4 px-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary">Accueil</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900">{content.headerTitle}</span>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="flex justify-center px-4 py-8">
        <div className="relative w-[90%] md:w-[80%] h-[300px] md:h-[400px] overflow-hidden rounded-2xl">
          <img
            src={content.bannerImage}
            alt={content.headerTitle}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="text-center text-white">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                {content.headerTitle}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-[90%] md:max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              {content.title}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6 text-center">
              {content.description}
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-[90%] md:max-w-[80%] mx-auto">
            {/* Products Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Notre Collection</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Produits 1-{content.products.length} sur {content.products.length}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-600">Trier par</span>
                <select 
                  className="border rounded-md px-4 py-2 bg-white"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recommended">Recommandé</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="newest">Nouveautés</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {content.products.map((product) => (
                <div 
                  key={product.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-[300px] object-cover hover:scale-105 transition-transform duration-300"
                    />
                    {product.badge && (
                      <div className={`absolute top-4 left-0 ${getBadgeStyle(product.badge.type)} text-white px-4 py-1 rounded-r-lg`}>
                        {product.badge.text}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-3 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center mb-3">
                      {renderStars(product.rating.score)}
                      <span className="ml-2 text-sm text-gray-600">
                        {product.rating.score}/5 - {product.rating.reviews} avis
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-medium text-gray-500">À partir de</span>
                        <span className="text-xl font-semibold text-primary">{product.price.toFixed(2)} €</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">{product.originalPrice.toFixed(2)} €</span>
                        )}
                      </div>
                      <Link 
                        to="/devis"
                        className="inline-block bg-primary text-white text-center px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Demander un devis
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-[90%] md:max-w-[80%] mx-auto bg-primary rounded-2xl text-white p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Besoin d'un devis personnalisé ?
            </h2>
            <p className="mb-8 text-lg max-w-2xl mx-auto">
              Contactez-nous pour obtenir un devis adapté à vos besoins spécifiques
            </p>
            <Link
              to="/devis"
              className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Demander un devis
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VetementsCuisine;

