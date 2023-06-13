import connect from "../../../api_utils/dbConfig.js";
import User from "../../../api_utils/Models/User.js";
import { NextResponse } from "next/server";

export async function GET(req, res) {
  await connect();
  const users = await User.find({});
  return new NextResponse(JSON.stringify(users), {
    headers: {
      "content-type": "application/json",
    },
  });
}
