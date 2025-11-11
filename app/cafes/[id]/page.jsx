"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CafeMenuPage() {
  const { id } = useParams();
  const router = useRouter();
  const [foods, setFoods] = useState([]);
  const [cafe, setCafe] = useState(null);
  const [message, setMessage] = useState("");
  const [addingItem, setAddingItem] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [quantities, setQuantities] = useState({});

  // Load cart count
  useEffect(() => {
    const savedCount = localStorage.getItem("cartNotificationCount");
    if (savedCount) setCartCount(parseInt(savedCount, 10));
  }, []);

  // Fetch menu
  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch(`http://localhost:5000/api/cafe/${id}`);
        if (!res.ok) throw new Error("Failed to load menu");
        const data = await res.json();
        setCafe(data);
        setFoods(data.foods || []);
      } catch (error) {
        console.error("Failed to fetch menu:", error);
      }
    }
    fetchMenu();
  }, [id]);

  function handleQuantityChange(foodId, value) {
    const qty = Math.max(1, parseInt(value) || 1);
    setQuantities((prev) => ({ ...prev, [foodId]: qty }));
  }

  async function handleAddToCart(foodId) {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to add items to your cart.");
      router.push("/signin");
      return;
    }

    const quantity = quantities[foodId] || 1;
    setAddingItem(foodId);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ foodId, quantity }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add to cart");

      setMessage(`✅ Added ${quantity} item(s) to cart!`);
      const newCount = cartCount + quantity;
      setCartCount(newCount);
      localStorage.setItem("cartNotificationCount", newCount);

      setTimeout(() => setMessage(""), 2500);
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to add to cart");
    } finally {
      setAddingItem(null);
    }
  }

  function handleCartClick() {
    router.push("/cart");
    setCartCount(0);
    localStorage.removeItem("cartNotificationCount");
  }

  if (!cafe)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300">
        Loading menu...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* 🔸 HEADER */}
      <header className="backdrop-blur-md bg-white/70 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
          <h1
            onClick={() => router.push("/")}
            className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 text-transparent bg-clip-text cursor-pointer select-none"
          >
            CampusEats
          </h1>

          <nav className="flex items-center gap-6 text-gray-800 dark:text-gray-200 font-medium relative">
            <button onClick={() => router.push("/dashboard")} className="hover:text-orange-500">
              Home
            </button>
            <button onClick={() => router.push("/orderHistory")} className="hover:text-orange-500">
              Orders
            </button>

            <div className="relative">
              <button onClick={handleCartClick} className="hover:text-orange-500">
                Cart
              </button>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full animate-bounce">
                  {cartCount}
                </span>
              )}
            </div>

           
           
          </nav>
        </div>
      </header>

      {/* 🔸 MAIN MENU */}
      <main className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {cafe.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{cafe.email}</p>
        </div>

        {/* 🔹 Message Toast */}
        {message && (
          <div
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg text-sm font-semibold transition-all duration-300 ${
              message.startsWith("✅")
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {message}
          </div>
        )}

        {/* 🔹 Food Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {foods.map((food) => (
            <div
              key={food.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-4 flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <img
                src={food.imageUrl || "/fallback.jpg"}
                alt={food.name}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {food.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                  {food.description}
                </p>
              </div>

              <div className="flex justify-between items-center mt-3">
                <span className="font-semibold text-orange-600 dark:text-orange-400">
                  ${food.price}
                </span>
                <input
                  type="number"
                  min="1"
                  value={quantities[food.id] || 1}
                  onChange={(e) =>
                    handleQuantityChange(food.id, e.target.value)
                  }
                  className="w-16 border border-gray-300 dark:border-gray-600 bg-transparent rounded-md px-2 py-1 text-sm text-center text-gray-900 dark:text-gray-200"
                />
              </div>

              <button
                onClick={() => handleAddToCart(food.id)}
                disabled={addingItem === food.id}
                className="mt-4 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 text-white font-semibold hover:opacity-90 disabled:opacity-60 transition-all"
              >
                {addingItem === food.id ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
