const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
});

// untuk proses login
userSchema.statics.findByCredentials = async function (username, password) {
  const user = await this.findOne({ username });
  // if (!user) {
  //   throw new Error("Invalid username or password!");
  // }

  const isMatch = await bcrypt.compare(password, user.password);
  // if (!isMatch) {
  //   throw new Error("Invalid username or password!");
  // }
  // return user;
  return isMatch ? user : false;
};

// untuk proses registrasi
// saat proses save di jalankan, format passwordnya sudah langsung format hash
// jadi proses hashing nya di sini bukan di index.js
userSchema.pre("save", async function (next) {
  // method isModified ini nilai baliknya true
  // kalau data passwordnya tidak diperbarui, maka jalankan ini..
  if (!this.isModified("password")) {
    return next();
  }

  // kalau diperbarui lanjut ke sini
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
module.exports = mongoose.model("User", userSchema);
