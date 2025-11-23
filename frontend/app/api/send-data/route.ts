import { NextRequest, NextResponse } from 'next/server';
import { getSeatData, updateSeatData } from '../seat-storage';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log('Received data:', data);

    let isVacant: boolean;

    if (typeof data === 'boolean') {
      // Direct boolean
      isVacant = data;

    } else if (typeof data === 'object' && data !== null) {
      
      // Accept ANY of the following fields:
      // { status: true }
      // { vacant: true }
      // { occupied: false }
      // { states: false }
      
      if (data.status !== undefined) {
        isVacant = data.status;

      } else if (data.vacant !== undefined) {
        isVacant = data.vacant;

      } else if (data.occupied !== undefined) {
        isVacant = !data.occupied;

      } else if (data.states !== undefined) {
        // RASPBERRY PI NEW FORMAT
        // states = false means occupied
        isVacant = data.states;

      } else {
        // Default fallback
        isVacant = true;
      }

    } else {
      return NextResponse.json(
        { error: 'Invalid data format. Expected boolean or object.' },
        { status: 400 }
      );
    }

    // Update seat data (1 = occupied, 0 = vacant)
    updateSeatData({
      occupied: isVacant ? 0 : 1,
    });

    const currentData = getSeatData();

    return NextResponse.json({
      status: 'success',
      received: isVacant ? 'vacant' : 'occupied',
      seatData: currentData,
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request', details: String(error) },
      { status: 500 }
    );
  }
}
