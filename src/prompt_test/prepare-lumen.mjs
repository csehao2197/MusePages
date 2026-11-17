import { copyFile, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ShoppingBag, ArrowUpRight, Menu, Play, ArrowDown, Camera, Laptop, Smartphone, Plus, MousePointer2, Maximize2, Truck, ShieldCheck, Globe2, X, ArrowRight, Download } from "lucide-react";

const root = fileURLToPath(new URL("../../", import.meta.url));
const directory = path.join(root, "out", "pages", "photo_equipment", "gpt-6.1-sol");
const assets = path.join(directory, "out", "assets");
const icons = { "shopping-bag": ShoppingBag, "arrow-up-right": ArrowUpRight, menu: Menu, play: Play, "arrow-down": ArrowDown, camera: Camera, laptop: Laptop, smartphone: Smartphone, plus: Plus, "mouse-pointer-2": MousePointer2, "maximize-2": Maximize2, truck: Truck, "shield-check": ShieldCheck, "globe-2": Globe2, x: X, "arrow-right": ArrowRight, download: Download };
const symbols = Object.entries(icons).map(([id, component]) =>
{
    const svg = renderToStaticMarkup(createElement(component));
    return `<symbol id="${id}" viewBox="0 0 24 24">${svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "")}</symbol>`;
}).join("");
await writeFile(path.join(assets, "icons.svg"), `<svg xmlns="http://www.w3.org/2000/svg">${symbols}</svg>`);
await writeFile(path.join(assets, "favicon.svg"), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#101114"/><path d="M20 15v34h25" fill="none" stroke="#f5f7fa" stroke-width="6"/><circle cx="45" cy="18" r="4" fill="#60cdff"/></svg>');
await copyFile(path.join(root, "node_modules", "lucide-react", "LICENSE"), path.join(assets, "lucide-LICENSE.txt"));
await writeFile(path.join(assets, "lumen-x1-specifications.txt"), "LUMEN X1 — Fictional concept specification sheet\n\n61MP Full-Frame Sensor\n8K Cinematic Video Recording\nAI-Powered Autofocus\nAdvanced 5-Axis In-Body Image Stabilization\nUltra-Low-Light Performance\nProfessional Color Science\nPrecision-Machined Magnesium Alloy Body\nHigh-Resolution Electronic Viewfinder\nUSB-C Tethering and Wireless Image Transfer\n\nBody only: $3,499\n24–70mm F2.8 lens: $1,899\n50mm F1.2 lens: $1,499\n70–200mm F2.8 lens: $2,299\n\nThese are fictional specifications and prices, not a real product offer.\n");
const images = { camera: "1516035069371-29a1b244cc32", lens: "1617005082133-548c4dd27f35", landscape: "1464822759023-fed622ff2c3b", cinema: "1473448912268-2022ce9509d8", wildlife: "1546182990-dffeafbe841d", night: "1519608487953-e999c86e7455", portrait: "1534528741775-53994a69daeb", architecture: "1487958449943-2429e8be8625" };
await writeFile(path.join(assets, "image-credits.txt"), "Illustrative photographs sourced from Unsplash.\nLicense: https://unsplash.com/license\nThird-party camera/lens photographs are not LUMEN hardware.\nGallery photographs are not LUMEN performance samples.\n\n" + Object.entries(images).map(([name, id]) => `${name}.jpg\nOriginal image: https://images.unsplash.com/photo-${id}`).join("\n\n") + "\n");
for (const file of ["index.html", "styles.css", "app.js"])
{
    await copyFile(path.join(directory, file), path.join(directory, "out", file));
}
const html = await readFile(path.join(directory, "out", "index.html"), "utf8");
if (!html.includes('lang="en"') || !html.includes('id="purchase"'))
{
    throw new Error("Static source preparation failed.");
}
console.log("Prepared static HTML/CSS/JS and local Lucide assets. No build performed.");
