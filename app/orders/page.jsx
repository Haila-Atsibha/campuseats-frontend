"use client";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      setLoading(false);
      return () => controller.abort();
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(
          "https://campuseats-backend-production.up.railway.app/api/orders",
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }
        );

        if (!res.ok) {
          console.error("Failed to fetch orders", res.status, res.statusText);
          setOrders([]);
          return;
        }

        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    return () => controller.abort();
  }, []);

  if (loading) return <div>Loading orders...</div>;
  if (orders.length === 0) return <div>No orders yet</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      <ul className="space-y-4">
        {orders.map((order) => (
          <li key={order.id} className="border p-4 rounded shadow-sm">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Order #{order.id}</span>
              <span
                className={`px-2 py-1 rounded text-white ${
                  order.status === "PENDING"
                    ? "bg-gray-500"
                    : order.status === "PREPARING"
                    ? "bg-yellow-500"
                    : order.status === "READY"
                    ? "bg-blue-500"
                    : "bg-green-500"
                }`}
              >
                {order.status}
              </span>
            </div>
            <ul className="mb-2">
              {order.items?.map((item) => (
                <li key={item.id ?? `${order.id}-${item.food?.id}`}>
                  {item.food?.name ?? "Unknown"} x {item.quantity} - ${
                    typeof item.price === "number" ? item.price.toFixed(2) : item.price
                  }
                </li>
              ))}
            </ul>
            <div className="font-semibold">Total: ${
              typeof order.total === "number" ? order.total.toFixed(2) : order.total
            }</div>
            <div className="text-sm text-gray-500">
              Placed at: {new Date(order.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
