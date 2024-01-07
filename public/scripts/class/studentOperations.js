// create student operation
const createStudent = (lock) => {
    if (lock) return false;
    lock = true;

    const fetchOptions = {
        method: "POST",
        body: JSON.stringify({
            classId: currentClassId,
            className: currentClassName,
            studentName: addStudentName.value,
            studentGender: addStudentGender.value,
        }),
        headers: { "Content-Type": "application/json" },
    };

    fetch("/student/create", fetchOptions)
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                constructStudent(data.student);
                addStudentName.value = "";
            }
        })
        .catch((err) => console.log(err))
        .finally(() => (lock = false));
};

// update student operation
const updateStudent = (lock) => {
    if (lock) return false;
    lock = true;

    const name = setName.value;
    const gender = setGender.value;

    const fetchOptions = {
        method: "PATCH",
        body: JSON.stringify({
            student: currentStudent,
            name,
            gender,
        }),
        headers: { "Content-Type": "application/json" },
    };

    fetch("/student/edit", fetchOptions)
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                let { name, gender, newAvatar } = data;
                newAvatar = `./images/characters/${newAvatar}.png`;

                const studentBox = studentsBox.querySelector(
                    `[data-student-id='${currentStudent}']`
                );

                studentName.innerText = name;
                studentAvatar.src = newAvatar;

                studentBox.querySelector(".student-name").innerText = name;
                studentBox.querySelector(".student-avatar").src = newAvatar;
                studentBox.title = name;

                resetGender(gender);
                document
                    .querySelector(`[data-student-id='${currentStudent}']`)
                    .setAttribute("data-student-gender", gender);
                studentBox.style.backgroundColor =
                    gender == "male" ? "#60cfff" : "#ffa0f0";
                // colors form ../styles/sass/abstracts/variables.scss

                setSave.classList.add("saved");
                setSave.innerText = "Saved!";
                setTimeout(() => {
                    setSave.classList.remove("saved");
                    setSave.innerText = "Save";
                }, 1000);

                constructHeroCall();
            }
        })
        .catch((err) => console.log(err))
        .finally(() => (lock = false));
};

// update points operation
const updatePoints = (lock, increment, value) => {
    if (lock) return false;
    value = 5;
    if (!value || isNaN(value)) return false;

    lock = true;

    const fetchOptions = {
        method: "PATCH",
        body: JSON.stringify({ increment, value, student: currentStudent }),
        headers: { "Content-Type": "application/json" },
    };

    fetch("/student/points", fetchOptions)
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                const newPoints =
                    parseInt(studentPoints.innerText) + data.value;

                studentPoints.innerText = newPoints;

                const studentBox = document.querySelector(
                    `[data-student-id='${currentStudent}']`
                );
                studentBox.querySelector(".student-points").innerText =
                    newPoints;

                orderBoxes();
            }
        })
        .catch((err) => console.log(err))
        .finally(() => (lock = false));
};

// delete student operation
const deleteStudent = async (lock) => {
    if (lock) return false;
    lock = true;

    const confirmed = await confirmation({
        operation: "delete-student",
        studentName: document.querySelector(
            `[data-student-id="${currentStudent}"] .student-name`
        ).innerText,
        className: currentClassName,
    });
    if (!confirmed) return (lock = false);

    const fetchOptions = {
        method: "DELETE",
        body: JSON.stringify({ student: currentStudent }),
        headers: { "Content-Type": "application/json" },
    };

    fetch("/student/delete", fetchOptions)
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                document
                    .querySelector(`[data-student-id='${currentStudent}']`)
                    .remove();
                darken.click();
                setNoContent(studentsBox, studentsWrapper, noStudents);
                setNumber();
                orderBoxes();
            }
        })
        .catch((err) => console.log(err))
        .finally(() => (lock = false));
};
