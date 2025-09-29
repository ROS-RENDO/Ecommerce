'use client'
import React from "react";
import { X } from "lucide-react";

export default function CustomSearch() {
  const [value, setValue] = React.useState("");

  return (
    <div className="relative w-64">
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search..."
        className="w-full py-2 px-4 pr-10 border rounded-2xl"
      />
      {value && (
        <button
          onClick={() => setValue("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
