import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";
export async function GET() {
  await dbConnect();
  try {
    const existingUsersByAdminRole = await UserModel.find({ role: "Admin" });
    if (existingUsersByAdminRole) {
      return NextResponse.json(
        {
          success: true,
          message: "Fetched admins successfully!",
          admins:existingUsersByAdminRole
        },
        { status: 201 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching admins",
      },
      { status: 500 }
    );
  }
}
