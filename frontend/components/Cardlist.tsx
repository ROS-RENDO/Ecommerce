"use client";
import React, { useState } from "react";
import RelativeCard from "./RelativeCard";

const CardList = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <div className="flex gap-4">
      {[1, 2, 3].map((id) => (
        <RelativeCard
          key={id}
          id={id}
          selected={selectedId === id}
          onSelect={() => setSelectedId(id)}
        />
      ))}
    </div>
  );
};

export default CardList;
