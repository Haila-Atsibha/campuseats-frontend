"use client";
import { useState } from "react";

export default function AddFoodPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);

      // ✅ Add file if selected, else add URL
      if (imageFile) {
        formData.append("imageFile", imageFile);
      } else if (imageUrl.trim() !== "") {
        formData.append("imageUrl", imageUrl.trim());
      }

      const res = await fetch("https://campuseats-backend-production.up.railway.app/api/food/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to create food");

      setMessage("✅ Food added successfully!");
      setName("");
      setDescription("");
      setPrice("");
      setImageUrl("");
      setImageFile(null);
    } catch (error) {
      console.error(error);
      setMessage("❌ " + error.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start p-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Add New Food</h1>

        {message && (
          <p
            className={`text-center mb-4 font-semibold ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Name */}
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-orange-500 outline-none"
        />

        {/* Description */}
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full border rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-orange-500 outline-none"
        />

        {/* Price */}
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Price ($)
        </label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          step="0.01"
          className="w-full border rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-orange-500 outline-none"
        />

        {/* Image Upload OR URL */}
        <div className="border rounded-lg p-4 mb-4 bg-gray-50">
          <p className="text-sm font-semibold mb-2">Image</p>

          <label className="block text-sm mb-1 text-gray-600">Image URL</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setImageFile(null); // reset file if URL is typed
            }}
            placeholder="https://example.com/food.jpg"
            className="w-full border rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-orange-500 outline-none"
          />

          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-600">or Upload Image File</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setImageFile(e.target.files[0]);
                setImageUrl(""); // reset URL if file chosen
              }}
              className="block w-2/3 text-sm text-gray-700"
            />
          </div>

          {/* Preview */}
          {(imageFile || imageUrl) && (
            <div className="mt-3 flex justify-center">
              <img
                src={
                  imageFile
                    ? URL.createObjectURL(imageFile)
                    : imageUrl
                }
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition"
        >
          Add Food
        </button>
      </form>
    </div>
  );
}
