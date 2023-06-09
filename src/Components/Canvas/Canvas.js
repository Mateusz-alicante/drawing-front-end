import { useState, useEffect, useRef } from "react";
import GestureRecognizer from "../GestureRecognizer";
import { getStroke } from "perfect-freehand";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./Canva.module.css";
import { useAtom } from "jotai";
import {
  savedDrawingAtom,
  userAtom,
  pendingDrawingAtom,
} from "../../utils/atoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { options, getSvgPathFromStroke } from "../../utils/strokeOptions";
import LearnPopUp from "../LearnPopUp/LearnPopUp";

const ThumbDownTime = 10;
const ILoveYouTime = 25;

export default function Canvas() {
  // button
  const buttonRef = useRef(null);
  const router = useRouter();

  // change to more efficent method
  const [points, setPoints] = useState([]);
  const [savedDrawing, setSavedDrawing] = useAtom(savedDrawingAtom);
  const [pendingDrawing, setPendingDrawing] = useAtom(pendingDrawingAtom);
  const [user, setUser] = useAtom(userAtom);
  const [s, setS] = useState([]);
  const [showPopUp, setShowPopUp] = useState(false);
  const [gestureInfo, setGestureInfo] = useState([
    [0, 0],
    undefined,
    undefined,
    undefined,
  ]);
  const [traversedPoints, setTraversedPoints] = useState([]);
  const [loveTime, setLoveTime] = useState(0);
  const [downTime, setDownTime] = useState(0);

  const stroke = getStroke(points, options);

  const handleStrokeUpdate = (coords, gesture, rawPoint) => {
    setGestureInfo((prev) => [coords, gesture, prev[1], rawPoint]);
  };

  useEffect(() => {
    const coords = gestureInfo[0];
    if (gestureInfo[1] === "Open_Palm") {
      if (gestureInfo[2] !== gestureInfo[1]) {
        setPoints([[coords[0], coords[1], coords[2]]]);
        setS((prevS) => [...prevS, getSvgPathFromStroke(stroke)]);
        setTraversedPoints((prevTraversedPoints) => {
          if (!prevTraversedPoints[0]) {
            return [[gestureInfo[3]]];
          } else {
            prevTraversedPoints[prevTraversedPoints.length - 1].push(
              gestureInfo[3]
            );
            return prevTraversedPoints;
          }
        });
      } else {
        setPoints([...points, [coords[0], coords[1], coords[2]]]);
        setS((prevS) => {
          prevS.pop();
          return [...prevS, getSvgPathFromStroke(stroke)];
        });
        setTraversedPoints((prevTraversedPoints) => {
          if (!prevTraversedPoints[0]) {
            return [[gestureInfo[3]]];
          } else {
            prevTraversedPoints[prevTraversedPoints.length - 1].push(
              gestureInfo[3]
            );
            return prevTraversedPoints;
          }
        });
      }
    } else if (gestureInfo[2] === "Open_Palm") {
      setS((prevS) => {
        prevS.pop();
        setTraversedPoints((prevTraversedPoints) => [
          ...prevTraversedPoints,
          [],
        ]);
        return [...prevS, getSvgPathFromStroke(stroke)];
      });
      setPoints([]);
    } else if (gestureInfo[1] === "Thumb_Down") {
      if (downTime > ThumbDownTime) {
        setS((prevS) => {
          prevS.pop();
          return [...prevS];
        });
        setTraversedPoints((prev) => {
          prev.pop();
          return [...prev];
        });
        setDownTime([[]]);
        setDownTime(0);
      } else {
        setDownTime((prev) => prev + 1);
      }
    } else if (gestureInfo[1] === "ILoveYou") {
      if (loveTime > ILoveYouTime) {
        setS([]);
        setTraversedPoints([[]]);
        setLoveTime(0);
      } else {
        setLoveTime((prev) => prev + 1);
      }
    } else {
      setDownTime(0);
      setLoveTime(0);
    }
  }, [gestureInfo]);

  const submitHandler = () => {
    if (!user.username) {
      alert("Please login to submit a drawing");
      setSavedDrawing(traversedPoints);
      setPendingDrawing(true);
      return router.push("/login");
    }
    setSavedDrawing(traversedPoints);
    router.push("/new");
  };

  return (
    <div className="z-50 absolute top-0 left-0 h-screen w-screen">
      <LearnPopUp show={showPopUp} setShow={setShowPopUp} />
      <Link href={"/"} className={styles.noplay}>
        <FontAwesomeIcon icon={faArrowLeft} /> BACK
      </Link>
      <div className="h-screen w-screen">
        <GestureRecognizer
          percentageLoader={
            (downTime / ThumbDownTime) * 100 || (loveTime / ILoveYouTime) * 100
          }
          callback={handleStrokeUpdate}
        />
        <svg style={{ touchAction: "none" }} className={styles.playSvg}>
          {points &&
            s.map((p, ind) => {
              return <path d={p} key={ind} />;
            })}
        </svg>
        <div>
          <button
            onClick={() => setShowPopUp(true)}
            className={styles.learnButton}
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            <p>Learn</p>
          </button>
          <button
            className={styles.drawing_submit}
            onClick={submitHandler}
            ref={buttonRef}
          >
            SUBMIT
          </button>
        </div>
      </div>
    </div>
  );
}
