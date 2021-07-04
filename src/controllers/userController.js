import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

const isHeroku = process.env.NODE_ENV === "production";
const errorMsg = "Error: Please try again.";

export const getSignUp = (req, res) => {
  return res.render("user/signup", { pageTitle: "Sign Up" });
};

export const postSignUp = async (req, res) => {
  const { email, password, pwConfirm, name, description } = req.body;
  if (password !== pwConfirm) {
    req.flash("formError", "The confirmation does not match the password.");
    return res.status(400).redirect("/signup");
  }
  try {
    const exists = await User.exists({ email });
    if (exists) {
      req.flash("formError", "This email already exists.");
      return res.status(400).redirect("/signup");
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
    req.flash("error", errorMsg);
    return res.status(400).redirect("/signup");
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
      req.flash("formError", "This email does not exist.");
      return res.status(400).redirect("/login");
    } else if (existUser.socialLogin) {
      req.flash("formError", "Please use social login.");
      return res.status(400).redirect("/login");
    }
    const match = await bcrypt.compare(password, existUser.password);
    if (!match) {
      req.flash("formError", "The password is incorrect.");
      return res.status(400).redirect("/login");
    }
    req.session.loggedIn = true;
    req.session.loggedInUser = existUser;
    req.flash("info", "Login succeeded!");
    return res.redirect("/");
  } catch (error) {
    req.flash("error", errorMsg);
    return res.status(400).redirect("/login");
  }
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_ID,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_ID,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  try {
    const tokenRequest = await (
      await fetch(finalUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      })
    ).json();
    const { access_token } = tokenRequest;
    if (!access_token) {
      req.flash("error", errorMsg);
      return res.status(400).redirect("/login");
    }

    const apiUrl = "https://api.github.com/user";
    const userData = await (
      await fetch(apiUrl, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.verified === true && email.primary === true
    );
    if (!emailObj) {
      req.flash("error", "Error: Social login can't be used.");
      return res.status(400).redirect("/login");
    }

    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        email: emailObj.email,
        name: userData.name ? userData.name : "Unknown",
        avatarUrl: userData.avatar_url ? userData.avatar_url : null,
        socialLogin: true,
      });
    }
    req.session.loggedIn = true;
    req.session.loggedInUser = user;
    req.flash("info", "Login succeeded!");
    return res.redirect("/");
  } catch (error) {
    req.flash("error", errorMsg);
    return res.status(400).redirect("/login");
  }
};

export const logout = (req, res) => {
  req.session.loggedIn = false;
  delete req.session.loggedInUser;
  return res.redirect("/");
};

export const profile = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).populate({
      path: "videos",
      populate: {
        path: "owner",
        select: "avatarUrl name",
      },
    });
    if (!user) {
      req.flash("error", "Error: The user does not exist.");
      return res.status(404).redirect("/");
    }
    return res.render("user/profile", {
      pageTitle: user.name,
      user,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", errorMsg);
    return res.status(400).redirect("/");
  }
};

export const getUserEdit = async (req, res) => {
  return res.render("user/edit-profile", { pageTitle: "Edit profile" });
};

export const postUserEdit = async (req, res) => {
  const {
    session: { loggedInUser },
    body: { name, description },
    file,
  } = req;
  try {
    const user = await User.findByIdAndUpdate(
      loggedInUser._id,
      {
        name,
        description,
        avatarUrl: file
          ? isHeroku
            ? file.location
            : file.path
          : loggedInUser.avatarUrl,
      },
      {
        new: true,
      }
    );
    req.session.loggedInUser = user;
    req.flash("info", "Profile updated!");
    return res.redirect("/users/" + loggedInUser._id);
  } catch (error) {
    console.log(error);
    req.flash("error", errorMsg);
    return res.status(400).redirect(`/users/${loggedInUser._id}/edit`);
  }
};

export const getChangePassword = (req, res) => {
  return res.render("user/change-password", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
  const {
    body: { currentPw, newPw, confirmPw },
    params: { id },
  } = req;
  if (newPw !== confirmPw) {
    req.flash("formError", "The confirmation does not match the password.");
    return res.status(400).redirect(`/users/${id}/change-password`);
  }
  try {
    const user = await User.findById(id);
    const match = await bcrypt.compare(currentPw, user.password);
    if (!match) {
      req.flash("formError", "The current password is incorrect.");
      return res.status(400).redirect(`/users/${id}/change-password`);
    }
    user.password = newPw;
    await user.save();

    req.flash("info", "Password updated!");
    return res.redirect("/logout");
  } catch (error) {
    console.log(error);
    req.flash("error", errorMsg);
    return res.status(400).redirect(`/users/${id}/change-password`);
  }
};
