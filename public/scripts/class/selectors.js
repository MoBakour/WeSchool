// selectors

// class credentials
const currentClassId = document.documentElement.dataset.classId;
const currentClassName = document.documentElement.dataset.className;
const currentClassTheme = document.documentElement.dataset.classTheme;
let currentStudent;

// general selectors
const studentsWrapper = document.querySelector(".class-students");
const studentsBox = document.querySelector(".class-students-main");
const herosBox = document.querySelector(".class-students-heros");
const students = document.querySelectorAll(".student");
const darken = document.querySelector(".darken");
const studentCardNavBtn = document.querySelectorAll(".student-card-nav-btn");
const noStudents = document.querySelector(".no-content");

// tabs buttons
const studentsTabBtn = document.querySelector(".students-tab-btn");
const herosTabBtn = document.querySelector(".heros-tab-btn");
const tabLine = document.querySelector(".tab-line");

// student popup selectors
const studentPopup = document.querySelector(".student-popup");
const studentAvatar = document.querySelector(".student-popup .student-avatar");
const studentName = document.querySelector(".student-popup .student-name");
const studentPoints = document.querySelector(".student-popup .student-points");

// student points input selectors
const pointsInput = document.querySelector(".points-input");
const pointsInc = document.querySelector(".points-inc");
const pointsDec = document.querySelector(".points-dec");

// student settings selectors
const setName = document.querySelector(".student-name-input");
const setGender = document.querySelector(".student-gender-input");
const setMaleBtn = document.querySelector(".settings .male-btn");
const setFemaleBtn = document.querySelector(".settings .female-btn");
const setSave = document.querySelector(".settings .save-btn");
const setDelete = document.querySelector(".delete-student-btn");

// header buttons
const addStudentBtn = document.querySelector(".add-student-btn");
const editClassBtn = document.querySelector(".edit-class-btn");
const deleteClassBtn = document.querySelector(".delete-class-btn");

// add student selectors
const addStudentPopup = document.querySelector(".new-student");
const addStudentName = document.querySelector(".new-student .new-name");
const addStudentGender = document.querySelector(".new-student .new-gender");
const addStudentMale = document.querySelector(".new-gender-selection-male");
const addStudentFemale = document.querySelector(".new-gender-selection-female");
const addStudentSubmit = document.querySelector(".new-student .new-add");

// edit class selectors
const editClassPopup = document.querySelector(".edit-class");
const editClassSubmit = document.querySelector(".edit-class-submit");
const newClassName = document.querySelector(".edit-name");
const newClassTheme = document.querySelector(".edit-theme");
