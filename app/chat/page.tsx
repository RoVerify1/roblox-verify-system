'use client';

import { useState, useRef, useEffect } from 'react';
import Navbar from '@/app/components/Navbar';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        role: 'assistant',
        content: `Error: ${error.message}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark to-black flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex flex-col pt-16">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 accent-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">AI Script Assistant</h2>
                <p className="text-gray-400 max-w-md mx-auto">
                  Ask me to generate scripts, code, or help with your programming tasks.
                  I specialize in Lua/Roblox, JavaScript, Python, and more!
                </p>
                <div className="mt-8 grid sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                  <button
                    onClick={() => setInput('Generate an auto-farm script for Roblox')}
                    className="glass p-4 rounded-lg text-sm hover:bg-white/10 transition-colors text-left"
                  >
                    🎮 Auto-farm script
                  </button>
                  <button
                    onClick={() => setInput('Create an ESP wallhack script')}
                    className="glass p-4 rounded-lg text-sm hover:bg-white/10 transition-colors text-left"
                  >
                    👁️ ESP Wallhack
                  </button>
                  <button
                    onClick={() => setInput('Make a Discord bot template')}
                    className="glass p-4 rounded-lg text-sm hover:bg-white/10 transition-colors text-left"
                  >
                    🤖 Discord Bot
                  </button>
                  <button
                    onClick={() => setInput('Create a UI framework for Roblox')}
                    className="glass p-4 rounded-lg text-sm hover:bg-white/10 transition-colors text-left"
                  >
                    🎨 UI Framework
                  </button>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                      message.role === 'user'
                        ? 'bg-accent text-white'
                        : 'glass-card text-gray-100'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="glass-card rounded-2xl px-6 py-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-white/10 px-4 py-6">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me to generate a script..."
                disabled={loading}
                className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-accent text-white placeholder-gray-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-8 py-4 bg-accent text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed accent-glow"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
