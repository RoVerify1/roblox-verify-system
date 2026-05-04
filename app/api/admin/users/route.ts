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

    // Only allow admin users (check by email domain or specific list)
    const adminEmails = ['admin@xerionx.com', 'admin@example.com'];
    if (!adminEmails.includes(payload.email)) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    let users;

    if (!useMemoryStore) {
      try {
        await connectDB();
        users = await User.find().select('-__v -otp');
      } catch (error) {
        console.log('MongoDB not available, using memory store');
        useMemoryStore = true;
      }
    }

    if (useMemoryStore || !users) {
      users = await memoryStore.getAllUsers();
    }

    return NextResponse.json({
      users: users.map((u: any) => ({
        id: u._id.toString ? u._id.toString() : u._id,
        email: u.email,
        robloxUsername: u.robloxUsername,
        purchasedItems: u.purchasedItems,
        aiUsageCount: u.aiUsageCount,
        createdAt: u.createdAt,
      })),
    });
  } catch (error) {
    console.error('Admin users error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
