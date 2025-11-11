"use client";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("https://campuseats-backend-production.up.railway.app/api/order", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Loading your orders...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100 text-center">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center">
            You haven’t placed any orders yet.
          </p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3">
                  <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                    Order #{order.id}
                  </span>
                  <span
                    className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-xs font-semibold text-white
                      ${
                        order.status === "PENDING"
                          ? "bg-gray-500"
                          : order.status === "PREPARING"
                          ? "bg-yellow-500"
                          : order.status === "READY"
                          ? "bg-blue-500"
                          : "bg-green-600"
                      }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between py-2 text-gray-700 dark:text-gray-300"
                    >
                      <span>
                        {item.food.name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-800 dark:text-gray-200 font-semibold">
                    Total
                  </span>
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
