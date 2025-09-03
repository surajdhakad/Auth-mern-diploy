const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,   // ✅ fixed
  },
  email: {
    type: String,
    required: true,   // ✅ fixed
    unique: true,
  },
  password: {
    type: String,
    required: true,   // ✅ fixed
  },
}, { timestamps: true });

// ✅ Correct Model Name
const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
