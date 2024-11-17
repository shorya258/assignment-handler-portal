import dbConnect from "@/lib/dbConnect";
import AssignmentModel from "@/model/Assignment";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";
export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const { username, task, adminname } = body;
    if (!username || !task || !adminname) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }
    const existingAssignmentByTaskAndUserName = await AssignmentModel.findOne({
      username,
      task,
    });
    if (existingAssignmentByTaskAndUserName) {
      return NextResponse.json(
        {
          success: false,
          message: "This task already exists for this username.",
        },
        { status: 400 }
      );
    }
    const userByAdminName = await UserModel.findOne({ username: adminname });
    const adminId = userByAdminName._id;
    const newAssignment = new AssignmentModel({
      username,
      task,
      adminObjectId: adminId,
      status: "pending",
    });
    await newAssignment.save();
    return NextResponse.json(
      {
        success: true,
        message: "Assignment created successfully!",
        createdAssignment: newAssignment,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error creating assignment",
      },
      { status: 500 }
    );
  }
}