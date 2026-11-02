import { writeFileSync } from "node:fs";
const groups = [
  ["SEASONAL", "Lavender Oat Latte $6.50 (V)", "Matcha Rose Latte $7.00"],
  ["ESPRESSO DRINKS", "Espresso $3.00 | Cortado $4.50 | Flat White $5.50", "Cappuccino $5.50 | Latte $6.00 | Mocha $6.50"],
  ["BREWED & COLD", "Drip Coffee $3.50 | Pour Over $5.00 | Cold Brew $5.50", "Cold Brew Flight $9.00 | Iced Americano $4.50 | Nitro Cold Brew $6.00"],
  ["FOOD & PASTRIES", "Almond Croissant $4.50 | Avocado Toast $9.00 (V)", "Acai Bowl $11.00 (V) | Banana Bread $4.00 (GF)", "Breakfast Burrito $10.00 | Seasonal Scone $3.50"],
  ["BREW AT HOME - 12 OZ", "Ethiopia Yirgacheffe $19.00 - Light Roast", "Colombia Huila $17.00 - Medium Roast", "House Blend - Ember $15.00 - Medium-Dark Roast"]
];
const lines = ["EMBER & BLOOM", "Illustrative full menu - local demo only", "", ...groups.flatMap(g => [...g, ""]), "V: Vegan. GF: Gluten-Free. Dietary claims and allergens unverified.", "Oat milk +$0.75 per drink. No tax, shipping, or payment in this demo.", "No actual orders, certifications, or real business operations."];
const escape = text => text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
const stream = `BT /F1 12 Tf 48 750 Td 20 TL\n${lines.map((line, i) => `${i ? "T* " : ""}(${escape(line)}) Tj`).join("\n")}\nET`;
const objects = [
  "<< /Type /Catalog /Pages 2 0 R >>",
  "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
  "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`
];
let pdf = "%PDF-1.4\n";
const offsets = [0];
objects.forEach((object, i) => { offsets.push(Buffer.byteLength(pdf)); pdf += `${i + 1} 0 obj\n${object}\nendobj\n`; });
const xref = Buffer.byteLength(pdf);
pdf += `xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map(offset => `${String(offset).padStart(10, "0")} 00000 n \n`).join("")}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
writeFileSync(new URL("../public/ember-menu.pdf", import.meta.url), pdf);
