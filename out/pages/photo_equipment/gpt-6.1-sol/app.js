"use strict";

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const currency = (amount) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
const products =
{
    body: { name: "LUMEN X1 / Body only", price: 3499, image: "camera.jpg" },
    kit: { name: "LUMEN X1 / 24–70mm F2.8 kit", price: 5398, image: "camera.jpg" },
    zoom: { name: "LUMEN 24–70mm F2.8", price: 1899, image: "lens.jpg", description: "A versatile professional zoom with a constant F2.8 aperture. Wide establishing shots, natural portraits, and the details in between.", specs: "24–70mm focal range · F2.8 constant aperture · LUMEN full-frame mount" },
    prime: { name: "LUMEN 50mm F1.2", price: 1499, image: "camera.jpg", description: "A luminous portrait prime. An expressive F1.2 aperture creates beautiful background separation and brings natural-light portraits to life.", specs: "50mm focal length · F1.2 maximum aperture · LUMEN full-frame mount" },
    tele: { name: "LUMEN 70–200mm F2.8", price: 2299, image: "lens.jpg", description: "Reach further without losing the intimacy. A constant F2.8 telephoto zoom for wildlife, sport, and the unrepeatable moment.", specs: "70–200mm focal range · F2.8 constant aperture · LUMEN full-frame mount" }
};
let cart = {};
try
{
    const saved = JSON.parse(localStorage.getItem("lumen-cart-v1") || "{}");
    if (saved && typeof saved === "object" && !Array.isArray(saved))
    {
        for (const [id, quantity] of Object.entries(saved))
        {
            if (Object.hasOwn(products, id) && Number.isInteger(quantity) && quantity > 0 && quantity <= 99)
            {
                cart[id] = quantity;
            }
        }
    }
}
catch
{
    cart = {};
}
let toastTimer;
function toast(message)
{
    const element = $("#toast");
    element.textContent = message;
    element.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => element.classList.remove("visible"), 3200);
}
function saveCart()
{
    try
    {
        localStorage.setItem("lumen-cart-v1", JSON.stringify(cart));
    }
    catch
    {
        toast("Shopping bag updated. This browser cannot save it between visits.");
    }
    renderCart();
}
function renderCart()
{
    const entries = Object.entries(cart);
    const count = entries.reduce((total, [, quantity]) => total + quantity, 0);
    const subtotal = entries.reduce((total, [id, quantity]) => total + products[id].price * quantity, 0);
    $(".cart-count").textContent = count;
    $(".cart-count").hidden = count === 0;
    $("#bag-count").textContent = count;
    $(".cart-toggle").setAttribute("aria-label", `Open shopping bag, ${count} ${count === 1 ? "item" : "items"}`);
    $("#cart-summary").hidden = count === 0;
    $("#cart-subtotal").textContent = currency(subtotal);
    if (!count)
    {
        $("#cart-items").innerHTML = `<div class="cart-empty"><svg><use href="assets/icons.svg#shopping-bag"/></svg><p>Your next chapter is waiting.<br>Find the tools to make it yours.</p><button class="button secondary" id="continue-shopping">Explore the collection</button></div>`;
        $("#continue-shopping").addEventListener("click", () =>
        {
            $("#cart-dialog").close();
            $("#lenses").scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth" });
        });
        return;
    }
    $("#cart-items").innerHTML = entries.map(([id, quantity]) =>
    {
        const product = products[id];
        return `<article class="cart-row"><img src="assets/${product.image}" alt="${product.name} illustrative product photograph"><div><h3>${product.name}</h3><p>${currency(product.price * quantity)}</p><div class="quantity"><button data-change="-1" data-id="${id}" aria-label="Decrease quantity of ${product.name}">−</button><span aria-label="Quantity">${quantity}</span><button data-change="1" data-id="${id}" aria-label="Increase quantity of ${product.name}" ${quantity >= 99 ? "disabled" : ""}>+</button><button class="remove" data-remove="${id}" aria-label="Remove ${product.name}">Remove</button></div></div></article>`;
    }).join("");
}
function addProduct(id)
{
    if (!Object.hasOwn(products, id))
    {
        return;
    }
    if ((cart[id] || 0) >= 99)
    {
        toast("Maximum quantity is 99 for each configuration.");
        return;
    }
    cart[id] = (cart[id] || 0) + 1;
    saveCart();
    toast(`${products[id].name} added to your bag`);
}
$("#cart-items").addEventListener("click", (event) =>
{
    const button = event.target.closest("button");
    if (!button)
    {
        return;
    }
    if (button.dataset.remove)
    {
        delete cart[button.dataset.remove];
        saveCart();
    }
    else if (button.dataset.change)
    {
        const id = button.dataset.id;
        const change = Number(button.dataset.change);
        cart[id] = Math.min(99, cart[id] + change);
        if (cart[id] <= 0)
        {
            delete cart[id];
        }
        saveCart();
        const next = $(`[data-id="${id}"][data-change="${change}"]`, $("#cart-items"));
        (next || $("#cart-dialog [data-close]")).focus();
    }
});
$$(".add-product").forEach((button) => button.addEventListener("click", () => addProduct(button.dataset.product)));
$("#add-camera").addEventListener("click", () => addProduct($('input[name="configuration"]:checked').value));
$$('input[name="configuration"]').forEach((input) => input.addEventListener("change", () =>
{
    const price = products[input.value].price;
    $("#purchase-price").textContent = currency(price);
    $("#finance-price").textContent = `or $${(price / 12).toFixed(2)}/mo. for 12 months*`;
}));
$$(".cart-toggle").forEach((button) => button.addEventListener("click", () => $("#cart-dialog").showModal()));
$$("[data-close]").forEach((button) => button.addEventListener("click", () => button.closest("dialog").close()));
$$("dialog").forEach((dialog) => dialog.addEventListener("click", (event) =>
{
    if (event.target !== dialog)
    {
        return;
    }
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)
    {
        dialog.close();
    }
}));

const info =
{
    specifications: ["THE LUMEN X1 / TECHNICAL DETAILS", "Precision, in every specification.", `<dl><dt>Sensor</dt><dd>61MP full-frame sensor</dd><dt>Video</dt><dd>8K cinematic recording with 10-bit color</dd><dt>Autofocus</dt><dd>AI-powered subject recognition and tracking</dd><dt>Stabilization</dt><dd>Advanced 5-axis in-body image stabilization</dd><dt>Low light</dt><dd>Ultra-low-light performance with clean shadow detail</dd><dt>Color</dt><dd>Professional LUMEN color science</dd><dt>Construction</dt><dd>Precision-machined magnesium alloy body</dd><dt>Viewfinder</dt><dd>High-resolution electronic viewfinder</dd><dt>Connectivity</dt><dd>Wireless image transfer and USB-C tethering</dd><dt>Starting price</dt><dd>$3,499, body only</dd></dl><p>All specifications are fictional concept specifications.</p>`],
    engineering: ["DESIGNED WITH INTENTION", "A tool that feels like an extension of you.", "<p>The X1 concept brings a precision-machined magnesium alloy shell together with a deep, textured grip and deliberate physical controls. Exposure settings remain at your fingertips so the camera never interrupts the moment.</p><p>Five-axis stabilization supports steady handheld capture, while a high-resolution electronic viewfinder keeps your attention on the frame.</p>"],
    connectivity: ["THE CONNECTED WORKFLOW", "From your camera to your creative world.", "<p>Transfer selects wirelessly to your mobile device, tether over USB-C for a studio session, or move full-resolution files directly to your editing workstation.</p><ul><li>USB-C cable — studio tethering and charging.</li><li>LUMEN mobile companion — wireless previews and image transfer.</li><li>Desktop workflow — edit exported JPEG and RAW files in your preferred software.</li></ul><p>This is a conceptual ecosystem. Hardware, apps, and transfers are not available for purchase or download.</p>"],
    journal: ["FIELD NOTES / JOURNAL", "The minutes before first light.", "<img src=\"assets/landscape.jpg\" alt=\"Mountain landscape\"><p>Arrive before the scene announces itself. Find a simple foreground, leave room for the sky, and wait for the light to separate the ridges. Work at f/8 for depth, keep your ISO low, and let a tripod take the pressure off your shutter speed.</p><p>Great photographs rarely begin with a specification. They begin with paying attention.</p>"],
    contact: ["LUMEN / SUPPORT", "A note about this concept.", "<p>LUMEN is a fictional photography brand created for this interactive website. There is no customer service team, store, or order fulfillment.</p><p>Explore the camera specifications, lens collection, and shopping bag freely. No personal information or payments are collected.</p>"],
    warranty: ["PEACE OF MIND", "Made to go further.", "<p>The concept product offering includes a fictional two-year limited warranty covering manufacturing defects. Accidental damage, wear, and unauthorized repairs would be excluded.</p><p>No actual product is sold here, and no enforceable warranty is offered.</p>"],
    downloads: ["CREATOR RESOURCES", "Keep the details close.", "<p>Download the concept specification sheet for an offline overview of the LUMEN X1. There is no firmware or companion application for this fictional product.</p><a class=\"button primary\" href=\"assets/lumen-x1-specifications.txt\" download>Download specification sheet <svg><use href=\"assets/icons.svg#download\"/></svg></a>"],
    social: ["LUMEN / COMMUNITY", "A fictional brand. A real creative spirit.", "<p>This concept has no official Instagram, YouTube, or X account. The social labels illustrate a premium brand's site architecture without linking to unrelated accounts.</p><p>Explore the photography gallery for a little inspiration instead.</p>"],
    privacy: ["YOUR PRIVACY", "A simple, local experience.", "<p>Your shopping bag is saved only in your browser's local storage under lumen-cart-v1. It is not sent to a server. Removing site data in your browser clears the bag.</p><p>This page uses no analytics, cookies, account services, or payment processing. All imagery is served locally.</p>"],
    terms: ["CONCEPT STORE / TERMS", "Created to explore. Not to transact.", "<p>LUMEN products, specifications, financing, shipping, and warranty are fictional. Shopping controls demonstrate product selection and order review only.</p><p>No contract of sale is formed and no payment is processed. Illustrative photographs depict real equipment from other brands; they are not photographs of a manufactured LUMEN product.</p>"],
    credits: ["PHOTOGRAPHY / SOURCES", "A world worth looking at.", "<p>Photography is sourced from Unsplash and stored locally. Images of existing third-party cameras and lenses illustrate this fictional brand; they are not renders of LUMEN hardware. Gallery images are creative inspiration, not camera performance samples.</p><p><a href=\"https://unsplash.com/license\" target=\"_blank\" rel=\"noopener noreferrer\">Unsplash license</a> · <a href=\"assets/image-credits.txt\" download>Download original image source links</a></p><p>Interface icons: Lucide, ISC license. See the bundled license in assets.</p>"]
};
function showInfo(label, title, content)
{
    $("#info-label").textContent = label;
    $("#info-content").innerHTML = `<h2 id="info-title">${title}</h2>${content}`;
    if (!$("#info-dialog").open)
    {
        $("#info-dialog").showModal();
    }
}
$$("[data-info]").forEach((button) => button.addEventListener("click", () => showInfo(...info[button.dataset.info])));
$$("[data-explore]").forEach((button) => button.addEventListener("click", () =>
{
    const id = button.dataset.product;
    const product = products[id];
    showInfo("LUMEN / PRECISION OPTICS", product.name, `<p>${product.description}</p><p>${product.specs}</p><p>Concept price: ${currency(product.price)}. Product photographs are illustrative.</p><button class="button primary" id="add-explored">Add to Cart — ${currency(product.price)} <svg><use href="assets/icons.svg#plus"/></svg></button>`);
    $("#add-explored").addEventListener("click", () =>
    {
        addProduct(id);
        $("#info-dialog").close();
    });
}));
$("#checkout").addEventListener("click", () =>
{
    const entries = Object.entries(cart);
    const total = entries.reduce((sum, [id, quantity]) => sum + products[id].price * quantity, 0);
    $("#cart-dialog").close();
    showInfo("DEMO ORDER / NO PAYMENT REQUIRED", "Your vision, all together.", `<ul>${entries.map(([id, quantity]) => `<li>${quantity} × ${products[id].name} — ${currency(products[id].price * quantity)}</li>`).join("")}</ul><p><strong>Subtotal: ${currency(total)}</strong></p><p>This is an order preview only. No purchase is placed, no payment is collected, and your bag remains saved for later.</p><button class="button secondary" id="back-to-bag">Return to shopping bag</button>`);
    $("#back-to-bag").addEventListener("click", () =>
    {
        $("#info-dialog").close();
        $("#cart-dialog").showModal();
    });
});
const components =
{
    sensor: ["01 / THE SENSOR", "A bigger picture.", "61 million pixels. One extraordinary full-frame sensor. Preserve the finest textures and the most subtle tones."],
    dials: ["02 / THE CONTROLS", "Keep your eyes on the moment.", "Tactile, precisely machined control dials put exposure at your fingertips. Less time in menus. More time in the frame."],
    mount: ["03 / THE LENS MOUNT", "A world of perspectives.", "A precision lens mount connects your X1 to the LUMEN optical collection. From wide horizons to intimate portraits, your vision comes first."]
};
$$("[data-component]").forEach((button) => button.addEventListener("click", () =>
{
    const [number, title, copy] = components[button.dataset.component];
    $("#component-number").textContent = number;
    $("#component-title").textContent = title;
    $("#component-copy").textContent = copy;
    $$("[data-component]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
}));
$$("[data-view]").forEach((button) => button.addEventListener("click", () =>
{
    $(".camera-stage").dataset.view = button.dataset.view;
    $$("[data-view]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    const component = { overview: "sensor", detail: "dials", lens: "mount" }[button.dataset.view];
    $(`[data-component="${component}"]`).click();
    $("#showcase-image").alt = `${button.textContent} of the illustrative camera photograph`;
}));
$$("[data-filter]").forEach((button) => button.addEventListener("click", () =>
{
    const filter = button.dataset.filter;
    $$("[data-filter]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    $$("[data-gallery]").forEach((item) => item.hidden = filter !== "all" && item.dataset.gallery !== filter);
    $(".gallery-grid").classList.toggle("filtered", filter !== "all");
}));
$$("[data-gallery]").forEach((button) => button.addEventListener("click", () =>
{
    const image = $("img", button);
    $("#lightbox-image").src = image.src;
    $("#lightbox-image").alt = image.alt;
    $("#lightbox-caption").textContent = $("span", button).textContent.trim();
    $("#gallery-dialog").showModal();
}));

const menu = $(".menu-toggle");
function closeMenu()
{
    $("#main-nav").classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-label", "Open navigation");
}
menu.addEventListener("click", () =>
{
    const open = !$("#main-nav").classList.contains("open");
    $("#main-nav").classList.toggle("open", open);
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
});
$$("#main-nav a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true")
    {
        closeMenu();
        menu.focus();
    }
});
document.addEventListener("click", (event) =>
{
    if (!event.target.closest(".navigation"))
    {
        closeMenu();
    }
});
const mobileQuery = matchMedia("(max-width: 800px)");
mobileQuery.addEventListener("change", closeMenu);
function updateNavigation()
{
    $(".navigation").classList.toggle("scrolled", window.scrollY > 30);
}
window.addEventListener("scroll", updateNavigation, { passive: true });
updateNavigation();
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reducedMotion)
{
    const observer = new IntersectionObserver((entries) =>
    {
        for (const entry of entries)
        {
            if (entry.isIntersecting)
            {
                entry.target.classList.add("revealed");
                observer.unobserve(entry.target);
            }
        }
    }, { threshold: 0.08 });
    $$(".section-heading, .story-copy").forEach((element) =>
    {
        element.classList.add("reveal-ready");
        observer.observe(element);
    });
}
if (matchMedia("(hover: hover) and (pointer: fine)").matches && !reducedMotion)
{
    $$(".reveal-light").forEach((card) => card.addEventListener("pointermove", (event) =>
    {
        const bounds = card.getBoundingClientRect();
        card.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
        card.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
    }));
}
let filmTimer;
let filmIndex = 0;
function showFilmFrame()
{
    $$(".film-frame").forEach((image, index) => image.classList.toggle("active", index === filmIndex));
    $("#film-progress").textContent = `0${filmIndex + 1} / 03`;
}
function setFilmPlaying(playing)
{
    clearInterval(filmTimer);
    $("#film-play").setAttribute("aria-pressed", String(playing));
    $("#film-play").textContent = playing ? "Pause film" : "Play film";
    if (playing)
    {
        filmTimer = setInterval(() =>
        {
            filmIndex = (filmIndex + 1) % 3;
            showFilmFrame();
        }, 4500);
    }
}
$("#watch-film").addEventListener("click", () =>
{
    filmIndex = 0;
    showFilmFrame();
    $("#film-dialog").showModal();
    setFilmPlaying(!reducedMotion);
});
$("#film-play").addEventListener("click", () => setFilmPlaying($("#film-play").getAttribute("aria-pressed") !== "true"));
$("#film-dialog").addEventListener("close", () => setFilmPlaying(false));
document.addEventListener("visibilitychange", () =>
{
    if (document.hidden)
    {
        setFilmPlaying(false);
    }
});
renderCart();
