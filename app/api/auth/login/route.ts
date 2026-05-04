import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import { User } from '@/app/models/User';
import { Otp } from '@/app/models/Otp';
import { memoryStore } from '@/app/lib/memoryStore';
import { generateOTP } from '@/app/lib/auth';

let useMemoryStore = false;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Try to use MongoDB, fallback to memory store
    let otpRecord;
    
    if (!useMemoryStore) {
      try {
        await connectDB();
        
        // Delete any existing OTP for this email
        await Otp.deleteOne({ email });
        
        // Generate new OTP
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        
        otpRecord = await Otp.create({
          email,
          otp,
          expiresAt,
        });
      } catch (error) {
        console.log('MongoDB not available, using memory store');
        useMemoryStore = true;
      }
    }

    if (useMemoryStore || !otpRecord) {
      // Use memory store
      await memoryStore.deleteExpiredOtps();
      const otp = generateOTP();
      otpRecord = await memoryStore.createOtp(email, otp);
    }

    // In production, send email here
    // For demo, we'll log the OTP and also return it in a special header
    console.log(`OTP for ${email}: ${otpRecord.otp}`);

    return NextResponse.json(
      { 
        message: 'OTP sent successfully',
        // In development/demo mode, include OTP in response
        // Remove this in production!
        otp: process.env.NODE_ENV === 'development' ? otpRecord.otp : undefined,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
