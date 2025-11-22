import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-black/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600"></div>
            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">SeatSense</span>
          </div>
          <div className="hidden items-center gap-6 md:flex">
            <a href="#features" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
              How It Works
            </a>
            <a href="#about" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
              About
            </a>
            <a href="/map" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
              Occupancy
            </a>
            <a href="/map" className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200">
              View Map
            </a>
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
            Built for HackWestern 2024
          </div>
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl lg:text-7xl">
            The Future of
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Real-Time Seating Solutions</span>
          </h1>
          <p className="mb-10 text-lg leading-8 text-zinc-600 dark:text-zinc-400 sm:text-xl">
            Get straight to work and skip the seat searching. Built with modern tech stack and designed for students, by students.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="/map" className="w-full rounded-full bg-zinc-900 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-zinc-800 hover:shadow-lg dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 sm:w-auto text-center">
              View Occupancy Map
            </a>
            <button className="w-full rounded-full border border-zinc-300 bg-white px-8 py-4 text-base font-semibold text-zinc-900 transition-all hover:bg-zinc-50 hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800 sm:w-auto">
              Learn More
            </button>
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
              },
              {
                step: "02",
                title: "Data Processing",
                description: "Sensor data is collected and processed in real-time, then formatted for web display.",
              },
              {
                step: "03",
                title: "View Map",
                description: "Check the interactive heatmap to see which seats are available. Find your perfect study spot instantly.",
              },
            ].map((item, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex flex-shrink-0 flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-bold text-white">
                    {item.step}
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
                <li><a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-50">HackWestern 2024</a></li>
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
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                © 2024 SeatSense - HackWestern 2024. All rights reserved.
              </p>
              <div className="flex gap-6">
                <a href="#" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

