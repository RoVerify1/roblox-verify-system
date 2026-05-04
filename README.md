# 🚀 XerionX AI Shop

A complete, production-ready web application featuring AI-powered chat, digital product shop, and user authentication.

## 🎯 Features

- **Modern SaaS Design**: Dark theme with orange accents (#ff6a00) and glassmorphism UI
- **AI Chat System**: ChatGPT-like interface powered by Hugging Face API
- **Digital Shop**: Browse and purchase scripts, tools, and digital products
- **Email OTP Authentication**: Secure login system with one-time passwords
- **User Dashboard**: Manage profile, view purchases, link Roblox account
- **Admin Panel**: View users, purchases, and platform statistics
- **MongoDB + Fallback**: Uses MongoDB when available, falls back to in-memory storage
- **JWT Sessions**: Secure token-based authentication
- **Fully Responsive**: Works on desktop and mobile devices

## 📁 Project Structure

```
/workspace
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   ├── login/page.tsx        # Login page (OTP)
│   ├── chat/page.tsx         # AI chat interface
│   ├── shop/page.tsx         # Product listing
│   ├── item/[id]/page.tsx    # Product detail page
│   ├── dashboard/page.tsx    # User dashboard
│   ├── admin/page.tsx        # Admin panel
│   ├── components/
│   │   └── Navbar.tsx        # Navigation component
│   ├── api/
│   │   ├── ai/chat/route.ts  # AI chat endpoint
│   │   ├── auth/
│   │   │   ├── login/route.ts       # Send OTP
│   │   │   ├── verify-otp/route.ts  # Verify OTP
│   │   │   └── me/route.ts          # Get current user
│   │   ├── shop/purchase/route.ts   # Purchase endpoint
│   │   └── admin/users/route.ts     # Admin users endpoint
│   ├── lib/
│   │   ├── db.ts             # MongoDB connection
│   │   ├── auth.ts           # JWT & OTP utilities
│   │   ├── memoryStore.ts    # In-memory fallback storage
│   │   └── products.ts       # Product data
│   └── models/
│       ├── User.ts           # User schema
│       └── Otp.ts            # OTP schema
├── middleware.ts             # Route protection middleware
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── .env.example              # Environment variables template
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your values:

```env
# Hugging Face API (optional - app works in demo mode without it)
HUGGINGFACE_API_KEY=your_api_key_here
HF_MODEL_ID=Qwen/Qwen2.5-7B-Instruct
HF_API_URL=https://router.huggingface.co/v1/chat/completions

# MongoDB (optional - app uses in-memory storage if not provided)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/xerionx

# JWT Secret (change in production!)
JWT_SECRET=your-secret-key-change-in-production
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎮 Usage Guide

### Landing Page (`/`)
- Modern SaaS homepage with feature highlights
- Quick links to shop and AI chat
- Call-to-action for new users

### AI Chat (`/chat`)
- Protected route (requires login)
- ChatGPT-like interface
- Pre-built prompts for script generation
- Real-time AI responses via Hugging Face
- Demo mode available without API key

### Shop (`/shop`)
- Browse products by category
- Filter by Scripts, Tools, Bots
- Click products to view details

### Product Detail (`/item/[id]`)
- View full product information
- Purchase button (requires login)
- Shows if already purchased

### Login (`/login`)
- Enter email address
- Receive OTP (shown in console/demo UI)
- Enter OTP to authenticate
- JWT token stored in cookie + localStorage

### Dashboard (`/dashboard`)
- Protected route (requires login)
- View account information
- Link Roblox username
- See purchased items
- Track AI usage count

### Admin Panel (`/admin`)
- Access with admin email (admin@xerionx.com or admin@example.com)
- View all registered users
- See total purchases and AI usage stats
- Browse purchase history

## 🔐 Authentication Flow

1. User enters email on `/login`
2. System generates 6-digit OTP
3. OTP displayed in UI (demo mode) or sent via email
4. User enters OTP
5. System creates/finds user account
6. JWT token issued and stored
7. User redirected to intended page

## 🛒 Purchase Flow

1. User browses shop
2. Clicks product to view details
3. Clicks "Buy Now" (redirects to login if not authenticated)
4. Purchase recorded in user's account
5. Item appears in dashboard under "Purchased Items"
6. Cannot purchase same item twice

## 🤖 AI Chat Features

- **Script Generation**: Lua/Roblox, JavaScript, Python
- **Code Explanation**: Understand existing code
- **Debugging Help**: Fix errors in your scripts
- **Best Practices**: Learn coding standards

**Demo Mode**: Without API key, returns helpful fallback responses.

## 📊 Data Storage

The app supports two storage modes:

### MongoDB Mode (Production)
- Persistent user data
- OTP records with auto-expiry
- Purchase history
- Requires `MONGODB_URI` env variable

### In-Memory Mode (Development/Fallback)
- No setup required
- Data lost on server restart
- Perfect for testing and demos
- Automatic fallback if MongoDB unavailable

## 🎨 Design System

- **Primary Color**: Orange (#ff6a00)
- **Background**: Dark gradient (#0a0a0a to #000000)
- **Glass Effect**: Semi-transparent cards with blur
- **Glow Effects**: Subtle shadows on interactive elements
- **Typography**: Inter font family
- **Animations**: Smooth transitions and hover states

## 🔒 Security Features

- JWT tokens with 7-day expiry
- HTTP-only cookies for token storage
- Server-side API key protection
- OTP expiration (10 minutes)
- One-time use OTP codes
- Protected routes via middleware
- Admin-only endpoints

## 📱 Responsive Design

- Mobile-first approach
- Hamburger menu on small screens
- Touch-friendly buttons
- Adaptive grid layouts
- Optimized touch targets

## 🚧 Future Enhancements

- Real email sending (SendGrid, AWS SES)
- Roblox API integration for inventory sync
- Payment processing (Stripe, PayPal)
- Gamepass verification system
- AI usage limits per user
- Download links for purchased items
- User reviews and ratings

## 📄 License

MIT License - Free for personal and commercial use

---

**Built with Next.js 14, TypeScript, TailwindCSS, MongoDB, and Hugging Face AI**
