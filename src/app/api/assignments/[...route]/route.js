import dbConnect from "@/lib/dbConnect";
import AssignmentModel from "@/model/Assignment";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
//API URL: http://localhost:3000/api/assignments/[:id]/[action]
export async function POST(req) {
  await dbConnect();
  try {
    // extract taskId and action from the URL
    const url = new URL(req.url);
    //  parts returns an array of type [ '', 'api', 'assignments', [taskId], [action] ]
    const parts = url.pathname.split("/");
    const taskId = parts[parts.length - 2];
    const action = parts[parts.length - 1].toLowerCase();
    // check for required fields
    if (!taskId || !action) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields.",
        },
        { status: 400 }
      );
    }
    // validate task id
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid task ID format.",
        },
        { status: 400 }
      );
  }
    // Validate the action
    if (!["accept", "reject"].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid action type. Only 'accept' or 'reject' allowed.",
        },
        { status: 400 }
      );
    }
    // find assignment corresponding to that ID
    const existingAssignmentByTaskId = await AssignmentModel.findById({
      _id: taskId,
    });
    if (!existingAssignmentByTaskId) {
      return NextResponse.json(
        {
          success: false,
          message: `Can not find any assignment with this task name`,
        },
        { status: 400 }
      );
    }
    // check if the assignment is already reviewed by an admin
    if (existingAssignmentByTaskId.status !== "pending") {
      return NextResponse.json(
        {
          success: false,
          message: `An Admin has already ${existingAssignmentByTaskId.status}ed this task`,
        },
        { status: 400 }
      );
    }
    // update the status of this assignment from pending to accept or reject
    existingAssignmentByTaskId.status =
      action === "accept" ? "accepted" : "rejected";
    existingAssignmentByTaskId.save();
    return NextResponse.json(
      {
        success: true,
        message: `Assignement ${existingAssignmentByTaskId.status}ed by the tagged admin successfully!`,
        reviewedAssignment: existingAssignmentByTaskId,
      },
      { status: 201 }
    );
  //handle any unexpected error with catch block
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
