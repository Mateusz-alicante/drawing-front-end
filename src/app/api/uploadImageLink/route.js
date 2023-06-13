import User from "../../../api_utils/Models/User.js";
import connect from "../../../api_utils/dbConfig.js";

import { NextResponse } from "next/server";

export async function POST(req, res) {
  const { image, user } = await req.json();
  console.log(user);
  const validUser = req.headers.get("user");

  if (validUser != user.id) {
    return NextResponse.json(
      { message: "You are not authorized to upload profile picture" },
      { status: 400 }
    );
  }
  await connect();
  await User.findByIdAndUpdate(user.id, { picture: image });
  return NextResponse.json(
    {
      message: "Update success",
    },
    { status: 200 }
  );
}
