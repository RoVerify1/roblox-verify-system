'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/app/components/Navbar';

interface User {
  id: string;
  email: string;
  robloxUsername?: string;
  purchasedItems: string[];
  aiUsageCount: number;
  createdAt: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        const adminEmails = ['admin@xerionx.com', 'admin@example.com'];
        if (adminEmails.includes(data.user.email)) {
          setIsAdmin(true);
          fetchUsers();
        } else {
          setError('Access denied. Admin privileges required.');
        }
      } else {
        setError('Not authenticated. Please login as admin.');
      }
    } catch (err) {
      setError('Failed to verify admin status.');
    } finally {
      setChecking(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await res.json();
      setUsers(data.users);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark to-black">
        <Navbar />
        <div className="pt-24 px-4 flex items-center justify-center">
          <div className="text-gray-400">Checking permissions...</div>
        </div>
      </div>
    );
  }

  if (!isAdmin && error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark to-black">
        <Navbar />
        <div className="pt-24 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="glass-card p-8 text-center">
              <h1 className="text-2xl font-bold mb-4 accent-text">Access Denied</h1>
              <p className="text-gray-400 mb-6">{error}</p>
              <a href="/login" className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-orange-600 transition-colors">
                Login as Admin
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark to-black">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">
            <span className="accent-text">Admin Dashboard</span>
          </h1>

          {/* Stats Cards */}
          <div className="grid sm:grid-cols-3 gap-6 mb-8">
            <div className="glass-card p-6">
              <h3 className="text-gray-400 text-sm mb-2">Total Users</h3>
              <p className="text-3xl font-bold accent-text">{users.length}</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-gray-400 text-sm mb-2">Total Purchases</h3>
              <p className="text-3xl font-bold accent-text">
                {users.reduce((sum, u) => sum + u.purchasedItems.length, 0)}
              </p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-gray-400 text-sm mb-2">AI Requests</h3>
              <p className="text-3xl font-bold accent-text">
                {users.reduce((sum, u) => sum + u.aiUsageCount, 0)}
              </p>
            </div>
          </div>

          {/* Users Table */}
          <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-semibold">Registered Users</h2>
            </div>
            
            {loading ? (
              <div className="p-8 text-center text-gray-400">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No users found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Roblox Username</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Purchases</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">AI Usage</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-white">{user.email}</td>
                        <td className="px-6 py-4 text-gray-400">
                          {user.robloxUsername || '-'}
                        </td>
                        <td className="px-6 py-4 text-gray-400">
                          <span className="px-2 py-1 bg-accent/20 text-accent rounded-full text-sm">
                            {user.purchasedItems.length} items
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-400">{user.aiUsageCount}</td>
                        <td className="px-6 py-4 text-gray-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Purchase History Section */}
          <div className="mt-8 glass-card overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-semibold">Recent Purchases</h2>
            </div>
            {loading ? (
              <div className="p-8 text-center text-gray-400">Loading purchases...</div>
            ) : (
              <div className="p-6">
                <div className="space-y-4">
                  {users.flatMap((user) =>
                    user.purchasedItems.map((itemId) => (
                      <div
                        key={`${user.id}-${itemId}`}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                      >
                        <div>
                          <p className="text-white font-medium">Item #{itemId}</p>
                          <p className="text-sm text-gray-400">{user.email}</p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date().toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  ).length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No purchases yet.</p>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
