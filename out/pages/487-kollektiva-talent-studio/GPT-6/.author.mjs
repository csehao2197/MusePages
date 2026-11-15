import fs from "node:fs/promises";
const text = await fs.readFile("data\\prompts\\487-kollektiva-talent-studio\\487-kollektiva-talent-studio.md", "utf8");
const people = [...text.matchAll(/\d\. \*\*(.*?)\*\* — (.*?)\s+`https:[\s\S]*?Description: `(.*?)`/g)].map((match) => ({ name: match[1], role: match[2], bio: match[3] }));
if (people.length !== 8) throw Error("Eight exact source biographies required");
const folder = "out\\pages\\487-kollektiva-talent-studio\\GPT-6";
const colors = ["#6c7776", "#907f72", "#5a6668", "#8d8980", "#64756f", "#807d76", "#6a707b", "#8c7d79"];
for (let i = 0; i < 8; i++)
{
    const skin = ["#c59b7b", "#d4ad93", "#b58e73", "#ddb69d", "#c5a086", "#c6a792", "#bc967a", "#d5b197"][i];
    const hair = ["#302e2a", "#4b3329", "#232623", "#685344", "#3b332c", "#47352f", "#292b29", "#30282a"][i];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200" viewBox="0 0 1600 1200"><defs><linearGradient id="wall"><stop stop-color="#303d3b"/><stop offset="1" stop-color="${colors[i]}"/></linearGradient><radialGradient id="skin"><stop stop-color="${skin}"/><stop offset="1" stop-color="#876650"/></radialGradient><filter id="grain"><feTurbulence baseFrequency=".7" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".055"/></feComponentTransfer><feBlend in="SourceGraphic" mode="soft-light"/></filter></defs><g filter="url(#grain)"><path fill="url(#wall)" d="M0 0h1600v1200H0z"/><ellipse cx="1120" cy="1120" rx="340" ry="540" fill="${i % 2 ? "#242929" : "#b9b8ad"}"/><path d="M985 637v151q120 85 245-5V625" fill="${skin}"/><path d="M940 412q-8-205 174-220 200 0 184 231l-30 178q-45 128-148 138-106-21-150-139Z" fill="url(#skin)"/><path d="M936 472q-67-267 154-308 250-6 209 321l-40-130q-134 0-229-75-45 115-94 192" fill="${hair}"/><path d="M980 480q44-22 83 0m102 0q42-23 81-1" fill="none" stroke="${hair}" stroke-width="12" stroke-linecap="round"/><ellipse cx="1034" cy="503" rx="8" ry="6" fill="#262b29"/><ellipse cx="1200" cy="503" rx="8" ry="6" fill="#262b29"/><path d="m1117 500-22 90 32 7m-53 53q50 25 99-7" fill="none" stroke="#805d4f" stroke-width="7" stroke-linecap="round"/><path d="M992 797q120 98 239-7m-245 99-37 311m286-311 39 311" fill="none" stroke="${i % 2 ? "#555c58" : "#93988e"}" stroke-width="3"/><path d="M870 1100q140 50 280 100" fill="none" stroke="${skin}" stroke-width="68" stroke-linecap="round"/></g></svg>`;
    await fs.writeFile(`${folder}\\portrait-${i}.svg`, svg);
}
await fs.writeFile(`${folder}\\people.js`, `export const people = ${JSON.stringify(people, null, 4)};\n`);
