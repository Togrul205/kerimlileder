export function shippingCentsForCountry(country: string, subtotal = 0) {
  const code = country.toUpperCase();
  if (code === "DE" && subtotal >= 15000) return 0;
  if (code === "DE") return 490;
  if (code === "AT" || code === "CH") return 690;
  if (code === "AZ") return 1490;
  return 990;
}

export const COUNTRIES = [
  { code: "DE", nameAz: "Almaniya", nameDe: "Deutschland" },
  { code: "AT", nameAz: "Avstriya", nameDe: "Österreich" },
  { code: "CH", nameAz: "İsveçrə", nameDe: "Schweiz" },
  { code: "AZ", nameAz: "Azərbaycan", nameDe: "Aserbaidschan" },
  { code: "TR", nameAz: "Türkiyə", nameDe: "Türkei" },
  { code: "NL", nameAz: "Niderland", nameDe: "Niederlande" },
  { code: "FR", nameAz: "Fransa", nameDe: "Frankreich" },
] as const;
