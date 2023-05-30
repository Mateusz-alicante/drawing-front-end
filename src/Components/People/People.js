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

  useEffect(() => {
    setFriendship(user.friends);
  }, [user.friends]);

  console.log(user.friends);

  const addFriendHandler = async () => {
    setFriendship({ ...friendship });
    await addFriend(profileId, user.token);
  };

  const getPeople = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_REACT_APP_BACKEND}/getPeople`
      );
      setPeople(data.people);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    getPeople();
  }, []);

  const handleFriendChange = async (person) => {
    try {
      if (user.friends?.includes(person._id)) {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_REACT_APP_BACKEND}/unFriend`,
          { id: person._id },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setFriendship(data.result.friends);
        setUser((prev) => {
          return { ...prev, friends: data.result.friends };
        });
      } else {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_REACT_APP_BACKEND}/addFriend`,
          { id: person._id },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setFriendship(data.result.friends);
        setUser((prev) => {
          return { ...prev, friends: data.result.friends };
        });
      }
    } catch (error) {
      return error.response.data.message;
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
              {friendship?.includes(person._id)
                ? "DELETE FRIEND"
                : "ADD FRIEND"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
