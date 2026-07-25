import { PNG } from "pngjs";
import { writeFileSync, mkdirSync } from "fs";

// ClarityAI brand colors
const INDIGO = { r: 79, g: 70, b: 229 }; // #4F46E5
const VIOLET = { r: 124, g: 58, b: 237 }; // #7C3AED
const WHITE = { r: 255, g: 255, b: 255 };

function lerp(a, b, t) {
  return Math.round(a + (b - a) * t);
}

function createIcon(size) {
  const png = new PNG({ width: size, height: size });
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (size * y + x) << 2;
      const dx = x - cx + 0.5;
      const dy = y - cy + 0.5;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > outerR) {
        // Transparent outside circle
        png.data[idx] = 0;
        png.data[idx + 1] = 0;
        png.data[idx + 2] = 0;
        png.data[idx + 3] = 0;
        continue;
      }

      // Gradient from indigo (top-left) to violet (bottom-right)
      const gradientT = (x / size + y / size) / 2;
      const r = lerp(INDIGO.r, VIOLET.r, gradientT);
      const g = lerp(INDIGO.g, VIOLET.g, gradientT);
      const b = lerp(INDIGO.b, VIOLET.b, gradientT);

      png.data[idx] = r;
      png.data[idx + 1] = g;
      png.data[idx + 2] = b;
      png.data[idx + 3] = 255;

      // Draw white letter "C" shape in the center
      const normX = (x - cx) / outerR;
      const normY = (y - cy) / outerR;

      // C shape: ring with opening on right side
      const cDist = Math.sqrt(normX * normX + normY * normY);
      const ringOuter = 0.55;
      const ringInner = 0.3;
      const isRing = cDist >= ringInner && cDist <= ringOuter;
      const isOpening = normX > 0.15 && Math.abs(normY) < 0.22;

      if (isRing && !isOpening) {
        png.data[idx] = WHITE.r;
        png.data[idx + 1] = WHITE.g;
        png.data[idx + 2] = WHITE.b;
        png.data[idx + 3] = 255;
      }

      // Add a small sparkle dot inside the C
      const sparkDist = Math.sqrt(
        (normX + 0.05) * (normX + 0.05) + normY * normY
      );
      if (sparkDist < 0.14) {
        const alpha = 1 - sparkDist / 0.14;
        png.data[idx] = lerp(r, WHITE.r, alpha * 0.9);
        png.data[idx + 1] = lerp(g, WHITE.g, alpha * 0.9);
        png.data[idx + 2] = lerp(b, WHITE.b, alpha * 0.9);
        png.data[idx + 3] = 255;
      }
    }
  }

  return PNG.sync.write(png);
}

mkdirSync("public/icons", { recursive: true });

for (const size of [16, 48, 128]) {
  const buffer = createIcon(size);
  writeFileSync(`public/icons/icon${size}.png`, buffer);
  console.log(`✓ Created public/icons/icon${size}.png`);
}

console.log("Icons generated successfully!");
