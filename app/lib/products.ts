export const products = [
  {
    id: '1',
    name: 'Auto Farm Script',
    description: 'Advanced auto-farming script for Roblox games. Includes teleport, collect, and sell features.',
    price: 9.99,
    image: '/products/auto-farm.png',
    category: 'Scripts',
  },
  {
    id: '2',
    name: 'ESP Wallhack',
    description: 'See players and items through walls. Customizable colors and distance settings.',
    price: 14.99,
    image: '/products/esp.png',
    category: 'Scripts',
  },
  {
    id: '3',
    name: 'Auto Clicker Pro',
    description: 'Lightweight auto-clicker with adjustable CPS and hotkey support.',
    price: 4.99,
    image: '/products/clicker.png',
    category: 'Tools',
  },
  {
    id: '4',
    name: 'Discord Bot Template',
    description: 'Full-featured Discord bot template with moderation and music commands.',
    price: 19.99,
    image: '/products/bot.png',
    category: 'Bots',
  },
  {
    id: '5',
    name: 'UI Framework',
    description: 'Modern UI framework for Roblox scripts. Fully customizable themes.',
    price: 12.99,
    image: '/products/ui.png',
    category: 'Scripts',
  },
  {
    id: '6',
    name: 'Anti-AFK System',
    description: 'Prevent AFK kick in any game. Works with virtual movement simulation.',
    price: 7.99,
    image: '/products/antiafk.png',
    category: 'Scripts',
  },
];

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getAllProducts(): Product[] {
  return products;
}
