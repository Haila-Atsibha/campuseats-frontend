"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const [password, setPassword] = useState({ old: "", new: "" })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")
    setLoading(true)

    const token = localStorage.getItem("token")
    if (!token) {
      setMessage("⚠️ You must be logged in to change your password.")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("https://campuseats-backend-production.up.railway.app/api/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: password.old,
          newPassword: password.new,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to update password")

      setMessage("✅ Password updated successfully!")
      setPassword({ old: "", new: "" })

      // Optional: redirect after success
      setTimeout(() => {
        router.push("/owner/profile")
      }, 1500)
    } catch (err) {
      console.error(err)
      setMessage("❌ " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 p-6">
      {/* Header */}
      <header className="w-full bg-white dark:bg-gray-800 shadow-md py-4 px-6 flex items-center justify-between rounded-xl">
        <h1
          className="text-xl font-bold text-gray-800 dark:text-white cursor-pointer"
          onClick={() => router.push("/profile")}
        >
          CampusEats
        </h1>
        <button
          onClick={() => router.push("/profile")}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-lg shadow hover:opacity-90 transition"
        >
          Back
        </button>
      </header>

      {/* Password Change Form */}
      <div className="max-w-md mx-auto mt-10">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white text-center">
          Account Settings
        </h1>

        {message && (
          <div
            className={`mb-4 p-3 rounded text-center ${
              message.startsWith("✅")
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 space-y-4 transition-colors duration-300"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Old Password
            </label>
            <input
              type="password"
              name="old"
              value={password.old}
              onChange={handleChange}
              placeholder="Enter old password"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              New Password
            </label>
            <input
              type="password"
              name="new"
              value={password.new}
              onChange={handleChange}
              placeholder="Enter new password"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:opacity-90 transition"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  )
}
