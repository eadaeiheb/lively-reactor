import { useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';

const HeroSection = () => {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const text = "Innovation through simplicity.";
    let index = 0;
    const interval = setInterval(() => {
      if (textRef.current && index <= text.length) {
        textRef.current.textContent = text.slice(0, index);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative px-6">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
          <span ref={textRef} className="bg-clip-text"></span>
        </h1>
        <p className="text-soft-600 text-lg md:text-xl max-w-2xl mx-auto mb-12 animate-fadeIn opacity-0" style={{ animationDelay: '1s' }}>
          Experience design that puts user needs first, creating meaningful interactions through thoughtful simplicity.
        </p>
      </div>
      
      <div className="absolute bottom-12 animate-bounce">
        <ArrowDown size={24} className="text-soft-400" />
      </div>
    </section>
  );
};

export default HeroSection;