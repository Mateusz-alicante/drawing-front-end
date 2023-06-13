export function usernameExists(username, User) {
  return User.findOne({ username: username });
}

export function emailExists(email, User) {
  return User.findOne({ email: email });
}

export function lengthValidation(text, min, max) {
  if (text.length < min || text.length > max) {
    return false;
  }
  return true;
}
