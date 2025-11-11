"use client"
import { useEffect, useState } from "react"

export default function OrdersPage() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    // Replace this with your API call
    setOrders([
      { id: 1, date: "2025-10-25", total: 24.99, status: "Delivered" },
      { id: 2, date: "2025-10-27", total: 15.5, status: "Pending" },
    ])
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">My Orders</h1>
      <div className="bg-white p-6 rounded-xl shadow">
        {orders.length === 0 ? (
          <p className="text-gray-600">You have no orders yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {orders.map((order) => (
              <li key={order.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-800 font-semibold">${order.total}</p>
                  <p className={`text-sm ${order.status === "Delivered" ? "text-green-600" : "text-yellow-600"}`}>
                    {order.status}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
