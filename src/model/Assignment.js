import mongoose, { Schema } from "mongoose";
const AssignmentSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      unique: true,
    },
    task: {
      type: String,
      required: [true, "Task is required"],
      trim: true,
    },
    adminObjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: [true, "Admin ID is required"],
      required: true,
    },
    status: {
      type: String,
      required: [true, "Status is required"],
    },
  },
  { timestamps: true }
);

const AssignmentModel =
  mongoose.models.Assignment || mongoose.model("Assignment", AssignmentSchema);
export default AssignmentModel;
