const menu = document.querySelector("#menu");
const navigation = document.querySelector("#navigation");
menu.addEventListener("click", () =>
{
    const expanded = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(expanded));
    navigation.classList.toggle("open", expanded);
});
navigation.addEventListener("click", (event) =>
{
    if (event.target.closest("a"))
    {
        navigation.classList.remove("open");
        menu.setAttribute("aria-expanded", "false");
    }
});
document.querySelector("#social").addEventListener("click", () =>
{
    document.querySelector("#social-note").hidden = false;
});
