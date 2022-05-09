// selectors
const searchInput = document.querySelector(".search-input");
const searchBy = document.querySelector(".search-by-select");
const allRows = document.querySelectorAll(".board tbody tr");
const teachers = document.querySelectorAll(".board tbody td:last-child");

// search mechanism
searchInput.addEventListener("input", () => {
    const searchValue = searchInput.value.toLowerCase();
    const checkNth =
        searchBy.value == "student"
            ? "2"
            : searchBy.value == "class"
            ? "4"
            : "5";

    allRows.forEach((row) => {
        const checkValue = row
            .querySelector(`td:nth-child(${checkNth})`)
            .innerText.toLowerCase();

        if (!checkValue.includes(searchValue)) {
            row.classList.add("hidden");
        } else {
            row.classList.remove("hidden");
        }
    });
});

// auto focus on search input
searchBy.addEventListener("input", () => {
    searchInput.focus();
});

// ellipses
teachers.forEach((teacher) => {
    let name = teacher.innerText;
    if (name.length > 16) {
        name = name.substring(0, 14);
        name += "...";
    }
    teacher.innerText = name;
});
