// style class boxes
document.querySelectorAll(".class-box").forEach((box) => {
    const hsl = HEXtoHSL(box.dataset.classTheme);

    const firstLightness = hsl[2] + Math.round(hsl[2] * (2 / 10));
    const secondLightness = hsl[2] + Math.round(hsl[2] * (8 / 10));

    const fontSize = (() => {
        const words = box.firstElementChild.innerText.split(" ");

        if (words.some((word) => word.length > 7) || words.length > 4)
            return 20;
        else return 30;
    })();

    const styleTemplate = `
        font-size: ${fontSize}px;
        color: ${hsl[3]};
        background-image: linear-gradient(
            to top right,
            hsl(${hsl[0]}, ${hsl[1]}%, ${firstLightness}%),
            hsl(${hsl[0]}, ${hsl[1]}%, ${secondLightness}%)
        );
    `;

    box.setAttribute("style", styleTemplate);
});
