"use client";

import { useState } from "react";

export function VariantQuickEdit({
  id,
  kind,
  label,
  value,
}: {
  id: string;
  kind: "price" | "stock";
  label: string;
  value: string;
}) {
  const [current, setCurrent] = useState(value);

  async function save(next: string) {
    setCurrent(next);
    await fetch(`/api/admin/variants/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(kind === "price" ? { priceEur: next } : { stock: next }),
    });
  }

  return (
    <label className="mb-1 flex items-center gap-2 text-xs">
      <span className="w-16 truncate text-muted">{label}</span>
      <input
        type="number"
        step={kind === "price" ? "0.01" : "1"}
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
        onBlur={(e) => save(e.target.value)}
        className="w-20 border border-ink/15 bg-transparent px-1 py-0.5"
      />
    </label>
  );
}
