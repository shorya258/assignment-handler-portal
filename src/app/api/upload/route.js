import dbConnect from "@/lib/dbConnect";
import AssignmentModel from "@/model/Assignment";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";
//API URL: http://localhost:3000/api/upload
export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const { username, task, adminname } = body;
    // check for required field names
    if (!username || !task || !adminname) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }
    // user should create assignment with unique task names 
    const existingAssignmentByTaskAndUserName = await AssignmentModel.findOne({
      username,
      task,
    });
    if (existingAssignmentByTaskAndUserName) {
      return NextResponse.json(
        {
          success: false,
          message: `${task} already exists for ${username}.`,
        },
        { status: 400 }
      );
    }
    // check if the tagged admin exists in users
    const userByAdminName = await UserModel.findOne({ username: adminname });
    if (!userByAdminName) {
      return NextResponse.json(
        {
          success: false,
          message: `${adminname} is not an admin.`,
        },
        { status: 400 }
      );
    }
    const adminId = userByAdminName._id;
    //create a new assignment and assign the initial state as pending
    const newAssignment = new AssignmentModel({
      username,
      task,
      adminObjectId: adminId,
      status: "pending",
    });
    await newAssignment.save();
    // save the newly created assignment and return it
    return NextResponse.json(
      {
        success: true,
        message: "Assignment created successfully!",
        createdAssignment: newAssignment,
      },
      { status: 201 }
    );
  } 
  //handle any unexpected error with catch block
  catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Error creating assignment",
      },
      { status: 500 }
    );
  }
}
