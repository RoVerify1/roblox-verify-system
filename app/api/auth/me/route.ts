import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/app/lib/auth';
import connectDB from '@/app/lib/db';
import { User } from '@/app/models/User';
import { memoryStore } from '@/app/lib/memoryStore';

let useMemoryStore = false;

export async function GET(request: NextRequest) {
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

    let user;

    if (!useMemoryStore) {
      try {
        await connectDB();
        user = await User.findById(payload.userId).select('-__v');
        
        if (!user) {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }
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
    }

    return NextResponse.json({
      user: {
        id: user._id.toString ? user._id.toString() : user._id,
        email: user.email,
        robloxUsername: user.robloxUsername,
        purchasedItems: user.purchasedItems,
        aiUsageCount: user.aiUsageCount,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Failed to get user' },
      { status: 500 }
    );
  }
}
