// general selectors
const errorField = document.querySelector(".edit-account-error-field");
const darken = document.querySelector(".darken");

// slider selectors
const slider = document.querySelector("main section");
const slideUsername = document.querySelector(".slide-username");
const slidePassword = document.querySelector(".slide-password");
const slideDeleteAccount = document.querySelector(".delete-account-btn");
const slide = document.querySelectorAll(".slide");

// gender selectors
const genderField = document.querySelector(".edit-gender-field");
const maleBtn = document.querySelector(".edit-gender-male");
const femaleBtn = document.querySelector(".edit-gender-female");

// input selectors
const usernameInput = document.querySelector(".edit-username-input");
const usernamePassInput = document.querySelector(".edit-username-pass-input");
const editGenderInput = document.querySelector(".edit-gender-input");
const saveUsername = document.querySelector(".edit-username-btn");

const passwordPassInput = document.querySelector(".edit-password-pass-input");
const passwordInput = document.querySelector(".edit-password-input");
const repasswordInput = document.querySelector(".edit-password-confirm-input");
const savePassword = document.querySelector(".edit-password-btn");

// delete account selectors
const deleteAccountPopup = document.querySelector(".delete-account-popup");
const deleteAccountPass = document.querySelector(
    ".delete-account-popup .pass-input"
);
const deleteAccountConfirm = document.querySelector(".confirm-box");
const deleteAccountBtn = document.querySelector(".delete-account-submit");

// handle darken
darken.addEventListener("click", () => {
    darken.classList.remove("active");
    deleteAccountPopup.classList.remove("active");
});

// set gender
maleBtn.addEventListener("click", () => {
    genderField.classList.replace("female", "male");
    editGenderInput.value = "male";
});
femaleBtn.addEventListener("click", () => {
    genderField.classList.replace("male", "female");
    editGenderInput.value = "female";
});

// move slider
function setSlider(pos) {
    if (pos > 3 || pos < 1) return false;

    slider.className = "";
    slider.classList.add(`step-${pos}`);
}

slideUsername.addEventListener("click", () => setSlider(1));
slidePassword.addEventListener("click", () => setSlider(3));
slide.forEach((el) =>
    el.addEventListener("click", () => {
        let pos = slider.className.replace("step-", "");
        pos = parseInt(pos);
        el.classList.contains("left") ? pos-- : pos++;

        setSlider(pos);
    })
);

// save username
saveUsername.addEventListener("click", () =>
    fetchRequest(
        {
            username: usernameInput.value,
            password: usernamePassInput.value,
            gender: editGenderInput.value,
        },
        "username"
    )
);

// save password
savePassword.addEventListener("click", () =>
    fetchRequest(
        {
            passwordCheck: passwordPassInput.value,
            password: passwordInput.value,
            repassword: repasswordInput.value,
        },
        "password"
    )
);

// delete account
slideDeleteAccount.addEventListener("click", () => {
    darken.classList.add("active");
    deleteAccountPopup.classList.add("active");
});

let deleteConfirmed = false;
deleteAccountConfirm.addEventListener("click", () => {
    deleteAccountConfirm.classList.toggle("checked");
    deleteAccountBtn.classList.toggle("active");
    deleteConfirmed = !deleteConfirmed;
});

let deleteAccountLock = false;
deleteAccountBtn.addEventListener("click", () => {
    if (deleteAccountLock) return false;
    if (!deleteConfirmed) return false;
    deleteAccountLock = true;

    const fetchOptions = {
        method: "DELETE",
        body: JSON.stringify({
            password: deleteAccountPass.value,
        }),
        headers: { "Content-Type": "application/json" },
    };

    fetch("/user/delete", fetchOptions)
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                location.href = "/";
            } else {
                darken.click();
                errorField.innerText = data.error;

                deleteAccountConfirm.classList.remove("checked");
                deleteAccountBtn.classList.remove("active");
                deleteConfirmed = false;
            }
        })
        .catch((err) => console.log(err))
        .finally(() => (deleteAccountLock = false));
});

// fetch function
let fetchLock = false;
function fetchRequest(body, action) {
    if (fetchLock) return false;
    fetchLock = true;

    const fetchOptions = {
        method: "PATCH",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
    };

    fetch(`/user/edit/${action}`, fetchOptions)
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                location.reload();
            } else {
                errorField.innerText = data.error;
            }
        })
        .catch((err) => console.log(err))
        .finally(() => (fetchLock = false));
}
