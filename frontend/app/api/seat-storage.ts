// Shared in-memory storage for seat data
// In production, replace this with a database

interface SeatData {
  occupied: number; // 0 = vacant, 1 = occupied
  popularity: number;
  totalHoursUsed: number;
  averageSessionTime: number;
  lastUpdated: string;
}

let seatData: SeatData = {
  occupied: 0, // 0 = vacant, 1 = occupied
  popularity: 0,
  totalHoursUsed: 0,
  averageSessionTime: 0,
  lastUpdated: new Date().toISOString(),
};

export function getSeatData(): SeatData {
  return seatData;
}

export function updateSeatData(newData: Partial<SeatData>): void {
  seatData = {
    ...seatData,
    ...newData,
    lastUpdated: new Date().toISOString(),
  };
}

