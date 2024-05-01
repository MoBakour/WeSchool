export default (
    { username, password, repassword, gender },
    specific = null
) => {
    // specific
    switch (specific) {
        case "username":
            password = "XXXXXX";
            repassword = "XXXXXX";
            break;
        case "password":
            username = "XXXXXX";
            gender = "male";
            break;
        default:
            null;
    }

    // error string & valid chars
    let error = "";
    const validChars = "qwertyuiopasdfghjklzxcvbnm1234567890_";
    // ^^ I know I could use RegEx for that, but yeh.. all works fine

    // validate gender
    if (gender !== "male" && gender !== "female")
        error = "Incorrect gender specification";
    if (!gender) error = "Please specify your gender";

    // validate repassword
    if (password !== repassword) error = "Incorrect password confirmation";

    // validate password
    if (password.startsWith(" ") || password.endsWith(" "))
        error = "Password cannot start or end with an empty space";
    if (password.length > 300)
        error = "Password maximum length is 300 characters";
    if (password.length < 6) error = "Password minimum length is 6 characters";
    if (!password) error = "Please enter a password";

    // validate username
    for (let char of username) {
        if (!validChars.includes(char.toLowerCase()))
            error =
                "Use only letters, numbers, and underscores in your username";
    }
    if (username.length > 30)
        error = "Username maximum length is 30 characters";
    if (!username) error = "Please enter a username";

    // return error
    return error;
};
