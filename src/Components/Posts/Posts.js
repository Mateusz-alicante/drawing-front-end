"use client";
import { userAtom } from "../../utils/atoms";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";
import style from "./Posts.module.css";
import Drawing from "../../Components/Drawing/Drawing";
import { useState } from "react";

export default function Posts() {
  const [user, setUser] = useAtom(userAtom);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getAllPosts();
  }, [user]);

  const getAllPosts = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/getAllPosts", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setPosts(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={style.postWrapper}>
      {posts.map((post, ind) => (
        <div className={style.post} key={ind}>
          <div className={style.postHeader}>
            <div className={style.postName}>
              {post?.user.firstName} {post?.user.lastName}
            </div>
          </div>
          <div className={style.drawing}>
            <Drawing data={post?.image} />
          </div>
          <div className={style.description}>{post?.description}</div>
        </div>
      ))}
    </div>
  );
}
