const details = [...document.querySelectorAll("#safety details")];
details.forEach((current) => current.querySelector("summary").addEventListener("click", (event) =>
{
    event.preventDefault();
    const expanded = !current.open;
    details.forEach((item) =>
    {
        item.open = item === current && expanded;
    });
}));
