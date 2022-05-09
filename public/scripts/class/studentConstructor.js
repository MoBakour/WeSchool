// student constructor
function constructStudent({ _id, name, gender, avatar, points }) {
    const box = document.createElement("div");
    box.title = name;
    box.style = `background-color: ${
        gender == "male" ? "#60CFFF" : "#FFA0F0"
    };`;
    box.classList.add("student");
    box.setAttribute("data-student-id", _id.toString());
    box.setAttribute("data-student-gender", gender);
    box.addEventListener("click", () => openStudentPopup(box));

    const avatarEl = document.createElement("img");
    avatarEl.src = `./images/characters/${avatar}.png`;
    avatarEl.alt = "Student Character";
    avatarEl.classList.add("student-avatar");

    const nameEl = document.createElement("h2");
    nameEl.classList.add("student-name");
    nameEl.appendChild(document.createTextNode(name));

    const pointsEl = document.createElement("h3");
    pointsEl.classList.add("student-points");
    pointsEl.appendChild(document.createTextNode(points));

    box.appendChild(avatarEl);
    box.appendChild(nameEl);
    box.appendChild(pointsEl);

    studentsBox.appendChild(box);
    orderBoxes();
    setNumber();
    setNoContent(studentsBox, studentsWrapper, noStudents);
}

function constructHero(nth) {
    const studentEl = document.querySelector(`[data-student-rank='${nth}']`);
    const studentName = studentEl.querySelector(".student-name").innerText;

    const box = document.createElement("div");
    box.title = studentName;
    box.classList.add("hero-box");

    const avatarEl = document.createElement("img");
    avatarEl.classList.add("hero-avatar");
    const avatar = studentEl.querySelector(".student-avatar").src;
    avatarEl.src = avatar;

    const nameEl = document.createElement("h2");
    nameEl.classList.add("hero-name");
    const name = studentName;
    nameEl.appendChild(document.createTextNode(name));

    const pointsEl = document.createElement("h3");
    pointsEl.classList.add("hero-points");
    const points = studentEl.querySelector(".student-points").innerText;
    pointsEl.appendChild(document.createTextNode(points));

    const medalEl = document.createElement("img");
    medalEl.classList.add("hero-medal");
    medalEl.src = `./images/medals/medal-${nth + 1}.png`;

    box.appendChild(avatarEl);
    box.appendChild(nameEl);
    box.appendChild(pointsEl);
    box.appendChild(medalEl);

    herosBox.appendChild(box);
}
