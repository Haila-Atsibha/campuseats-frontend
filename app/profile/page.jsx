"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          window.location.href = "/login"
          return
        }

        const res = await fetch("http://localhost:5000/api/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Failed to load user")

        setUser(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] text-gray-500 dark:text-gray-400">
        Loading profile...
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center mt-10 text-gray-600 dark:text-gray-400">
        Failed to load user. Please{" "}
        <Link
          href="/login"
          className="text-orange-600 dark:text-orange-400 font-semibold hover:underline"
        >
          login again
        </Link>
        .
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 dark:text-white mb-8 text-center">
          My Profile
        </h1>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-8 transition-all duration-300">
          {/* Top Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                👋 Welcome back,{" "}
                <span className="text-orange-600 dark:text-orange-400">
                  {user.name}
                </span>
                !
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Here’s your account overview.
              </p>
            </div>

            <div className="relative mt-6 sm:mt-0">
              <img
                src="/default-avatar.png"
                alt="Profile Avatar"
                className="w-20 h-20 rounded-full border-4 border-orange-500 shadow-md object-cover"
              />
              <span className="absolute bottom-1 right-1 block h-4 w-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
            </div>
          </div>

          {/* User Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-800 dark:text-gray-300">
            <div className="space-y-2">
              <p>
                <strong className="text-gray-900 dark:text-gray-100">Name:</strong>{" "}
                {user.name}
              </p>
              <p>
                <strong className="text-gray-900 dark:text-gray-100">Email:</strong>{" "}
                {user.email}
              </p>
            </div>

            <div className="space-y-2">
              <p>
                <strong className="text-gray-900 dark:text-gray-100">Role:</strong>{" "}
                {user.role || "Customer"}
              </p>
              <p>
                <strong className="text-gray-900 dark:text-gray-100">Joined:</strong>{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-wrap gap-4 justify-center sm:justify-start">
            <Link
              href="/profile/edit"
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:opacity-90 transition"
            >
              Edit Profile
            </Link>

            <Link
              href="/profile/orders"
              className="px-6 py-2.5 border border-orange-500 text-orange-600 dark:text-orange-400 font-semibold rounded-lg hover:bg-orange-50 dark:hover:bg-gray-700 transition"
            >
              View Orders
            </Link>

            <Link
              href="/profile/settings"
              className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
