const validator = require("validator");

const signupValidation = (data) => {
  console.log(data);
  const { name, email, password, role, gender } = data;
  if ((name && email && password && role && gender) === false) {
    throw new Error(
      "Missing required fields for signup validation" + Object.keys(data)
    );
  } else if (name.length < 3 && name.length > 30) {
    throw new Error("Name must be between 3 and 30 characters long");
  } else if (password.length <= 7) {
    throw new Error("Password must be at least 8 characters long");
  }
};

module.exports = { signupValidation };
