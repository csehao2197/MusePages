import fs from "node:fs/promises";
const folder = "out\\pages\\496-cosmic-motion-portfolio\\GPT-6";
const images = {
    automotive: `<path fill="#57616a" d="M0 0h1000v800H0z"/><path d="m0 600 1000-260v460H0" fill="#252e37"/><ellipse cx="530" cy="602" rx="350" ry="60" fill="#111922" opacity=".5"/><path d="m160 470 126-50 150-145 243 22 161 124 67 72-20 62-718 23-45-48Z" fill="#c2c9c7"/><path d="m320 417 135-109 184 18 105 93Z" fill="#263e4d"/><path d="m513 312 4 108m-353 79 692-25" stroke="#62717a" stroke-width="5"/><ellipse cx="285" cy="550" rx="64" ry="71" fill="#131c24"/><ellipse cx="753" cy="535" rx="61" ry="68" fill="#131c24"/><ellipse cx="285" cy="550" rx="36" ry="43" fill="#84939c"/><ellipse cx="753" cy="535" rx="34" ry="42" fill="#84939c"/><path d="m183 476 82-15m501-13 68 13" stroke="#e4f3f5" stroke-width="10"/>`,
    architecture: `<path fill="#b2b1aa" d="M0 0h1000v800H0z"/><path d="M0 800V140L470 0v800" fill="#d2cfc4"/><path d="M470 0 800 180v620H470" fill="#6e7776"/><path d="M800 180 1000 80v720H800" fill="#9b9f99"/>${Array.from({ length: 10 }, (_, index) => `<path d="m0 ${200 + index * 64} 470-130 330 155 200-100" fill="none" stroke="#4c5758" stroke-width="13"/><path d="M${index * 47} 140V800" stroke="#a1a39a" stroke-width="5"/>`).join("")}`,
    perspective: `<path fill="#97947f" d="M0 0h1000v800H0z"/><circle cx="520" cy="410" r="290" fill="#c7c0a5"/><path d="M190 800q20-260 285-250 270 0 310 250" fill="#293d3d"/><path d="M433 465h128v180H433" fill="#9d7050"/><path d="M377 260q118-134 244-1v178q-22 135-122 151-101-25-123-153Z" fill="#c3946e"/><path d="M370 336q-99-247 134-238 202 11 123 241l-51-130q-101 114-193 75Z" fill="#34332c"/><path d="M408 373h50m75 0h48m-115 127q35 20 70-6" fill="none" stroke="#4c4231" stroke-width="7" stroke-linecap="round"/>`,
    identity: `<path fill="#284c7b" d="M0 0h1000v800H0z"/><g fill="#b1d0e6" font-family="Arial,sans-serif"><text x="70" y="130" font-size="24">FORM / FIELD</text><text x="60" y="655" font-size="130" letter-spacing="-8">Stay curious.</text></g><g fill="none" stroke="#b1d0e6" stroke-width="24"><path d="m320 230 180-100 180 100v200L500 530 320 430Z"/><path d="m320 230 180 100 180-100M500 330v200"/></g>`
};
for (const [name, content] of Object.entries(images))
{
    await fs.writeFile(`${folder}\\${name}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="800" viewBox="0 0 1000 800">${content}</svg>`);
}
for (let index = 0; index < 6; index++)
{
    const palettes = [["#a4b8cb", "#28394d"], ["#cbc5b7", "#52574f"], ["#6e8fa7", "#d9e8e8"], ["#9da290", "#273a32"], ["#c2af9e", "#53423b"], ["#b2bcc2", "#2d4154"]];
    const [bg, ink] = palettes[index];
    const paths = Array.from({ length: 30 }, (_, j) => `<ellipse cx="300" cy="300" rx="${30 + j * 7}" ry="${180 - j * 3}" fill="none" stroke="${ink}" stroke-width="1.5" transform="rotate(${j * (index % 2 ? 5 : 2) + index * 30} 300 300)"/>`).join("");
    await fs.writeFile(`${folder}\\exploration-${index}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><path fill="${bg}" d="M0 0h600v600H0z"/>${paths}<text x="30" y="565" fill="${ink}" font-family="monospace" font-size="12">FORM EXPERIMENT / ${String(index + 1).padStart(2, "0")}</text></svg>`);
}
