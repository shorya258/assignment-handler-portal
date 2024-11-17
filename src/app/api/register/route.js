import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";
const bcrypt= require("bcryptjs")
export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const { username, email, password, role } = body;
    if (!username || !email || !password || !role) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }
    const existingUserByEmail = await UserModel.findOne({ email });
    if (existingUserByEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists",
        },
        { status: 400 }
      );
    }
    const existingUserByUsername = await UserModel.findOne({ username });
    if (existingUserByUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }
    const salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      role
    });
    await newUser.save();
    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully!",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error registering user",
      },
      { status: 500 }
    );
  }
}
