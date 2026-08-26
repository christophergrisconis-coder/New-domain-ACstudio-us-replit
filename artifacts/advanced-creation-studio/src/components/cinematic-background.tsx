import { useEffect, useState } from 'react';

const IMAGES = [
  "https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=1600",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1600",
  "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=1600",
  "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=1600",
  "https://images.unsplash.com/photo-1616499370260-485b3e5ed653?auto=format&fit=crop&q=80&w=1600",
  "https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&q=80&w=1600",
  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1600",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1600",
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=1600",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1600"
];

const INTERVAL_MS = 6000;

export function CinematicBackground() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
    }, INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0a0a0a]">
      {IMAGES.map((src, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-35 z-10' : 'opacity-0 z-0'}`}
          >
            <img 
              src={src} 
              alt="Cinematic background"
              className={`h-full w-full object-cover transition-transform duration-[8000ms] ease-linear origin-center ${isActive ? 'scale-110' : 'scale-100'}`}
              style={{ filter: 'saturate(0.6) contrast(1.1)' }}
            />
          </div>
        );
      })}
      {/* Overlay to ensure text readability and maintain brand vibe */}
      <div className="absolute inset-0 bg-[#0a0a0a]/50 mix-blend-multiply z-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/30 to-[#0a0a0a] z-20" />
      {/* We keep the ambient scanline effect from the original for tech feel */}
      <div className="ambient-scanline z-30" />
    </div>
  );
}
