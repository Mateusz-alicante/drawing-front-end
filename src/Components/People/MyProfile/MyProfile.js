"use client";
import styles from "./MyProfile.module.css";
import axios from "axios";
import { userAtom } from "../../../utils/atoms";
import { useAtom } from "jotai";
import { useRef, useState } from "react";
import dataURItoBlob from "../../../utils/dataURItoBlob";
import Loader from "../../Loader/Loader";

export default () => {
  const [user, setUser] = useAtom(userAtom);
  const inputRef = useRef();
  const [image, setImage] = useState();
  const [error, setError] = useState();
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitImage = async () => {
    try {
      setLoading(true);
      const postImage = dataURItoBlob(image);
      // cloudinary path to upload images
      console.log("hello");
      const path = `${user?.username}/pfp`;
      //// file transfer to backend are done through formData
      //// formData is an object
      let formData = new FormData();
      formData.append("path", path);
      // add blobs to formData
      formData.append("file", postImage);
      formData.append("userID", user?.id);

      // upload images to cloudinary
      const { data } = await axios.post(`api/uploadImage`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      });

      // data is the cludinary link
      // add cloudinary link to post
      const res = await axios.post(
        `api/uploadImageLink`,
        {
          user: user,
          image: data.Image,
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setUser((prev) => {
        return { ...prev, picture: data.Image };
      });
      setUpdating(false);
      setImage("");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      setError(error);
    }
  };

  // submit profile image
  const handleImage = (e) => {
    try {
      const files = Array.from(e.target.files);
      files.forEach((img) => {
        const reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onload = (readerEvent) => {
          setImage(readerEvent.target.result);
        };
      });
      setUpdating(true);
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  return (
    <div className={styles.myProfileContainer}>
      <div className={styles.myProfile}>
        <div className={styles.basicMyProfileInfo}>
          <h1>My profile</h1>
          <div className={styles.myProfileSingleContainer}>
            <h3>Name:</h3>{" "}
            <h5>
              {user?.firstName} {user?.lastName}
            </h5>
          </div>
          <div className={styles.myProfileSingleContainer}>
            <h3>username: </h3>
            <h5>{user?.username}</h5>
          </div>
          <div className={styles.myProfileSingleContainer}></div>
        </div>
        <div className={styles.imageMyProfile}>
          <input
            type="file"
            ref={inputRef}
            hidden
            accept="image/*"
            onChange={handleImage}
          ></input>
          <div className={styles.imageFrame}>
            {user?.picture && (
              <img src={user?.picture} className={styles.pfp} alt="" />
            )}
          </div>
          <div className={styles.myProfileSingleContainer}>
            <h3>Profile picture:</h3>
          </div>

          <div className={styles.peopleName}>
            {user?.firstName} {user?.lastName}
          </div>

          <div className={styles.updatePictureButtonsContainer}>
            <button
              className={styles.updatePictureButton}
              onClick={() => {
                inputRef.current.click();
              }}
            >
              {user?.picture ? "Update Photo" : "Upload Photo"}
            </button>
            {updating && (
              <button
                onClick={submitImage}
                className={styles.updatePictureButton}
              >
                Confirm
              </button>
            )}
          </div>
        </div>
      </div>
      <Loader show={loading} />
    </div>
  );
};
