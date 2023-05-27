import { useState, useEffect, useRef } from "react";
import GestureRecognizer from "../GestureRecognizer";
import { getStroke } from "perfect-freehand";
import Link from "next/link";
import styles from "./Canva.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const options = {
  size: 20,
  thinning: 0.6,
  smoothing: 0.5,
  streamline: 0.5,
  easing: (t) => t,
  start: {
    taper: 85,
    easing: (t) => t,
    cap: true,
  },
  end: {
    taper: 85,
    easing: (t) => t,
    cap: true,
  },
};

function getSvgPathFromStroke(stroke) {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );

  d.push("Z");
  return d.join(" ");
}

export default function Canvas() {
  // button
  const buttonRef = useRef(null);

  // change to more efficent method
  const [points, setPoints] = useState([]);
  const [s, setS] = useState([]);
  const [gestureInfo, setGestureInfo] = useState([
    [0, 0],
    undefined,
    undefined,
    undefined,
  ]);
  const [traversedPoints, setTraversedPoints] = useState([[]]);
  const [loveTime, setLoveTime] = useState(0);

  const stroke = getStroke(points, options);

  const handleStrokeUpdate = (coords, gesture, rawPoint) => {
    setGestureInfo((prev) => [coords, gesture, prev[1], rawPoint]);
    console.log(gesture);
  };

  useEffect(() => {
    const coords = gestureInfo[0];
    if (gestureInfo[1] === "Open_Palm") {
      if (gestureInfo[2] !== gestureInfo[1]) {
        setPoints([[coords[0], coords[1], coords[2]]]);
        setS((prevS) => [...prevS, getSvgPathFromStroke(stroke)]);
        setTraversedPoints((prevTraversedPoints) => {
          prevTraversedPoints[prevTraversedPoints.length - 1].push(
            gestureInfo[3]
          );
          return prevTraversedPoints;
        });
      } else {
        setPoints([...points, [coords[0], coords[1], coords[2]]]);
        setS((prevS) => {
          prevS.pop();
          return [...prevS, getSvgPathFromStroke(stroke)];
        });
        setTraversedPoints((prevTraversedPoints) => {
          prevTraversedPoints[prevTraversedPoints.length - 1].push(
            gestureInfo[3]
          );
          return prevTraversedPoints;
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
    } else if (
      gestureInfo[1] === "Thumb_Down" &&
      gestureInfo[2] !== "Thumb_Down"
    ) {
      setS((prevS) => {
        prevS.pop();
        return [...prevS];
      });
      setTraversedPoints((prevTraversedPoints) => {
        prevTraversedPoints.pop();
        if (prevTraversedPoints.length == 0) {
          prevTraversedPoints = [[]];
        }
        return prevTraversedPoints;
      });
    } else if (gestureInfo[1] === "ILoveYou") {
      if (loveTime > 50) {
        setS([]);
        setTraversedPoints([[]]);
        setLoveTime(0);
      } else {
        setLoveTime((prev) => prev + 1);
      }
    }
    console.log(gestureInfo[1]);
  }, [gestureInfo]);

  return (
    <div className="z-50 absolute top-0 left-0">
      <Link href="/" className={styles.noplay}>
        <FontAwesomeIcon icon={faArrowLeft} /> BACK
      </Link>
      <div className="h-screen w-screen">
        <GestureRecognizer callback={handleStrokeUpdate} />
        <svg style={{ touchAction: "none" }}>
          {points &&
            s.map((p, ind) => {
              return <path d={p} key={ind} />;
            })}
        </svg>
        <button className={styles.drawing_submit} type="submit" ref={buttonRef}>
          SUBMIT
        </button>
      </div>
    </div>
  );
}
