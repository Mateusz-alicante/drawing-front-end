"use client";
import { userAtom } from "../../utils/atoms";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";
import style from "./Posts.module.css";
import Drawing from "../../Components/Drawing/Drawing";
import { useState } from "react";
import Loader from "../Loader/Loader";

export default function Posts() {
  const [user, setUser] = useAtom(userAtom);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    getAllPosts();
  }, [user]);

  const getAllPosts = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_REACT_APP_BACKEND}/getAllPosts`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setPosts(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      router.push("/");
    }
  };

  return (
    <div className={style.postWrapper}>
      <Loader show={loading} />
      {posts.map((post, ind) => (
        <div className={style.post} key={ind}>
          <h1>
            {post?.user.firstName} {post?.description}
          </h1>
          <div className={style.drawingContainer}>
            <Drawing renderProgressively={true} data={post.image} />
          </div>
          <h3>{post?.user.lastName}</h3>
        </div>
      ))}
    </div>
  );
}
