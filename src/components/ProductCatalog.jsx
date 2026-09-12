import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import ProductCard from './ProductCard';
import { PackageSearch } from 'lucide-react';

export default function ProductCatalog({ products = [], isLoading = false, onRefresh }) {
  const { activeCategory, searchQuery, setSearchQuery } = useCart();
  const [sortBy, setSortBy] = useState('featured');

  // Filter products by active category and search text
  const filteredProducts = React.useMemo(() => {
    return products.filter(product => {
      // Category filter
      const matchCat =
        activeCategory === 'All Categories' ||
        activeCategory === 'Offers' ||
        product.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
        (activeCategory === 'Combo Deals' && (product.category.toLowerCase().includes('combo') || product.name.toLowerCase().includes('combo')));

      // Search filter
      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);

      return matchCat && matchSearch;
    });
  }, [products, activeCategory, searchQuery]);

  // Sort products
  const sortedProducts = React.useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'discount') {
      list.sort((a, b) => b.discountPercent - a.discountPercent);
    }
    return list;
  }, [filteredProducts, sortBy]);

  return (
    <section id="shop-catalog" className="max-w-7xl mx-auto px-3 py-4 md:px-6">


      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-3 h-64 flex flex-col justify-between">
              <div className="w-full h-32 animate-shimmer rounded-lg"></div>
              <div className="h-4 animate-shimmer rounded-md w-3/4 mt-2"></div>
              <div className="h-3 animate-shimmer rounded-md w-1/2 mt-1"></div>
              <div className="h-8 animate-shimmer rounded-full mt-3"></div>
            </div>
          ))}
        </div>
      ) : sortedProducts.length > 0 ? (
        /* Product Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {sortedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center max-w-md mx-auto my-6 shadow-xs">
          <div className="w-16 h-16 bg-[#e7f4e8] text-[#007600] rounded-full flex items-center justify-center mx-auto mb-3">
            <PackageSearch className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-[#0f1111]">No products found</h3>
          <p className="text-xs text-[#565959] mt-1">
            We couldn't find any products under "{activeCategory}" matching your filter.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-4 bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] border border-[#fcd200] font-bold text-xs px-5 py-2 rounded-full shadow-2xs transition-colors"
          >
            Clear Search & Filters
          </button>
        </div>
      )}
    </section>
  );
}
