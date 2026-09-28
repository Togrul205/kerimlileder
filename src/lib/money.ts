export function formatEur(cents: number, _locale?: string) {
  const value = (cents / 100).toFixed(2).replace(".", ",");
  return `${value} €`;
}
