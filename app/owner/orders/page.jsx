"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OwnerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState(null);
  const router = useRouter();

  // ✅ Get token on mount
  useEffect(() => {
    const stored = localStorage.getItem("token");
    setToken(stored);
  }, []);

  // ✅ Fetch orders
  useEffect(() => {
    if (!token) return;

    async function fetchOrders() {
      try {
        const res = await fetch("http://localhost:5000/api/owner-orders/my-cafe-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, [token]);

  // ✅ Mark order as READY
  const markReady = async (orderId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/order-status/ready/${orderId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to mark order as ready");

      const updated = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o.id === updated.id ? { ...o, status: updated.status } : o))
      );
    } catch (err) {
      console.error(err);
      alert("Error marking order as ready");
    }
  };

  // ✅ Undo READY status
  const undoReady = async (orderId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/order-status/undo/${orderId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to undo ready");

      const updated = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o.id === updated.id ? { ...o, status: updated.status } : o))
      );
    } catch (err) {
      console.error(err);
      alert("Error undoing order status");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 text-lg">
        Loading orders...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-lg">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 transition-colors">
      {/* ✅ Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 shadow-md">
              <span className="text-xl font-bold text-white">CE</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Café Orders
            </h1>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/owner/dashboard")}
              className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Home
            </button>
          </div>
        </div>
      </header>

      {/* ✅ Main Section */}
      <main className="max-w-6xl mx-auto p-6">
        {orders.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center text-lg mt-20">
            No orders yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {orders.map((order) => {
              const total = order.items?.reduce(
                (sum, i) => sum + i.food.price * i.quantity,
                0
              );

              return (
                <div
                  key={order.id}
                  className={`rounded-2xl p-5 shadow-md border transition hover:shadow-lg bg-white dark:bg-gray-800 ${
                    order.status === "READY"
                      ? "border-green-400/70"
                      : order.status === "PREPARING"
                      ? "border-yellow-400/70"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  {/* Header */}
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                      Order #{order.id}
                    </h2>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === "DELIVERED"
                          ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                          : order.status === "READY"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    From:{" "}
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {order.student.name}
                    </span>{" "}
                    ({order.student.email})
                  </p>

                  <ul className="divide-y divide-gray-200 dark:divide-gray-700 mb-3">
                    {order.items.map((item) => (
                      <li
                        key={item.id}
                        className="py-2 flex justify-between text-gray-700 dark:text-gray-300"
                      >
                        <span>{item.food.name}</span>
                        <span>
                          ${item.food.price} × {item.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <p className="text-right font-semibold text-gray-800 dark:text-gray-100 mb-3">
                    Total: ${total.toFixed(2)}
                  </p>

                  {/* ✅ Action Buttons */}
                  <div className="flex justify-end gap-2">
                    {order.status !== "READY" ? (
                      <button
                        onClick={() => markReady(order.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                      >
                        Mark as Ready
                      </button>
                    ) : (
                      <button
                        onClick={() => undoReady(order.id)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                      >
                        Undo Ready
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ✅ Footer */}
      <footer className="border-t mt-12 py-6 bg-white dark:bg-gray-900">
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; 2025 CampusEats. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
