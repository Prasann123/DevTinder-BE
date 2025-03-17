const validate = require("validator");
function validateUser(UserData) {
  const { firstName, lastName, email, password } = UserData;
  if (!firstName || !lastName) {
    throw new Error("First Name and Last Name are required");
  } else if (!validate.isEmail(email)) {
    throw new Error("Email is invalid");
  } else if (!validate.isStrongPassword(password)) {
    throw new Error("Password is not strong enough");
  }
}


const userUpdateValidation = (data) => {
const validateFields = ["firstName", "lastName","email","gender","skills","age","ImageUrl"];
const keys = Object.keys(data).every((key) => validateFields.includes(key));

if(!keys)
{
    return false;
}
return true;
}

module.exports = {validateUser,userUpdateValidation};
