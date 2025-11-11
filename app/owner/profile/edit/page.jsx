"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function EditProfilePage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: "", email: "" })
  const [profilePic, setProfilePic] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  // ✅ Fetch current user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("https://campuseats-backend-production.up.railway.app/api/user/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        if (!res.ok) throw new Error("Failed to load user info")
        const data = await res.json()
        setForm({ name: data.name, email: data.email })
        if (data.imageUrl) setPreview(`https://campuseats-backend-production.up.railway.app${data.imageUrl}`)
      } catch (err) {
        console.error(err)
      }
    }
    fetchUser()
  }, [])

  // 📸 Handle image upload preview
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfilePic(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  // 💾 Submit changes
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const formData = new FormData()
      formData.append("name", form.name)
      formData.append("email", form.email)
      if (profilePic) formData.append("image", profilePic)

      const res = await fetch("https://campuseats-backend-production.up.railway.app/api/user/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      })

      const data = await res.json()
      if (res.ok) {
        setMessage("✅ Profile updated successfully!")
      } else {
        setMessage(`❌ ${data.error || "Failed to update profile"}`)
      }
    } catch (err) {
      console.error(err)
      setMessage("❌ Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Navbar */}
      <header className="w-full bg-white dark:bg-gray-800 shadow-md py-4 px-6 flex items-center justify-between">
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

      {/* Form */}
      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 mt-10">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Edit Profile</h1>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Update your profile information below. Make sure your email is correct.
          </p>

          {/* Profile Picture Upload */}
          <div className="mb-6 flex flex-col items-center">
            {preview ? (
              <img
                src={preview}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full object-cover mb-3 border-2 border-orange-500 shadow"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 mb-3 flex items-center justify-center border-2 border-orange-500 text-gray-500">
                No Image
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm text-gray-600 dark:text-gray-300"
            />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                required
              />
            </div>

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
