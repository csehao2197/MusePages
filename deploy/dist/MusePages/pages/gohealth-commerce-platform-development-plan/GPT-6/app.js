const $ = (id) => document.getElementById(id);
let products = [
    { id: 1, name: "Daily Multivitamin", category: "Nutrition", price: 125000, stock: 24 },
    { id: 2, name: "Digital Thermometer", category: "Equipment", price: 85000, stock: 8 },
    { id: 3, name: "Gentle Hand Wash", category: "Personal care", price: 45000, stock: 32 },
    { id: 4, name: "Omega-3 Capsules", category: "Nutrition", price: 185000, stock: 0 },
    { id: 5, name: "Recovery Balm", category: "Personal care", price: 65000, stock: 4 },
    { id: 6, name: "Yoga Recovery Mat", category: "Equipment", price: 240000, stock: 12 }
];
let nextId = 7;
let editing = null;
let page = 0;
let orders = 0;
let revenue = 2450000;
let invoice = "";
let cart = [];
const money = (value) => `Rp ${value.toLocaleString("id-ID")}`;
function render()
{
    const search = $("search").value.trim().toLowerCase();
    const category = $("category").value;
    let rows = products.filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(search) && (category === "all" || p.category === category));
    rows.sort((a, b) => $("sort").value === "name" ? a.name.localeCompare(b.name) : a[$("sort").value] - b[$("sort").value]);
    const pages = Math.max(1, Math.ceil(rows.length / 4));
    page = Math.min(page, pages - 1);
    $("result-count").textContent = `${rows.length} products`;
    $("product-count").textContent = products.length;
    $("rows").replaceChildren();
    rows.slice(page * 4, page * 4 + 4).forEach((product) =>
    {
        const tr = document.createElement("tr");
        const name = document.createElement("td");
        name.className = "product-name";
        name.textContent = product.name;
        const categoryText = document.createElement("small");
        categoryText.textContent = product.category;
        name.append(categoryText);
        tr.append(name);
        for (const text of [money(product.price), product.stock ? `${product.stock} in stock` : "Out of stock"])
        {
            const cell = document.createElement("td");
            cell.textContent = text;
            tr.append(cell);
        }
        const actions = document.createElement("td");
        const edit = document.createElement("button");
        edit.textContent = "Edit";
        edit.dataset.edit = product.id;
        const add = document.createElement("button");
        add.textContent = "Add";
        add.dataset.add = product.id;
        add.disabled = product.stock <= cart.filter((id) => id === product.id).length;
        actions.append(edit, add);
        tr.append(actions);
        $("rows").append(tr);
    });
    $("empty").hidden = rows.length > 0;
    $("prev").disabled = page === 0;
    $("next-page").disabled = page >= pages - 1;
    $("page-label").textContent = `Page ${page + 1} of ${pages}`;
    $("orders").textContent = orders;
    $("revenue").textContent = money(revenue);
    $("cart").replaceChildren();
    if (!cart.length) $("cart").textContent = "Your order starts here. Add a product to get going.";
    cart.forEach((id, index) =>
    {
        const p = products.find((entry) => entry.id === id);
        const line = document.createElement("div");
        line.className = "cart-item";
        line.textContent = p.name;
        const remove = document.createElement("button");
        remove.textContent = "Remove";
        remove.dataset.remove = index;
        const price = document.createElement("small");
        price.textContent = money(p.price);
        line.append(remove, price);
        $("cart").append(line);
    });
    $("total").textContent = money(cart.reduce((sum, id) => sum + products.find((p) => p.id === id).price, 0));
    $("cart-count").textContent = `${cart.length} items`;
    $("checkout").disabled = cart.length === 0;
}
function editor(id)
{
    editing = id;
    const product = products.find((p) => p.id === id);
    $("product-form").reset();
    $("editor-title").textContent = product ? "Edit product" : "Add a product";
    $("form-error").textContent = "";
    $("delete").hidden = !product;
    if (product)
    {
        $("product-name").value = product.name;
        $("product-category").value = product.category;
        $("price").value = product.price;
        $("stock").value = product.stock;
    }
    $("product-dialog").showModal();
}
$("new-product").addEventListener("click", () => editor(null));
$("close-product").addEventListener("click", () => $("product-dialog").close());
$("product-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const name = $("product-name").value.trim();
    const price = Number($("price").value);
    const stock = Number($("stock").value);
    if (!name || !Number.isInteger(price) || price <= 0 || !$("stock").value || !Number.isInteger(stock) || stock < 0)
    {
        $("form-error").textContent = "Add a name, positive whole-rupiah price and nonnegative whole stock.";
        return;
    }
    if (stock < cart.filter((id) => id === editing).length)
    {
        $("form-error").textContent = "Stock cannot be below the quantity reserved in your sample order.";
        return;
    }
    const product = { id: editing || nextId++, name, category: $("product-category").value, price, stock };
    if (editing) products = products.map((p) => p.id === editing ? product : p);
    else products.push(product);
    $("product-dialog").close();
    render();
});
$("delete").addEventListener("click", () =>
{
    products = products.filter((p) => p.id !== editing);
    cart = cart.filter((id) => id !== editing);
    $("product-dialog").close();
    render();
});
$("rows").addEventListener("click", (event) =>
{
    if (event.target.dataset.edit) editor(Number(event.target.dataset.edit));
    if (event.target.dataset.add)
    {
        const id = Number(event.target.dataset.add);
        const product = products.find((p) => p.id === id);
        if (cart.filter((value) => value === id).length < product.stock) cart.push(id);
        render();
    }
});
$("cart").addEventListener("click", (event) =>
{
    if (event.target.dataset.remove !== undefined)
    {
        cart.splice(Number(event.target.dataset.remove), 1);
        render();
    }
});
["search", "category", "sort"].forEach((id) => $(id).addEventListener("input", () => { page = 0; render(); }));
$("prev").addEventListener("click", () => { page--; render(); });
$("next-page").addEventListener("click", () => { page++; render(); });
$("checkout").addEventListener("click", () =>
{
    if (!cart.length) return;
    let total = 0;
    const lines = cart.map((id) =>
    {
        const p = products.find((entry) => entry.id === id);
        p.stock--;
        total += p.price;
        return `${p.name} · ${money(p.price)}`;
    });
    orders++;
    revenue += total;
    invoice = `GOHEALTH-DEMO-${orders}\n${lines.join("\n")}\n\nTOTAL ${money(total)}\nSample order only · Payment not collected`;
    $("invoice").textContent = invoice;
    cart = [];
    render();
    $("invoice-dialog").showModal();
});
$("orders-link").addEventListener("click", () =>
{
    $("invoice").textContent = invoice || "No session orders yet. Create a sample order from the catalog.";
    $("invoice-dialog").showModal();
});
$("close-invoice").addEventListener("click", () => $("invoice-dialog").close());
$("print").addEventListener("click", () => window.print());
render();
