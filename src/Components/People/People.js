"use client";
import { userAtom } from "../../utils/atoms";
import { useAtom } from "jotai";
import axios from "axios";
import { useState, useEffect } from "react";
import styles from "./People.module.css";
import MyProfile from "./MyProfile/MyProfile";

export default function People() {
  const [user, setUser] = useAtom(userAtom);
  const [people, setPeople] = useState([]);
  const [friendship, setFriendship] = useState(user?.friends);

  useEffect(() => {
    if (!user) return;
    getPeople();
  }, [user]);

  useEffect(() => {
    setFriendship(user?.friends);
  }, [user?.friends]);

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
    <div className={styles.peopleContainer}>
      <MyProfile />

      <div className={styles.peopleList}>
        <h1 className={styles.friendsLabel}>Manage friends:</h1>
        {people?.map((person, ind) => {
          if (person?.username !== user?.username) {
            return (
              <div className={styles.people} key={ind}>
                <div className={styles.basicInfoContainer}>
                  <div className={styles.singeInfoContainer}>
                    <h2>Username: </h2>{" "}
                    <h5 className={styles.peopleName}>{person?.username}</h5>{" "}
                  </div>
                  <div className={styles.singeInfoContainer}>
                    <h2>Name: </h2>{" "}
                    <h5 className={styles.peopleName}>
                      {person?.firstName} {person?.lastName}
                    </h5>{" "}
                  </div>
                </div>

                <div className={styles.rightContainer}>
                  <div className={styles.buttonContainer}>
                    <button
                      className={
                        friendship?.includes(person._id)
                          ? styles.deleteFriend
                          : styles.addFriend
                      }
                      onClick={() => {
                        handleFriendChange(person);
                      }}
                    >
                      {friendship?.includes(person._id)
                        ? "DELETE FRIEND"
                        : "ADD FRIEND"}
                    </button>
                  </div>
                  <div className={styles.imageFrame}>
                    {person?.picture && (
                      <img
                        src={person?.picture}
                        className={styles.pfp}
                        alt=""
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
