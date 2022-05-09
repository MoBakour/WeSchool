// order boxes
function orderBoxes() {
    const allBoxes = document.querySelectorAll(".student");
    const boxesOrder = [];

    allBoxes.forEach((box) => {
        let boxId = box.dataset.studentId;
        let boxVal = box.querySelector(".student-points").innerText;

        boxVal = parseInt(boxVal);

        boxesOrder.push([boxId, boxVal]);
    });

    boxesOrder.sort((a, b) => {
        return b[1] - a[1];
    });

    boxesOrder.forEach((box, index) => {
        const element = document.querySelector(`[data-student-id='${box[0]}']`);
        element.style.order = index;
        element.setAttribute("data-student-rank", index);
    });

    constructHeroCall();
}

// construct hero caller
function constructHeroCall() {
    // clear heros
    while (herosBox.firstChild) {
        herosBox.firstChild.remove();
    }

    // call hero constructor
    const studentsCount = studentsBox.childElementCount;
    const nth = studentsCount > 3 ? 3 : studentsCount;
    for (let i = 0; i < nth; i++) {
        constructHero(i);
    }
}

// set number
function setNumber() {
    const numberElement = document.querySelector(".students-number");
    const currentNumber = document.querySelectorAll(".student").length;

    numberElement.innerText = currentNumber;
}

// reset gender
function resetGender(gender) {
    if (gender == "male") {
        setMaleBtn.classList.add("inactive");
        setFemaleBtn.classList.remove("inactive");
    } else {
        setMaleBtn.classList.remove("inactive");
        setFemaleBtn.classList.add("inactive");
    }
    setGender.value = gender;
}

// open student popup
function openStudentPopup(student) {
    // set current student
    currentStudent = student.dataset.studentId;

    // toggle divs
    darken.classList.toggle("active");
    studentPopup.classList.toggle("active");

    // get stuff
    const getStudentName = student.querySelector(".student-name").innerText;
    const getStudentGender = student.dataset.studentGender;
    const getStudentAvatar = student.querySelector(".student-avatar").src;
    const getStudentPoints = student.querySelector(".student-points").innerText;

    // main
    studentAvatar.src = getStudentAvatar;
    studentName.innerText = getStudentName;
    studentPoints.innerText = getStudentPoints;

    // settings
    setName.value = getStudentName;
    resetGender(getStudentGender);
}
