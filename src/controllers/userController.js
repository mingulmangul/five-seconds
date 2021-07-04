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
    req.session.loggedInUser = existUser;
    req.flash("info", "Login succeeded!");
    return res.redirect("/");
  } catch (error) {
    req.flash("error", "Error: Please try again.");
    return res.redirect("/login");
  }
};

export const logout = (req, res) => {
  req.session.loggedIn = false;
  delete req.session.loggedInUser;
  req.flash("info", "Logout secceeded!");
  return res.redirect("/");
};

export const profile = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).populate("videos").populate({
      path: "owner",
      select: "avatarUrl name",
    });
    if (!user) {
      req.flash("error", "The user does not exist.");
      return res.redirect("/");
    }
    return res.render("user/profile", {
      pageTitle: user.name,
      user,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Cannot access");
    return res.redirect("/");
  }
};

export const getUserEdit = async (req, res) => {
  const {
    session: { loggedInUser },
    params: { id },
  } = req;
  if (loggedInUser._id !== id) {
    req.flash("error", "Cannot access");
    return res.redirect("/users/" + id);
  }
  return res.render("user/edit-profile", { pageTitle: "Edit profile" });
};

export const postUserEdit = async (req, res) => {
  const {
    session: { loggedInUser },
    params: { id },
    body: { name, description },
    file,
  } = req;
  if (loggedInUser._id !== id) {
    req.flash("error", "Cannot access");
    return res.redirect("/users/" + id);
  }
  try {
    await User.findByIdAndUpdate(id, {
      name,
      description,
      avatarUrl: file ? file.path : loggedInUser.avatarUrl,
    });
    req.flash("info", "Profile Updated!");
    return res.redirect("/users/" + loggedInUser._id);
  } catch (error) {
    console.log(error);
    req.flash("error", "Error: Please try again.");
    return res.redirect(`/users/${loggedInUser._id}/edit`);
  }
};

export const userDelete = (req, res) => {
  return res.send("user deleted!");
};
