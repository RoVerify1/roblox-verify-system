import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/app/lib/auth';
import connectDB from '@/app/lib/db';
import { User } from '@/app/models/User';
import { memoryStore } from '@/app/lib/memoryStore';

let useMemoryStore = false;

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    let user;

    if (!useMemoryStore) {
      try {
        await connectDB();
        
        user = await User.findById(payload.userId);
        
        if (!user) {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }

        // Check if already purchased
        if (user.purchasedItems.includes(productId)) {
          return NextResponse.json(
            { error: 'Already purchased this item' },
            { status: 400 }
          );
        }

        // Add to purchased items
        user.purchasedItems.push(productId);
        await user.save();
      } catch (error) {
        console.log('MongoDB not available, using memory store');
        useMemoryStore = true;
      }
    }

    if (useMemoryStore || !user) {
      user = await memoryStore.findUserById(payload.userId);
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      if (user.purchasedItems.includes(productId)) {
        return NextResponse.json(
          { error: 'Already purchased this item' },
          { status: 400 }
        );
      }

      user.purchasedItems.push(productId);
      await memoryStore.updateUser(payload.userId, { purchasedItems: user.purchasedItems });
    }

    return NextResponse.json({
      message: 'Purchase successful',
      purchasedItems: user.purchasedItems,
    });
  } catch (error) {
    console.error('Purchase error:', error);
    return NextResponse.json(
      { error: 'Failed to purchase item' },
      { status: 500 }
    );
  }
}
