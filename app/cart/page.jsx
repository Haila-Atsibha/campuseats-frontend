"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  // ✅ Fetch cart items
  useEffect(() => {
    async function fetchCart() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://campuseats-backend-production.up.railway.app/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch cart");

        const data = await res.json();
        setCartItems(data);
        const sum = data.reduce((acc, item) => acc + item.food.price * item.quantity, 0);
        setTotal(sum);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, []);

  // ✅ Remove item
  const removeItem = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`https://campuseats-backend-production.up.railway.app/api/cart/remove/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      setTotal((prevTotal) =>
        prevTotal -
        cartItems.find((item) => item.id === id).food.price *
          cartItems.find((item) => item.id === id).quantity
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Checkout (create order)
  const checkout = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://campuseats-backend-production.up.railway.app/api/order/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Checkout failed");
      alert("✅ Order placed successfully!");
      setCartItems([]);
      setTotal(0);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 text-lg">
        Loading your cart...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-lg">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 transition-colors">
      
      {/* Header */}
      <header className="max-w-4xl mx-auto mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white flex items-center gap-2">
          🛒 Your Cart
        </h1>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {cartItems.length} item{cartItems.length !== 1 && "s"}
          </span>

          {/* Styled Home button */}
          <Link
            href="/dashboard"
            className="flex items-center gap-1 bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white font-semibold px-4 py-2 rounded-xl shadow-md transition-transform active:scale-95"
          >
            🏠 Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
            <p className="text-lg mb-2">Your cart is empty.</p>
            <p className="text-sm">Browse cafés and add something delicious 🍰</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition"
                >
                  <div className="flex-1">
                    <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                      {item.food.name}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {item.food.description}
                    </p>
                    <p className="mt-1 text-orange-600 dark:text-orange-400 font-semibold">
                      ${item.food.price} × {item.quantity}
                    </p>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-4 rounded-lg bg-red-500 px-4 py-2 text-white font-medium hover:bg-red-600 active:scale-95 transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Total + Checkout */}
            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">
                Total:{" "}
                <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  ${total.toFixed(2)}
                </span>
              </div>

              <button
                onClick={checkout}
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold rounded-xl px-6 py-3 shadow-md transition-all active:scale-95"
              >
                Checkout →
              </button>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} CampusEats. All rights reserved.
      </footer>
    </div>
  );
}
