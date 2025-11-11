"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export default function SignupPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [role, setRole] = useState("CUSTOMER")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // ✅ Get role from URL
  useEffect(() => {
    const r = searchParams.get("role")
    if (r === "CAFE_OWNER") setRole("CAFE_OWNER")
    else setRole("CUSTOMER")
  }, [searchParams])

  // ✅ Handle text input change
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // ✅ Handle image upload
  const handleImageChange = e => {
    const file = e.target.files[0]
    setImage(file)
    if (file) setPreview(URL.createObjectURL(file))
  }

  // ✅ Submit form
  const handleSubmit = async e => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    try {
      const form = new FormData()
      form.append("name", formData.name)
      form.append("email", formData.email)
      form.append("password", formData.password)
      form.append("role", role)
      if (image) form.append("image", image)

      const res = await fetch("https://campuseats-backend-production.up.railway.app/api/signup", {
        method: "POST",
        body: form,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Signup failed")

      router.push("/login")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
          Sign Up
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
          Signing up as{" "}
          <strong>
            {role === "CAFE_OWNER" ? "Café Owner" : "Student"}
          </strong>
        </p>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-purple-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-purple-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-purple-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-purple-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            />
          </div>

          {/* ✅ Café Owner Image Upload */}
          {role === "CAFE_OWNER" && (
            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                Café Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-full mt-3 border"
                />
              )}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-600 text-white font-semibold rounded hover:bg-purple-700 transition"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  )
}
