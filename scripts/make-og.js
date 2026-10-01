// Generates the static Open Graph image (src/app/opengraph-image.png). Run: node scripts/make-og.js
const sharp = require("sharp");
const path = require("path");
const root = path.join(__dirname, "..");

(async () => {
  const W = 1200, H = 630;
  const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#060a1a"/><stop offset="0.6" stop-color="#0d1446"/><stop offset="1" stop-color="#2a1166"/></linearGradient>
    <linearGradient id="t" x1="0" x2="1"><stop offset="0" stop-color="#7fb2ff"/><stop offset="0.5" stop-color="#9d8cff"/><stop offset="1" stop-color="#d48bff"/></linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  ${[0, 1, 2, 3, 4].map((i) => `<path d="M -20 ${470 + i * 18} C 300 ${380 + i * 22}, 700 ${560 - i * 14}, 1220 ${330 + i * 20}" fill="none" stroke="#7fb2ff" stroke-opacity="${0.08 + i * 0.03}"/>`).join("")}
  <text x="80" y="300" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="84" font-weight="700" fill="#ffffff" letter-spacing="-3">SEE BEYOND.</text>
  <text x="80" y="392" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="84" font-weight="700" fill="url(#t)" letter-spacing="-3">AUTOMATE EVERYTHING.</text>
  <text x="82" y="470" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="22" fill="#9aa3c7" letter-spacing="3">SUPER INTELLIGENCE AUTOMATION &amp; INTELLIGENT SYSTEMS</text>
</svg>`);
  const mark = await sharp(path.join(root, "public/logo-mark.png")).resize({ height: 110 }).toBuffer();
  const word = await sharp(path.join(root, "public/logo-word-light.png")).resize({ height: 44 }).toBuffer();
  const wordMeta = await sharp(word).metadata();
  await sharp(bg)
    .composite([
      { input: mark, left: 80, top: 70 },
      { input: word, left: 170, top: 70 + 110 - wordMeta.height - 2 },
    ])
    .png()
    .toFile(path.join(root, "src/app/opengraph-image.png"));
  console.log("og image written");
})();
