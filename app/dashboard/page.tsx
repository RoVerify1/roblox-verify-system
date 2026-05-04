'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/app/components/Navbar';

interface User {
  id: string;
  email: string;
  robloxUsername?: string;
  purchasedItems: string[];
  aiUsageCount: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [robloxUsername, setRobloxUsername] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        if (data.user.robloxUsername) {
          setRobloxUsername(data.user.robloxUsername);
        }
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRoblox = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // This would normally be an API call to update the user
    // For demo, we'll just update local state
    setTimeout(() => {
      if (user) {
        setUser({ ...user, robloxUsername });
      }
      setSaving(false);
      alert('Roblox username saved!');
    }, 500);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark to-black">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">
            <span className="accent-text">Dashboard</span>
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* User Info Card */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4">Account Information</h2>
              {user && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400">Email</label>
                    <p className="text-white">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">AI Usage Count</label>
                    <p className="text-white">{user.aiUsageCount} requests</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Member Since</label>
                    <p className="text-white">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Roblox Integration Card */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4">Roblox Account</h2>
              <form onSubmit={handleSaveRoblox}>
                <div className="mb-4">
                  <label htmlFor="roblox" className="block text-sm font-medium text-gray-300 mb-2">
                    Roblox Username
                  </label>
                  <input
                    type="text"
                    id="roblox"
                    value={robloxUsername}
                    onChange={(e) => setRobloxUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent text-white placeholder-gray-500"
                    placeholder="Enter your Roblox username"
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full px-4 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Username'}
                </button>
              </form>
              <p className="text-xs text-gray-500 mt-4">
                Link your Roblox account for future inventory sync and gamepass verification features.
              </p>
            </div>

            {/* Purchased Items Card */}
            <div className="glass-card p-6 md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Purchased Items</h2>
              {user && user.purchasedItems.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {user.purchasedItems.map((itemId) => (
                    <div key={itemId} className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <p className="text-white font-medium">Item #{itemId}</p>
                      <p className="text-sm text-gray-400">Purchased</p>
                      <a
                        href={`/item/${itemId}`}
                        className="text-accent text-sm hover:underline mt-2 inline-block"
                      >
                        View Details →
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 py-8 text-center">
                  <p>No purchases yet.</p>
                  <a href="/shop" className="text-accent hover:underline mt-2 inline-block">
                    Browse Shop →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
