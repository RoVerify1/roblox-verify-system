'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/app/components/Navbar';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [displayOtp, setDisplayOtp] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      setMessage('OTP sent! Check the console for the code (demo mode).');
      if (data.otp) {
        setDisplayOtp(data.otp);
      }
      setStep('otp');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to verify OTP');
      }

      // Store token in localStorage for client-side access
      localStorage.setItem('token', 'set');
      
      setMessage('Login successful! Redirecting...');
      setTimeout(() => {
        router.push(redirect);
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark to-black">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="glass-card p-8">
            <h1 className="text-3xl font-bold text-center mb-2">
              <span className="accent-text">Welcome Back</span>
            </h1>
            <p className="text-gray-400 text-center mb-8">
              Sign in to your account
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
                {error}
              </div>
            )}

            {message && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">
                {message}
              </div>
            )}

            {displayOtp && (
              <div className="mb-6 p-4 bg-accent/20 border border-accent/50 rounded-lg">
                <p className="text-sm text-gray-300 mb-2">Your OTP (Demo Mode):</p>
                <p className="text-3xl font-mono font-bold accent-text tracking-wider">{displayOtp}</p>
              </div>
            )}

            {step === 'email' ? (
              <form onSubmit={handleSendOtp}>
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent text-white placeholder-gray-500"
                    placeholder="you@example.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed accent-glow"
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <div className="mb-6">
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-2">
                    Enter OTP Code
                  </label>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={6}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent text-white placeholder-gray-500 text-center text-2xl tracking-widest"
                    placeholder="000000"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed accent-glow"
                >
                  {loading ? 'Verifying...' : 'Verify & Login'}
                </button>
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="w-full mt-4 px-4 py-3 glass text-gray-300 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  Change Email
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
