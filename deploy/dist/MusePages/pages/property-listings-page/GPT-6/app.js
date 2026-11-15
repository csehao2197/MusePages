const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const homes = [
    { id:"cedar",street:"24 Cedar Grove",city:"Bayview",price:825000,beds:4,baths:3,size:2450,lot:.24,year:2018,days:2,type:"House",hoa:false,parking:2,keywords:"garden garage",status:"Active",market:"Buy",image:"coastal.svg",x:25,y:34 },
    { id:"harbor",street:"8 Harbor View",city:"Bayview",price:1195000,beds:4,baths:3.5,size:3120,lot:.38,year:2021,days:4,type:"House",hoa:true,parking:2,keywords:"pool waterfront garage",status:"Active",market:"Buy",image:"coastal.svg",x:72,y:56 },
    { id:"elm",street:"61 Elm Street",city:"Bayview",price:549000,beds:3,baths:2,size:1680,lot:.08,year:2015,days:8,type:"Townhouse",hoa:true,parking:1,keywords:"terrace garage",status:"Pending",market:"Buy",image:"townhouse.svg",x:39,y:47 },
    { id:"foundry",street:"12 Foundry Lane",city:"Bayview",price:425000,beds:2,baths:2,size:1250,lot:0,year:2019,days:12,type:"Condo",hoa:true,parking:1,keywords:"balcony open plan",status:"Active",market:"Buy",image:"loft.svg",x:42,y:50 },
    { id:"willow",street:"93 Willow Crescent",city:"Bayview",price:965000,beds:5,baths:3,size:2980,lot:.3,year:2011,days:17,type:"Multi-family",hoa:false,parking:3,keywords:"garden garage",status:"Contingent",market:"Buy",image:"townhouse.svg",x:18,y:72 },
    { id:"riverside",street:"7 Riverside Court",city:"Riverbend",price:735000,beds:3,baths:2,size:2100,lot:.28,year:2017,days:6,type:"House",hoa:false,parking:2,keywords:"waterfront garden garage",status:"Active",market:"Buy",image:"coastal.svg",x:83,y:27 },
    { id:"rental",street:"6 Station Loft",city:"Bayview",price:2800,beds:2,baths:1,size:1100,lot:0,year:2020,days:3,type:"Condo",hoa:false,parking:1,keywords:"balcony transit",status:"Active",market:"Rent",image:"loft.svg",x:58,y:23 },
    { id:"sold",street:"18 Maple Walk",city:"Bayview",price:785000,beds:4,baths:3,size:2300,lot:.2,year:2016,days:25,type:"House",hoa:false,parking:2,keywords:"garden garage",status:"Sold",market:"Sold",image:"coastal.svg",x:53,y:75 }
];
const money = value => new Intl.NumberFormat("en-US",{ style:"currency",currency:"USD",maximumFractionDigits:0 }).format(value);
let market = "Buy";
let criteria = {};
let locationFilter = "Bayview";
let view = "grid";
let limit = 4;
let area = "";
let rectangle = null;
let drawing = false;
let expanded = false;
let matches = [];
let favorites = new Set();
let saved = [];
try
{
    const storedFavorites = JSON.parse(localStorage.getItem("homehub-favorites") || "[]");
    const storedSearches = JSON.parse(localStorage.getItem("homehub-searches") || "[]");
    if (Array.isArray(storedFavorites)) favorites = new Set(storedFavorites.filter(id => homes.some(home => home.id === id)));
    if (Array.isArray(storedSearches)) saved = storedSearches.filter(item => typeof item.name === "string" && item.criteria && typeof item.criteria === "object").slice(0,20);
}
catch {}
function persist()
{
    try
    {
        localStorage.setItem("homehub-favorites",JSON.stringify([...favorites]));
        localStorage.setItem("homehub-searches",JSON.stringify(saved));
    }
    catch {}
    $("#saved-count").textContent = saved.length;
}
persist();
function cleanCriteria(raw)
{
    const result = {};
    for (const key of ["min","max","beds","baths","sqmin","sqmax","lotmin","lotmax","yearmin","yearmax","days","parking"])
    {
        if (raw[key] !== "" && raw[key] !== undefined && Number.isFinite(Number(raw[key])) && Number(raw[key]) >= 0) result[key] = Number(raw[key]);
    }
    result.keywords = typeof raw.keywords === "string" ? raw.keywords.trim().toLowerCase().slice(0,100) : "";
    result.hoa = ["yes","no"].includes(raw.hoa) ? raw.hoa : "";
    result.types = Array.isArray(raw.types) ? raw.types.filter(type => ["House","Condo","Townhouse","Multi-family","Land"].includes(type)) : [];
    return result;
}
function setForm()
{
    $("#filter-form").reset();
    Object.entries(criteria).forEach(([key,value]) =>
    {
        const element = $("#filter-form").elements.namedItem(key);
        if (element && key !== "types") element.value = value;
    });
    $$("[name=type]").forEach(input => input.checked = (criteria.types || []).includes(input.value));
    $("#year-label").textContent = $("[name=yearmin]").value;
}
function snapshot()
{
    return { market, location:locationFilter, criteria, area, rectangle };
}
function restore(data)
{
    market = ["Buy","Rent","Sold"].includes(data.market) ? data.market : "Buy";
    locationFilter = typeof data.location === "string" ? data.location.slice(0,100) : "All areas";
    criteria = cleanCriteria(data.criteria || {});
    area = ["west","east"].includes(data.area) ? data.area : "";
    rectangle = Array.isArray(data.rectangle) && data.rectangle.length === 4 && data.rectangle.every(value => Number.isFinite(value) && value >= 0 && value <= 100) ? data.rectangle : null;
    $("#location").value = locationFilter;
    $("#map-area").value = area;
    $$("[data-market]").forEach(button => button.setAttribute("aria-pressed",String(button.dataset.market === market)));
    setForm();
    limit = Number($("#per-page").value);
    render();
}
try
{
    const query = new URL(location.href).searchParams.get("search");
    if (query) restore(JSON.parse(query));
}
catch {}
function activeLabels()
{
    const labels = [];
    if (criteria.min) labels.push(`From ${money(criteria.min)}`);
    if (criteria.max) labels.push(`To ${money(criteria.max)}`);
    if (criteria.beds) labels.push(`${criteria.beds}+ beds`);
    if (criteria.baths) labels.push(`${criteria.baths}+ baths`);
    labels.push(...(criteria.types || []));
    if (criteria.keywords) labels.push(criteria.keywords);
    for (const key of ["sqmin","sqmax","lotmin","lotmax","days","parking"]) if (criteria[key]) labels.push(`${key}: ${criteria[key]}`);
    if (criteria.yearmin > 1900) labels.push(`Since ${criteria.yearmin}`);
    if (criteria.yearmax && criteria.yearmax < 2026) labels.push(`Before ${criteria.yearmax}`);
    if (criteria.hoa) labels.push(`HOA: ${criteria.hoa}`);
    if (area || rectangle) labels.push("Custom map area");
    return labels;
}
function filtered()
{
    const text = locationFilter.toLowerCase().trim();
    return homes.filter(home =>
    {
        const c = criteria;
        if (home.market !== market) return false;
        if (text && text !== "all areas" && !`${home.city} ${home.street}`.toLowerCase().includes(text)) return false;
        if (c.min && home.price < c.min || c.max !== undefined && home.price > c.max) return false;
        if (home.beds < (c.beds || 0) || home.baths < (c.baths || 0)) return false;
        if (c.types?.length && !c.types.includes(home.type)) return false;
        if (c.keywords && !c.keywords.split(/[,\s]+/).every(word => home.keywords.includes(word))) return false;
        if (c.sqmin && home.size < c.sqmin || c.sqmax !== undefined && home.size > c.sqmax) return false;
        if (c.lotmin && home.lot < c.lotmin || c.lotmax !== undefined && home.lot > c.lotmax) return false;
        if (home.year < (c.yearmin || 1900) || home.year > (c.yearmax || 2026)) return false;
        if (c.days && home.days >= c.days || home.parking < (c.parking || 0)) return false;
        if (c.hoa === "yes" && !home.hoa || c.hoa === "no" && home.hoa) return false;
        if (area === "west" && home.x > 50 || area === "east" && home.x <= 50) return false;
        if (rectangle && (home.x < rectangle[0] || home.x > rectangle[2] || home.y < rectangle[1] || home.y > rectangle[3])) return false;
        return true;
    }).sort((a,b) => $("#sort").value === "low" ? a.price-b.price : $("#sort").value === "high" ? b.price-a.price : $("#sort").value === "beds" ? b.beds-a.beds : $("#sort").value === "size" ? b.size-a.size : a.days-b.days);
}
function favoriteButton(button,home)
{
    button.textContent = favorites.has(home.id) ? "♥" : "♡";
    button.setAttribute("aria-pressed",String(favorites.has(home.id)));
    button.setAttribute("aria-label",`${favorites.has(home.id) ? "Unsave" : "Save"} ${home.street}`);
}
function card(home)
{
    const article = document.createElement("article");
    article.className = "card";
    article.dataset.id = home.id;
    article.innerHTML = `<div class="image"><button class="details-button" aria-label="View ${home.street} details"><img src="${home.image}" width="900" height="600" loading="lazy" alt="Original concept illustration, not a photograph of ${home.street}"></button><span class="tag">${home.status} / Sample</span><button class="favorite"></button><span class="photo-counter">2 concept views</span><button class="next-image" aria-label="Next illustration for ${home.street}">→</button></div><div class="card-content"><h3>${money(home.price)}${market === "Rent" ? '<small style="font-size:11px">/mo</small>' : ""}</h3><p class="address">${home.street}</p><p class="city">${home.city} / Fictional sample area</p><div class="spec">${home.beds} beds &nbsp;·&nbsp; ${home.baths} baths &nbsp;·&nbsp; ${home.size.toLocaleString()} sq ft</div><div class="meta"><span>${money(home.price/home.size)} / sq ft${market === "Rent" ? " / mo" : ""}</span><span>${home.lot ? `${home.lot} acre lot` : home.type}</span></div><p class="description">An illustrative ${home.type.toLowerCase()} with ${home.keywords.replaceAll(" ",", ")}. Built ${home.year}; ${home.parking} parking space(s). Not a real listing.</p><div class="card-bottom"><small>${home.days} days on market · demo</small><button class="tour-button">Schedule tour ↗</button></div></div>`;
    const favorite = article.querySelector(".favorite");
    favoriteButton(favorite,home);
    favorite.addEventListener("click", () =>
    {
        if (favorites.has(home.id)) favorites.delete(home.id);
        else favorites.add(home.id);
        persist();
        favoriteButton(favorite,home);
    });
    let imageIndex = 0;
    const alternate = home.image === "loft.svg" ? "townhouse.svg" : "loft.svg";
    const changeImage = () =>
    {
        imageIndex = imageIndex ? 0 : 1;
        article.querySelector("img").src = imageIndex ? alternate : home.image;
        article.querySelector(".photo-counter").textContent = `${imageIndex+1} / 2 concept views`;
    };
    article.querySelector(".next-image").addEventListener("click",changeImage);
    article.querySelector(".image").addEventListener("mouseenter",changeImage);
    article.querySelector(".image").addEventListener("mouseleave",() =>
    {
        imageIndex = 0;
        article.querySelector("img").src = home.image;
        article.querySelector(".photo-counter").textContent = "2 concept views";
    });
    article.querySelector(".details-button").addEventListener("click",() => openTour(home,false));
    article.querySelector(".tour-button").addEventListener("click",() => openTour(home,true));
    return article;
}
function render()
{
    matches = filtered();
    $("#result-title").textContent = `${matches.length} sample ${market === "Rent" ? "rentals" : market === "Sold" ? "sold homes" : "homes for sale"} in ${locationFilter || "All areas"}`;
    const labels = activeLabels();
    $("#filter-count").textContent = labels.length;
    $("#active-filters").replaceChildren(...labels.map(label =>
    {
        const span = document.createElement("span");
        span.textContent = label;
        return span;
    }));
    $("#cards").replaceChildren(...matches.slice(0,limit).map(card));
    $("#cards").classList.toggle("list",view === "list");
    $(".map-panel").hidden = view !== "map";
    $(".layout").classList.toggle("map-mode",view === "map");
    $("#mobile-map").textContent = view === "map" ? "Back to homes" : "Map view";
    $("#mobile-map").setAttribute("aria-pressed",String(view === "map"));
    $("#empty").hidden = matches.length > 0;
    $(".pagination").hidden = matches.length === 0;
    $("#load").hidden = limit >= matches.length;
    $("#page-note").textContent = `Showing ${Math.min(limit,matches.length)} of ${matches.length} sample homes`;
    renderMap();
}
function renderMap()
{
    const markers = $("#markers");
    markers.replaceChildren();
    const groups = [];
    matches.forEach(home =>
    {
        const group = !expanded && groups.find(items => Math.abs(items[0].x-home.x) < 8 && Math.abs(items[0].y-home.y) < 9);
        if (group) group.push(home);
        else groups.push([home]);
    });
    groups.forEach(group =>
    {
        const home = group[0];
        const marker = document.createElement("button");
        marker.className = "marker";
        marker.style.left = `${home.x}%`;
        marker.style.top = `${home.y}%`;
        marker.textContent = group.length > 1 ? `${group.length} homes` : home.price >= 1000000 ? `$${(home.price/1000000).toFixed(2)}m` : `$${Math.round(home.price/1000)}k`;
        marker.setAttribute("aria-label",group.length > 1 ? `Expand cluster of ${group.length} sample homes` : `View ${home.street} on map`);
        marker.addEventListener("click",() =>
        {
            if (group.length > 1)
            {
                expanded = true;
                $("#zoom").textContent = "Collapse clusters";
                renderMap();
            }
            else openTour(home,false);
        });
        markers.append(marker);
    });
    $("#selection").hidden = !rectangle;
    if (rectangle)
    {
        const [left,top,right,bottom] = rectangle;
        Object.assign($("#selection").style,{ left:`${left}%`,top:`${top}%`,width:`${right-left}%`,height:`${bottom-top}%` });
    }
}
$("#filter-form").addEventListener("submit",event =>
{
    event.preventDefault();
    const data = new FormData(event.target);
    const raw = Object.fromEntries(data);
    raw.types = data.getAll("type");
    const next = cleanCriteria(raw);
    for (const [min,max] of [["min","max"],["sqmin","sqmax"],["lotmin","lotmax"],["yearmin","yearmax"]])
    {
        if (next[min] !== undefined && next[max] !== undefined && next[min] > next[max])
        {
            $("#filter-error").textContent = "Each minimum must be no greater than its maximum.";
            return;
        }
    }
    $("#filter-error").textContent = "";
    criteria = next;
    limit = Number($("#per-page").value);
    render();
    if (innerWidth <= 600)
    {
        $("#filters").classList.remove("open");
        $("#filter-toggle").setAttribute("aria-expanded","false");
        $("#results").scrollIntoView();
    }
});
$("[name=yearmin]").addEventListener("input",event => $("#year-label").textContent = event.target.value);
function clear()
{
    criteria = {};
    area = "";
    rectangle = null;
    $("#map-area").value = "";
    setForm();
    $("#filter-error").textContent = "";
    limit = Number($("#per-page").value);
    render();
}
$("#clear").addEventListener("click",clear);
$("#broaden").addEventListener("click",() =>
{
    locationFilter = "All areas";
    $("#location").value = locationFilter;
    clear();
});
$(".location").addEventListener("submit",event =>
{
    event.preventDefault();
    locationFilter = $("#location").value.trim();
    limit = Number($("#per-page").value);
    render();
});
$$("[data-market]").forEach(button => button.addEventListener("click",() =>
{
    market = button.dataset.market;
    $$("[data-market]").forEach(item => item.setAttribute("aria-pressed",String(item === button)));
    clear();
}));
$("#sort").addEventListener("change",render);
$$("[data-view]").forEach(button => button.addEventListener("click",() =>
{
    view = button.dataset.view;
    $$("[data-view]").forEach(item => item.setAttribute("aria-pressed",String(item === button)));
    render();
}));
$("#per-page").addEventListener("change",() =>
{
    limit = Number($("#per-page").value);
    render();
});
$("#load").addEventListener("click",() =>
{
    limit += Number($("#per-page").value);
    render();
});
$("#mobile-map").addEventListener("click",() =>
{
    view = view === "map" ? "grid" : "map";
    $$("[data-view]").forEach(button => button.setAttribute("aria-pressed",String(button.dataset.view === view)));
    render();
    $("#results").scrollIntoView();
});
$("#map-area").addEventListener("change",event =>
{
    area = event.target.value;
    rectangle = null;
    render();
});
["west","east"].forEach(direction => $(`#${direction}`).addEventListener("click",() =>
{
    $("#map-note").textContent = `Demo viewport moved ${direction}. ${$("#move-search").checked ? "Results restricted to that half of the illustrative map." : "Search-as-I-move is off; results unchanged."}`;
    if ($("#move-search").checked)
    {
        area = direction;
        rectangle = null;
        $("#map-area").value = direction;
        render();
    }
}));
$("#reset-map").addEventListener("click",() =>
{
    area = "";
    rectangle = null;
    drawing = false;
    $("#map-area").value = "";
    $("#draw").setAttribute("aria-pressed","false");
    $(".map").classList.remove("drawing");
    render();
});
$("#zoom").addEventListener("click",() =>
{
    expanded = !expanded;
    $("#zoom").textContent = expanded ? "Collapse clusters" : "Expand clusters";
    renderMap();
});
$("#draw").addEventListener("click",() =>
{
    drawing = !drawing;
    $("#draw").setAttribute("aria-pressed",String(drawing));
    $(".map").classList.toggle("drawing",drawing);
    $("#map-note").textContent = drawing ? "Drag a rectangle to filter sample coordinates. Keyboard alternative: choose West or East above." : "Area drawing disabled.";
});
let start;
const point = event =>
{
    const box = $(".map").getBoundingClientRect();
    return [Math.max(0,Math.min(100,(event.clientX-box.left)/box.width*100)),Math.max(0,Math.min(100,(event.clientY-box.top)/box.height*100))];
};
$(".map").addEventListener("pointerdown",event =>
{
    if (!drawing) return;
    start = point(event);
    event.currentTarget.setPointerCapture(event.pointerId);
});
$(".map").addEventListener("pointermove",event =>
{
    if (!drawing || !start) return;
    const end = point(event);
    const left = Math.min(start[0],end[0]);
    const top = Math.min(start[1],end[1]);
    $("#selection").hidden = false;
    Object.assign($("#selection").style,{ left:`${left}%`,top:`${top}%`,width:`${Math.abs(start[0]-end[0])}%`,height:`${Math.abs(start[1]-end[1])}%` });
});
$(".map").addEventListener("pointerup",event =>
{
    if (!drawing || !start) return;
    const end = point(event);
    rectangle = [Math.min(start[0],end[0]),Math.min(start[1],end[1]),Math.max(start[0],end[0]),Math.max(start[1],end[1])];
    start = null;
    area = "";
    $("#map-area").value = "";
    drawing = false;
    $("#draw").setAttribute("aria-pressed","false");
    $(".map").classList.remove("drawing");
    render();
});
const dialog = $("dialog");
function modal(title,note,panel)
{
    $("#modal-title").textContent = title;
    $("#modal-note").textContent = note;
    ["save","share","tour"].forEach(name => $(`#${name}-panel`).hidden = name !== panel);
    dialog.showModal();
}
function savedList()
{
    $("#saved-list").replaceChildren();
    saved.forEach((item,index) =>
    {
        const div = document.createElement("div");
        div.className = "saved-item";
        const text = document.createElement("p");
        text.textContent = `${item.name} / ${item.frequency || "Off"} / local only`;
        const apply = document.createElement("button");
        apply.className = "btn light";
        apply.textContent = "Apply saved search";
        apply.addEventListener("click",() =>
        {
            restore(item);
            dialog.close();
        });
        const remove = document.createElement("button");
        remove.className = "btn light";
        remove.textContent = "Delete saved search";
        remove.addEventListener("click",() =>
        {
            saved.splice(index,1);
            persist();
            savedList();
        });
        div.append(text,apply,remove);
        $("#saved-list").append(div);
    });
}
function openSave()
{
    modal("Keep your possibilities close.","Saved only in this browser. Frequency choices are a demo; no email alerts run, no sign-up and no personal address is collected.","save");
    savedList();
}
$("#save-search").addEventListener("click",openSave);
$("#manage").addEventListener("click",openSave);
$("#empty-alert").addEventListener("click",openSave);
$("#save-form").addEventListener("submit",event =>
{
    event.preventDefault();
    if (saved.length >= 20)
    {
        $("#modal-note").textContent = "Local demo limit: 20 saved searches. Delete one to save another.";
        return;
    }
    const data = new FormData(event.target);
    saved.push({ ...snapshot(),name:String(data.get("searchname")).trim(),frequency:String(data.get("frequency")) });
    persist();
    savedList();
    $("#modal-note").textContent = "Search saved on this browser. No email alert scheduled or personal data sent.";
});
$("#share-search").addEventListener("click",() =>
{
    modal("Share this search.","The link contains current criteria only. It does not expose your favorites or saved searches.","share");
    const url = new URL(location.href);
    url.search = "";
    url.hash = "";
    url.searchParams.set("search",JSON.stringify(snapshot()));
    $("#share-link").value = url.href;
    $("#copy-result").textContent = "";
});
$("#copy").addEventListener("click",async () =>
{
    try
    {
        await navigator.clipboard.writeText($("#share-link").value);
        $("#copy-result").textContent = "Search link copied.";
    }
    catch
    {
        $("#share-link").select();
        $("#copy-result").textContent = "Select and copy the link above using your keyboard.";
    }
});
function openTour(home,booking)
{
    modal(`${booking ? "Tour" : "Explore"} ${home.street}`,`${money(home.price)}${home.market === "Rent" ? "/month" : ""} / ${home.beds} beds / ${home.baths} baths / ${home.size} sq ft. Fictional ${home.type.toLowerCase()}, ${home.city}. Demo only; no agent, availability or real tour booking. Illustrations are not property photos.`,"tour");
    $("#tour-result").textContent = "";
}
const now = new Date();
$("[name=date]").min = new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,10);
$("#tour-form").addEventListener("submit",event =>
{
    event.preventDefault();
    $("#tour-result").textContent = "Demo tour request checked locally. Nothing sent or stored; no tour scheduled.";
});
$("#close").addEventListener("click",() => dialog.close());
$("#filter-toggle").addEventListener("click",event =>
{
    const open = !$("#filters").classList.contains("open");
    $("#filters").classList.toggle("open",open);
    event.target.setAttribute("aria-expanded",String(open));
});
const menu = $("[data-menu]");
menu.addEventListener("click",() =>
{
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded",String(open));
    $("nav").classList.toggle("open",open);
});
render();
