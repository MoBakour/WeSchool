// selectors
const searchInput = document.querySelector(".search-class-input"),
	allClasses = document.querySelectorAll(".classes a"),
	classesBox = document.querySelector(".classes"),
	noClasses = document.querySelector(".no-content");

const createClassOpener = document.querySelector(".create-class-opener"),
	createClassForm = document.querySelector(".create-class-form"),
	addStudentsInput = document.querySelector(".class-students"),
	studentsList = document.querySelector(".class-students-list"),
	createClassBtn = document.querySelector(".create-class-btn"),
	createClassCancel = document.querySelector(".create-class-cancel"),
	darken = document.querySelector(".darken"),
	logoutBtn = document.querySelector(".logout-btn");

const classNameInput = document.querySelector(".class-name"),
	classThemeInput = document.querySelector(".class-theme");
let classStudents = [];

// set initial no content
setNoContent(classesBox, noClasses);

// listen to search
searchInput.addEventListener("input", () => {
	const searchValue = searchInput.value.toLowerCase();

	allClasses.forEach((classBox) => {
		if (
			!classBox.firstElementChild.innerText
				.toLowerCase()
				.includes(searchValue)
		) {
			classBox.classList.add("hidden");
		} else {
			classBox.classList.remove("hidden");
		}
	});
});

// create class form
createClassOpener.addEventListener("click", () => {
	createClassForm.classList.add("active");
	darken.classList.add("active");
});

function closeCreateClass() {
	createClassForm.classList.remove("active");
	darken.classList.remove("active");

	classNameInput.value = "";
	classThemeInput.value = "#00c8a4";
	while (studentsList.firstElementChild) {
		studentsList.firstElementChild.remove();
	}
	classStudents = [];
}

createClassCancel.addEventListener("click", closeCreateClass);
darken.addEventListener("click", closeCreateClass, false);

// add/remove students from create-class form
let counter = 0;
addStudentsInput.addEventListener("keydown", (e) => {
	if (e.key == "Enter") {
		const studentName = addStudentsInput.value.trim();

		const studentElement = document.createElement("li");
		const studentNameNode = document.createTextNode(studentName);

		studentElement.title = addStudentsInput.value;
		studentElement.setAttribute("data-identification", counter.toString());
		studentElement.setAttribute("onclick", "removeStudent(this)");

		studentElement.appendChild(studentNameNode);
		studentsList.appendChild(studentElement);

		classStudents.push([counter, studentName]);
		addStudentsInput.value = "";
		counter++;
	}
});

function removeStudent(self) {
	self.remove();

	classStudents.forEach((student, index) => {
		if (student[0] == self.dataset.identification) {
			classStudents.splice(index, 1);
		}
	});
}

// create class request
let createClassLocked = false;
createClassBtn.addEventListener("click", () => {
	if (createClassLocked) return false;
	createClassLocked = true;

	const classData = {
		className: classNameInput.value,
		classTheme: classThemeInput.value,
	};

	const studentsData = (() => {
		let students = [];

		classStudents.forEach((student) => {
			students.push({ name: student[1] });
		});

		return students;
	})();

	const fetchOptions = {
		method: "POST",
		body: JSON.stringify({ classData, studentsData }),
		headers: { "Content-Type": "application/json" },
	};

	fetch("/class/create", fetchOptions)
		.then((res) => res.json())
		.then((data) => {
			if (data.success) {
				location.href = `/class/${data.classId}`;
			}
			classStudents = [];
		})
		.catch((err) => console.log(err))
		.finally(() => (createClassLocked = false));
});

// logout request
let logoutLock = false;
logoutBtn.addEventListener("click", async () => {
	if (logoutLock) return false;
	logoutLock = true;

	const confirmed = await confirmation({ operation: "logout" });
	if (!confirmed) return (logoutLock = false);

	const fetchOptions = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
	};

	fetch("/user/logout", fetchOptions)
		.then((res) => res.json())
		.then((data) => {
			if (data.success) {
				location.href = "/";
			}
		})
		.catch((err) => console.log(err))
		.finally(() => (logoutLock = false));
});
