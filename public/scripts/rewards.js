// selectors
const rewardsList = document.querySelector(".rewards .top");
const rewardInput = document.querySelector(".reward-input");
const rewardSubmit = document.querySelector(".reward-submit");
const roller = document.querySelector(".roller");
const rollerContainer = document.querySelector(".roller-container");
const mainContainer = document.querySelector(".rewards main");
const listToggler = document.querySelector(".list-toggler");
const mouseTip = document.querySelector(".mouse-tip");

rewardInput.focus();

// reward constructor
function constructReward() {
    const rewardName = rewardInput.value.trim();
    rewardInput.value = "";
    rewardInput.focus();

    const allRewards = [...document.querySelectorAll(".reward p")];
    const exists = allRewards.some((reward) => reward.innerText == rewardName);

    if (!rewardName || exists) return false;

    // construct list item
    const listItem = document.createElement("div");
    listItem.classList.add("reward");

    const listItemContent = document.createElement("p");
    listItemContent.title = rewardName;
    listItemContent.appendChild(document.createTextNode(rewardName));

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete");
    deleteButton.addEventListener("click", () => {
        deleteReward(deleteButton.parentElement, rewardName);
    });
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash");
    deleteButton.appendChild(deleteIcon);

    listItem.appendChild(listItemContent);
    listItem.appendChild(deleteButton);
    rewardsList.appendChild(listItem);

    // construct roller item
    const arm = document.createElement("div");
    arm.classList.add("arm");

    const box = document.createElement("div");
    box.classList.add("box");

    const boxContent = document.createElement("p");
    boxContent.appendChild(document.createTextNode(rewardName));

    box.appendChild(boxContent);
    arm.appendChild(box);
    roller.appendChild(arm);

    positionArms();
    handleRollerSpace();
}

rewardSubmit.addEventListener("click", constructReward);
rewardInput.addEventListener("keydown", (e) => {
    if (e.key == "Enter") constructReward();
});

// reward remover
function deleteReward(listItem, rewardName) {
    [...document.querySelectorAll(".arm")]
        .filter((arm) => arm.querySelector("p").textContent == rewardName)
        .forEach((arm) => arm.remove());

    listItem.remove();

    positionArms();
    handleRollerSpace();
}

// handle roller space
function handleRollerSpace() {
    const arms = document.querySelectorAll(".arm");

    if (arms.length < 1) {
        rollerContainer.classList.add("empty");
    } else {
        rollerContainer.classList.remove("empty");
    }
}
handleRollerSpace();

// roller
const slowTransition = "transform 6s ease";
const fastTransition = "transform 0.3s ease";

function positionArms() {
    const arms = roller.querySelectorAll(".arm");
    const boxes = roller.querySelectorAll(".box");
    const ratio = 360 / arms.length;

    setTransition(fastTransition);

    arms.forEach((arm, index) => {
        arm.style.setProperty("--rotation", `${ratio * index}deg`);
        boxes[index].style.setProperty("--rotation", `-${ratio * index}deg`);
    });
}

let turn = true;
function roll() {
    const arms = roller.querySelectorAll(".arm");
    const boxes = roller.querySelectorAll(".box");
    const ratio = 360 / arms.length;

    let positions = [];

    for (let i = 0; i < arms.length; i++) {
        positions.push(ratio * i + 3600);
    }
    let chosen = positions[Math.floor(Math.random() * positions.length)];

    setTransition(slowTransition);
    arms.forEach((arm, index) => {
        arm.style.setProperty(
            "--rotation",
            `${turn ? "" : "-"}${chosen + ratio * index}deg`
        );
        boxes[index].style.setProperty(
            "--rotation",
            `${turn ? "-" : ""}${chosen + ratio * index}deg`
        );
    });

    turn = !turn;
}

rollerContainer.addEventListener("click", roll);

// set transitions
function setTransition(transition) {
    const arms = document.querySelectorAll(".arm");
    const boxes = document.querySelectorAll(".box");

    for (let i = 0; i < arms.length; i++) {
        arms[i].style.transition = transition;
        boxes[i].style.transition = transition;
    }
}

// toggle rewards list on mobile devices
window.addEventListener("keydown", (e) => {
    if (e.key == "Tab") {
        toggleList(e);
    }
});
listToggler.addEventListener("click", toggleList);

function toggleList(e) {
    if (e) {
        e.preventDefault();
    }
    listToggler.classList.toggle("active");
    mainContainer.classList.toggle("active");
    rewardInput.focus();
}

// handle mouse tip
window.addEventListener("mousemove", (e) => {
    mouseTip.style.top = e.clientY + "px";
    mouseTip.style.left = e.clientX + "px";
});
