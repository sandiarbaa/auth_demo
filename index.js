// Setup library
const express = require("express");
const app = express();
app.set("view engine", "ejs");
app.set("views", "views"); // param 1: untuk menentukan views nya, param 2: direktori foler untuk menyimpan views nya

// Model
const User = require("./models/user");

// Route
app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/admin", (req, res) => {
  res.send("Halaman admin hanya bisa di akses jika kamu sudah login!");
});

app.listen(3000, () => {
  console.log(`App listening on port http://localhost:3000`);
});
