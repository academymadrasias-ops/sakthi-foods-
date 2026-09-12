import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { fetchLiveHeaderBanners, FALLBACK_BANNERS, getFallbackDriveUrl } from '../services/googleSheetService';

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [banners, setBanners] = useState(FALLBACK_BANNERS);
  const [isLoadingBanners, setIsLoadingBanners] = useState(true);
  const { setActiveCategory } = useCart();

  // Load live banner images from Google Sheet tab (gid: 736887566)
  useEffect(() => {
    async function loadBanners() {
      setIsLoadingBanners(true);
      try {
        const res = await fetchLiveHeaderBanners();
        if (res.banners && res.banners.length > 0) {
          setBanners(res.banners);
        }
      } catch (err) {
        console.error('Failed to fetch live banners:', err);
      } finally {
        setIsLoadingBanners(false);
      }
    }
    loadBanners();
  }, []);

  // Auto scroll every 4.5 seconds
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [banners.length]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 pt-3 md:px-6">
      <div className="relative rounded-xl overflow-hidden shadow-xs border border-gray-200 bg-slate-900 h-44 sm:h-64 md:h-80 group">
        {/* Banner Images Carousel (PURE IMAGE ONLY - NO TEXT OVERLAY) */}
        {banners.map((banner, index) => {
          const isCurrent = index === currentIndex;

          return (
            <div
              key={banner.id || index}
              onClick={() => setActiveCategory(banner.category || 'All Categories')}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out cursor-pointer ${
                isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              {/* Background Banner Image */}
              <img
                src={banner.imgSrc}
                alt={`Hero Banner ${index + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  if (!e.target.dataset.triedFallback) {
                    e.target.dataset.triedFallback = 'true';
                    const fallback = banner.fallbackUrl || getFallbackDriveUrl(banner.rawUrl || banner.imgSrc);
                    e.target.src = fallback;
                  } else {
                    e.target.src = '/assets/header image.png';
                  }
                }}
              />
            </div>
          );
        })}

        {/* Carousel Navigation Arrows */}
        {banners.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goToPrev(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs opacity-80 md:opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs opacity-80 md:opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Slide Indicators Dots */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 max-w-[80%] overflow-x-auto no-scrollbar py-0.5 px-2 bg-black/30 rounded-full backdrop-blur-xs">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                  className={`h-2 rounded-full transition-all duration-300 flex-shrink-0 ${
                    idx === currentIndex ? 'w-6 bg-[#ffd814]' : 'w-2 bg-white/60 hover:bg-white'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
