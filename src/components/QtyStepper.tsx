"use client";

type Props = {
  value: number;
  min?: number;
  max: number;
  onChange: (n: number) => void;
};

export function QtyStepper({ value, min = 1, max, onChange }: Props) {
  return (
    <div className="inline-flex items-center border border-ink/15">
      <button
        type="button"
        className="h-10 w-10 text-lg leading-none text-muted hover:text-ink"
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label="-"
      >
        −
      </button>
      <span className="w-8 text-center text-sm tabular-nums">{value}</span>
      <button
        type="button"
        className="h-10 w-10 text-lg leading-none text-muted hover:text-ink"
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label="+"
      >
        +
      </button>
    </div>
  );
}
