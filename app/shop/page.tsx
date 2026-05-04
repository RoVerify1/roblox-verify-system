'use client';

import { useState } from 'react';
import Navbar from '@/app/components/Navbar';
import { getAllProducts, Product } from '@/app/lib/products';

export default function ShopPage() {
  const products = getAllProducts();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark to-black">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">
            <span className="accent-text">Shop</span>
          </h1>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category
                    ? 'bg-accent text-white'
                    : 'glass text-gray-300 hover:bg-white/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <a
      href={`/item/${product.id}`}
      className="glass-card p-6 hover:accent-glow transition-all group"
    >
      <div className="aspect-video bg-gradient-to-br from-accent/20 to-transparent rounded-lg mb-4 flex items-center justify-center">
        <svg className="w-16 h-16 text-accent/50 group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-white group-hover:text-accent transition-colors">
          {product.name}
        </h3>
        <span className="text-accent font-bold">${product.price}</span>
      </div>
      <p className="text-sm text-gray-400 line-clamp-2 mb-3">{product.description}</p>
      <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300">
        {product.category}
      </span>
    </a>
  );
}
