"use client";

import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { apiCall } from "@/lib/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Fetch data when user is authenticated
  useEffect(() => {
    if (user) {
      apiCall("/api/data").then(setData).catch(console.error);
    }
  }, [user]);

  const saveData = async () => {
    try {
      await apiCall("/api/data", {
        method: "POST",
        body: JSON.stringify({ example: "data" }),
      });
      alert("Saved!");
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-950">
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes rotate3d {
            from {
              transform: rotateY(0deg) rotateX(10deg);
            }
            to {
              transform: rotateY(360deg) rotateX(10deg);
            }
          }
        `
      }} />
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-black/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600"></div>
            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Find My Seat</span>
          </div>
          <div className="hidden items-center gap-6 md:flex">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">{user.email}</span>
            <a href="/map" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
              Occupancy
            </a>
            <a href="/demo" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
              Demo
            </a>
            <button
              onClick={handleLogout}
              className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500"
            >
              Logout
            </button>
          </div>
          <button className="md:hidden">
            <svg className="h-6 w-6 text-zinc-900 dark:text-zinc-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
            Built for HackWestern 2025
          </div>
          <div className="relative mb-6">
            {/* Rotating Chair Animation */}
            <div className="absolute left-1/2 top-[55%] -z-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ perspective: "1000px" }}>
              <div className="flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
                <svg
                  className="h-80 w-80 sm:h-96 sm:w-96 lg:h-[28rem] lg:w-[28rem]"
                  style={{
                    animation: "rotate3d 20s linear infinite",
                    transformStyle: "preserve-3d",
                  }}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="chairGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0.25" />
                    </linearGradient>
                  </defs>
                  {/* Chair silhouette outline - back */}
                  <path
                    d="M 9 2 L 15 2 L 15 10 L 9 10 Z"
                    stroke="url(#chairGradient)"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  {/* Chair seat */}
                  <path
                    d="M 5 10 L 19 10 L 19 13 L 5 13 Z"
                    stroke="url(#chairGradient)"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  {/* Armrests */}
                  <path
                    d="M 5 8 L 7 8 L 7 10"
                    stroke="url(#chairGradient)"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <path
                    d="M 17 8 L 19 8 L 19 10"
                    stroke="url(#chairGradient)"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  {/* Front legs */}
                  <line x1="6" y1="13" x2="6" y2="19" stroke="url(#chairGradient)" strokeWidth="1" strokeLinecap="round" />
                  <line x1="18" y1="13" x2="18" y2="19" stroke="url(#chairGradient)" strokeWidth="1" strokeLinecap="round" />
                  {/* Back legs */}
                  <line x1="9" y1="13" x2="9" y2="19" stroke="url(#chairGradient)" strokeWidth="1" strokeLinecap="round" />
                  <line x1="15" y1="13" x2="15" y2="19" stroke="url(#chairGradient)" strokeWidth="1" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <h1 className="relative z-10 text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl lg:text-7xl">
              The Future of
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Real-Time Seating Solutions</span>
            </h1>
          </div>
          <p className="mb-10 text-lg leading-8 text-zinc-600 dark:text-zinc-400 sm:text-xl">
            Get straight to work and skip the seat searching. Stop roaming around like an NPC and get to scrolling those reels.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a 
              href="/map" 
              className="group relative w-full overflow-hidden rounded-full bg-zinc-900 px-8 py-4 text-base font-semibold text-white transition-all hover:scale-105 hover:bg-zinc-800 hover:shadow-xl hover:shadow-blue-500/20 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 sm:w-auto text-center"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                View Occupancy Map
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
            </a>
            <a 
              href="https://github.com/liamma06/Hackwestern/tree/main" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative w-full overflow-hidden rounded-full border border-zinc-300 bg-white px-8 py-4 text-base font-semibold text-zinc-900 transition-all hover:scale-105 hover:border-zinc-400 hover:bg-zinc-50 hover:shadow-xl hover:shadow-purple-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:border-zinc-600 dark:hover:bg-zinc-800 sm:w-auto text-center"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="h-5 w-5 transition-transform group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub Repo
              </span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-purple-500/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Powerful Features
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Everything you need to find the perfect study spot in real-time
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2 lg:max-w-7xl lg:grid-cols-3">
          {[
            {
              title: "Real-Time Detection",
              description: "Arduino sensors continuously monitor seat occupancy. Get instant updates as seats become available or occupied.",
              icon: "⚡",
            },
            {
              title: "Visual Heatmap",
              description: "Interactive map shows seat availability at a glance. Green for available, red for occupied - no guessing needed.",
              icon: "🗺️",
            },
            {
              title: "Accurate Sensors",
              description: "Advanced sensor technology ensures reliable detection. Know exactly which seats are free before you arrive.",
              icon: "📡",
            },
            {
              title: "Student Friendly",
              description: "Designed specifically for library use. Save time searching for seats and focus on what matters - studying.",
              icon: "📚",
            },
            {
              title: "Live Updates",
              description: "Data refreshes automatically every few seconds. Always see the current state of library occupancy.",
              icon: "🔄",
            },
            {
              title: "Easy Access",
              description: "Access the occupancy map from any device. Check seat availability on your phone, tablet, or laptop.",
              icon: "📱",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-zinc-200 bg-white p-8 transition-all hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <div className="mb-4 text-4xl">{feature.icon}</div>
              <h3 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">{feature.title}</h3>
              <p className="text-zinc-600 dark:text-zinc-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            See how our sensor system keeps you informed
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-3xl">
          <div className="space-y-12">
            {[
              {
                step: "01",
                title: "Sensors Detect",
                description: "Arduino sensors placed at each seat continuously monitor occupancy using motion and pressure detection.",
                animation: (
                  <div className="absolute -inset-4 flex items-center justify-center pointer-events-none">
                    <div className="absolute h-16 w-16 rounded-full border-2 border-blue-400/50 animate-ping"></div>
                    <div className="absolute h-12 w-12 rounded-full border-2 border-blue-400/70 animate-pulse"></div>
                  </div>
                ),
              },
              {
                step: "02",
                title: "Data Processing",
                description: "Sensor data is collected and processed in real-time, then formatted for web display.",
                animation: (
                  <div className="absolute -inset-4 flex items-center justify-center pointer-events-none">
                    <svg className="h-8 w-8 animate-spin text-purple-400/70" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                ),
              },
              {
                step: "03",
                title: "View Map",
                description: "Check the interactive heatmap to see which seats are available. Find your perfect study spot instantly.",
                animation: (
                  <div className="absolute -inset-4 flex items-center justify-center pointer-events-none">
                    <svg className="h-8 w-8 text-blue-400/70 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <div className="absolute h-3 w-3 rounded-full bg-purple-400/70 animate-ping"></div>
                  </div>
                ),
              },
            ].map((item, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex flex-shrink-0 flex-col items-center">
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 overflow-visible">
                    <span className="relative z-20 text-lg font-bold text-white">{item.step}</span>
                    {item.animation}
                  </div>
                  {index < 2 && (
                    <div className="mt-2 h-24 w-0.5 bg-gradient-to-b from-blue-500 to-purple-600"></div>
                  )}
                </div>
                <div className="flex-1 pb-12">
                  <h3 className="mb-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{item.title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 px-8 py-16 text-center sm:px-12 lg:px-16">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to Find Your Seat?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
              Check real-time library occupancy and never waste time searching for an empty seat again
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a href="/map" className="w-full rounded-full bg-white px-8 py-4 text-base font-semibold text-blue-600 transition-all hover:bg-blue-50 hover:shadow-lg sm:w-auto text-center">
                View Occupancy Map
              </a>
              <button className="w-full rounded-full border-2 border-white bg-transparent px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/10 sm:w-auto">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">Product</h3>
              <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                <li><a href="#features" className="hover:text-zinc-900 dark:hover:text-zinc-50">Features</a></li>
                <li><a href="/map" className="hover:text-zinc-900 dark:hover:text-zinc-50">Occupancy Map</a></li>
                <li><a href="#how-it-works" className="hover:text-zinc-900 dark:hover:text-zinc-50">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">About</h3>
              <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                <li><a href="#about" className="hover:text-zinc-900 dark:hover:text-zinc-50">Our Project</a></li>
                <li><a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-50">HackWestern 2025</a></li>
                <li><a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-50">Team</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">Resources</h3>
              <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                <li><a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-50">Support</a></li>
                <li><a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-50">GitHub</a></li>
                <li><a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-50">Sensor Status</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">Legal</h3>
              <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                <li><a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-50">Privacy</a></li>
                <li><a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-50">Terms</a></li>
                <li><a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-50">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
            <div className="flex flex-col items-center justify-center">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                © 2025 Find My Seat - HackWestern 2025. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

