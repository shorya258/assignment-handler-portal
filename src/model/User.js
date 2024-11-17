import mongoose, { Schema } from "mongoose";
const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/.+\@.+\..+/, "please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);
export default UserModel;
