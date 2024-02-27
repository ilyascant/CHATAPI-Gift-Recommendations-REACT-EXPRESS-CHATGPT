module.exports = isLoggedIn = (req, res, next) => {
  const password = req.body?.password;
  if (password) {
    if (password === process.env.PASSWORD) {
      return next();
    } else return next(new Error("Wrong Password"));
  } else return next(new Error("Couldn't get password"));
};
