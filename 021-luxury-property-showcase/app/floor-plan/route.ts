export function GET() {
  const lines = ["The Meridian Penthouse - fictional concept plan", "3,800 sq ft interior | 600 sq ft terrace (separate)", "Not to scale. Dimensions are illustrative, not surveyed.", "Primary Suite 18 x 22 ft | Living Room 24 x 30 ft", "Kitchen 16 x 20 ft | Home Office 12 x 14 ft", "Guest Bedroom 1 14 x 16 ft | Guest Bedroom 2 12 x 14 ft", "Guest Bedroom 3 12 x 12 ft | 4 beds, 3.5 baths", "Sterling Luxury Group is fictional. Not for construction."];
  let stream = "BT /F1 14 Tf 40 750 Td ";
  lines.forEach((line, index) => { stream += `${index ? "0 -25 Td " : ""}(${line.replace(/[()\\]/g, "\\$&")}) Tj\n`; });
  stream += "ET\n40 320 520 200 re S\n40 420 m 560 420 l S\n210 320 m 210 520 l S\n380 320 m 380 520 l S\nBT /F1 10 Tf 60 470 Td (Primary Suite) Tj 180 0 Td (Living Room) Tj 170 0 Td (Kitchen) Tj -350 -100 Td (Guest Suites) Tj 180 0 Td (Office / circulation) Tj ET";
  const objects = ["<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>", "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>", `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`];
  let pdf = "%PDF-1.4\n"; const offsets = [0];
  objects.forEach((object, i) => { offsets.push(Buffer.byteLength(pdf)); pdf += `${i+1} 0 obj\n${object}\nendobj\n`; });
  const xref = Buffer.byteLength(pdf);
  pdf += `xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map(n => `${String(n).padStart(10, "0")} 00000 n \n`).join("")}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Response(pdf, { headers: { "Content-Type": "application/pdf", "Content-Disposition": 'attachment; filename="meridian-fictional-floor-plan.pdf"' } });
}
