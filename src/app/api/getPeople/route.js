import User from "../../../api_utils/Models/User.js";
import connect from "../../../api_utils/dbConfig.js";

import { NextResponse } from "next/server";

export async function GET(req, res) {
  try {
    await connect();
    const people = await User.find({}).select(
      "firstName friends id lastName picture token username"
    );
    return NextResponse.json({ people }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
