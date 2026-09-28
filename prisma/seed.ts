import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.product.count();
  if (existing > 0) {
    console.log(`Database already has ${existing} products — skip seed.`);
    return;
  }

  const wallets = await prisma.category.create({
    data: { slug: "wallets", nameAz: "Pul kisələri", nameDe: "Geldbörsen" },
  });
  const bags = await prisma.category.create({
    data: { slug: "bags", nameAz: "Çantalar", nameDe: "Taschen" },
  });
  const accessories = await prisma.category.create({
    data: { slug: "accessories", nameAz: "Aksesuarlar", nameDe: "Accessoires" },
  });

  const products = [
    {
      slug: "classic-bifold",
      nameAz: "Klassik bifold pul kisəsi",
      nameDe: "Klassische Bifold-Geldbörse",
      descriptionAz:
        "Tam dənəli dəridən əl ilə tikilmiş klassik kişi pul kisəsi. Kart yerləri, əskinas bölməsi və incə siluet.",
      descriptionDe:
        "Handgenähte Herrengeldbörse aus Vollleder. Kartenfächer, Scheinfach und schlanke Silhouette.",
      featured: true,
      categoryId: wallets.id,
      images: [{ url: "/products/bifold.svg", altAz: "Bifold pul kisəsi", altDe: "Bifold-Geldbörse" }],
      variants: [
        { nameAz: "Cognac", nameDe: "Cognac", color: "#8B4E2A", price: 7900, stock: 8, sku: "KL-BF-COG" },
        { nameAz: "Qara", nameDe: "Schwarz", color: "#1A120C", price: 7900, stock: 6, sku: "KL-BF-BLK" },
      ],
    },
    {
      slug: "slim-cardholder",
      nameAz: "İncə kart qabı",
      nameDe: "Schlankes Kartenetui",
      descriptionAz:
        "Cibə sığan minimalist kart qabı. 4–6 kart və qatlanmış əskinas üçün.",
      descriptionDe:
        "Minimalistisches Kartenetui für die Hosentasche. Platz für 4–6 Karten und gefaltete Scheine.",
      featured: true,
      categoryId: wallets.id,
      images: [{ url: "/products/cardholder.svg", altAz: "Kart qabı", altDe: "Kartenetui" }],
      variants: [
        { nameAz: "Zeytun", nameDe: "Oliv", color: "#5C5346", price: 4900, stock: 12, sku: "KL-CH-OLV" },
        { nameAz: "Cognac", nameDe: "Cognac", color: "#8B4E2A", price: 4900, stock: 10, sku: "KL-CH-COG" },
      ],
    },
    {
      slug: "long-wallet",
      nameAz: "Uzun dəri pul kisəsi",
      nameDe: "Lange Lederbörse",
      descriptionAz:
        "Qadın və kişi üçün uzun format. Fermuarlı sikkə bölməsi və çoxlu kart yerləri.",
      descriptionDe:
        "Langes Format für Damen und Herren. Münzfach mit Reißverschluss und vielen Kartenfächern.",
      featured: true,
      categoryId: wallets.id,
      images: [{ url: "/products/long-wallet.svg", altAz: "Uzun pul kisəsi", altDe: "Lange Börse" }],
      variants: [
        { nameAz: "Şərab", nameDe: "Weinrot", color: "#6B2D3C", price: 8900, stock: 5, sku: "KL-LW-WIN" },
        { nameAz: "Qaymaq", nameDe: "Creme", color: "#C4B49A", price: 8900, stock: 4, sku: "KL-LW-CRM" },
      ],
    },
    {
      slug: "coin-purse",
      nameAz: "Sikkə kisəsi",
      nameDe: "Münzbörse",
      descriptionAz: "Kiçik fermuarlı kisə — açar, sikkə və kartlar üçün.",
      descriptionDe: "Kleine Börse mit Reißverschluss für Münzen, Schlüssel und Karten.",
      featured: false,
      categoryId: wallets.id,
      images: [{ url: "/products/coin.svg", altAz: "Sikkə kisəsi", altDe: "Münzbörse" }],
      variants: [
        { nameAz: "Cognac", nameDe: "Cognac", color: "#8B4E2A", price: 3900, stock: 15, sku: "KL-CP-COG" },
      ],
    },
    {
      slug: "messenger-bag",
      nameAz: "Dəri messenger çanta",
      nameDe: "Leder-Umhängetasche",
      descriptionAz:
        "Gündəlik şəhər çantası. Laptop bölməsi, tənzimlənən kəmər, bərk tikiş.",
      descriptionDe:
        "Alltagstasche für die Stadt. Laptopfach, verstellbarer Riemen, feste Nähte.",
      featured: true,
      categoryId: bags.id,
      images: [{ url: "/products/messenger.svg", altAz: "Messenger çanta", altDe: "Umhängetasche" }],
      variants: [
        { nameAz: "Tünd qəhvəyi", nameDe: "Dunkelbraun", color: "#3D2416", price: 18900, stock: 3, sku: "KL-MS-DRK" },
        { nameAz: "Cognac", nameDe: "Cognac", color: "#8B4E2A", price: 18900, stock: 4, sku: "KL-MS-COG" },
      ],
    },
    {
      slug: "tote-bag",
      nameAz: "Dəri tote çanta",
      nameDe: "Leder-Shopper",
      descriptionAz: "Geniş tote — bazar, iş və səyahət üçün. Yumşaq, amma möhkəm dəri.",
      descriptionDe: "Geräumiger Shopper für Markt, Büro und Reise. Weiches, tragfähiges Leder.",
      featured: true,
      categoryId: bags.id,
      images: [{ url: "/products/tote.svg", altAz: "Tote çanta", altDe: "Shopper" }],
      variants: [
        { nameAz: "Qara", nameDe: "Schwarz", color: "#1A120C", price: 15900, stock: 5, sku: "KL-TO-BLK" },
        { nameAz: "Qum", nameDe: "Sand", color: "#A68A64", price: 15900, stock: 3, sku: "KL-TO-SND" },
      ],
    },
    {
      slug: "crossbody",
      nameAz: "Çiyin çantası",
      nameDe: "Crossbody-Tasche",
      descriptionAz: "Kompakt crossbody — telefon, pul kisəsi və açarlar üçün.",
      descriptionDe: "Kompakte Crossbody für Telefon, Geldbörse und Schlüssel.",
      featured: false,
      categoryId: bags.id,
      images: [{ url: "/products/crossbody.svg", altAz: "Çiyin çantası", altDe: "Crossbody" }],
      variants: [
        { nameAz: "Cognac", nameDe: "Cognac", color: "#8B4E2A", price: 11900, stock: 7, sku: "KL-XB-COG" },
      ],
    },
    {
      slug: "passport-holder",
      nameAz: "Pasport qabı",
      nameDe: "Reisepasshülle",
      descriptionAz: "Pasport, boarding pass və 2 kart üçün nazik dəri qab.",
      descriptionDe: "Schlanke Hülle für Reisepass, Boardingkarte und zwei Karten.",
      featured: false,
      categoryId: accessories.id,
      images: [{ url: "/products/passport.svg", altAz: "Pasport qabı", altDe: "Reisepasshülle" }],
      variants: [
        { nameAz: "Zeytun", nameDe: "Oliv", color: "#5C5346", price: 4500, stock: 9, sku: "KL-PP-OLV" },
        { nameAz: "Qara", nameDe: "Schwarz", color: "#1A120C", price: 4500, stock: 8, sku: "KL-PP-BLK" },
      ],
    },
  ];

  for (const p of products) {
    await prisma.product.create({
      data: {
        slug: p.slug,
        nameAz: p.nameAz,
        nameDe: p.nameDe,
        descriptionAz: p.descriptionAz,
        descriptionDe: p.descriptionDe,
        featured: p.featured,
        categoryId: p.categoryId,
        images: { create: p.images.map((img, i) => ({ ...img, sortOrder: i })) },
        variants: { create: p.variants },
      },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
