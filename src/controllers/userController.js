import User from "../models/User";

export const getJoin = (req, res) => {
  return res.render("user/join", { pageTitle: "Join" });
};

export const postJoin = async (req, res) => {
  const { email, password, pwConfirm, name, description } = req.body;
  if (password !== pwConfirm) {
    req.flash("joinError", "Passwords didn't match.");
    return res.redirect("/join");
  }
  try {
    const emailExists = await User.exists({ email });
    if (emailExists) {
      req.flash("joinError", "This email already exists.");
      return res.redirect("/join");
    }
    const nameExists = await User.exists({ name });
    if (nameExists) {
      req.flash("joinError", "This name already exists.");
      return res.redirect("/join");
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
    return res.redirect("/join");
  }
};

export const login = (req, res) => {
  return res.render("user/login", { pageTitle: "Login" });
};

export const logout = (req, res) => {
  return res.send("logout!");
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
