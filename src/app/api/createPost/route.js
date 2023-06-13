import { NextResponse } from "next/server";
import Post from "../../../api_utils/Models/Post";
import connect from "../../../api_utils/dbConfig.js";

export async function POST(req) {
  try {
    const { description, image, privacy, user } = await req.json();
    const validUser = req.headers.get("user"); // currently signed in user on browser
    if (validUser !== user.id) {
      return res
        .status(400)
        .json({ message: "Your are not authorized to post" });
    }
    await connect();
    const post = await new Post({
      description: description,
      image: image,
      user: user.id,
      privacy: privacy,
    }).save();
    return NextResponse.json(
      {
        post,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
}
