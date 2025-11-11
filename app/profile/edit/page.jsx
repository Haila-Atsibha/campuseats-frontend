"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function EditProfilePage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: "", email: "" })
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  // 🧠 Fetch current user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        if (!res.ok) throw new Error("Failed to fetch user")
        const data = await res.json()
        setForm({ name: data.name, email: data.email })
        if (data.imageUrl) setPreview(`http://localhost:5000${data.imageUrl}`)
      } catch (err) {
        console.error(err)
      }
    }
    fetchUser()
  }, [])

  // 📸 Preview profile picture
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  // ✏️ Handle text input change
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  // 💾 Submit update to backend
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const formData = new FormData()
      formData.append("name", form.name)
      formData.append("email", form.email)
      if (image) formData.append("image", image)

      const res = await fetch("http://localhost:5000/api/user/update", {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      })

      const data = await res.json()

      if (res.ok) {
        setMessage("✅ Profile updated successfully!")
      } else {
        setMessage(`❌ ${data.error || "Something went wrong"}`)
      }
    } catch (err) {
      console.error(err)
      setMessage("❌ Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 🧭 Navbar */}
      <nav className="sticky top-0 bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Edit Profile</h1>
        <button
          onClick={() => router.push("/")}
          className="text-sm bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          ← Back to Home
        </button>
      </nav>

      {/* 🧾 Form */}
      <div className="flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-lg bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center">
              {/* Profile Image */}
              <div className="relative">
                <img
                  src={preview || "/default-avatar.png"}
                  alt="Profile Preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-orange-500 shadow-md"
                />
                <label className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full cursor-pointer hover:bg-orange-600 transition">
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  ✎
                </label>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">Click to change photo</p>
            </div>

            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-gray-100 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-gray-100 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                required
              />
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

            {message && (
              <p className="text-center mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
