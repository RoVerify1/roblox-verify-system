import Navbar from '@/app/components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark to-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">Welcome to </span>
            <span className="accent-text">XerionX</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Your ultimate destination for AI-generated scripts, tools, and digital products.
            Powered by cutting-edge AI technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/shop"
              className="px-8 py-4 bg-accent text-white rounded-lg text-lg font-semibold hover:bg-orange-600 transition-all accent-glow-hover"
            >
              Browse Shop
            </a>
            <a
              href="/chat"
              className="px-8 py-4 glass text-white rounded-lg text-lg font-semibold hover:bg-white/10 transition-all"
            >
              Try AI Chat
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="accent-text">Features</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-8 hover:accent-glow transition-all">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 accent-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Script Generation</h3>
              <p className="text-gray-400">
                Generate custom scripts instantly using our advanced AI powered by Hugging Face models.
              </p>
            </div>

            <div className="glass-card p-8 hover:accent-glow transition-all">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 accent-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Digital Products</h3>
              <p className="text-gray-400">
                Browse and purchase premium scripts, tools, and templates for your projects.
              </p>
            </div>

            <div className="glass-card p-8 hover:accent-glow transition-all">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 accent-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Authentication</h3>
              <p className="text-gray-400">
                Email OTP-based login system ensures your account stays secure and accessible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center glass-card p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-400 mb-8">
            Join thousands of users creating amazing scripts with XerionX AI Shop.
          </p>
          <a
            href="/login"
            className="inline-block px-8 py-4 bg-accent text-white rounded-lg text-lg font-semibold hover:bg-orange-600 transition-all accent-glow"
          >
            Create Account
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
          <p>&copy; 2024 XerionX AI Shop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
