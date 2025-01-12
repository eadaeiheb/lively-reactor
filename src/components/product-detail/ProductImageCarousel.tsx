import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, ZoomOut, X } from 'lucide-react';

interface ProductImageCarouselProps {
  images: string[];
  name: string;
}

const ProductImageCarousel = ({ images, name }: ProductImageCarouselProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const filteredImages = images.filter(img => img !== '');

  if (filteredImages.length === 0) return null;

  // Get other images excluding the selected one
  const otherImages = filteredImages.filter((_, index) => index !== selectedImage);

  return (
    <div className="flex gap-6">
      {/* Thumbnails column */}
      <div className="flex flex-col gap-4">
        {otherImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(filteredImages.indexOf(image))}
            className="w-32 h-32 rounded-lg overflow-hidden border-2 border-transparent hover:border-gray-200 transition-all duration-300"
          >
            <img
              src={image}
              alt={`${name} - Thumbnail ${index + 1}`}
              className="w-full h-full object-contain mix-blend-normal p-2 opacity-80 hover:opacity-100 transition-opacity"
            />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="flex-1 relative">
        <div 
          className="aspect-square bg-white rounded-xl overflow-hidden cursor-zoom-in"
          onClick={() => setIsZoomed(true)}
        >
          <motion.img
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            src={filteredImages[selectedImage]}
            alt={`${name} - Image ${selectedImage + 1}`}
            className="w-full h-full object-contain mix-blend-normal p-4"
          />
          <button
            className="absolute bottom-4 right-4 p-2 bg-black/10 rounded-full opacity-0 hover:opacity-100 transition-opacity"
          >
            <ZoomIn className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Zoom Modal */}
      <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-black/95">
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute right-4 top-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="w-full h-full flex items-center justify-center p-4">
            <img
              src={filteredImages[selectedImage]}
              alt={name}
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductImageCarousel;