document.querySelectorAll(".pull").forEach((heading) =>
{
    let index = 0;
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) =>
    {
        const fragment = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach((word) =>
        {
            if (!word.trim()) fragment.append(document.createTextNode(word));
            else
            {
                const span = document.createElement("span");
                span.className = "word";
                span.style.setProperty("--delay", `${index++ * .08}s`);
                span.textContent = word;
                fragment.append(span);
            }
        });
        node.replaceWith(fragment);
    });
});
const observer = new IntersectionObserver((entries) =>
{
    entries.forEach((entry) =>
    {
        if (entry.isIntersecting) { entry.target.classList.add("seen"); observer.unobserve(entry.target); }
    });
}, { threshold: .1 });
document.querySelectorAll(".pull, .grid article").forEach((element) => observer.observe(element));
const reveal = document.querySelector(".letter-reveal");
const text = reveal.textContent;
reveal.setAttribute("aria-label", text);
reveal.textContent = "";
for (const letter of text)
{
    const span = document.createElement("span");
    span.textContent = letter;
    span.setAttribute("aria-hidden", "true");
    reveal.append(span);
}
function updateLetters()
{
    const rect = reveal.getBoundingClientRect();
    const progress = (innerHeight * .8 - rect.top) / (innerHeight * .6 + rect.height);
    [...reveal.children].forEach((span, index, list) =>
    {
        const start = index / list.length - .1;
        const fraction = Math.max(0, Math.min(1, (progress - start) / .15));
        span.style.opacity = String(.2 + .8 * fraction);
    });
}
addEventListener("scroll", updateLetters, { passive: true });
addEventListener("resize", updateLetters);
updateLetters();
const detail = document.getElementById("detail");
const inquiry = document.getElementById("inquiry");
const features = [
    ["Project Storyboard.", "Build a visual sequence, keep references beside each frame, and invite the collective into your process. A shared vision starts with a clear story."],
    ["Smart Critiques.", "Explore how contextual creative notes and visual analysis could support your next edit. This static showcase explains the workflow; no AI service is connected."],
    ["Immersion Capsule.", "Make room for deep work with intentional quiet, ambient soundscapes and a protected schedule. This is a concept, not a connected device controller."]
];
document.querySelectorAll(".learn").forEach((button) => button.onclick = () =>
{
    const [title, copy] = features[Number(button.dataset.feature)];
    document.getElementById("detail-title").textContent = title;
    document.getElementById("detail-copy").textContent = copy;
    detail.showModal();
});
document.querySelectorAll(".join").forEach((button) => button.onclick = () =>
{
    detail.close();
    inquiry.showModal();
});
document.querySelectorAll(".close").forEach((button) => button.onclick = () => button.closest("dialog").close());
document.querySelector("form").onsubmit = (event) =>
{
    event.preventDefault();
    const name = new FormData(event.currentTarget).get("name");
    document.querySelector(".feedback").textContent = `Thank you, ${name}. Your interest is noted in this local demo only. Nothing was sent.`;
};
