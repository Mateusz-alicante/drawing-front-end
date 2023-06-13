import {
  usernameExists,
  emailExists,
  lengthValidation,
} from "../../helpers/checks";
import { generateToken } from "../../helpers/tokens";
import bcrypt from "bcrypt";
import User from "../../../api_utils/Models/User.js";
import connect from "../../../api_utils/dbConfig.js";

import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    console.log("reached register");
    const { firstName, lastName, password, email, username } = await req.json();
    console.log(firstName);
    if (!lengthValidation(firstName, 2, 30)) {
      return NextResponse.json(
        { message: "First name must be between 3 and 30 characters" },
        { status: 400 }
      );
    }
    if (!lengthValidation(lastName, 2, 30)) {
      return NextResponse.json(
        { message: "Last name must be between 3 and 30 characters" },
        { status: 400 }
      );
    }
    if (!lengthValidation(password, 6, 40)) {
      return NextResponse.json(
        { message: "Password must be between 6 and 40 characters" },
        { status: 400 }
      );
    }

    await connect();

    // check if username already exists
    if (await usernameExists(username, User)) {
      return NextResponse.json(
        { message: "Username already exists, try a different username" },
        { status: 400 }
      );
    }

    // check if email already exists
    if (await emailExists(email, User)) {
      return NextResponse.json(
        { message: "Email already exists, try a different email" },
        { status: 400 }
      );
    }

    // encrypt password
    const cryptedPassword = await bcrypt.hash(password, 12);

    // save new user
    const user = await new User({
      firstName: firstName,
      lastName: lastName,
      username: username,
      password: cryptedPassword,
      email: email,
    }).save();

    // generate jwt token
    const token = generateToken({ id: user._id.toString() }, "7d");

    console.log("reached end of register");
    // send back info
    return NextResponse.json({
      id: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      token: token,
      friends: user.friends,
      picture: user.picture,
      email: email,
      message: "Registeration with Bluedraw success!",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
