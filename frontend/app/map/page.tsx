"use client";

import { useState, useEffect } from "react";

// Types for seat and table data
interface Seat {
  id: string;
  x: number; // Position relative to table (percentage)
  y: number;
  occupied: boolean;
  lastUpdated?: string;
}

interface Table {
  id: string;
  name: string;
  x: number; // Position in grid (percentage)
  y: number;
  width: number;
  height: number;
  seats: Seat[];
}

// Mock data generator - simulates data from Arduino CSV
function generateMockData(): Table[] {
  return [
    {
      id: "table-1",
      name: "Table 1",
      x: 5,
      y: 10,
      width: 20,
      height: 20,
      seats: [
        { id: "t1-s1", x: 20, y: -15, occupied: false },
        { id: "t1-s2", x: 80, y: -15, occupied: true },
        { id: "t1-s3", x: 20, y: 115, occupied: false },
        { id: "t1-s4", x: 80, y: 115, occupied: true },
      ],
    },
    {
      id: "table-2",
      name: "Table 2",
      x: 35,
      y: 10,
      width: 30,
      height: 20,
      seats: [
        { id: "t2-s1", x: -10, y: 30, occupied: true },
        { id: "t2-s2", x: -10, y: 70, occupied: false },
        { id: "t2-s3", x: 110, y: 30, occupied: true },
        { id: "t2-s4", x: 20, y: -15, occupied: false },
        { id: "t2-s5", x: 80, y: -15, occupied: true },
        { id: "t2-s6", x: 20, y: 115, occupied: false },
        { id: "t2-s7", x: 80, y: 115, occupied: true },
      ],
    },
    {
      id: "table-3",
      name: "Table 3",
      x: 70,
      y: 10,
      width: 15,
      height: 40,
      seats: [
        { id: "t3-s1", x: 50, y: -10, occupied: true },
        { id: "t3-s2", x: 50, y: 110, occupied: false },
      ],
    },
    {
      id: "table-4",
      name: "Table 4",
      x: 5,
      y: 50,
      width: 20,
      height: 20,
      seats: [
        { id: "t4-s1", x: 30, y: -15, occupied: false },
        { id: "t4-s2", x: 70, y: -15, occupied: false },
        { id: "t4-s3", x: 30, y: 115, occupied: true },
        { id: "t4-s4", x: 70, y: 115, occupied: true },
      ],
    },
    {
      id: "table-5",
      name: "Table 5",
      x: 35,
      y: 50,
      width: 30,
      height: 20,
      seats: [
        { id: "t5-s1", x: 110, y: 30, occupied: true },
        { id: "t5-s2", x: 20, y: -15, occupied: false },
        { id: "t5-s3", x: 80, y: -15, occupied: true },
        { id: "t5-s4", x: 20, y: 115, occupied: false },
        { id: "t5-s5", x: 80, y: 115, occupied: false },
      ],
    },
  ];
}

export default function OccupancyPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [totalSeats, setTotalSeats] = useState(0);
  const [occupiedSeats, setOccupiedSeats] = useState(0);

  // Load mock data (simulating CSV data fetch)
  const loadData = () => {
    const data = generateMockData();
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

  // Auto-refresh every 5 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Simulate random changes in occupancy
      setTables((prevTables) =>
        prevTables.map((table) => ({
          ...table,
          seats: table.seats.map((seat) => ({
            ...seat,
            // Randomly change occupancy (10% chance)
            occupied: Math.random() < 0.1 ? !seat.occupied : seat.occupied,
          })),
        }))
      );
      setLastUpdate(new Date());
      
      // Recalculate stats
      setTables((prevTables) => {
        const total = prevTables.reduce((sum, table) => sum + table.seats.length, 0);
        const occupied = prevTables.reduce(
          (sum, table) => sum + table.seats.filter((seat) => seat.occupied).length,
          0
        );
        setTotalSeats(total);
        setOccupiedSeats(occupied);
        return prevTables;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const occupancyPercentage = totalSeats > 0 ? Math.round((occupiedSeats / totalSeats) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-black">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-black/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600"></div>
            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Library Occupancy</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/home"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Home
            </a>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                autoRefresh
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              }`}
            >
              {autoRefresh ? "Auto-refresh: ON" : "Auto-refresh: OFF"}
            </button>
            <button
              onClick={loadData}
              className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Refresh Now
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
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{occupiedSeats}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Available</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {totalSeats - occupiedSeats}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Occupancy Rate</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{occupancyPercentage}%</p>
              </div>
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-green-500"></div>
              <span className="text-sm text-zinc-700 dark:text-zinc-300">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-red-500"></div>
              <span className="text-sm text-zinc-700 dark:text-zinc-300">Occupied</span>
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Canvas */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="relative mx-auto aspect-[4/3] max-w-6xl rounded-2xl border-4 border-zinc-900 bg-white p-8 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
          {tables.map((table) => (
            <div
              key={table.id}
              className="absolute rounded-lg border-2 border-zinc-900 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800"
              style={{
                left: `${table.x}%`,
                top: `${table.y}%`,
                width: `${table.width}%`,
                height: `${table.height}%`,
              }}
            >
              {/* Table Label */}
              <div className="absolute -top-6 left-0 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                {table.name}
              </div>

              {/* Seats */}
              {table.seats.map((seat) => (
                <div
                  key={seat.id}
                  className={`absolute h-8 w-8 rounded-full border-2 transition-all hover:scale-125 ${
                    seat.occupied
                      ? "border-red-700 bg-red-500 shadow-lg shadow-red-500/50 dark:border-red-400 dark:bg-red-600"
                      : "border-green-700 bg-green-500 shadow-lg shadow-green-500/50 dark:border-green-400 dark:bg-green-600"
                  }`}
                  style={{
                    left: `${seat.x}%`,
                    top: `${seat.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  title={`${seat.id} - ${seat.occupied ? "Occupied" : "Available"}`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-8 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            <strong className="text-zinc-900 dark:text-zinc-50">Note:</strong> This page displays real-time seat
            occupancy data from Arduino sensors. Hover over seats to see their status. Data updates automatically every
            5 seconds when auto-refresh is enabled.
          </p>
        </div>
      </div>
    </div>
  );
}

