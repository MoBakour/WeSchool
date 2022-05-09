// scroller
const scrollerUp = document.querySelector(".scroller-up");
const scrollerDown = document.querySelector(".scroller-down");

function scrollFunction(updown) {
    const pageHeight = window.innerHeight;
    let amount = updown ? -pageHeight : pageHeight;
    window.scrollBy(0, amount);
}

scrollerUp.addEventListener("click", () => scrollFunction(true));
scrollerDown.addEventListener("click", () => scrollFunction(false));

// @ copy tooltip
const atElement = document.querySelector(".contacts-at");
const tooltip = document.querySelector(".tooltip");
const at = "@swordax.sy";

atElement.addEventListener("click", () => {
    navigator.clipboard
        .writeText(at)
        .then(() => {
            tooltip.classList.add("active");
            setTimeout(() => {
                tooltip.classList.remove("active");
            }, 1500);
        })
        .catch((err) => console.log(err));
});
