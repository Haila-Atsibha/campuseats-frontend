"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* ⭐ Reusable StarRating component */
function StarRating({ cafeId, currentRating, onRated }) {
  const [rating, setRating] = useState(currentRating || 0);
  const [hover, setHover] = useState(0);

  async function handleRate(value) {
    setRating(value);
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to log in to rate cafés!");
      return;
    }

    try {
      await fetch("https://campuseats-backend-production.up.railway.app/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cafeId, value }),
      });
      onRated?.(value);
    } catch (err) {
      console.error("Failed to submit rating:", err);
    }
  }

  return (
    <div className="flex gap-1 mb-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          onClick={() => handleRate(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          xmlns="http://www.w3.org/2000/svg"
          fill={(hover || rating) >= star ? "gold" : "gray"}
          viewBox="0 0 24 24"
          className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform"
        >
          <path d="M12 .587l3.668 7.568 8.332 1.151-6.001 5.85 1.415 8.344L12 18.897l-7.414 4.603 1.415-8.344-6.001-5.85 8.332-1.151z" />
        </svg>
      ))}
    </div>
  );
}

export default function StudentDashboard() {
  const [cafes, setCafes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // ✅ Fetch all cafés
  useEffect(() => {
    async function fetchCafes() {
      try {
        const res = await fetch("https://campuseats-backend-production.up.railway.app/api/cafe");
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Invalid data");
        setCafes(data);
      } catch (err) {
        console.error("Failed to fetch cafés:", err);
        setError("Failed to fetch cafés");
      } finally {
        setLoading(false);
      }
    }

    fetchCafes();
  }, []);

  // ✅ Fetch user's favorites from backend
  useEffect(() => {
    async function fetchFavorites() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("https://campuseats-backend-production.up.railway.app/api/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          const ids = data.map((fav) => fav.id);
          setFavorites(ids);
        }
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
      }
    }

    fetchFavorites();
  }, []);

  // ✅ Toggle Favorite
  async function toggleFavorite(cafeId) {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to save favorites.");
      return;
    }

    try {
      const res = await fetch(`https://campuseats-backend-production.up.railway.app/api/favorites/${cafeId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update favorites");
      }

      const data = await res.json();
      console.log(data.message);

      setFavorites((prev) =>
        prev.includes(cafeId) ? prev.filter((id) => id !== cafeId) : [...prev, cafeId]
      );
    } catch (err) {
      console.error("Error updating favorites:", err);
      alert(err.message);
    }
  }

  // ✅ Logout function
  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
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
            <Link href="/favorites">
              <button className="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                Favorites ❤️
              </button>
            </Link>
            <Link href="/profile">
              <button className="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                Profile
              </button>
            </Link>
            <Link href="/orderHistory">
              <button className="rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 font-semibold text-white hover:opacity-90">
                My Orders
              </button>
            </Link>
            {/* ✅ Logout button */}
            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600 active:scale-95 transition-transform"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 flex-col items-center px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Welcome to CampusEats 🎓
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-10 text-center max-w-2xl">
          Discover and order from your favorite cafés and restaurants on campus — quick, easy, and delicious.
        </p>

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading cafés...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : cafes.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No cafés available at the moment.</p>
        ) : (
          <div className="grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cafes.map((cafe) => (
              <div
                key={cafe.id}
                className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <img
                  src={
                    cafe.imageUrl
                      ? `https://campuseats-backend-production.up.railway.app${cafe.imageUrl}`
                      : "/default-cafe.png"
                  }
                  alt={`${cafe.name} profile`}
                  className="w-full h-40 object-cover rounded-xl mb-4"
                  onError={(e) => (e.target.src = "/default-cafe.png")}
                />

                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                      {cafe.name}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      ⭐ {cafe.averageRating ? cafe.averageRating : "0.0"}
                    </p>
                  </div>

                  {/* ❤️ Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(cafe.id)}
                    className={`transition transform hover:scale-110 ${
                      favorites.includes(cafe.id)
                        ? "text-red-500"
                        : "text-gray-400 hover:text-red-500"
                    }`}
                    aria-label="Add to favorites"
                  >
                    {favorites.includes(cafe.id) ? "❤️" : "🤍"}
                  </button>
                </div>

                <StarRating
                  cafeId={cafe.id}
                  currentRating={Math.round(cafe.averageRating || 0)}
                />

                {cafe.description && (
                  <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
                    {cafe.description}
                  </p>
                )}

                <Link
                  href={`/cafes/${cafe.id}`}
                  className="inline-block w-full text-center rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 font-semibold text-white hover:opacity-90"
                >
                  View Menu →
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-gray-800 py-6">
        <div className="container mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; 2025 CampusEats. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
