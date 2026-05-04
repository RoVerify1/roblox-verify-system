'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import { getProductById, Product } from '@/app/lib/products';

export default function ItemPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [alreadyPurchased, setAlreadyPurchased] = useState(false);

  useEffect(() => {
    const productId = params.id as string;
    const foundProduct = getProductById(productId);
    
    if (foundProduct) {
      setProduct(foundProduct);
    }
    
    // Check if logged in and if already purchased
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    
    if (token) {
      checkPurchaseStatus(productId);
    }
    
    setLoading(false);
  }, [params.id]);

  const checkPurchaseStatus = async (productId: string) => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.user.purchasedItems.includes(productId)) {
          setAlreadyPurchased(true);
        }
      }
    } catch (error) {
      console.error('Failed to check purchase status:', error);
    }
  };

  const handlePurchase = async () => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=/item/${params.id}`);
      return;
    }

    setPurchasing(true);
    try {
      const res = await fetch('/api/shop/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: params.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Purchase failed');
      }

      setAlreadyPurchased(true);
      alert('Purchase successful! Item added to your inventory.');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark to-black">
        <Navbar />
        <div className="pt-24 px-4 flex items-center justify-center">
          <div className="text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark to-black">
        <Navbar />
        <div className="pt-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
            <a href="/shop" className="text-accent hover:underline">
              Back to Shop →
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark to-black">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <a href="/shop" className="text-gray-400 hover:text-accent mb-6 inline-block">
            ← Back to Shop
          </a>

          <div className="glass-card p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="aspect-square bg-gradient-to-br from-accent/20 to-transparent rounded-lg flex items-center justify-center">
                <svg className="w-32 h-32 text-accent/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>

              {/* Product Info */}
              <div>
                <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300 mb-4">
                  {product.category}
                </span>
                <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                <p className="text-2xl accent-text font-bold mb-6">${product.price}</p>
                <p className="text-gray-300 mb-8">{product.description}</p>

                {alreadyPurchased ? (
                  <button
                    disabled
                    className="w-full px-6 py-4 bg-green-600 text-white rounded-lg font-semibold cursor-default"
                  >
                    ✓ Already Purchased
                  </button>
                ) : (
                  <button
                    onClick={handlePurchase}
                    disabled={purchasing}
                    className="w-full px-6 py-4 bg-accent text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 accent-glow"
                  >
                    {purchasing ? 'Processing...' : isLoggedIn ? 'Buy Now' : 'Login to Purchase'}
                  </button>
                )}

                {!isLoggedIn && !alreadyPurchased && (
                  <p className="text-sm text-gray-400 mt-4 text-center">
                    You need to be logged in to make a purchase.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
