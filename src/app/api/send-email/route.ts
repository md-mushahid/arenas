import { sendBookingConfirmation } from '@/lib/email';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, facility, date, time, hours } = body;

    // Validate data
    if (!email || !facility || !date || !time || !hours) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send email
    const result = await sendBookingConfirmation(email, {
      facility,
      date,
      time,
      hours
    });

    return NextResponse.json(result);
    
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}