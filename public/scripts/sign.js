// action
const signAction = document.documentElement.dataset.signAction;

// general selectors
const passViewSwitch = document.querySelector(".pass-icon");
const signField = document.querySelector(".sign-field");
const errorField = document.querySelector(".error-field");
const genderSelectionBtns = document.querySelectorAll(
    ".gender-field .selection"
);

// inputs
const usernameInput = document.querySelector(".username-input");
const passwordInput = document.querySelector(".password-input");
const repasswordInput = document.querySelector(".repassword-input");
const genderInput = document.querySelector(".gender-input");
const submitBtn = document.querySelector(".submit-btn");

// gender selection
if (signAction == "signup") {
    genderSelectionBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const currentSelection = document.querySelector(
                ".gender-field .selection.active"
            );

            genderInput.value = btn.dataset.genderSelection;
            repasswordInput.focus(); // so that enter keydown form submitting works

            if (currentSelection) currentSelection.classList.remove("active");
            btn.classList.add("active");
        });
    });
}

// send sign request
submitBtn.addEventListener("click", sendSignRequest);
signField.addEventListener("keydown", (e) => {
    if (e.key == "Enter") sendSignRequest();
});

function sendSignRequest() {
    const userData = {
        username: usernameInput.value,
        password: passwordInput.value,
    };

    if (signAction == "signup") {
        userData.repassword = repasswordInput.value;
        userData.gender = genderInput.value;
    }

    const fetchOptions = {
        method: "POST",
        body: JSON.stringify(userData),
        headers: { "Content-Type": "application/json" },
    };

    fetch(`/user/${signAction}`, fetchOptions)
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                location.href = "/";
            } else {
                errorField.innerText = data.error;
            }
        })
        .catch((err) => console.log(err));
}
