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
}

// Mock data generator - simulates data from Arduino CSV and database
function generateMockData(): Table[] {
  const now = new Date();
  const generateSeatData = (
    id: string,
    x: number,
    y: number,
    occupied: boolean,
    popularity: number,
    totalHours: number,
    avgSession: number
  ): Seat => ({
    id,
    x,
    y,
    occupied,
    popularity,
    totalHoursUsed: totalHours,
    averageSessionTime: avgSession,
    lastUpdated: now.toISOString(),
    lastOccupiedAt: occupied
      ? new Date(now.getTime() - Math.random() * 3600000).toISOString()
      : new Date(now.getTime() - Math.random() * 86400000).toISOString(),
  });

  return [
    {
      id: "table-1",
      name: "Table 1",
      x: 5,
      y: 10,
      width: 20,
      height: 20,
      seats: [
        generateSeatData("t1-s1", 20, -15, false, 85, 120, 45),
        generateSeatData("t1-s2", 80, -15, true, 92, 145, 60),
        generateSeatData("t1-s3", 20, 115, false, 45, 65, 30),
        generateSeatData("t1-s4", 80, 115, true, 78, 98, 50),
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
        generateSeatData("t2-s1", -10, 30, true, 95, 180, 75),
        generateSeatData("t2-s2", -10, 70, false, 60, 85, 40),
        generateSeatData("t2-s3", 110, 30, true, 88, 135, 55),
        generateSeatData("t2-s4", 20, -15, false, 70, 95, 45),
        generateSeatData("t2-s5", 80, -15, true, 82, 110, 50),
        generateSeatData("t2-s6", 20, 115, false, 55, 75, 35),
        generateSeatData("t2-s7", 80, 115, true, 90, 155, 65),
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
        generateSeatData("t3-s1", 50, -10, true, 65, 88, 42),
        generateSeatData("t3-s2", 50, 110, false, 40, 52, 28),
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
        generateSeatData("t4-s1", 30, -15, false, 50, 68, 32),
        generateSeatData("t4-s2", 70, -15, false, 58, 72, 38),
        generateSeatData("t4-s3", 30, 115, true, 75, 102, 48),
        generateSeatData("t4-s4", 70, 115, true, 68, 89, 43),
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
        generateSeatData("t5-s1", 110, 30, true, 88, 142, 58),
        generateSeatData("t5-s2", 20, -15, false, 62, 78, 38),
        generateSeatData("t5-s3", 80, -15, true, 80, 115, 52),
        generateSeatData("t5-s4", 20, 115, false, 48, 58, 28),
        generateSeatData("t5-s5", 80, 115, false, 72, 92, 44),
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
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'bot', message: string }>>([
    { role: 'bot', message: 'Hi! I can help you find seats. Ask me anything about seat availability or recommendations!' }
  ]);
  const [chatInput, setChatInput] = useState('');

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

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    // Add user message
    setChatMessages(prev => [...prev, { role: 'user', message: chatInput }]);
    setChatInput('');
    
    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: chatInput })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setChatMessages(prev => [...prev, { role: 'bot', message: result.message }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages(prev => [...prev, { 
        role: 'bot', 
        message: 'Sorry, I had trouble processing that. Please try again.' 
      }]);
    }
  };

  const generateBotResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('available') || lowerInput.includes('free')) {
      return `There are currently ${totalSeats - occupiedSeats} available seats out of ${totalSeats} total seats (${Math.round(((totalSeats - occupiedSeats) / totalSeats) * 100)}% available).`;
    } else if (lowerInput.includes('popular') || lowerInput.includes('best')) {
      const topSeat = tables.flatMap(t => t.seats).sort((a, b) => b.popularity - a.popularity)[0];
      return `The most popular seat is ${topSeat?.id} with ${topSeat?.popularity}% popularity and an average session time of ${topSeat?.averageSessionTime} minutes.`;
    } else if (lowerInput.includes('quiet') || lowerInput.includes('least')) {
      const quietSeats = tables.flatMap(t => t.seats).filter(s => !s.occupied && s.popularity < 60);
      return `I found ${quietSeats.length} quiet seats with low traffic. Try seats: ${quietSeats.slice(0, 3).map(s => s.id).join(', ')}.`;
    }
    
    return "I can help you find available seats, recommend popular spots, or suggest quiet areas. What would you like to know?";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-black">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-black/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600"></div>
            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Find My Seat</span>
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
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-green-500"></div>
              <span className="text-sm text-zinc-700 dark:text-zinc-300">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-red-500"></div>
              <span className="text-sm text-zinc-700 dark:text-zinc-300">Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-green-500 ring-2 ring-yellow-400 ring-offset-1"></div>
              <span className="text-sm text-zinc-700 dark:text-zinc-300">High Popularity (80%+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-green-500 ring-2 ring-blue-400 ring-offset-1"></div>
              <span className="text-sm text-zinc-700 dark:text-zinc-300">Medium Popularity (60-79%)</span>
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
              {table.seats.map((seat) => {
                // Determine popularity indicator color
                const popularityColor =
                  seat.popularity >= 80
                    ? "ring-2 ring-yellow-400 ring-offset-1"
                    : seat.popularity >= 60
                    ? "ring-2 ring-blue-400 ring-offset-1"
                    : "";
                
                return (
                  <div
                    key={seat.id}
                    onClick={() => setSelectedSeat(seat)}
                    className={`absolute h-8 w-8 rounded-full border-2 transition-all hover:scale-125 cursor-pointer ${popularityColor} ${
                      seat.occupied
                        ? "border-red-700 bg-red-500 shadow-lg shadow-red-500/50 dark:border-red-400 dark:bg-red-600"
                        : "border-green-700 bg-green-500 shadow-lg shadow-green-500/50 dark:border-green-400 dark:bg-green-600"
                    }`}
                    style={{
                      left: `${seat.x}%`,
                      top: `${seat.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    title={`${seat.id} - ${seat.occupied ? "Occupied" : "Available"} | Popularity: ${seat.popularity}%`}
                  >
                    {/* Popularity indicator dot */}
                    {seat.popularity >= 80 && (
                      <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-yellow-400 border border-zinc-900 dark:border-zinc-50"></div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-8 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            <strong className="text-zinc-900 dark:text-zinc-50">Note:</strong> This page displays real-time seat
            occupancy data from Arduino sensors. Click on seats to view detailed information. Yellow ring indicates high popularity (80%+). Data updates automatically every
            5 seconds when auto-refresh is enabled.
          </p>
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
                <p className={`text-xl font-semibold ${selectedSeat.occupied ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
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
                          ? "bg-yellow-500"
                          : selectedSeat.popularity >= 60
                          ? "bg-blue-500"
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

      {/* Floating Chat Button */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-2xl transition-transform hover:scale-110"
        aria-label="Toggle chat"
      >
        {chatOpen ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Slide-out Panel */}
      <div
        className={`fixed bottom-0 right-0 z-50 h-[600px] w-full max-w-md transform transition-transform duration-300 ${
          chatOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full rounded-l-2xl border-l border-t border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Seat Assistant</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Online</p>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: 'calc(100% - 140px)' }}>
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                      : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50'
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about seats..."
                className="flex-1 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              />
              <button
                onClick={handleSendMessage}
                disabled={!chatInput.trim()}
                className="rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-2 text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
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
                <p className={`text-xl font-semibold ${selectedSeat.occupied ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
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
                          ? "bg-yellow-500"
                          : selectedSeat.popularity >= 60
                          ? "bg-blue-500"
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

