"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchFavorites() {
      const token = localStorage.getItem("token")
      if (!token) return setError("You must log in to view favorites.")

      try {
        const res = await fetch("http://localhost:5000/api/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()

        if (!res.ok) throw new Error(data.error || "Failed to fetch favorites")
        setFavorites(data)
      } catch (err) {
        console.error("Error fetching favorites:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-pink-500">
              <span className="text-xl font-bold text-white">CE</span>
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-gray-100">
              CampusEats
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <button className="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                Dashboard
              </button>
            </Link>
            <Link href="/profile">
              <button className="rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 font-semibold text-white hover:opacity-90">
                Profile
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          ❤️ My Favorite Cafés
        </h1>

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Loading your favorites...
          </p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : favorites.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center">
            You haven’t added any cafés to your favorites yet.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((cafe) => (
              <div
                key={cafe.id}
                className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <img
                  src={
                    cafe.imageUrl
                      ? `http://localhost:5000${cafe.imageUrl}`
                      : "/default-cafe.png"
                  }
                  alt={`${cafe.name} image`}
                  className="w-full h-40 object-cover rounded-xl mb-4"
                  onError={(e) => (e.target.src = "/default-cafe.png")}
                />
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                  {cafe.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Avg Rating: ⭐ {cafe.averageRating.toFixed(1)}
                </p>
                <Link
                  href={`/cafes/${cafe.id}`}
                  className="inline-block rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 font-semibold text-white hover:opacity-90"
                >
                  View Menu →
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-gray-800 py-6 mt-12">
        <div className="container mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; 2025 CampusEats. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
