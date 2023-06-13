import cloudinary from "cloudinary";
// import * as fs from "fs";
import { NextResponse } from "next/server";
const { Readable } = require("stream");
//import formidable from "formidable";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

export async function POST(req) {
  try {
    const formInfor = await req.formData();
    const userID = formInfor.get("userID");
    const path = formInfor.get("path");

    const validUser = req.headers.get("user");
    if (validUser != userID) {
      return NextResponse.json(
        { message: "You are not authorized to upload profile picture" },
        { status: 400 }
      );
    }
    // const formData = req.formData();
    // console.log(formData);
    // let file = req.files.file;
    // let image = "";

    const file = formInfor.get("file");

    // await cloudinary.v2.uploader.upload(file, {
    //   resource_type: file.type.split("/")[0],
    //   public_id: `${path}/${file.name}`,
    //   chunk_size: 1048576000,
    // });

    const res = await new Promise((resolve, reject) => {
      const read = async () => {
        const theTransformStream = cloudinary.v2.uploader.upload_stream(
          (err, res) => {
            if (err) {
              console.log(err);
              reject(err);
            }
            resolve(res);
          }
        );

        const buffer = Buffer.from(await file.arrayBuffer());
        const stream = Readable.from(buffer);
        stream.pipe(theTransformStream);
      };
      read();
    });

    // removeFile(file.tempFilePath);
    return NextResponse.json(
      {
        Image: res.secure_url,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Got error");
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
