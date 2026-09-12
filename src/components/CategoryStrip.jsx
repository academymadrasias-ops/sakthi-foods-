import React from 'react';
import { useCart } from '../context/CartContext';
import { Sparkles, Wheat } from 'lucide-react';

// Category presets with dedicated custom isolated category images
const CATEGORY_PRESETS = [
  { name: 'All Categories', image: '/assets/categories/cat_all.jpg', fallbackBg: 'bg-emerald-50' },
  { name: 'Combo Deals', image: '/assets/categories/cat_combos.jpg', fallbackBg: 'bg-amber-50' },
  { name: 'Organic Rice', image: '/assets/categories/cat_rice.jpg', fallbackBg: 'bg-[#e7f4e8]' },
  { name: 'Millets', image: '/assets/categories/cat_millets.jpg', fallbackBg: 'bg-orange-50' },
  { name: 'Tea & Health', image: '/assets/categories/cat_tea.jpg', fallbackBg: 'bg-rose-50' },
  { name: 'Aval & Flour', image: '/assets/categories/cat_flour.jpg', fallbackBg: 'bg-purple-50' },
  { name: 'Offers', image: '/assets/categories/cat_offers.jpg', fallbackBg: 'bg-yellow-50' }
];

export default function CategoryStrip({ availableCategories = [] }) {
  const { activeCategory, setActiveCategory } = useCart();

  // Combine preset categories with dynamic ones
  const dynamicCategoryList = React.useMemo(() => {
    const list = [...CATEGORY_PRESETS];
    availableCategories.forEach(catName => {
      if (!list.some(item => item.name.toLowerCase() === catName.toLowerCase())) {
        list.push({
          name: catName,
          image: '/assets/categories/cat_all.jpg',
          fallbackBg: 'bg-gray-50'
        });
      }
    });
    return list;
  }, [availableCategories]);

  return (
    <div className="bg-white border-b border-gray-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 py-2.5 md:px-6">
        <div className="flex items-center gap-3 md:gap-6 overflow-x-auto no-scrollbar py-1">
          {dynamicCategoryList.map((cat) => {
            const isActive = activeCategory.toLowerCase() === cat.name.toLowerCase();

            return (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className="flex flex-col items-center gap-1.5 flex-shrink-0 group focus:outline-none transition-transform active:scale-95"
              >
                {/* Circular Image Container */}
                <div
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center border overflow-hidden p-1 bg-white transition-all duration-200 ${
                    isActive
                      ? 'border-[#87d8d2] ring-2 ring-[#87d8d2] scale-105 shadow-md'
                      : 'border-gray-200 group-hover:border-[#87d8d2] group-hover:scale-105 shadow-2xs'
                  }`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback if image fails
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className={`hidden w-full h-full rounded-full items-center justify-center ${cat.fallbackBg}`}>
                    <Sparkles className="w-5 h-5 text-[#007600]" />
                  </div>
                </div>

                {/* Category Title */}
                <span
                  className={`text-[11px] md:text-xs font-semibold whitespace-nowrap transition-colors ${
                    isActive ? 'text-[#0f1111] font-extrabold' : 'text-[#565959] group-hover:text-[#0f1111]'
                  }`}
                >
                  {cat.name}
                </span>

                {/* Active Underline Pill */}
                {isActive && (
                  <span className="w-6 h-0.5 bg-[#ffa41c] rounded-full animate-in fade-in duration-200"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
