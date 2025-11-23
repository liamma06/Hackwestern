import { NextResponse } from 'next/server';
import { getSeatData } from '../seat-storage';

export async function GET() {
  try {
    const seatData = getSeatData();
    
    // Return the seat data in the format expected by the demo page
    return NextResponse.json({
      occupied: seatData.occupied,
      popularity: seatData.popularity,
      totalHoursUsed: seatData.totalHoursUsed,
      averageSessionTime: seatData.averageSessionTime,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch seat data', details: String(error) },
      { status: 500 }
    );
  }
}

