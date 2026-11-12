// Minimal QR Code generator (byte mode, error correction level M, versions 1–10).
// A compact port of the reference algorithm from Project Nayuki's QR Code generator (MIT License).
(function () {
  "use strict";
  // index 0 unused; level M
  const ECC_PER_BLOCK = [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26];
  const NUM_BLOCKS = [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5];
  const FORMAT_BITS_M = 0;

  const getBit = (x, i) => ((x >>> i) & 1) !== 0;
  function numRawDataModules(ver) {
    let r = (16 * ver + 128) * ver + 64;
    if (ver >= 2) { const na = Math.floor(ver / 7) + 2; r -= (25 * na - 10) * na - 55; if (ver >= 7) r -= 36; }
    return r;
  }
  const numDataCodewords = (ver) => Math.floor(numRawDataModules(ver) / 8) - ECC_PER_BLOCK[ver] * NUM_BLOCKS[ver];

  function rsMul(x, y) { let z = 0; for (let i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11d); z ^= ((y >>> i) & 1) * x; } return z & 0xff; }
  function rsDivisor(degree) {
    const res = new Array(degree).fill(0); res[degree - 1] = 1; let root = 1;
    for (let i = 0; i < degree; i++) {
      for (let j = 0; j < res.length; j++) { res[j] = rsMul(res[j], root); if (j + 1 < res.length) res[j] ^= res[j + 1]; }
      root = rsMul(root, 0x02);
    }
    return res;
  }
  function rsRemainder(data, div) {
    const res = div.map(() => 0);
    for (const b of data) { const f = b ^ res.shift(); res.push(0); div.forEach((c, i) => { res[i] ^= rsMul(c, f); }); }
    return res;
  }

  function encode(text) {
    const bytes = Array.from(new TextEncoder().encode(text));
    let ver = 1;
    for (; ver <= 10; ver++) { const ccBits = ver <= 9 ? 8 : 16; if (4 + ccBits + bytes.length * 8 <= numDataCodewords(ver) * 8) break; }
    if (ver > 10) throw new RangeError("Text too long for this QR generator");
    const size = ver * 4 + 17;
    // ---- data bits
    const bb = []; const app = (val, len) => { for (let i = len - 1; i >= 0; i--) bb.push((val >>> i) & 1); };
    app(0x4, 4); app(bytes.length, ver <= 9 ? 8 : 16); bytes.forEach((b) => app(b, 8));
    const cap = numDataCodewords(ver) * 8;
    app(0, Math.min(4, cap - bb.length)); app(0, (8 - (bb.length % 8)) % 8);
    for (let pad = 0xec; bb.length < cap; pad ^= 0xec ^ 0x11) app(pad, 8);
    const data = []; for (let i = 0; i < bb.length; i += 8) data.push(parseInt(bb.slice(i, i + 8).join(""), 2));
    // ---- ECC + interleave
    const nb = NUM_BLOCKS[ver], eccLen = ECC_PER_BLOCK[ver], raw = Math.floor(numRawDataModules(ver) / 8);
    const numShort = nb - (raw % nb), shortLen = Math.floor(raw / nb), div = rsDivisor(eccLen), blocks = [];
    for (let i = 0, k = 0; i < nb; i++) {
      const dat = data.slice(k, k + shortLen - eccLen + (i < numShort ? 0 : 1)); k += dat.length;
      const ecc = rsRemainder(dat, div); if (i < numShort) dat.push(0); blocks.push(dat.concat(ecc));
    }
    const codewords = [];
    for (let i = 0; i < blocks[0].length; i++) blocks.forEach((b, j) => { if (i !== shortLen - eccLen || j >= numShort) codewords.push(b[i]); });
    // ---- matrix
    const mod = Array.from({ length: size }, () => new Array(size).fill(false));
    const fn = Array.from({ length: size }, () => new Array(size).fill(false));
    const set = (x, y, d) => { mod[y][x] = d; fn[y][x] = true; };
    for (let i = 0; i < size; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }
    const finder = (x, y) => { for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) { const d = Math.max(Math.abs(dx), Math.abs(dy)), xx = x + dx, yy = y + dy; if (xx >= 0 && xx < size && yy >= 0 && yy < size) set(xx, yy, d !== 2 && d !== 4); } };
    finder(3, 3); finder(size - 4, 3); finder(3, size - 4);
    const align = (() => { if (ver === 1) return []; const n = Math.floor(ver / 7) + 2, step = Math.ceil((ver * 4 + 4) / (n * 2 - 2)) * 2, r = [6]; for (let p = size - 7; r.length < n; p -= step) r.splice(1, 0, p); return r; })();
    align.forEach((ax, i) => align.forEach((ay, j) => {
      if ((i === 0 && j === 0) || (i === 0 && j === align.length - 1) || (i === align.length - 1 && j === 0)) return;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) set(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    }));
    const drawFormat = (mask) => {
      const d = (FORMAT_BITS_M << 3) | mask; let rem = d;
      for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
      const bits = ((d << 10) | rem) ^ 0x5412;
      for (let i = 0; i <= 5; i++) set(8, i, getBit(bits, i));
      set(8, 7, getBit(bits, 6)); set(8, 8, getBit(bits, 7)); set(7, 8, getBit(bits, 8));
      for (let i = 9; i < 15; i++) set(14 - i, 8, getBit(bits, i));
      for (let i = 0; i < 8; i++) set(size - 1 - i, 8, getBit(bits, i));
      for (let i = 8; i < 15; i++) set(8, size - 15 + i, getBit(bits, i));
      set(8, size - 8, true);
    };
    drawFormat(0);
    if (ver >= 7) {
      let rem = ver; for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
      const bits = (ver << 12) | rem;
      for (let i = 0; i < 18; i++) { const b = getBit(bits, i), a = size - 11 + (i % 3), c = Math.floor(i / 3); set(a, c, b); set(c, a, b); }
    }
    // codewords (zigzag)
    let bi = 0;
    for (let right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (let vert = 0; vert < size; vert++) for (let j = 0; j < 2; j++) {
        const x = right - j, up = ((right + 1) & 2) === 0, y = up ? size - 1 - vert : vert;
        if (!fn[y][x] && bi < codewords.length * 8) { mod[y][x] = getBit(codewords[bi >>> 3], 7 - (bi & 7)); bi++; }
      }
    }
    // mask selection by penalty score
    const maskFn = [(x, y) => (x + y) % 2 === 0, (x, y) => y % 2 === 0, (x) => x % 3 === 0, (x, y) => (x + y) % 3 === 0,
      (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0, (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
      (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0, (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0];
    const applyMask = (m) => { for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (!fn[y][x] && maskFn[m](x, y)) mod[y][x] = !mod[y][x]; };
    const penalty = () => {
      let p = 0;
      for (let y = 0; y < size; y++) for (let run = 1, x = 1; x <= size; x++) { if (x < size && mod[y][x] === mod[y][x - 1]) run++; else { if (run >= 5) p += run - 2; run = 1; } }
      for (let x = 0; x < size; x++) for (let run = 1, y = 1; y <= size; y++) { if (y < size && mod[y][x] === mod[y - 1][x]) run++; else { if (run >= 5) p += run - 2; run = 1; } }
      for (let y = 0; y < size - 1; y++) for (let x = 0; x < size - 1; x++) { const c = mod[y][x]; if (c === mod[y][x + 1] && c === mod[y + 1][x] && c === mod[y + 1][x + 1]) p += 3; }
      let dark = 0; mod.forEach((r) => r.forEach((c) => { if (c) dark++; }));
      p += Math.floor(Math.abs(dark * 20 - size * size * 10) / (size * size)) * 10;
      return p;
    };
    let best = 0, bestP = Infinity;
    for (let m = 0; m < 8; m++) { applyMask(m); drawFormat(m); const p = penalty(); if (p < bestP) { bestP = p; best = m; } applyMask(m); }
    applyMask(best); drawFormat(best);
    return { size, version: ver, mask: best, modules: mod };
  }

  function toSvg(text, { border = 4, dark = "#111", light = "#fff" } = {}) {
    const q = encode(text), n = q.size + border * 2;
    let d = ""; q.modules.forEach((row, y) => row.forEach((c, x) => { if (c) d += `M${x + border} ${y + border}h1v1h-1z`; }));
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges"><rect width="${n}" height="${n}" fill="${light}"/><path d="${d}" fill="${dark}"/></svg>`;
  }

  window.QR = { encode, toSvg };
})();
