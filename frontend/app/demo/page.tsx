"use client";

import { useState, useEffect } from "react";

// Types for seat and table data
interface Seat {
  id: string;
  x: number; // Position relative to table (percentage)
  y: number;
  occupied: boolean;
  lastUpdated?: string;
  popularity: number; // Popularity score (0-100)
  totalHoursUsed: number; // Total hours this seat has been used
  averageSessionTime: number; // Average session time in minutes
  lastOccupiedAt?: string;
}

interface Table {
  id: string;
  name: string;
  x: number; // Position in grid (percentage)
  y: number;
  width: number;
  height: number;
  seats: Seat[];
  row: number; // Row index (0, 1, 2, or 3)
}

// Generate static data with all seats vacant
function generateDemoData(): Table[] {
  const now = new Date();
  
  // Uniform seat positions for all tables (4 seats: 2 on top, 2 on bottom) - OUTSIDE the table
  const uniformSeatPositions = [
    { x: 30, y: -20 },   // Top left (outside table)
    { x: 70, y: -20 },   // Top right (outside table)
    { x: 30, y: 120 },   // Bottom left (outside table)
    { x: 70, y: 120 },   // Bottom right (outside table)
  ];

  const generateSeatData = (
    id: string,
    x: number,
    y: number,
    popularity: number,
    totalHours: number,
    avgSession: number
  ): Seat => ({
    id,
    x,
    y,
    occupied: false, // All seats vacant
    popularity,
    totalHoursUsed: totalHours,
    averageSessionTime: avgSession,
    lastUpdated: now.toISOString(),
    lastOccupiedAt: undefined,
  });

  // Helper to generate seats with uniform positions, all vacant with default/zero values
  const generateTableSeats = (tableId: string) => {
    return uniformSeatPositions.map((pos, index) => {
      const seatId = `${tableId}-s${index + 1}`;
      // Set all tracking data to 0/default values as if app is tracking but no data collected yet
      const popularity = 0;
      const totalHours = 0;
      const avgSession = 0;
      
      return generateSeatData(seatId, pos.x, pos.y, popularity, totalHours, avgSession);
    });
  };

  // Centered 4x3 grid layout - each row will be in its own section
  const gridPositions = [
    { x: 15, y: 15, row: 0 }, // Row 1 - in first section
    { x: 40, y: 15, row: 0 },
    { x: 65, y: 15, row: 0 },
    { x: 15, y: 15, row: 1 }, // Row 2 - in second section
    { x: 40, y: 15, row: 1 },
    { x: 65, y: 15, row: 1 },
    { x: 15, y: 15, row: 2 }, // Row 3 - in third section
    { x: 40, y: 15, row: 2 },
    { x: 65, y: 15, row: 2 },
    { x: 15, y: 15, row: 3 }, // Row 4 - in fourth section
    { x: 40, y: 15, row: 3 },
    { x: 65, y: 15, row: 3 },
  ];

  return [
    {
      id: "table-1",
      name: "Table 1",
      x: gridPositions[0].x,
      y: gridPositions[0].y,
      width: 20,
      height: 28,
      seats: generateTableSeats("t1"),
      row: gridPositions[0].row,
    },
    {
      id: "table-2",
      name: "Table 2",
      x: gridPositions[1].x,
      y: gridPositions[1].y,
      width: 20,
      height: 28,
      seats: generateTableSeats("t2"),
      row: gridPositions[1].row,
    },
    {
      id: "table-3",
      name: "Table 3",
      x: gridPositions[2].x,
      y: gridPositions[2].y,
      width: 20,
      height: 28,
      seats: generateTableSeats("t3"),
      row: gridPositions[2].row,
    },
    {
      id: "table-4",
      name: "Table 4",
      x: gridPositions[3].x,
      y: gridPositions[3].y,
      width: 20,
      height: 28,
      seats: generateTableSeats("t4"),
      row: gridPositions[3].row,
    },
    {
      id: "table-5",
      name: "Table 5",
      x: gridPositions[4].x,
      y: gridPositions[4].y,
      width: 20,
      height: 28,
      seats: generateTableSeats("t5"),
      row: gridPositions[4].row,
    },
    {
      id: "table-6",
      name: "Table 6",
      x: gridPositions[5].x,
      y: gridPositions[5].y,
      width: 20,
      height: 28,
      seats: generateTableSeats("t6"),
      row: gridPositions[5].row,
    },
    {
      id: "table-7",
      name: "Table 7",
      x: gridPositions[6].x,
      y: gridPositions[6].y,
      width: 20,
      height: 28,
      seats: generateTableSeats("t7"),
      row: gridPositions[6].row,
    },
    {
      id: "table-8",
      name: "Table 8",
      x: gridPositions[7].x,
      y: gridPositions[7].y,
      width: 20,
      height: 28,
      seats: generateTableSeats("t8"),
      row: gridPositions[7].row,
    },
    {
      id: "table-9",
      name: "Table 9",
      x: gridPositions[8].x,
      y: gridPositions[8].y,
      width: 20,
      height: 28,
      seats: generateTableSeats("t9"),
      row: gridPositions[8].row,
    },
    {
      id: "table-10",
      name: "Table 10",
      x: gridPositions[9].x,
      y: gridPositions[9].y,
      width: 20,
      height: 28,
      seats: generateTableSeats("t10"),
      row: gridPositions[9].row,
    },
    {
      id: "table-11",
      name: "Table 11",
      x: gridPositions[10].x,
      y: gridPositions[10].y,
      width: 20,
      height: 28,
      seats: generateTableSeats("t11"),
      row: gridPositions[10].row,
    },
    {
      id: "table-12",
      name: "Table 12",
      x: gridPositions[11].x,
      y: gridPositions[11].y,
      width: 20,
      height: 28,
      seats: generateTableSeats("t12"),
      row: gridPositions[11].row,
    },
  ];
}

export default function DemoPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [totalSeats, setTotalSeats] = useState(0);
  const [occupiedSeats, setOccupiedSeats] = useState(0);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [showPopularity, setShowPopularity] = useState(false);

  // Load demo data (all seats vacant)
  const loadData = () => {
    const data = generateDemoData();
    setTables(data);
    setLastUpdate(new Date());
    
    // Calculate statistics
    const total = data.reduce((sum, table) => sum + table.seats.length, 0);
    const occupied = data.reduce(
      (sum, table) => sum + table.seats.filter((seat) => seat.occupied).length,
      0
    );
    setTotalSeats(total);
    setOccupiedSeats(occupied);
  };

  // Initial load
  useEffect(() => {
    loadData();
  }, []);

  // Fetch data for first seat from FastAPI
  useEffect(() => {
    const fetchFirstSeatData = async () => {
      try {
        const response = await fetch("http://YOUR_SERVER_IP:8000/api/seats");
        if (!response.ok) {
          throw new Error("Failed to fetch seat data");
        }
        
        const data = await response.json();
        
        // Handle different response formats
        // If it's an array, get the first item; if it's an object, use it directly
        const seatData = Array.isArray(data) ? data[0] : data;
        
        // Update the first seat (first table, first seat - t1-s1)
        setTables((prevTables) => {
          const updatedTables = [...prevTables];
          if (updatedTables.length > 0 && updatedTables[0].seats.length > 0) {
            const firstSeat = updatedTables[0].seats[0];
            
            // Update seat data based on API response
            // API returns 0 or 1 for vacant/occupied
            let isOccupied = false;
            if (typeof seatData === 'number') {
              // Direct number: 0 = vacant, 1 = occupied
              isOccupied = seatData === 1;
            } else if (typeof seatData === 'object') {
              // Object with occupied field (0 or 1)
              isOccupied = seatData.occupied === 1 || seatData.occupied === true || seatData.status === 1;
            }
            
            const updatedSeat: Seat = {
              ...firstSeat,
              occupied: isOccupied,
              popularity: seatData?.popularity ?? seatData?.popularity_score ?? firstSeat.popularity,
              totalHoursUsed: seatData?.totalHoursUsed ?? seatData?.total_hours_used ?? seatData?.totalHours ?? firstSeat.totalHoursUsed,
              averageSessionTime: seatData?.averageSessionTime ?? seatData?.average_session_time ?? seatData?.avgSession ?? firstSeat.averageSessionTime,
              lastUpdated: new Date().toISOString(),
              lastOccupiedAt: isOccupied ? new Date().toISOString() : firstSeat.lastOccupiedAt,
            };
            
            updatedTables[0] = {
              ...updatedTables[0],
              seats: [updatedSeat, ...updatedTables[0].seats.slice(1)],
            };
            
            // Recalculate statistics
            const total = updatedTables.reduce((sum, table) => sum + table.seats.length, 0);
            const occupied = updatedTables.reduce(
              (sum, table) => sum + table.seats.filter((seat) => seat.occupied).length,
              0
            );
            setTotalSeats(total);
            setOccupiedSeats(occupied);
          }
          return updatedTables;
        });
      } catch (error) {
        console.error("Error fetching seat data:", error);
        // Silently fail - demo page should still work without API
      }
    };

    // Only fetch if tables are loaded
    if (tables.length > 0) {
      fetchFirstSeatData();
      
      // Optionally set up polling to refresh data periodically
      const interval = setInterval(fetchFirstSeatData, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [tables.length]); // Only run when tables are initially loaded

  const occupancyPercentage = totalSeats > 0 ? Math.round((occupiedSeats / totalSeats) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-black">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-black/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600"></div>
            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Find My Seat - Demo</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/home"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Home
            </a>
            <a
              href="/map"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Live Map
            </a>
            <button
              onClick={loadData}
              className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Refresh
            </button>
          </div>
        </div>
      </nav>

      {/* Stats Bar */}
      <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Seats</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{totalSeats}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Occupied</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{occupiedSeats}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Available</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {totalSeats - occupiedSeats}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Occupancy Rate</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{occupancyPercentage}%</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowPopularity(!showPopularity)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  showPopularity
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                }`}
              >
                Popularity: {showPopularity ? "ON" : "OFF"}
              </button>
              <div className="text-sm text-zinc-500 dark:text-zinc-400">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-3">Color Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-blue-500 border-2 border-blue-700"></div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Blue</span>
                <span className="text-xs text-zinc-600 dark:text-zinc-400">Available Seat</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-purple-500 border-2 border-purple-700"></div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Purple</span>
                <span className="text-xs text-zinc-600 dark:text-zinc-400">Occupied Seat</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-blue-500 border-2 border-blue-700 ring-2 ring-red-500 ring-offset-1"></div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Red Ring</span>
                <span className="text-xs text-zinc-600 dark:text-zinc-400">High Popularity (80%+)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-blue-500 border-2 border-blue-700 ring-2 ring-yellow-400 ring-offset-1"></div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Yellow Ring</span>
                <span className="text-xs text-zinc-600 dark:text-zinc-400">Medium Popularity (60-79%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Canvas */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="relative mx-auto aspect-[4/3] max-w-6xl rounded-2xl border-4 border-zinc-900 bg-white p-8 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900 overflow-hidden">
          {/* Four sections, one for each row */}
          {[0, 1, 2, 3].map((rowIndex) => (
            <div
              key={rowIndex}
              className="absolute left-0 right-0"
              style={{
                top: `${rowIndex * 25 + (rowIndex === 0 ? 2 : 0)}%`,
                height: "25%",
              }}
            >
              {tables
                .filter((table) => table.row === rowIndex)
                .map((table) => (
                  <div
                    key={table.id}
                    className="absolute rounded-lg border-2 border-zinc-900 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 z-0"
                    style={{
                      left: `${table.x}%`,
                      top: `${table.y}%`,
                      width: `${table.width}%`,
                      height: `${table.height}%`,
                    }}
                  >
                    {/* Table Label - centered in the middle of the table */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-base font-semibold text-zinc-700 dark:text-zinc-300 bg-white/90 dark:bg-zinc-900/90 px-3 py-1 rounded whitespace-nowrap z-10 shadow-sm">
                      {table.name}
                    </div>

                    {/* Seats */}
                    {table.seats.map((seat) => {
                      // Determine popularity indicator color - red for high, yellow for medium
                      const popularityColor = showPopularity
                        ? seat.popularity >= 80
                          ? "ring-2 ring-red-500 ring-offset-1"
                          : seat.popularity >= 60
                          ? "ring-2 ring-yellow-400 ring-offset-1"
                          : ""
                        : "";
                      
                      return (
                        <div
                          key={seat.id}
                          onClick={() => setSelectedSeat(seat)}
                          className={`absolute h-8 w-8 rounded-full border-2 transition-all hover:scale-125 cursor-pointer z-20 ${popularityColor} ${
                            seat.occupied
                              ? "border-purple-700 bg-purple-500 shadow-lg shadow-purple-500/50 dark:border-purple-400 dark:bg-purple-600"
                              : "border-blue-700 bg-blue-500 shadow-lg shadow-blue-500/50 dark:border-blue-400 dark:bg-blue-600"
                          }`}
                          style={{
                            left: `${seat.x}%`,
                            top: `${seat.y}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                          title={`${seat.id} - ${seat.occupied ? "Occupied" : "Available"} | Popularity: ${seat.popularity}%`}
                        />
                      );
                    })}
                  </div>
                ))}
            </div>
          ))}
        </div>

        {/* Database Data Display */}
        <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">Database Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Most Popular Seat</p>
              <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {tables
                  .flatMap((t) => t.seats)
                  .sort((a, b) => b.popularity - a.popularity)[0]?.id || "N/A"}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {tables
                  .flatMap((t) => t.seats)
                  .sort((a, b) => b.popularity - a.popularity)[0]?.popularity || 0}% popularity
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Total Usage Hours</p>
              <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {tables
                  .flatMap((t) => t.seats)
                  .reduce((sum, seat) => sum + seat.totalHoursUsed, 0)}{" "}
                hrs
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Across all seats</p>
            </div>
            <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Average Popularity</p>
              <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {Math.round(
                  tables
                    .flatMap((t) => t.seats)
                    .reduce((sum, seat) => sum + seat.popularity, 0) / totalSeats
                ) || 0}
                %
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Library-wide average</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            <strong className="text-zinc-900 dark:text-zinc-50">Demo Mode:</strong> This page displays the seat layout with all seats currently vacant. Click on seats to view detailed information. This demo uses static data and does not update automatically.
          </p>
        </div>
      </div>

      {/* Seat Details Modal Popup */}
      {selectedSeat && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedSeat(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          
          {/* Modal Content */}
          <div
            className="relative w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Seat Details: {selectedSeat.id}
              </h3>
              <button
                onClick={() => setSelectedSeat(null)}
                className="rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                aria-label="Close"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">Status</p>
                <p className={`text-xl font-semibold ${selectedSeat.occupied ? "text-purple-600 dark:text-purple-400" : "text-blue-600 dark:text-blue-400"}`}>
                  {selectedSeat.occupied ? "Occupied" : "Available"}
                </p>
              </div>
              <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">Popularity Score</p>
                <div className="space-y-2">
                  <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">{selectedSeat.popularity}%</p>
                  <div className="h-3 bg-zinc-200 rounded-full dark:bg-zinc-700">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        selectedSeat.popularity >= 80
                          ? "bg-red-500"
                          : selectedSeat.popularity >= 60
                          ? "bg-yellow-500"
                          : "bg-zinc-400"
                      }`}
                      style={{ width: `${selectedSeat.popularity}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">Total Hours Used</p>
                <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">{selectedSeat.totalHoursUsed} hrs</p>
              </div>
              <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">Average Session Time</p>
                <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">{selectedSeat.averageSessionTime} min</p>
              </div>
              <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">Last Updated</p>
                <p className="text-sm text-zinc-900 dark:text-zinc-50">
                  {new Date(selectedSeat.lastUpdated || "").toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">Last Occupied</p>
                <p className="text-sm text-zinc-900 dark:text-zinc-50">
                  {selectedSeat.lastOccupiedAt
                    ? new Date(selectedSeat.lastOccupiedAt).toLocaleString()
                    : "Never"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

