const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
//Packages--------------------
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");

//User Schema--------------------
var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 40,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
    },
    username: {
      type: String,
      unique: true,
      trim: true,
    },
    profile_photo: {
      data: Buffer,
      contentType: String,
    },
    userinfo: {
      type: String,
      trim: true,
    },
    followers: [{ type: ObjectId, ref: "User", default: [] }],
    following: [{ type: ObjectId, ref: "User", default: [] }],
    encry_password: {
      type: String,
      required: true,
    },
    salt: String,
    role: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

//Creating a password field in schema by taking value and hasing it
userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1();
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

//Functions or Methods for hasing password and authenticate user
userSchema.methods = {
  authenticate: function (plainpassword) {
    return this.securePassword(plainpassword) === this.encry_password;
  },
  //Hash the password
  securePassword: function (plainpassword) {
    if (!plainpassword) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};

module.exports = mongoose.model("User", userSchema);