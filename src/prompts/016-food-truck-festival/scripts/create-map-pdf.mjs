import { writeFileSync } from "node:fs";

// Original vector schematic, intentionally not a geographic navigation map.
const commands = [
  "0.96 0.97 0.88 rg 0 0 792 612 re f",
  "0.65 0.83 0.84 rg 30 432 732 65 re f",
  "0.2 0.2 0.16 rg BT /F1 25 Tf 36 564 Td (STREETBITE FEST - DEMO MAP) Tj ET",
  "BT /F1 11 Tf 36 541 Td (July 25-27, 2026 - fictional event - not a surveyed map) Tj ET",
  "BT /F1 13 Tf 289 459 Td (WILLAMETTE RIVER - NORTH) Tj ET",
  "0.98 0.97 0.9 RG 16 w 45 286 m 746 286 l S 396 153 m 396 432 l S",
];
function box(x, y, width, height, color, title, subtitle) {
  commands.push(`${color} rg ${x} ${y} ${width} ${height} re f`, "1 1 1 rg",
    `BT /F1 16 Tf ${x + 12} ${y + height - 26} Td (${title}) Tj ET`,
    `BT /F1 10 Tf ${x + 12} ${y + 14} Td (${subtitle}) Tj ET`);
}
box(49, 321, 206, 83, ".76 .15 .27", "ZONE A - WEST", "Mexican / BBQ / Mediterranean");
box(293, 321, 206, 83, ".14 .37 .60", "ZONE B - CENTER", "Asian / Seafood / Fusion");
box(537, 321, 206, 83, ".22 .47 .29", "ZONE C - EAST", "Vegan / Desserts / Drinks");
box(321, 214, 150, 46, ".75 .39 .12", "MAIN STAGE", "Center lawn");
box(139, 151, 168, 46, ".44 .29 .57", "ACOUSTIC STAGE", "South garden");
box(555, 218, 137, 46, ".67 .24 .45", "DJ TENT", "North pier concept");
commands.push("0.2 0.2 0.16 rg");
for (const [x, y, text] of [
  [43, 251, "Beer & Cocktail Garden - 21+"], [43, 229, "West restrooms - accessible concept"],
  [528, 178, "East restrooms - accessible concept"], [315, 174, "First aid"],
  [43, 115, "GATE 1 / ATM - South edge"], [528, 115, "GATE 2 / ATM - South edge"],
  [36, 77, "Illustrative amenities, vendors, routes and availability. No real event or booking."],
  [36, 59, "Confirm real park access, transit and accessibility independently."],
  [36, 41, "Original StreetBite demo artwork. No third-party maps or geographic data used."],
]) commands.push(`BT /F1 10 Tf ${x} ${y} Td (${text}) Tj ET`);
const stream = commands.join("\n");
const objects = [
  "<< /Type /Catalog /Pages 2 0 R >>",
  "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
  "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 792 612] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
  `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
];
let result = "%PDF-1.4\n";
const offsets = [0];
objects.forEach((object, index) => { offsets.push(Buffer.byteLength(result)); result += `${index + 1} 0 obj\n${object}\nendobj\n`; });
const start = Buffer.byteLength(result);
result += `xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map(offset => `${String(offset).padStart(10, "0")} 00000 n \n`).join("")}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${start}\n%%EOF\n`;
writeFileSync("public/festival-map.pdf", result);
console.log("Created original illustrative PDF map.");
