"use client";
import React, { useState, useEffect } from "react";
import { Category } from "@/types/category";

export default function CreateProductPage({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [color, setColor]= useState("");

  // Fetch categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/category");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        } else {
          console.error("Failed to fetch categories:", res.status);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const resetForm = () => {
    setName("");
    setPrice("");
    setStock("");
    setDescription("");
    setCategory("");
    setImage(null);
    // Reset file input
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("=== FORM SUBMISSION DEBUG ===");
    console.log("Form data:", { name, price, description, category });
    console.log("Image file:", images);

    if (!images) {
      setMessage("❌ Please select an image");
      return;
    }

    // Validate form data
    if (!name.trim()) {
      setMessage("❌ Product name is required");
      return;
    }

    if (!price || parseFloat(price) <= 0) {
      setMessage("❌ Valid price is required");
      return;
    }

    if (!description.trim()) {
      setMessage("❌ Description is required");
      return;
    }

    if (!category) {
      setMessage("❌ Please select a category");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("price", price);
    formData.append("description", description.trim());
    formData.append("category", category);
    formData.append("file", images);
    formData.append("stock", stock || "0");
    formData.append("color", color);

    console.log("FormData contents:");
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    setLoading(true);
    setMessage("");

    try {
      console.log("Sending request to:", "http://localhost:5000/api/product");

      const res = await fetch("http://localhost:5000/api/product", {
        method: "POST",
        body: formData,
        // Don't set Content-Type header - let browser set it for FormData
      });

      console.log("Response status:", res.status);
      console.log(
        "Response headers:",
        Object.fromEntries(res.headers.entries())
      );

      // Check if response is JSON
      const contentType = res.headers.get("content-type");
      console.log("Content-Type:", contentType);

      if (!contentType?.includes("application/json")) {
        // If not JSON, get text to see what was returned
        const text = await res.text();
        console.error("Non-JSON response:", text);
        throw new Error(
          `Server returned ${res.status}: ${text.substring(0, 200)}...`
        );
      }

      const data = await res.json();
      console.log("Response data:", data);

      if (!res.ok) {
        throw new Error(
          data.message || `HTTP ${res.status}: ${res.statusText}`
        );
      }

      setMessage("✅ Product created successfully!");
      resetForm();
      console.log("Product created successfully:", data);
    } catch (error: unknown) {
      if (error instanceof Error) {
      console.error("=== FRONTEND ERROR ===");
      console.error("Error type:", error.constructor.name);
      console.error("Error message:", error.message);
      console.error("Full error:", error);

      setMessage("❌ Error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Create New Product</h2>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        aria-label="Close"></button>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            message.includes("✅")
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Product Name *
          </label>
          <input
            type="text"
            placeholder="Enter product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price ($) *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Stock</label>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Description *
          </label>
          <textarea
            placeholder="Enter product description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded h-24 resize-none focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category *</label>
          {categories.length > 0 ? (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="w-full border border-gray-300 px-3 py-2 rounded bg-gray-100 text-gray-500">
              Loading categories...
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Product Image *
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
            required
          />
          {images && (
            <div className="text-sm text-gray-600 mt-1">
              <p>Selected: {images.name}</p>
              <p>Size: {(images.size / 1024 / 1024).toFixed(2)} MB</p>
              <p>Type: {images.type}</p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Color</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-16 h-10 cursor-pointer border rounded"
          />
          {color && <p className="mt-1 text-sm">Selected: {color}</p>}
        </div>

        <button
          type="submit"
          disabled={loading || categories.length === 0}
          className={`w-full py-2 rounded font-medium transition-colors ${
            loading || categories.length === 0
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {loading ? "Creating Product..." : "Create Product"}
        </button>
      </form>

      {/* Debug info - remove in production */}
      <div className="mt-4 p-2 bg-gray-100 text-xs text-gray-600 rounded">
        <p>Debug: Categories loaded: {categories.length}</p>
        <p>Debug: File selected: {images ? "Yes" : "No"}</p>
      </div>
    </div>
  );
}
