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
import InfiniteScroll from "react-infinite-scroller";

const PostRequestLimit = 15;

const PostOptionsArray = [
  ["Public Posts", "public"],
  ["My Friends", "friends"],
  ["Only Mine", "private"],
];

export default function Posts() {
  const [user, setUser] = useAtom(userAtom);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [postOption, setPostOption] = useState("public");
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [page, setPage] = useState(0);
  const router = useRouter();

  const loadPosts = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { data } = await axios.get(
        `api/getPost?page=${page}&limit=${PostRequestLimit}&option=${postOption}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setPosts((prevPosts) => [...prevPosts, ...data.posts]);
      setHasMorePosts(data.hasMore);
      setPage((prevPage) => prevPage + 1);
      setLoading(false);
    } catch (error) {
      console.log(error);
      router.push("/");
    }
  };

  return (
    <div className={style.postWrapper}>
      <div className={style.postOptionContainer}>
        {PostOptionsArray.map(([label, value]) => (
          <div className={style.postOptionSingleOption}>
            <button
              className={
                value == postOption
                  ? style.postOptionActiveButton
                  : style.postOptionInactiveButton
              }
              onClick={() => {
                setPostOption(value);
                setPosts([]);
                setHasMorePosts(true);
                setPage(0);
              }}
            >
              {label}
            </button>
          </div>
        ))}
      </div>

      <InfiniteScroll
        pageStart={0}
        loadMore={loadPosts}
        hasMore={hasMorePosts}
        loader={<Loader show={loading} />}
      >
        {posts.map((post, ind) => (
          <div className={style.post} key={post._id}>
            <h1>{post?.description}</h1>
            <div className={style.drawingContainer}>
              <Drawing
                renderProgressively={true}
                originalData={post.image}
                redrawOnClick={true}
              />
            </div>
            <h3>
              {post?.user.firstName} {post?.user.lastName}
            </h3>
          </div>
        ))}
        {posts.length == 0 && !loading && (
          <div className={style.emptyContainer}>
            <h1>No posts here yet!</h1>
            <h3>Create some drawings and encourage your friends to join</h3>
          </div>
        )}
      </InfiniteScroll>
    </div>
  );
}
