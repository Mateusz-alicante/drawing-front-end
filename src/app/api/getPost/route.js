import { NextResponse } from "next/server";
import Post from "../../../api_utils/Models/Post";
import User from "../../../api_utils/Models/User";
import connect from "../../../api_utils/dbConfig.js";

export async function GET(req) {
  try {
    console.log("reached getposts");
    // construct the object that will allow us to fewtch the correct posts based on the request otions
    let requestOptions;
    let friends;
    await connect();
    const params = new URL(req.url).searchParams;
    const user = req.headers.get("user");
    console.log(params.get("option"));
    switch (params.get("option")) {
      case "public":
        friends = await User.findById(user).select("friends");
        friends = friends.friends;
        requestOptions = [
          { user: user },
          { $and: [{ user: { $in: friends } }, { privacy: "friends" }] },
          { privacy: "public" },
        ];
        break;
      case "friends":
        console.log("Reached friends posts");
        friends = await User.findById(user).select("friends");
        friends = friends.friends;
        // I know what the problem is friends and public posts don't get displayed
        requestOptions = [
          {
            $or: [
              { $and: [{ user: { $in: friends } }, { privacy: "friends" }] },
              { $and: [{ privacy: "public" }, { user: { $ne: user } }] },
            ],
          },
        ];
        break;
      case "private":
        requestOptions = [{ user: user }];
        break;
    }

    // find the list of friends of the user that is logged in

    const posts = await Post.find({
      $or: requestOptions,
    })
      .sort({ createdAt: "desc" })
      .skip(params.get("page") * params.get("limit"))
      .limit(params.get("limit"))
      .populate("user", "firstName lastName username");
    return NextResponse.json(
      {
        posts,
        hasMore: posts.length == params.get("limit"),
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
