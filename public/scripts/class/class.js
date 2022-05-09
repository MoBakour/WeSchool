// initial calls
setNoContent(studentsBox, studentsWrapper, noStudents);
orderBoxes();

// set colors
const colors = HEXtoRGB(currentClassTheme);
const txtColor = textColor(colors[0], colors[1], colors[2]);

document.documentElement.style.color = txtColor;
document.querySelector("header.hero-header .account .user p").style.color =
    txtColor;
document.body.style.backgroundColor = `rgba(${colors[0]}, ${colors[1]}, ${colors[2]}, 0.4)`;

// handle tabs
studentsTabBtn.addEventListener("click", () => {
    tabLine.classList.remove("active");
    studentsWrapper.classList.remove("onheros");
});
herosTabBtn.addEventListener("click", () => {
    tabLine.classList.add("active");
    studentsWrapper.classList.add("onheros");
});

// darken
darken.addEventListener("click", () => {
    darken.classList.remove("active");
    studentPopup.classList.remove("active", "onsettings");
    addStudentPopup.classList.remove("active");
    editClassPopup.classList.remove("active");

    pointsInput.value = "";
    addStudentName.value = "";
    addStudentGender.value = "";

    newClassName.value = currentClassName;
    newClassTheme.value = currentClassTheme;

    addStudentMale.classList.remove("active");
    addStudentFemale.classList.remove("active");
});

// handle student popup
students.forEach((student) => {
    student.addEventListener("click", () => {
        openStudentPopup(student);
    });
});
studentCardNavBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
        studentPopup.classList.toggle("onsettings");
    });
});
// settings set gender
setMaleBtn.addEventListener("click", () => {
    resetGender("male");
});
setFemaleBtn.addEventListener("click", () => {
    resetGender("female");
});
// update student
let updateStudentLock = false;
setSave.addEventListener("click", () => updateStudent(updateStudentLock));

// handle points input
let updatePointsLock = false;
pointsInput.addEventListener("keydown", (e) => {
    const validKeys = "1234567890";
    if (!validKeys.includes(e.key) && e.key !== "Backspace") e.preventDefault();
});
pointsInc.addEventListener("click", () =>
    updatePoints(updatePointsLock, true, parseInt(pointsInput.value))
);
pointsDec.addEventListener("click", () =>
    updatePoints(updatePointsLock, false, parseInt(pointsInput.value))
);

// handle create student popup
addStudentBtn.addEventListener("click", () => {
    darken.classList.add("active");
    addStudentPopup.classList.add("active");
});
addStudentMale.addEventListener("click", () => {
    addStudentMale.classList.add("active");
    addStudentFemale.classList.remove("active");
    addStudentGender.value = "male";
});
addStudentFemale.addEventListener("click", () => {
    addStudentFemale.classList.add("active");
    addStudentMale.classList.remove("active");
    addStudentGender.value = "female";
});

// handle edit class popup
editClassBtn.addEventListener("click", () => {
    darken.classList.add("active");
    editClassPopup.classList.add("active");
});

// create student
let addStudentLock = false;
addStudentSubmit.addEventListener("click", () => createStudent(addStudentLock));

// delete student
let deleteStudentLock = false;
setDelete.addEventListener("click", () => deleteStudent(deleteStudentLock));

// udpate class
let updateClassLock = false;
editClassSubmit.addEventListener("click", () => updateClass(updateClassLock));

// delete class
let deleteClassLock = false;
deleteClassBtn.addEventListener("click", () => deleteClass(deleteClassLock));
