// Text Color
const textColor = (r, g, b) => {
    if (r * 0.5 + g * 0.5 + b * 0.5 > 186) return "#000000";
    else return "#ffffff";
};

// HEX color to HSL
const HEXtoHSL = (hex) => {
    hex = hex.replace(/#/g, "");

    if (hex.length === 3) {
        hex = hex
            .split("")
            .map(function (hex) {
                return hex + hex;
            })
            .join("");
    }

    let result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})[\da-z]{0,0}$/i.exec(
        hex
    );

    if (!result) {
        return null;
    }

    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);

    const txtColor = textColor(r, g, b);

    (r /= 255), (g /= 255), (b /= 255);

    let max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    let h,
        s,
        l = (max + min) / 2;

    if (max == min) {
        h = s = 0;
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    s = s * 100;
    s = Math.round(s);
    l = l * 100;
    l = Math.round(l);
    h = Math.round(360 * h);

    return [h, s, l, txtColor];
};

// HEX to RGB
const HEXtoRGB = (hex) => {
    hex = hex.replaceAll("#", "");
    const colorChunks = [];

    for (let i = 0; i < 6; i += 2) {
        colorChunks.push(hex.substring(i, i + 2));
    }

    return colorChunks.map((color) => {
        return parseInt(color, 16);
    });
};

// date formatter
const dateFormatter = (date, format) => {
    date = new Date(date);
    if (!format) format = "overview";

    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    const year = date.getFullYear().toString(),
        month = months[date.getMonth()],
        day = date.getDate().toString();

    const hour = (() => {
            let h = date.getHours();
            if (h == 0) return 12;
            else if (h > 12) return h - 12;
            else return h;
        })(),
        minute = date.getMinutes().toString().padStart(2, "0");

    const overview = `${day}${
        day.endsWith("1")
            ? "st"
            : day.endsWith("2")
            ? "nd"
            : day.endsWith("3")
            ? "rd"
            : "th"
    } ${month}, ${year}`;

    const outputs = {
        overview,
        full: `
            ${overview} at ${hour}:${minute} ${
            date.getHours() > 12 ? "PM" : "AM"
        }
        `,
    };

    return format == "full"
        ? outputs.full
        : format == "overview"
        ? outputs.overview
        : null;
};

// number formatter
const numberFormatter = (number) => {};

// format page content
const allDates = document.querySelectorAll(".format-date");
allDates.forEach((el) => {
    const date = el.dataset.formatDate;

    el.innerText = dateFormatter(date, "overview");
    el.title = dateFormatter(date, "full");
});

const allNumbers = document.querySelectorAll(".format-number");
allNumbers.forEach((el) => {
    el.innerText = numberFormatter(el.dataset.formatNumber);
});

// set noContent
function setNoContent(check, target, noContent) {
    if (arguments.length < 3) {
        noContent = target;
        target = check;
    }

    if (check.childElementCount < 1) {
        target.classList.add("empty");
        noContent.classList.add("active");
    } else {
        target.classList.remove("empty");
        noContent.classList.remove("active");
    }
}

// show password
let visible = false;
const passFields = document.querySelectorAll(".pass-field");
if (passFields) {
    passFields.forEach((field) => {
        const icon = field.querySelector(".pass-icon");
        const inputs = field.querySelectorAll(".pass-input");

        let visible = icon.dataset.passShown;
        icon.addEventListener("click", () => {
            let type = visible ? "password" : "text";
            icon.classList.toggle("active");
            inputs.forEach((inp) => (inp.type = type));
            visible = !visible;
        });
    });
}

// confirmation function
const confirmationDiv = document.querySelector(".confirmation");
const confirmationMsg = document.querySelector(".confirmation .message");
const confirmBtn = document.querySelector(".confirmation .confirm");
const deconfirmBtn = document.querySelector(".confirmation .deconfirm");

function confirmation(options) {
    let message;

    switch (options.operation) {
        case "delete-student": {
            const { studentName, className } = options;
            message = `Are you sure you want to remove ${studentName} from ${className}?`;
            break;
        }
        case "delete-class": {
            const { className } = options;
            message = `Are you sure you want to delete ${className}?`;
            break;
        }
        case "logout": {
            message = "Are you sure you want to logout?";
        }
    }

    confirmationMsg.innerText = message;
    confirmationDiv.classList.add("active");

    const promise = new Promise((res) => {
        confirmBtn.onclick = () => {
            confirmationDiv.classList.remove("active");
            res(true);
        };
        deconfirmBtn.onclick = () => {
            confirmationDiv.classList.remove("active");
            res(false);
        };
    });

    return promise;
}
