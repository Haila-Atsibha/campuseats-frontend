"use client"
import { useState, useEffect } from "react"

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    // Replace with real API
    setFavorites([
      { id: 1, name: "Cheese Pizza", cafe: "Cafe Roma" },
      { id: 2, name: "Burger Deluxe", cafe: "Campus Dine" },
    ])
  }, [])

  const handleRemove = (id) => {
    // Here you would call your API to remove from favorites
    setFavorites(favorites.filter((fav) => fav.id !== id))
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">My Favorites</h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
        {favorites.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">You have no favorites yet.</p>
        ) : (
          <ul className="space-y-4">
            {favorites.map((fav) => (
              <li
                key={fav.id}
                className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition border border-gray-200 dark:border-gray-700"
              >
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-100">{fav.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{fav.cafe}</p>
                </div>
                <button
                  onClick={() => handleRemove(fav.id)}
                  className="text-red-500 font-medium text-sm hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
