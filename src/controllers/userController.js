export const join = (req, res) => {
  return res.render("user/join", { pageTitle: "Join" });
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
