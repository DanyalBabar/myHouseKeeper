function isStrongPassword(password) {
  const special = "!#$%^&*";

  if (
    password.toLocaleLowerCase() === password ||
    password.toLocaleUpperCase() === password ||
    !password.match(/\d+/g) ||
    password.length < 8
  ) {
    return false;
  }

  let isSpecial = false;

  for (let i = 0; i < special.length; i++) {
    if (password.includes(special.charAt(i))) {
      isSpecial = true;
    }
  }

  return isSpecial;
}

export function passwordCheck(password) {
  const err =
    "Password must contain at least: \n• 8 characters\n• 1 capital\n• 1 lowercase\n• 1 number\n• 1 special character !#$%^&*";

  if (!isStrongPassword(password)) {
    throw Error(err);
  }
}
