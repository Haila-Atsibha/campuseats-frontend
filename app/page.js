// frontend/app/page.js
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-pink-500">
              <span className="text-xl font-bold text-white">CE</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">CampusEats</span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-orange-50 via-pink-50 to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 py-20 md:py-28">
        <div className="container mx-auto px-6 grid items-center gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
              Discover, Order, and Enjoy Campus Food 🍔
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md">
              Skip the line — order from your favorite campus cafés and get your food delivered in minutes.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/signup?role=CUSTOMER">
                <button className="px-6 py-3 font-semibold text-white bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl shadow hover:opacity-90 transition">
                  I am a Student →
                </button>
              </Link>
              <Link href="/signup?role=CAFE_OWNER">
                <button className="px-6 py-3 font-semibold text-pink-600 border border-pink-500 rounded-xl hover:bg-pink-50 dark:hover:bg-gray-800 transition">
                  I own a Café →
                </button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?fit=crop&w=900&q=80"
              alt="Students eating at campus café"
              className="rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white dark:bg-gray-800 transition">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose CampusEats?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-12">
            Designed for students, café owners, and convenience.
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: "🛍️",
                title: "Easy Ordering",
                desc: "Browse menus, customize your meals, and order in seconds.",
              },
              {
                icon: "⚡",
                title: "Fast Delivery",
                desc: "Get your food delivered to your dorm or class without delay.",
              },
              {
                icon: "💳",
                title: "Secure Payment",
                desc: "Your payments are fast, safe, and encrypted end-to-end.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-8 text-center shadow-sm hover:shadow-lg transition"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-2xl">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-orange-500 to-pink-500 py-20">
        <div className="container mx-auto px-6 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Ready to Order Smarter?
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Join thousands of students making campus dining fast and easy.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/signup?role=CUSTOMER">
              <button className="px-6 py-3 font-semibold text-orange-600 bg-white rounded-xl hover:bg-gray-100 transition">
                I am a Student →
              </button>
            </Link>
            <Link href="/signup?role=CAFE_OWNER">
              <button className="px-6 py-3 font-semibold border border-white rounded-xl hover:bg-white/10 transition">
                I own a Café →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-8">
        <div className="container mx-auto px-6 text-center text-gray-500 dark:text-gray-400">
          &copy; 2025 CampusEats. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
