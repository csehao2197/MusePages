const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const icon = (id) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const use = document.createElementNS(svg.namespaceURI, "use");
  use.setAttribute("href", `assets/icons.svg#${id}`);
  svg.append(use);
  svg.setAttribute("aria-hidden", "true");
  return svg;
};
const element = (tag, text, className) => {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
};
const sampleAddress = "742 Evergreen Terrace, Springfield";
const normalized = (value) => value.toLocaleLowerCase("en").replace(/[^a-z0-9]+/g, " ").trim();
const addressInputs = $$(".address-input");
const cmaForm = $("#cma-form");
const info = $("#info-dialog");
const content = $("#info-content");
const result = $("#estimate-result");
const focusTop = () => {
  $("#top").scrollIntoView({block:"start"});
  $("#hero-address").focus({preventScroll:true});
};
const updateAddress = (value, source) => {
  for (const input of addressInputs) {
    if (input !== source) input.value = value;
    input.setCustomValidity("");
  }
  $("#property-address").value = value;
};
const jump = (id, field) => {
  if (info.open) info.close();
  requestAnimationFrame(() => {
    $(`#${id}`).scrollIntoView({block:"start"});
    if (field) $(field).focus({preventScroll:true});
  });
};
const jumpButton = (text, id, field) => {
  const button = element("button", text, "button");
  button.type = "button";
  button.addEventListener("click", () => jump(id,field));
  button.append(icon("arrow"));
  return button;
};
function openInfo(title, ...nodes) {
  $("#info-title").textContent = title;
  content.replaceChildren(...nodes);
  info.showModal();
}
$(".close-info").addEventListener("click", () => info.close());
info.addEventListener("close", () => { content.replaceChildren(); $("#info-title").textContent = ""; });
info.addEventListener("click", (event) => {
  if (event.target !== info) return;
  const box = info.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) info.close();
});
const nav = $("#nav-dialog"), menu = $(".mobile-menu");
menu.addEventListener("click", () => { nav.showModal(); menu.setAttribute("aria-expanded","true"); });
$(".close-nav").addEventListener("click", () => nav.close());
nav.addEventListener("close", () => menu.setAttribute("aria-expanded","false"));
$$("a",nav).forEach((link) => link.addEventListener("click", () => {
  nav.close();
  requestAnimationFrame(() => $(link.hash).scrollIntoView({block:"start"}));
}));
matchMedia("(min-width:901px)").addEventListener("change", (event) => { if (event.matches && nav.open) nav.close(); });
$$(".focus-estimate").forEach((button) => button.addEventListener("click", (event) => { event.preventDefault(); focusTop(); }));

for (const input of addressInputs) {
  const list = document.getElementById(input.getAttribute("aria-controls"));
  let selected = false;
  const close = () => {
    list.hidden = true;
    selected = false;
    input.setAttribute("aria-expanded","false");
    input.removeAttribute("aria-activedescendant");
  };
  const choose = () => {
    input.value = sampleAddress;
    updateAddress(sampleAddress,input);
    input.setCustomValidity("");
    close();
    input.focus({preventScroll:true});
  };
  function suggest() {
    input.setCustomValidity("");
    updateAddress(input.value,input);
    const query = normalized(input.value);
    list.replaceChildren();
    selected = false;
    input.removeAttribute("aria-activedescendant");
    if (!query || !normalized(sampleAddress).includes(query)) return close();
    const option = element("li");
    option.id = `${input.id}-sample`;
    option.setAttribute("role","option");
    option.setAttribute("aria-selected","false");
    option.append(icon("pin"));
    const text = element("span");
    text.append(element("strong","742 Evergreen Terrace"),element("small","Springfield · Illustrative sample address"));
    option.append(text);
    option.addEventListener("pointerdown", (event) => event.preventDefault());
    option.addEventListener("click",choose);
    list.append(option);
    list.hidden = false;
    input.setAttribute("aria-expanded","true");
  }
  input.addEventListener("input",suggest);
  input.addEventListener("focus", () => { if (input.value && !input.validity.customError) suggest(); });
  input.addEventListener("blur",close);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { close(); return; }
    if (["ArrowDown","ArrowUp"].includes(event.key)) {
      event.preventDefault();
      if (list.hidden) suggest();
      if (!list.hidden) {
        selected = true;
        list.firstElementChild.setAttribute("aria-selected","true");
        input.setAttribute("aria-activedescendant",list.firstElementChild.id);
      }
    } else if (event.key === "Enter" && selected && !list.hidden) { event.preventDefault(); choose(); }
    else if (event.key === "Tab") close();
  });
  input.form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input.value.trim();
    if (value.length < 5) { input.setCustomValidity("Enter a full property address."); input.reportValidity(); return; }
    close();
    const matches = ["742 evergreen terrace springfield","742 evergreen terrace"].includes(normalized(value));
    const address = matches ? sampleAddress : value;
    updateAddress(address);
    const dismiss = element("button",undefined,"icon-button");
    dismiss.type = "button";
    dismiss.setAttribute("aria-label","Dismiss estimate result");
    dismiss.append(icon("close"));
    dismiss.addEventListener("click", () => {
      result.hidden = true;
      result.replaceChildren();
      input.focus({preventScroll:true});
    });
    result.replaceChildren(dismiss,element("h2",matches ? "Your sample report is ready." : "Live estimates aren't available in this demo."),
      element("p",address),element("p",matches ? "Sample address matched. The supplied $485,000–$520,000 report below is illustrative, not a live estimate. No account or contact details are needed." : "No property data was fetched and no valuation was calculated. You can explore the sample report or prepare a local CMA request preview."));
    const reportLink = element("a",matches ? "View the sample report →" : "Explore the sample report →");
    reportLink.href = "#sample";
    result.append(reportLink,document.createTextNode("  "),jumpButton("Preview a Free CMA","cma","#property-address"));
    result.hidden = false;
    result.scrollIntoView({block:"center"});
  });
}
$$(".try-sample").forEach((button) => button.addEventListener("click", () => {
  updateAddress(sampleAddress);
  $("#hero-address").form.requestSubmit();
}));

const series = [
  ["April 2025",448000],["May 2025",450000],["June 2025",449500],["July 2025",454000],
  ["August 2025",455000],["September 2025",458000],["October 2025",457000],["November 2025",461000],
  ["December 2025",462500],["January 2026",465000],["February 2026",468000],["March 2026",472000],
];
const currency = (value) => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(value);
const x = (index) => 10 + index * 780 / 11;
const y = (price) => 210 - (price-440000)/40000*180;
const line = series.map((entry,index) => `${index ? "L" : "M"}${x(index)} ${y(entry[1])}`).join(" ");
$("#price-line").setAttribute("d",line);
$("#price-area").setAttribute("d",`${line}L790 225L10 225Z`);
function chartPoint(index) {
  const [month,price] = series[index];
  $("#market-month").value = index;
  $("#market-month").setAttribute("aria-valuetext",`${month}, ${currency(price)}, illustrative`);
  $("#market-point").textContent = `${month} · ${currency(price)}`;
  $("#chart-guide").setAttribute("x1",x(index));
  $("#chart-guide").setAttribute("x2",x(index));
  $("#chart-dot").setAttribute("cx",x(index));
  $("#chart-dot").setAttribute("cy",y(price));
}
$("#market-month").addEventListener("input", (event) => chartPoint(Number(event.target.value)));
$("#market-chart").addEventListener("pointermove", (event) => {
  if (event.pointerType === "touch") return;
  const box = event.currentTarget.getBoundingClientRect();
  chartPoint(Math.max(0,Math.min(11,Math.round(((event.clientX-box.left)/box.width*800-10)/780))));
});
chartPoint(11);

function validatePhone() {
  const value = $("#phone").value.trim(), digits = value.replace(/\D/g,"");
  $("#phone").setCustomValidity(value && (!/^[+()\d .-]+$/.test(value) || digits.length < 7 || digits.length > 15) ? "Enter a phone number with 7 to 15 digits." : "");
}
$("#phone").addEventListener("input",validatePhone);
cmaForm.addEventListener("submit", (event) => {
  event.preventDefault();
  validatePhone();
  if (!cmaForm.reportValidity()) return;
  const data = new FormData(cmaForm);
  const summary = element("dl",undefined,"preview-list");
  for (const [label,key] of [["Full name","name"],["Email","email"],["Phone","phone"],["Property address","address"],["Selling timeline","timeline"],["Message","message"]]) {
    const row = element("div");
    row.append(element("dt",label),element("dd",String(data.get(key) || "Not provided").trim()));
    summary.append(row);
  }
  openInfo("Your local CMA request preview",element("p","Nothing was sent. No agent will contact you, and no visit or valuation has been arranged. This preview exists only in this page until you close it."),summary);
  cmaForm.reset();
  addressInputs.forEach((input) => { input.value = ""; input.setCustomValidity(""); input.setAttribute("aria-expanded","false"); input.removeAttribute("aria-activedescendant"); });
  $$(".suggestions").forEach((list) => { list.hidden = true; list.replaceChildren(); });
  $("#phone").setCustomValidity("");
  result.replaceChildren();
  result.hidden = true;
});

const panels = {
  phone:["A conversation, when you're ready","The original concept phone number is (555) 329-8100. It is an illustrative contact, not a verified working line. This page does not place calls. You can preview a CMA inquiry locally."],
  "Buy a Home":["Find your next chapter","The brief supplies a home-valuation page, not a verified property inventory. Explore the sample report and market snapshot to understand the concept, or prepare a local CMA inquiry. No homes are being offered here."],
  "Neighborhood Guides":["Every neighborhood has a story","Springfield, Riverside and Oakwood appear in the fictional brief. No verified neighborhood guides, boundaries or local recommendations were supplied. The market snapshot is the original unverified March 2026 concept data."],
  Blog:["The Keystone journal","A journal wasn't included in the original brief. The sample valuation report, market snapshot and FAQ explain the content that is actually available on this homepage."],
  Careers:["Good people make a difference","No real brokerage employer, open positions or application service is connected. The team photograph is an attributed stock illustration, not actual Keystone agents."],
  Press:["About this concept","Keystone Realty Group is a fictional homepage concept generated by gpt-6.1-sol. The property, market, brokerage, review and license claims came from the original brief and have not been independently verified."],
  Privacy:["Your privacy in this demo","Entered addresses and CMA details remain only in the current page. No backend requests, tracking, cookies, browser storage or external runtime resources are used. CMA fields clear after a successful local preview; closing the dialog removes the preview details. No information is sold, delivered to agents or used to produce real estimates."],
  Terms:["A useful example, not a valuation","This fictional static concept is not an appraisal, mortgage offer, licensed brokerage service or financial advice. Figures, sales, accuracy claims, service promises, testimonials and licensing are unverified input. Intermediate chart points are illustrative. Obtain independent advice and verify data before making property or financial decisions."],
};
$$("[data-panel]").forEach((button) => button.addEventListener("click", () => {
  const key = button.dataset.panel;
  const [title,text] = panels[key] || [`${key} · Keystone concept`,`No verified ${key} account was supplied. This local information panel avoids linking to an unrelated person's or company's profile. No social feed, tracking or sign-in is connected.`];
  openInfo(title,element("p",text),jumpButton(key === "Neighborhood Guides" ? "Explore the market snapshot" : "Explore the local CMA preview",key === "Neighborhood Guides" ? "market" : "cma",key === "Neighborhood Guides" ? undefined : "#full-name"));
}));
$("#mortgage-open").addEventListener("click", () => {
  const form = element("form",undefined,"calculator");
  const fields = [
    ["price","Home price ($)",472000,1,100000000,1],
    ["down","Down payment ($)",94400,0,100000000,1],
    ["rate","Annual interest rate (%)",6.5,0,30,.01],
    ["years","Loan term (years)",30,1,50,1],
  ];
  for (const [name,text,value,min,max,step] of fields) {
    const label = element("label",text); label.htmlFor = `calc-${name}`;
    const input = element("input"); input.id = `calc-${name}`; input.name = name; input.type = "number"; input.value = value; input.min = min; input.max = max; input.step = step; input.required = true;
    form.append(label,input);
  }
  const submit = element("button","Calculate payment","button"); submit.type = "submit";
  const output = element("div",undefined,"calculator-output"); output.hidden = true; output.setAttribute("role","status");
  const downInput = $('[name="down"]',form), priceInput = $('[name="price"]',form);
  const checkDown = () => {
    downInput.setCustomValidity(Number(downInput.value) > Number(priceInput.value) ? "Down payment cannot exceed the home price." : "");
    output.hidden = true;
    output.replaceChildren();
  };
  form.addEventListener("input",checkDown);
  form.append(submit,output,element("small","Illustrative fixed-rate principal and interest only. Taxes, insurance, HOA charges, closing costs and lender qualification are excluded. Not a loan quote or financial advice."));
  form.addEventListener("submit", (event) => {
    event.preventDefault(); checkDown(); if (!form.reportValidity()) return;
    const data = new FormData(form), principal = Number(data.get("price"))-Number(data.get("down")), months = Number(data.get("years"))*12, rate = Number(data.get("rate"))/1200;
    const monthly = principal === 0 ? 0 : rate === 0 ? principal/months : principal*rate/(1-Math.pow(1+rate,-months));
    if (!Number.isFinite(monthly)) return;
    output.replaceChildren(element("p","Estimated monthly principal & interest"),element("strong",new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2,maximumFractionDigits:2}).format(monthly)),element("p",`Loan amount ${currency(principal)} · ${months} monthly payments · Illustrative calculation`));
    output.hidden = false;
  });
  openInfo("A little mortgage perspective",element("p","Explore a simple fixed-rate payment estimate. These sample assumptions are editable and are not an available lending offer."),form);
});
