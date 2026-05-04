import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import { User } from '@/app/models/User';
import { Otp } from '@/app/models/Otp';
import { memoryStore } from '@/app/lib/memoryStore';
import { generateToken } from '@/app/lib/auth';

let useMemoryStore = false;

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Try to use MongoDB, fallback to memory store
    let otpRecord;
    
    if (!useMemoryStore) {
      try {
        await connectDB();
        otpRecord = await Otp.findOne({ email, otp });
        
        if (!otpRecord) {
          return NextResponse.json(
            { error: 'Invalid or expired OTP' },
            { status: 401 }
          );
        }

        if (otpRecord.expiresAt < new Date()) {
          await Otp.deleteOne({ _id: otpRecord._id });
          return NextResponse.json(
            { error: 'OTP has expired' },
            { status: 401 }
          );
        }

        // Delete used OTP
        await Otp.deleteOne({ _id: otpRecord._id });

        // Find or create user
        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            email,
            purchasedItems: [],
            aiUsageCount: 0,
          });
        }

        // Generate JWT token
        const token = generateToken({
          userId: user._id.toString(),
          email: user.email,
        });

        const response = NextResponse.json(
          { 
            message: 'Login successful',
            user: {
              id: user._id.toString(),
              email: user.email,
              robloxUsername: user.robloxUsername,
              purchasedItems: user.purchasedItems,
              aiUsageCount: user.aiUsageCount,
            },
          },
          { status: 200 }
        );

        // Set cookie
        response.cookies.set('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/',
        });

        return response;
      } catch (error) {
        console.log('MongoDB not available, using memory store');
        useMemoryStore = true;
      }
    }

    // Use memory store
    otpRecord = await memoryStore.findOtpByEmail(email);
    
    if (!otpRecord || otpRecord.otp !== otp) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 401 }
      );
    }

    if (otpRecord.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'OTP has expired' },
        { status: 401 }
      );
    }

    // Find or create user in memory store
    let user = await memoryStore.findUserByEmail(email);
    if (!user) {
      user = await memoryStore.createUser({
        email,
        purchasedItems: [],
        aiUsageCount: 0,
      });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id,
      email: user.email,
    });

    const response = NextResponse.json(
      { 
        message: 'Login successful',
        user: {
          id: user._id,
          email: user.email,
          robloxUsername: user.robloxUsername,
          purchasedItems: user.purchasedItems,
          aiUsageCount: user.aiUsageCount,
        },
      },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}
