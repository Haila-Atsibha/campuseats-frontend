"use client";
import { useState } from "react";

export default function OwnerDashboard() {
  const [foods, setFoods] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.image) {
      alert("Please fill in all required fields");
      return;
    }

    setFoods((prev) => [...prev, form]);
    setForm({ name: "", price: "", description: "", image: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-pink-500">
              <span className="text-xl font-bold text-white">CE</span>
            </div>
            <span className="text-xl font-bold text-gray-800">CampusEats Owner</span>
          </div>

          <button className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100">
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Manage Your Menu 🍔
        </h1>

        {/* Upload Form */}
        <form
          onSubmit={handleSubmit}
          className="mx-auto mb-10 max-w-lg rounded-2xl bg-white p-6 shadow-md"
        >
          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Food Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Chicken Sandwich"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Price (ETB) *</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. 120"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="e.g. Freshly grilled sandwich with veggies"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Image URL *</label>
              <input
                type="text"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="Paste image URL here"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 py-2 font-semibold text-white hover:opacity-90"
            >
              Add Food
            </button>
          </div>
        </form>

        {/* Food List */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Menu</h2>
          {foods.length === 0 ? (
            <p className="text-gray-500 text-center">No food items added yet.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {foods.map((food, index) => (
                <div
                  key={index}
                  className="rounded-xl border bg-white p-4 shadow hover:shadow-md transition"
                >
                  <img
                    src={food.image}
                    alt={food.name}
                    className="h-40 w-full rounded-lg object-cover mb-3"
                  />
                  <h3 className="text-lg font-semibold">{food.name}</h3>
                  <p className="text-sm text-gray-500">{food.description}</p>
                  <p className="mt-2 font-semibold text-orange-600">
                    {food.price} ETB
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-6">
        <div className="container mx-auto text-center text-sm text-gray-500">
          &copy; 2025 CampusEats. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
