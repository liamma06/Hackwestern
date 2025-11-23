import { NextRequest, NextResponse } from 'next/server';
import { getSeatData, updateSeatData } from '../seat-storage';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log('Received data:', data);
    
    // Handle different input formats
    // Raspberry Pi sends: true = vacant, false = occupied
    let isVacant: boolean;
    
    if (typeof data === 'boolean') {
      isVacant = data; // true = vacant, false = occupied
    } else if (typeof data === 'object' && data !== null) {
      // Could be { status: true } or { vacant: true } or { occupied: false }
      if (data.status !== undefined) {
        isVacant = data.status;
      } else if (data.vacant !== undefined) {
        isVacant = data.vacant;
      } else if (data.occupied !== undefined) {
        isVacant = !data.occupied; // occupied: false means vacant: true
      } else {
        isVacant = true; // Default to vacant if no field found
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid data format. Expected boolean or object with status field.' },
        { status: 400 }
      );
    }
    
    // Update seat data
    // true = vacant (0), false = occupied (1)
    updateSeatData({
      occupied: isVacant ? 0 : 1,
    });
    
    const currentData = getSeatData();
    
    return NextResponse.json({
      status: 'success',
      received: isVacant ? 'vacant' : 'occupied',
      seatData: currentData
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request', details: String(error) },
      { status: 500 }
    );
  }
}