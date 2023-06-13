import { NextResponse } from "next/server";
import * as jose from "jose";

// This function can be marked `async` if using `await` inside
export async function middleware(req) {
  try {
    let temp = req.headers.get("Authorization"); // get token from header (this is currently logged in user)
    const token = temp.slice(7, temp.length); // token must be sliced since "bearer " is not part of the token
    if (!token) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "invalid Authentication" }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }
    // check if this is a valid token (does it link to a user?)
    const user = await jose
      .jwtVerify(token, new TextEncoder().encode(process.env.TOKEN_SECRET))
      .catch((err) => {
        console.log(err);
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: "Invalid authentication",
          }),
          { status: 400, headers: { "content-type": "application/json" } }
        );
      });
    const response = NextResponse.next();
    response.headers.append("user", user.payload.id);
    return response;
  } catch (error) {
    console.log(error.message);
    return new NextResponse(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/api/createPost",
    "/api/getPost",
    "/api/addFriend",
    "/api/unFriend",
    "/api/uploadImage",
    "/api/uploadImageLink",
    "/api/test",
  ],
};
