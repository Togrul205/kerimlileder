"use client";

import { useState } from "react";

const STATUSES = ["pending", "paid", "processing", "shipped", "cancelled"];

export function OrderStatusSelect({ id, status }: { id: string; status: string }) {
  const [value, setValue] = useState(status);

  async function onChange(next: string) {
    setValue(next);
    await fetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
  }

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-2 border border-ink/15 bg-transparent px-2 py-1 text-sm"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
