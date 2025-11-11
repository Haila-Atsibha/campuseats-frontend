"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OwnerHomePage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [newOrders, setNewOrders] = useState(0);

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
  }, []);

  useEffect(() => {
    if (!token) return;

    async function fetchStats() {
      try {
        const res = await fetch("http://localhost:5000/api/owner-orders/my-cafe-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();

        const totalOrders = data.length;
        const totalRevenue = data.reduce(
          (sum, order) =>
            sum +
            order.items.reduce(
              (subtotal, item) => subtotal + item.food.price * item.quantity,
              0
            ),
          0
        );
        const pendingOrders = data.filter(
          (o) => o.status !== "READY" && o.status !== "DELIVERED"
        ).length;

        setStats({ totalOrders, totalRevenue, pendingOrders });
        setNewOrders(pendingOrders);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [token]);

  const handleOrdersClick = () => {
    setNewOrders(0);
    router.push("/owner/orders");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 text-lg">
        Loading dashboard...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 transition-colors">
      {/* 🔹 Header */}
      <header className="max-w-6xl mx-auto mb-10 flex items-center justify-between bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg rounded-2xl px-6 py-4">
        <h1
          onClick={() => router.push("/owner/home")}
          className="text-2xl font-extrabold bg-gradient-to-r from-orange-500 to-pink-500 text-transparent bg-clip-text cursor-pointer"
        >
          CampusEats Owner
        </h1>

        <nav className="flex items-center gap-6 text-gray-800 dark:text-gray-200 font-medium relative">
          <button
            onClick={handleOrdersClick}
            className="relative hover:text-orange-500 transition"
          >
            Orders
            {newOrders > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                {newOrders}
              </span>
            )}
          </button>

          <button
            onClick={() => router.push("/owner/updateMenu")}
            className="hover:text-orange-500 transition"
          >
            Menu
          </button>

          {/* ⭐ New Profile link */}
          <button
            onClick={() => router.push("/owner/profile")}
            className="hover:text-orange-500 transition"
          >
            Profile
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/signin");
            }}
            className="text-red-500 hover:underline transition"
          >
            Logout
          </button>
        </nav>
      </header>

      {/* 🔹 Dashboard Content */}
      <main className="max-w-6xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
          Dashboard Overview
        </h2>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl shadow-md border-t-4 border-orange-500">
            <h3 className="text-sm text-gray-500 dark:text-gray-400">Total Orders</h3>
            <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
              {stats.totalOrders}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl shadow-md border-t-4 border-pink-500">
            <h3 className="text-sm text-gray-500 dark:text-gray-400">Pending Orders</h3>
            <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
              {stats.pendingOrders}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl shadow-md border-t-4 border-green-500">
            <h3 className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</h3>
            <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
              ${stats.totalRevenue.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Quick Actions + Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl shadow-md">
            <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-white">
              Quick Actions
            </h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleOrdersClick}
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition active:scale-95"
              >
                View Orders
              </button>
              <button
                onClick={() => router.push("/owner/updateMenu")}
                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition active:scale-95"
              >
                Manage Menu
              </button>

              {/* ⭐ Quick access to Profile too */}
              <button
                onClick={() => router.push("/owner/profile")}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition active:scale-95"
              >
                View Profile
              </button>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl shadow-md">
            <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-white">
              Welcome Back 👋
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Monitor new orders, check your café’s stats, and update your menu anytime.
              This dashboard keeps you connected to your café’s performance — in real time.
            </p>
          </div>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} CampusEats. All rights reserved.
      </footer>
    </div>
  );
}
