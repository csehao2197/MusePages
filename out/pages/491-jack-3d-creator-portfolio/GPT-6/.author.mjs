import fs from "node:fs/promises";
const folder = "out\\pages\\491-jack-3d-creator-portfolio\\GPT-6";
const prompt = await fs.readFile("data\\prompts\\491-jack-3d-creator-portfolio\\491-jack-3d-creator-portfolio.md", "utf8");
const services = [...prompt.matchAll(/0(\d) - (.*?): "(.*?)"/g)].map((item) => ({ number: `0${item[1]}`, name: item[2], description: item[3] }));
if (services.length !== 5) throw Error("Missing services");
await fs.writeFile(`${folder}\\data.js`, `export const services = ${JSON.stringify(services, null, 4)};\n`);
const palettes = [["#dedbd0", "#77745e"], ["#cdd7dc", "#364956"], ["#d8a977", "#613d2a"], ["#b2bcc2", "#2f444b"], ["#c2b9dc", "#594478"], ["#c8d6a5", "#36482e"]];
for (let index = 0; index < 21; index++)
{
    const [light, dark] = palettes[index % palettes.length];
    const rings = Array.from({ length: 10 }, (_, j) => `<ellipse cx="450" cy="300" rx="${70 + j * 13}" ry="${155 - j * 6}" fill="none" stroke="${light}" stroke-width="8" transform="rotate(${index * 17 + j * 5} 450 300)"/>`).join("");
    const block = `<g transform="translate(270 140)"><path d="m0 80 180-100 180 100-180 100Z" fill="${light}"/><path d="M0 80v220l180 100V180Z" fill="${dark}"/><path d="M180 180v220l180-100V80Z" fill="#777e7a"/><circle cx="180" cy="78" r="52" fill="${dark}"/><ellipse cx="180" cy="64" rx="52" ry="30" fill="${light}"/></g>`;
    await fs.writeFile(`${folder}\\object-${index}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600"><defs><radialGradient id="b"><stop stop-color="${dark}"/><stop offset="1" stop-color="#15191b"/></radialGradient></defs><path fill="url(#b)" d="M0 0h900v600H0z"/><ellipse cx="450" cy="520" rx="200" ry="30" fill="#000" opacity=".2"/>${index % 2 ? block : rings}</svg>`);
}
