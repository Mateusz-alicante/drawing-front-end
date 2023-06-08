import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import {
  FilesetResolver,
  GestureRecognizer,
  GestureRecognizerResult,
} from "@mediapipe/tasks-vision";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faCircle } from "@fortawesome/free-solid-svg-icons";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const marginFunc = (x, y) => {
  const newX = (x - 0.5) * 1.3 + 0.5;
  const newY = (y - 0.5) * 1.3 + 0.5;
  return [1 - newX, newY];
};

let gestureRecognizer = null;
let video = null;
let lastVideoTime = -1;

export default ({ callback, percentageLoader }) => {
  const [pointCoords, setPointCoords] = useState([0, 0]);
  const [specialRedirect, setSpecialRedirect] = useState(false);
  const [videoEl, setVideoEl] = useState(null);
  const [gestureRecEl, setGestureRecEl] = useState(null);
  const [lastVideoTimeStore, setLastVideoTimeStore] = useState(-1);
  const [gesture, setGesture] = useState("Closed_Fist");
  const container = useRef(null);

  const color = () => {
    switch (gesture) {
      case "Closed_Fist":
        return "yellow";
      case "Open_Palm":
        return "#1955e0";
      default:
        return "red";
    }
  };

  const icon = () => {
    switch (gesture) {
      case "Closed_Fist":
        return <FontAwesomeIcon icon={faCircle} />;
      case "Open_Palm":
        return <FontAwesomeIcon icon={faPen} />;

      case "ILoveYou":
      case "Thumb_Down":
        return (
          <div style={{ height: "10%", width: "10%" }}>
            <CircularProgressbar
              value={percentageLoader}
              styles={buildStyles({
                pathColor: gesture == "Thumb_Down" ? "orange" : "red",
                pathTransitionDuration: 0,
              })}
            />
          </div>
        );
      default:
        <div>*</div>;
    }
  };

  const handleOnChange = (result) => {
    const index = result.landmarks[0][1];
    const depth = result.worldLandmarks[0][1].z * 10;
    const containerElement = container.current;
    if (!containerElement) return;
    const [x, y] = marginFunc(index.x, index.y);
    setPointCoords([
      x * containerElement.clientWidth,
      y * containerElement.clientHeight,
    ]);
    callback(
      [
        x * containerElement.clientWidth,
        y * containerElement.clientHeight,
        depth,
      ],
      result.gestures[0][0].categoryName,
      [x, y, depth]
    );
  };

  const setup = async () => {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );
    gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task",
        delegate: "GPU",
      },
      numHands: 1,
      runningMode: "VIDEO",
    });
    setGestureRecEl(gestureRecognizer);
    video = document.getElementById("video");
    setVideoEl(video);
    navigator.mediaDevices
      .getUserMedia({ video: { width: 1280, height: 720 }, audio: false })
      .then((stream) => {
        video.srcObject = stream;
        video.addEventListener("loadeddata", () =>
          setSpecialRedirect(!specialRedirect)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const predict = () => {
    if (!videoEl) return;
    const nowInMs = Date.now();
    if (lastVideoTimeStore !== videoEl.currentTime) {
      lastVideoTime = videoEl.currentTime;
      setLastVideoTimeStore(lastVideoTime);
      const result = gestureRecEl.recognizeForVideo(videoEl, nowInMs);
      if (result.landmarks.length > 0) {
        setGesture(result.gestures[0][0].categoryName);
        handleOnChange(result);
      }
    }

    setTimeout(() => requestAnimationFrame(predict), 25);
  };

  useEffect(predict, [specialRedirect]);

  useEffect(() => {
    setup();
  }, []);

  return (
    <div className="w-full h-full">
      <video autoPlay id="video" className="rounded-2xl w-full h-full hidden" />
      <div ref={container} className="mr-auto ml-auto relative w-full h-full">
        <div
          className="absolute"
          style={{
            top: pointCoords[1],
            left: pointCoords[0],
            color: color(),
          }}
        >
          {icon()}
        </div>
      </div>
    </div>
  );
};
