import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const { email, password } = body;
    // check for required field names
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }
    const existingUserByEmail = await UserModel.findOne({ email });
    // Return if user does not exist
    if (!existingUserByEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "User does not exist.",
        },
        { status: 400 }
      );
    }
    // compare the hashed password string with the recieved password
    const passwordCompare = await bcrypt.compare(
      password,
      existingUserByEmail.password
    );
    if (!passwordCompare) {
      return NextResponse.json(
        {
          success: false,
          message: "Try logging in with correct credentials",
        },
        { status: 400 }
      );
    }
    // create an obj to store email and password to convert to jwtToken
    const dataToStore = {
      email: email,
      password: password,
    };
    // return this token to be used for authentication/verification puposes
    const jwtToken = jwt.sign(dataToStore, process.env.JWT_SECRET);
    return NextResponse.json(
      {
        success: true,
        message: "Logged in successfully.",
        jwtToken: jwtToken,
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
        message: "Problem signing in",
      },
      { status: 500 }
    );
  }
}
