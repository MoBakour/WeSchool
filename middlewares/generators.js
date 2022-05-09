// names & avatars
const classNames = [
    "Future Leaders",
    "The Champions",
    "Smart Heros",
    "Strong Warriors",
];
const maleAvatars = ["ahmad", "amro", "elias", "fahad", "saleem"];
const femaleAvatars = ["sara", "fatima", "aya", "yara"];

// generators
const getClassName = () => {
    return classNames[Math.floor(Math.random() * classNames.length)];
};
const getAvatar = (gender) => {
    return gender == "male"
        ? maleAvatars[Math.floor(Math.random() * maleAvatars.length)]
        : femaleAvatars[Math.floor(Math.random() * femaleAvatars.length)];
};

// export generators
export { getClassName, getAvatar };
