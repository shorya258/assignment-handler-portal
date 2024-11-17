// API URL: http://localhost:3000/api/assignments?adminname=[admin_name]
import dbConnect from "@/lib/dbConnect";
import AssignmentModel from "@/model/Assignment";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";
export async function GET(req) {
    await dbConnect();
    try {
      // search for the admin name in the URL and validate if the admin exists
      const { searchParams } = new URL(req.url);
      const adminname = decodeURI(searchParams.get("adminname"));
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
      // check if there are no assignments pending to be reviewed by this admin
      if (!existingAssignmentsForTaggedAdmin) {
        return NextResponse.json(
          {
            success: false,
            message: `${adminname} has not been tagged in any assignments.`,
          },
          { status: 400 }
        );
      }
      // fetch all the assignments pending for this admin
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