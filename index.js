// Setup library
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");

// Configuration
app.set("view engine", "ejs");
app.set("views", "views"); // param 1: untuk menentukan views nya, param 2: direktori foler untuk menyimpan views nya
app.use(express.urlencoded({ extended: true })); // catch req body
app.use(
  session({
    secret: "notasecret",
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware Auth
const auth = (req, res, next) => {
  if (!req.session.user_id) {
    return res.redirect("/login");
  }
  next();
};

const noAuth = (req, res, next) => {
  if (req.session.user_id) {
    return res.redirect("/admin");
  }
  next();
};

// Connection
mongoose
  .connect("mongodb://127.0.0.1/auth_demo")
  .then((result) => {
    console.log("connect to mongodb");
  })
  .catch((err) => {
    console.error(err);
  });

// Model
const User = require("./models/user");

// Route
app.get("/", (req, res) => {
  res.send("homepage");
});

app.get("/register", noAuth, (req, res) => {
  res.render("register");
});

app.post("/register", noAuth, async (req, res) => {
  // res.send(req.body);
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = new User({
    username,
    password: hashedPassword,
  });
  await user.save();
  res.redirect("/");
});

app.get("/login", noAuth, (req, res) => {
  res.render("login");
});

app.post("/login", noAuth, async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }); // find user

  // validation
  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      req.session.user_id = user._id;
      res.redirect("/admin");
    } else {
      res.redirect("/login");
    }
  } else {
    res.redirect("/login");
  }
});

app.post("/logout", auth, (req, res) => {
  // req.session.user_id = null; // spesifically for 1 session
  // for all sesion exist, so be careful
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

app.get("/admin", auth, (req, res) => {
  res.render("admin");
});

app.get("/profile/settings", auth, (req, res) => {
  res.send("Profile Settings: " + req.session.user_id);
});

app.listen(3000, () => {
  console.log(`App listening on port http://localhost:3000`);
});
