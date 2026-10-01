// One-off asset step: derives transparent logo assets from the supplied official logo JPG.
// The logo artwork itself is not redrawn — only the white background is removed and the
// lockup is cropped into mark / wordmark parts. Run: node scripts/make-logo.js
const sharp = require("sharp");
const path = require("path");
const root = path.join(__dirname, "..");
const pub = (f) => path.join(root, "public", f);

async function removeWhite(input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.from(data);
  for (let i = 0; i < out.length; i += 4) {
    const m = Math.min(out[i], out[i + 1], out[i + 2]);
    out[i + 3] = m >= 250 ? 0 : Math.round(Math.max(0, Math.min(1, (250 - m) / 35)) * 255);
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
}

(async () => {
  const full = await removeWhite(pub("logo-source.jpg"));
  const lockup = await sharp(full).trim().png({ compressionLevel: 9 }).toBuffer();
  await sharp(lockup).toFile(pub("logo.png"));

  // Find the transparent gap between the mark and the wordmark.
  const { data, info } = await sharp(lockup).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let gapStart = -1, gapEnd = -1;
  for (let y = Math.floor(info.height * 0.6); y < info.height; y++) {
    let any = false;
    for (let x = 0; x < info.width; x++) if (data[(y * info.width + x) * 4 + 3] > 40) { any = true; break; }
    if (!any && gapStart < 0) gapStart = y;
    if (any && gapStart >= 0) { gapEnd = y; break; }
  }

  const mark = await sharp(lockup).extract({ left: 0, top: 0, width: info.width, height: gapStart }).png().toBuffer();
  const markTrim = await sharp(mark).trim().png({ compressionLevel: 9 }).toBuffer();
  await sharp(markTrim).toFile(pub("logo-mark.png"));
  await sharp(markTrim)
    .resize(256, 256, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(root, "src/app/icon.png"));
  await sharp(markTrim)
    .resize(150, 150, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .extend({ top: 15, bottom: 15, left: 15, right: 15, background: "#ffffff" })
    .flatten({ background: "#ffffff" })
    .png()
    .toFile(path.join(root, "src/app/apple-icon.png"));

  const word = await sharp(lockup).extract({ left: 0, top: gapEnd, width: info.width, height: info.height - gapEnd }).png().toBuffer();
  const wordTrim = await sharp(word).trim().png({ compressionLevel: 9 }).toBuffer();
  await sharp(wordTrim).toFile(pub("logo-word.png"));

  // Reversed wordmark for dark backgrounds: neutral (black) letters become white, the blue "o" is kept.
  const w = await sharp(wordTrim).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const rev = Buffer.from(w.data);
  for (let i = 0; i < rev.length; i += 4) {
    const r = rev[i], g = rev[i + 1], b = rev[i + 2];
    if (Math.max(r, g, b) - Math.min(r, g, b) < 40) rev[i] = rev[i + 1] = rev[i + 2] = 255;
  }
  await sharp(rev, { raw: { width: w.info.width, height: w.info.height, channels: 4 } }).png().toFile(pub("logo-word-light.png"));

  for (const f of ["logo.png", "logo-mark.png", "logo-word.png", "logo-word-light.png"]) {
    const m = await sharp(pub(f)).metadata();
    console.log(f, m.width, m.height);
  }
})();
