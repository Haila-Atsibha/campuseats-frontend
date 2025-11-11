"use client";
import { useEffect, useState } from "react";

export default function UpdateMenuPage() {
  const [foods, setFoods] = useState([]);
  const [newFood, setNewFood] = useState({ name: "", description: "", price: "", imageFile: null });
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingFood, setEditingFood] = useState(null);
  const [message, setMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Detect dark mode
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setDarkMode(mq.matches);
    mq.addEventListener("change", (e) => setDarkMode(e.matches));
  }, []);

  // Load token and fetch foods
  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
    if (t) fetchFoods(t);
  }, []);

  async function fetchFoods(t) {
    try {
      const res = await fetch(`http://localhost:5000/api/food/myfoods`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (!res.ok) throw new Error("Failed to load foods");
      const data = await res.json();
      setFoods(data);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error fetching menu");
    } finally {
      setLoading(false);
    }
  }

  function handleNewChange(e) {
    const { name, value, files } = e.target;
    if (name === "imageFile") setNewFood({ ...newFood, imageFile: files[0] });
    else setNewFood({ ...newFood, [name]: value });
  }

  // Add new food
  async function handleAddFood(e) {
    e.preventDefault();
    if (!newFood.name || !newFood.price) {
      setMessage("⚠️ Name and price are required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", newFood.name);
      formData.append("price", newFood.price);
      formData.append("description", newFood.description);
      if (newFood.imageFile) formData.append("imageFile", newFood.imageFile); // match backend

      const res = await fetch("http://localhost:5000/api/food/create", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add food");

      setFoods((prev) => [...prev, data]);
      setNewFood({ name: "", description: "", price: "", imageFile: null });
      setMessage("✅ Food added successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add food");
    }
  }

  // Delete food
  async function handleDelete(foodId) {
    if (!confirm("Are you sure you want to delete this food?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/food/delete/${foodId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
      setFoods((prev) => prev.filter((f) => f.id !== foodId));
      setMessage("🗑️ Food deleted");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to delete food");
    }
  }

  // Save edits (including new image)
  async function handleEditSave(e) {
    e.preventDefault();
    const { id, name, price, description, imageFile } = editingFood;

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);
      if (imageFile) formData.append("imageFile", imageFile);

      const res = await fetch(`http://localhost:5000/api/food/update/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      setFoods((prev) => prev.map((f) => (f.id === id ? data : f)));
      setEditingFood(null);
      setMessage("✅ Food updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update food");
    }
  }

  if (loading) return <div className="p-6 text-center">Loading menu...</div>;

  return (
    <div className={`${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"} min-h-screen transition-colors p-6`}>
      <h1 className="text-3xl font-bold mb-6">🍴 Manage Menu</h1>

      {message && (
        <p className={`mb-4 text-center font-semibold ${message.startsWith("✅") ? "text-green-500" : "text-red-500"}`}>
          {message}
        </p>
      )}

      {/* Add Food Form */}
      <form onSubmit={handleAddFood} className={`${darkMode ? "bg-gray-800" : "bg-white"} p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-4`}>
        <input type="text" name="name" placeholder="Food name" value={newFood.name} onChange={handleNewChange} className={`${darkMode ? "bg-gray-700 border-gray-600" : "border"} border p-2 rounded`} />
        <input type="number" name="price" placeholder="Price" value={newFood.price} onChange={handleNewChange} className={`${darkMode ? "bg-gray-700 border-gray-600" : "border"} border p-2 rounded`} />
        <input type="file" name="imageFile" accept="image/*" onChange={handleNewChange} className={`${darkMode ? "bg-gray-700 border-gray-600" : "border"} border p-2 rounded`} />
        <button className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600">Add Food</button>
        <textarea name="description" placeholder="Description" value={newFood.description} onChange={handleNewChange} className={`${darkMode ? "bg-gray-700 border-gray-600" : "border"} border p-2 rounded col-span-full`} />
      </form>

      {/* Food Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {foods.map((food) =>
          editingFood?.id === food.id ? (
            <form key={food.id} onSubmit={handleEditSave} className={`${darkMode ? "bg-gray-800" : "bg-white"} p-4 rounded-lg shadow flex flex-col gap-3`}>
              <input type="text" value={editingFood.name} onChange={(e) => setEditingFood({ ...editingFood, name: e.target.value })} className={`${darkMode ? "bg-gray-700 border-gray-600" : "border"} border p-2 rounded`} />
              <input type="number" value={editingFood.price} onChange={(e) => setEditingFood({ ...editingFood, price: e.target.value })} className={`${darkMode ? "bg-gray-700 border-gray-600" : "border"} border p-2 rounded`} />
              <textarea value={editingFood.description} onChange={(e) => setEditingFood({ ...editingFood, description: e.target.value })} className={`${darkMode ? "bg-gray-700 border-gray-600" : "border"} border p-2 rounded`} />
              <input type="file" accept="image/*" onChange={(e) => setEditingFood({ ...editingFood, imageFile: e.target.files[0] })} className={`${darkMode ? "bg-gray-700 border-gray-600" : "border"} border p-2 rounded`} />
              <div className="flex justify-end gap-2">
                <button type="submit" className="bg-blue-500 text-white rounded px-3 py-1 hover:bg-blue-600">Save</button>
                <button type="button" onClick={() => setEditingFood(null)} className="bg-gray-500 text-white rounded px-3 py-1 hover:bg-gray-600">Cancel</button>
              </div>
            </form>
          ) : (
            <div key={food.id} className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow p-4 flex flex-col`}>
              <img src={food.imageUrl || "/fallback.jpg"} alt={food.name} className="w-full h-40 object-cover rounded mb-3" />
              <h2 className="font-semibold text-lg">{food.name}</h2>
              <p className="text-sm mb-2 text-gray-400">{food.description}</p>
              <p className="font-semibold text-orange-500">${food.price}</p>
              <div className="flex justify-end gap-2 mt-3">
                <button onClick={() => setEditingFood(food)} className="bg-yellow-500 text-white rounded px-3 py-1 hover:bg-yellow-600">Edit</button>
                <button onClick={() => handleDelete(food.id)} className="bg-red-500 text-white rounded px-3 py-1 hover:bg-red-600">Delete</button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
