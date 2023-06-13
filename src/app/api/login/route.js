import { NextResponse } from "next/server";
import User from "../../../api_utils/Models/User.js";
import bcrypt from "bcrypt";
import generateToken from "../../helpers/tokens";
import connect from "../../../api_utils/dbConfig.js";

export async function POST(req) {
  try {
    console.log("This is req.body:");
    const { email, password } = await req.json();
    console.log(email, password);

    await connect();

    const user = await User.findOne({ email: email });

    if (!user) {
      // no user found
      return NextResponse.json(
        { message: "This email is not connected to an account" },
        { status: 400 }
      );
    } else {
      // compare password with hash in database
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        // correct password
        const token = await generateToken({ id: user._id.toString() }, "7d");
        console.log(token);
        return NextResponse.json(
          {
            id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            token: token,
            friends: user.friends,
            picture: user.picture,
            email: email,
            message: "successfully logged in",
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "Wrong password, please try again" },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    console.log("This is the error message:" + error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
