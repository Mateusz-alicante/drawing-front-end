import User from "../../../api_utils/Models/User.js";
import connect from "../../../api_utils/dbConfig.js";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const user = req.headers.get("user");
    const { id } = req.json();
    if (user !== id) {
      await connect();
      // check that you're not adding yourself as friend
      const sender = await User.findById(user);
      const receiver = await User.findById(id);
      if (!receiver.friends.includes(sender._id)) {
        await User.bulkWrite([
          {
            updateOne: {
              filter: { _id: receiver._id },
              update: {
                $push: { friends: sender._id },
              },
            },
          },
          {
            updateOne: {
              filter: { _id: sender._id },
              update: {
                $push: { friends: receiver._id },
              },
            },
          },
        ]);
        result = await User.findById(user).select("friends");
        console.log(result);
        console.log("reached here 3");
        return NextResponse.json({ result }, { status: 200 });
      } else {
        console.log("reached here 4");
        return NextResponse.json(
          { message: "Already friends" },
          { status: 400 }
        );
      }
    } else {
      console.log("add self");
      return NextResponse.json(
        { message: "You cannot add yourself as a friend" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log(error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
