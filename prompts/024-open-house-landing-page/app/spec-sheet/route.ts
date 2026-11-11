import { specs } from "../../components/fixtures";
export function GET() {
  const lines = [
    "RIDGEWOOD TERRACE - FICTIONAL PROPERTY SPEC SHEET",
    "4821 Ridgewood Terrace, Scottsdale, AZ 85262",
    "Illustrative price: $2,450,000. Not a real listing or offer.",
    ...specs.map(([label,value]) => `${label}: ${value}`),
    "All specifications, taxes, schools and identifiers are unverified.",
    "Original event April 4, 2026 is archival.",
    "Demo replay: November 14, 2026, 11 AM-3 PM Arizona MST.",
    "No real booking, brokerage, lender partnership or guarantee.",
    "Concept art and floor plan are not photographic or to scale.",
  ];
  const escape = (s:string) => s.replace(/[^\x20-\x7e]/g,"-").replaceAll("\\","\\\\").replaceAll("(","\\(").replaceAll(")","\\)");
  const stream = `BT /F1 10 Tf 45 760 Td 16 TL ${lines.map((line,index)=>`${index?"T* ":""}(${escape(line)}) Tj`).join("\n")} ET`;
  const objects = ["<< /Type /Catalog /Pages 2 0 R >>","<< /Type /Pages /Kids [3 0 R] /Count 1 >>","<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>","<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",`<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`];
  let pdf = "%PDF-1.4\n"; const offsets = [0];
  objects.forEach((object,index)=>{offsets.push(Buffer.byteLength(pdf));pdf+=`${index+1} 0 obj\n${object}\nendobj\n`;});
  const xref = Buffer.byteLength(pdf);
  pdf += `xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map(n=>`${String(n).padStart(10,"0")} 00000 n \n`).join("")}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return new Response(pdf,{headers:{"Content-Type":"application/pdf","Content-Disposition":'attachment; filename="ridgewood-fictional-specs.pdf"',"Cache-Control":"no-store"}});
}
