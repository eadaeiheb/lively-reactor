import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X } from 'lucide-react';

interface HeroVideoProps {
  thumbnailUrl: string;
  videoUrl: string;
  title?: string;
  description?: string;
}

const HeroVideo: React.FC<HeroVideoProps> = ({ thumbnailUrl, videoUrl, title, description }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group"
        onClick={() => setIsModalOpen(true)}
      >
        <img
          src={thumbnailUrl}
          alt="Video Thumbnail"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />
        {title && (
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <h3 className="text-xl md:text-2xl font-bold mb-2">{title}</h3>
            {description && <p className="text-gray-200">{description}</p>}
          </div>
        )}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileHover={{ scale: 1, opacity: 1 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gold-500 rounded-full flex items-center justify-center gold-glow">
            <Play className="w-8 h-8 md:w-10 md:h-10 text-black" />
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-6xl aspect-video bg-black rounded-xl overflow-hidden gold-glow"
            >
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                src={videoUrl}
                onClick={togglePlay}
                playsInline
              />
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  if (videoRef.current) {
                    videoRef.current.pause();
                    setIsPlaying(false);
                  }
                }}
                className="absolute top-4 right-4 w-10 h-10 bg-black/80 rounded-full flex items-center justify-center text-gold-400 hover:text-gold-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <button
                onClick={togglePlay}
                className="absolute bottom-4 right-4 w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center text-black hover:bg-gold-400 transition-colors"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HeroVideo;