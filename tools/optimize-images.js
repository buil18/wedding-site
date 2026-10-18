#!/usr/bin/env node
/* =========================================================
   Nén ảnh tự động
   Bỏ ảnh gốc (nặng, tên bất kỳ) vào thư mục  images-raw/
   Chạy:  node tools/optimize-images.js          (nén 1 lần)
          node tools/optimize-images.js --watch  (đứng chờ, có ảnh mới là tự nén)
          node tools/optimize-images.js --force  (nén lại tất cả)
   Kết quả (nhẹ, đã xoay đúng chiều, đã xóa thông tin GPS) nằm ở  site/assets/img/own/
   cùng tên file (đổi đuôi thành .jpg; ảnh PNG giữ PNG để còn nền trong suốt).
   ========================================================= */
const fs = require("fs");
const path = require("path");

// ---- Chỉnh ở đây nếu muốn ảnh nhẹ hơn / nét hơn ----
const MAX_W = 2000;      // chiều ngang tối đa (px)
const MAX_H = 3000;      // chiều cao tối đa (px)
const QUALITY = 78;      // chất lượng JPG, 70-85 là hợp lý
const PNG_MAX = 1200;    // logo/PNG: cạnh dài tối đa
const WARN_KB = 600;     // báo nếu ảnh trong own/ nặng hơn mức này

let sharp;
try { sharp = require("sharp"); }
catch { console.error("Chưa cài thư viện nén ảnh. Chạy một lần:  npm install"); process.exit(1); }

const ROOT = path.join(__dirname, "..");
const IN = path.join(ROOT, "images-raw");
const OUT = path.join(ROOT, "site", "assets", "img", "own");
const EXT = /\.(jpe?g|png|webp|tiff?)$/i;
const kb = (n) => Math.round(n / 1024) + " KB";

fs.mkdirSync(IN, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });

async function convert(file, force) {
  const src = path.join(IN, file);
  const isPng = /\.png$/i.test(file);
  const outName = path.parse(file).name + (isPng ? ".png" : ".jpg");
  const dst = path.join(OUT, outName);
  if (!force && fs.existsSync(dst) && fs.statSync(dst).mtimeMs >= fs.statSync(src).mtimeMs) return false;
  let img = sharp(src, { failOn: "none" }).rotate(); // .rotate() = xoay theo thông tin chiều chụp
  if (isPng) {
    img = img.resize({ width: PNG_MAX, height: PNG_MAX, fit: "inside", withoutEnlargement: true })
             .png({ compressionLevel: 9, effort: 8 });
  } else {
    img = img.resize({ width: MAX_W, height: MAX_H, fit: "inside", withoutEnlargement: true })
             .jpeg({ quality: QUALITY, mozjpeg: true, progressive: true });
  }
  await img.toFile(dst);
  console.log(`✓ ${file}  ${kb(fs.statSync(src).size)} → ${outName}  ${kb(fs.statSync(dst).size)}`);
  return true;
}

async function runAll(force) {
  const files = fs.readdirSync(IN).filter((f) => EXT.test(f));
  if (!files.length) console.log("images-raw/ đang trống. Bỏ ảnh gốc vào đó rồi chạy lại.");
  let n = 0;
  for (const f of files) {
    try { if (await convert(f, force)) n++; }
    catch (e) { console.error(`✗ ${f}: ${e.message}`); }
  }
  if (files.length) console.log(n ? `Xong ${n} ảnh.` : "Không có ảnh mới (ảnh đã nén rồi).");
  // Nhắc nếu có ảnh nặng bỏ thẳng vào own/ mà chưa qua công cụ này
  for (const f of fs.readdirSync(OUT)) {
    const size = fs.statSync(path.join(OUT, f)).size;
    if (EXT.test(f) && size > WARN_KB * 1024)
      console.log(`! ${f} nặng ${kb(size)}: hãy chép bản gốc vào images-raw/ để công cụ nén lại.`);
  }
}

(async () => {
  const args = process.argv.slice(2);
  await runAll(args.includes("--force"));
  if (args.includes("--watch")) {
    console.log("Đang chờ ảnh mới trong images-raw/ ... (Ctrl+C để dừng)");
    let timer;
    fs.watch(IN, () => { clearTimeout(timer); timer = setTimeout(() => runAll(false), 1500); });
  }
})();
