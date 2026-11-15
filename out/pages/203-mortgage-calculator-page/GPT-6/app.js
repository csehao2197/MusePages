import { payment, amortize } from "./calculator.mjs";

const $ = selector => document.querySelector(selector);
const money = value => new Intl.NumberFormat("en-US", { style:"currency", currency:"USD", maximumFractionDigits:0 }).format(value);
let unit = "dollar";
let term = 30;
let view = "yearly";
let base;
let current;
const fields = ["price","down","rate","tax","insurance","hoa","extra","lump"];

function read()
{
    const numbers = {};
    for (const id of fields)
    {
        const input = $(`#${id}`);
        const value = Number(input.value);
        if (input.value.trim() === "" || !Number.isFinite(value) || value < Number(input.min) || value > Number(input.max))
        {
            throw Error(`Enter a valid ${id === "down" ? "down payment" : id} within the field limits. Last valid estimate remains below.`);
        }
        numbers[id] = value;
    }
    numbers.deposit = unit === "percent" ? numbers.price * numbers.down / 100 : numbers.down;
    if (numbers.deposit > numbers.price) throw Error("Down payment must not exceed the home price. Last valid estimate remains below.");
    numbers.loan = numbers.price - numbers.deposit;
    return numbers;
}

function schedule()
{
    if (!base) return;
    const rows = view === "monthly" ? base.rows : base.rows.reduce((groups,row) =>
    {
        const index = Math.floor((row.month - 1) / 12);
        groups[index] ||= { month:index + 1, payment:0, principal:0, interest:0, balance:0 };
        for (const key of ["payment","principal","interest"]) groups[index][key] += row[key];
        groups[index].balance = row.balance;
        return groups;
    }, []);
    $("#schedule-body").innerHTML = rows.map(row => `<tr><td>${view === "monthly" ? "Month" : "Year"} ${row.month}</td><td>${money(row.payment)}</td><td>${money(row.principal)}</td><td>${money(row.interest)}</td><td>${money(row.balance)}</td></tr>`).join("");
    $("#explore").max = Math.max(1,base.months);
    if (Number($("#explore").value) > base.months) $("#explore").value = 1;
    explore();
    const line = getter => base.rows.map((row,index) => `${index ? "L" : "M"}${10 + index / Math.max(1,base.months - 1) * 880},${165 - getter(row) * 150}`).join(" ");
    $("#principal-line").setAttribute("d", line(row => base.scheduled ? row.principal / base.scheduled : 0));
    $("#interest-line").setAttribute("d", line(row => base.scheduled ? row.interest / base.scheduled : 0));
    $("#balance-line").setAttribute("d", line(row => current.loan ? row.balance / current.loan : 0));
}

function explore()
{
    const row = base?.rows[Number($("#explore").value) - 1];
    $("#explore-result").textContent = row ? `Month ${row.month}: principal ${money(row.principal)} / interest ${money(row.interest)} / remaining balance ${money(row.balance)}` : "No loan balance — no mortgage payments required.";
}

function calculate()
{
    try
    {
        $("#down").max = unit === "percent" ? "100" : $("#price").value || "10000000";
        const data = read();
        current = data;
        $("#error").textContent = "";
        $("#result-panel").style.opacity = "1";
        $("#price-slider").value = String(Math.min(2000000,Math.max(50000,data.price)));
        base = amortize(data.loan,data.rate,term);
        const pmi = data.deposit / data.price < .2 ? data.loan * .005 / 12 : 0;
        const parts = [["Principal & interest",base.scheduled,"#2c6e56"],["Property tax",data.tax/12,"#91b49b"],["Home insurance",data.insurance/12,"#becf8a"],["HOA fees",data.hoa,"#c8a576"],["PMI estimate",pmi,"#a3abbc"]];
        const total = parts.reduce((sum,row) => sum + row[1],0);
        $("#total").textContent = money(total);
        $("#total").dataset.value = String(total);
        $("#breakdown").innerHTML = parts.map(row => `<div style="--dot:${row[2]}"><span>${row[0]}</span><b>${money(row[1])}</b></div>`).join("");
        let progress = 0;
        $(".donut").style.background = total ? `conic-gradient(${parts.map(row =>
        {
            const start = progress;
            progress += row[1] / total * 100;
            return `${row[2]} ${start}% ${progress}%`;
        }).join(",")})` : "#dce5d8";
        $(".donut").setAttribute("aria-label", parts.map(row => `${row[0]} ${money(row[1])}`).join(", "));
        $("#loan").textContent = money(data.loan);
        $("#ltv").textContent = `${(data.loan/data.price*100).toFixed(1)}%`;
        $("#all-payments").textContent = money(base.total);
        $("#all-interest").textContent = money(base.totalInterest);
        const payoff = new Date();
        payoff.setDate(1);
        payoff.setMonth(payoff.getMonth() + base.months);
        $("#payoff").textContent = base.months ? payoff.toLocaleDateString("en-US",{ month:"short", year:"numeric" }) : "Paid in full";
        $("#down-hint").textContent = `${(data.deposit/data.price*100).toFixed(1)}% of home price / ${money(data.deposit)}`;
        const options = [["30-year fixed",data.loan,data.rate,30],["15-year fixed",data.loan,data.rate,15],["30-year / 10% down",data.price*.9,data.rate,30],["30-year / +0.5% rate",data.loan,data.rate+.5,30]];
        $("#comparison").innerHTML = options.map(option =>
        {
            const loan = amortize(option[1],option[2],option[3]);
            return `<div class="option"><h3>${option[0]}</h3><strong>${money(loan.scheduled)}</strong><p>P&amp;I / month at ${option[2].toFixed(2)}%</p><p>Interest: ${money(loan.totalInterest)}</p><p>Total P&amp;I: ${money(loan.total)}</p><p>Δ monthly vs selected: ${money(loan.scheduled-base.scheduled)}</p></div>`;
        }).join("");
        const accelerated = amortize(data.loan,data.rate,term,data.extra,data.lump);
        $("#savings").textContent = `${((base.months-accelerated.months)/12).toFixed(1)} years saved / ${money(Math.max(0,base.totalInterest-accelerated.totalInterest))} interest saved. ${accelerated.months} payments remaining.`;
        schedule();
    }
    catch (error)
    {
        $("#error").textContent = error.message;
        $("#result-panel").style.opacity = ".55";
    }
}

fields.forEach(id => $(`#${id}`).addEventListener("input", calculate));
$("#price-slider").addEventListener("input", event =>
{
    $("#price").value = event.target.value;
    calculate();
});
document.querySelectorAll("[data-unit]").forEach(button => button.addEventListener("click", () =>
{
    const next = button.dataset.unit;
    const price = Number($("#price").value);
    const down = Number($("#down").value);
    if (next !== unit && price > 0)
    {
        $("#down").value = String(Number((next === "percent" ? down / price * 100 : down / 100 * price).toFixed(2)));
    }
    unit = next;
    document.querySelectorAll("[data-unit]").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
    calculate();
}));
document.querySelectorAll("[data-term]").forEach(button => button.addEventListener("click", () =>
{
    term = Number(button.dataset.term);
    document.querySelectorAll("[data-term]").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
    calculate();
}));
["minus","plus"].forEach(id => $(`#${id}`).addEventListener("click", () =>
{
    $("#rate").value = String(Math.min(25,Math.max(0,Number($("#rate").value) + (id === "plus" ? .125 : -.125))));
    calculate();
}));
document.querySelectorAll("[data-view]").forEach(button => button.addEventListener("click", () =>
{
    view = button.dataset.view;
    document.querySelectorAll("[data-view]").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
    schedule();
}));
$("#explore").addEventListener("input", explore);
$(".chart").addEventListener("pointermove", event =>
{
    if (!base?.months) return;
    const box = event.currentTarget.getBoundingClientRect();
    const fraction = Math.min(1,Math.max(0,(event.clientX-box.left)/box.width));
    $("#explore").value = String(Math.max(1,Math.round(fraction*base.months)));
    explore();
});
const dialog = $("dialog");
let tool = "afford";
const tools = {
    afford:["Home affordability / income screen","Annual gross income ($)","Monthly existing debt ($)",100000,500,"Simplified screen: 28% of gross monthly income less existing debt. Not lender qualification."],
    rent:["Rent vs buy / monthly cash flow","Monthly rent ($)","Estimated ownership cost ($)",2200,2600,"Cash-flow difference only; excludes equity, tax effects, opportunity cost and appreciation."],
    refinance:["Refinance / payment difference","Current monthly P&I ($)","Proposed monthly P&I ($)",2400,2200,"Monthly payment savings only, excluding closing costs, term changes and break-even."],
    deposit:["Down payment planner","Home price ($)","Down payment target (%)",400000,20,"Savings target only; closing costs and reserves are additional."]
};
document.querySelectorAll("[data-tool]").forEach(button => button.addEventListener("click", () =>
{
    tool = button.dataset.tool;
    const data = tools[tool];
    $("#tool-title").textContent = data[0];
    $("#label-a").textContent = data[1];
    $("#label-b").textContent = data[2];
    $("#tool-a").value = data[3];
    $("#tool-b").value = data[4];
    $("#tool-note").textContent = data[5];
    $("#tool-result").textContent = "";
    dialog.showModal();
}));
$("#tool-calculate").addEventListener("click", () =>
{
    const a = Number($("#tool-a").value);
    const b = Number($("#tool-b").value);
    if ($("#tool-a").value === "" || $("#tool-b").value === "" || !Number.isFinite(a+b) || a < 0 || b < 0 || (tool === "deposit" && b > 100))
    {
        $("#tool-result").textContent = "Enter valid nonnegative values; a percentage must be at most 100.";
        return;
    }
    const result = tool === "afford" ? Math.max(0,a/12*.28-b) : tool === "deposit" ? a*b/100 : a-b;
    $("#tool-result").textContent = `${tool === "afford" ? "Illustrative monthly housing screen" : tool === "deposit" ? "Down payment target" : tool === "rent" ? "Rent minus ownership cost / month" : "Potential monthly payment savings"}: ${money(result)}`;
});
$("#close").addEventListener("click", () => dialog.close());
$(".contact form").addEventListener("submit", event =>
{
    event.preventDefault();
    $("#lead-result").textContent = "Demo checked locally. Nothing sent or saved; no credit check, rate quote or pre-approval occurred.";
});
$("#find").addEventListener("click", () => $("#find-result").textContent = `Demo budget: ${money(Number($("#price").value) || 0)}. Live property search is not connected; no listings or lender offers are implied.`);
const menu = $("[data-menu]");
menu.addEventListener("click", () =>
{
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    $("nav").classList.toggle("open", open);
});
calculate();
