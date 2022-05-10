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
