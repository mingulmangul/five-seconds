import User from "../models/User";
import bcrypt from "bcrypt";

export const getSignUp = (req, res) => {
  return res.render("user/signup", { pageTitle: "Sign Up" });
};

export const postSignUp = async (req, res) => {
  const { email, password, pwConfirm, name, description } = req.body;
  if (password !== pwConfirm) {
    req.flash("signUpError", "The confirmation does not match the password.");
    return res.redirect("/signup");
  }
  try {
    const exists = await User.exists({ email });
    if (exists) {
      req.flash("signUpError", "This email already exists.");
      return res.redirect("/signup");
    }
    await User.create({
      email,
      password,
      name,
      description,
    });
    req.flash("info", "Account creation succeeded!");
    return res.redirect("/login");
  } catch (error) {
    console.log(error);
    req.flash("error", "Error: Please try again.");
    return res.redirect("/signup");
  }
};

export const getLogin = (req, res) => {
  return res.render("user/login", { pageTitle: "Log In" });
};

export const postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existUser = await User.findOne({ email });
    if (!existUser) {
      req.flash("loginError", "This email does not exist.");
      return res.redirect("/login");
    }
    const match = await bcrypt.compare(password, existUser.password);
    if (!match) {
      req.flash("loginError", "The password is incorrect.");
      return res.redirect("/login");
    }
    req.session.loggedIn = true;
    req.session.user = existUser;
    req.flash("info", "Login succeeded!");
    return res.redirect("/");
  } catch (error) {
    req.flash("error", "Error: Please try again.");
    return res.redirect("/login");
  }
};

export const logout = (req, res) => {
  req.session.loggedIn = false;
  delete req.session.user;
  req.flash("info", "Logout secceeded!");
  return res.redirect("/");
};

export const profile = (req, res) => {
  return res.render("user/profile", { pageTitle: "profile owner's name" });
};
export const userEdit = (req, res) => {
  return res.render("user/edit-profile", { pageTitle: "Edit profile" });
};
export const userDelete = (req, res) => {
  return res.send("user deleted!");
};
