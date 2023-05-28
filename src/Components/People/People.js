"use client";
import { userAtom } from "../../utils/atoms";
import { useAtom } from "jotai";
import axios from "axios";
import { useState, useEffect } from "react";
import styles from "./People.module.css";

export default function People() {
  const [user, setUser] = useAtom(userAtom);
  const [self, setSelf] = useState();
  const [people, setPeople] = useState();

  const [friendship, setFriendship] = useState(user.friends);

  console.log(user.friends);
  console.log(user);
  useEffect(() => {
    setFriendship(user.friends);
  }, [user.friends]);

  const addFriendHandler = async () => {
    setFriendship({ ...friendship });
    await addFriend(profileId, user.token);
  };

  const getSelf = async () => {
    try {
      console.log(user.username);
      const { data } = await axios.get("http://localhost:8000/getSelf", {
        params: { user: user.username },
      });
      setSelf(data);
    } catch (e) {
      console.log(e);
    }
  };

  const getPeople = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/getPeople");
      console.log(data);
      setPeople(data.people);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    getSelf();
    getPeople();
  }, []);

  console.log(user.friends);

  const handleFriendChange = async (person) => {
    if (user.friends?.includes(person)) {
      try {
        await axios.post(
          `http://localhost:8000/unFriend`,
          { id: person._id },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        return "ok";
      } catch (error) {
        return error.response.data.message;
      }
    } else {
      try {
        await axios.post(
          `http://localhost:8000/addFriend`,
          { id: person._id },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        return "ok";
      } catch (error) {
        return error.response.data.message;
      }
    }
  };

  return (
    <div className={styles.peopleList}>
      {people?.map((person, ind) => {
        return (
          <div className={styles.people} key={ind}>
            <div className={styles.peopleName}>
              {person?.firstName} {person?.lastName}
            </div>
            <button
              className={styles.addFriend}
              onClick={() => {
                handleFriendChange(person);
              }}
            >
              {friendship?.includes(person) ? "DELETE FRIEND" : "ADD FRIEND"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
