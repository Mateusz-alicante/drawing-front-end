import User from "../../../api_utils/Models/User.js";
import connect from "../../../api_utils/dbConfig.js";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const user = req.headers.get("user");
    const { id } = await req.json();
    if (user !== id) {
      await connect();
      // check that you're not unfriending yourself
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(id);
      if (
        receiver.friends.includes(sender._id) &&
        sender.friends.includes(receiver._id)
      ) {
        await User.bulkWrite([
          {
            updateOne: {
              filter: { _id: sender._id },
              update: {
                $pull: {
                  friends: receiver._id,
                },
              },
            },
          },
          {
            updateOne: {
              filter: { _id: receiver._id },
              update: {
                $pull: {
                  friends: sender._id,
                },
              },
            },
          },
        ]);
        result = await User.findById(user).select("friends");
        console.log(result);
        console.log("reached here");
        return NextResponse.json({ result }, { status: 200 });
      } else {
        return NextResponse.json(
          { message: "Already not friends" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { message: "You cannot unfriend yourself" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log(error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
