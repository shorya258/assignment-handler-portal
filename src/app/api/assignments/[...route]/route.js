import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import AssignmentModel from "@/model/Assignment";
import { NextResponse } from "next/server";
// API URL: http://localhost:3000/api/assignments?adminname=[admin_name]
export async function GET(req) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const adminname = searchParams.get("adminname");
    const existingAdmin = await UserModel.findOne({ username: adminname });
    if (!existingAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: `Admin by the user name ${adminname} does not exist.`,
        },
        { status: 400 }
      );
    }
    const adminObjectId = existingAdmin._id;
    const existingAssignmentsForTaggedAdmin = await AssignmentModel.find({
      adminObjectId,
    });
    if (!existingAssignmentsForTaggedAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: `${adminname} has not been tagged in any assignments.`,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: `Fetched all assignments for tagged admin ${adminname} successfully!`,
        assignmentsFetchedForTaggedAdmin: existingAssignmentsForTaggedAdmin,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching assignments",
      },
      { status: 500 }
    );
  }
}
//API URL: http://localhost:3000/api/assignments/[task]/[action]
export async function POST(req) {
  await dbConnect();
  try {
    const url = new URL(req.url);
    const parts = url.pathname.split('/'); // Split the URL path
    console.log(parts)
    const task = parts[parts.length - 2]; // Second last part (Task)
    const action = parts[parts.length - 1];
    if (!task || !action) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields.",
        },
        { status: 400 }
      );
    }
    // Validate the action
    if (!['accept', 'reject'].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid action type. Must be 'accept' or 'reject' allowed.",
        },
        { status: 400 }
      );
    }
    const existingAssignmentByTask = await AssignmentModel.findOne({ task });
    if (!existingAssignmentByTask) {
      return NextResponse.json(
        {
          success: false,
          message: `Can not find any assignment with ${task} task name`,
        },
        { status: 400 }
      );
    }
    if(existingAssignmentByTask.status!=="pending"){
      return NextResponse.json(
        {
          success: false,
          message: `Tagged Admin has already ${existingAssignmentByTask.status} this task`,
        },
        { status: 400 }
      );
    }
    existingAssignmentByTask.status= (action==="accept")?"accepted":"rejected";
    existingAssignmentByTask.save();
    return NextResponse.json(
      {
        success: true,
        message: `Assignement ${existingAssignmentByTask.status}ed by the tagged admin successfully!`,
        updatedAssignment: existingAssignmentByTask,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching assignments",
      },
      { status: 500 }
    );
  }
}
