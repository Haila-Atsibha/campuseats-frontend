"use client";
import { useEffect, useState } from "react";

export default function CafeOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://campuseats-backend-production.up.railway.app/api/orders/cafe", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load orders");

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading orders...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📦 Incoming Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center">No orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white shadow rounded-xl p-5">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h2 className="font-semibold text-lg text-gray-800">
                    Order #{order.id}
                  </h2>
                  <p className="text-sm text-gray-600">
                    From: {order.student.name} ({order.student.email})
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === "DELIVERED"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <ul className="divide-y divide-gray-200">
                {order.items.map((item) => (
                  <li key={item.id} className="py-2 flex justify-between">
                    <span>{item.food.name}</span>
                    <span>
                      ${item.food.price} × {item.quantity}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
