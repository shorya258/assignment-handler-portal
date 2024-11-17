import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import AssignmentModel from "@/model/Assignment";
import { NextResponse } from "next/server";
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
