const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._-]{4,}$/,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", UserSchema);
