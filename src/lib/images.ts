export const CATALOG_IMAGES: Record<string, string> = {
  "classic-bifold":
    "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1400&q=80",
  "slim-cardholder":
    "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?auto=format&fit=crop&w=1400&q=80",
  "long-wallet":
    "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=1400&q=80",
  "coin-purse":
    "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1400&q=80",
  "messenger-bag":
    "https://images.unsplash.com/photo-1553062407-98eeb64c6ca4?auto=format&fit=crop&w=1400&q=80",
  "tote-bag":
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1400&q=80",
  "crossbody":
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1400&q=80",
  "passport-holder":
    "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1400&q=80",
};

export const SITE_IMAGES = {
  hero:
    "https://images.unsplash.com/photo-1553062407-98eeb64c6ca4?auto=format&fit=crop&w=2000&q=80",
  craft:
    "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1600&q=80",
  about:
    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&q=80",
  wallets:
    "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1000&q=80",
  bags:
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80",
  accessories:
    "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?auto=format&fit=crop&w=1000&q=80",
};

export function productImage(slug: string, stored?: string | null) {
  if (stored?.startsWith("http") || stored?.startsWith("/uploads/")) return stored;
  return CATALOG_IMAGES[slug] ?? stored ?? "/products/bifold.svg";
}

export function categoryImage(slug: string) {
  if (slug === "wallets") return SITE_IMAGES.wallets;
  if (slug === "bags") return SITE_IMAGES.bags;
  return SITE_IMAGES.accessories;
}
