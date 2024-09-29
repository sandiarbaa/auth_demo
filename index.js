// Setup library
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Configuration
app.set("view engine", "ejs");
app.set("views", "views"); // param 1: untuk menentukan views nya, param 2: direktori foler untuk menyimpan views nya
app.use(express.urlencoded({ extended: true }));

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

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
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

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }); // find user

  // validation
  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      res.redirect("/admin");
    } else {
      res.redirect("/login");
    }
  } else {
    res.redirect("/login");
  }
});

app.get("/admin", (req, res) => {
  res.send("Halaman admin hanya bisa di akses jika kamu sudah login!");
});

app.listen(3000, () => {
  console.log(`App listening on port http://localhost:3000`);
});
