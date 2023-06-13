import * as jose from "jose";

const alg = "HS256";

export default async (payload, expired) => {
  //generate jwt token that expires in 7 days for THAT user
  //payload is that user's id
  console.log(process.env.TOKEN_SECRET);
  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg })
    .setExpirationTime(expired)
    .sign(new TextEncoder().encode(process.env.TOKEN_SECRET));
  return jwt;
};
