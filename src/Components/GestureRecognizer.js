import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import {
  FilesetResolver,
  GestureRecognizer,
  GestureRecognizerResult,
} from "@mediapipe/tasks-vision";

let gestureRecognizer = null;
let video = null;
let lastVideoTime = -1;

export default ({ callback }) => {
  const [pointCoords, setPointCoords] = useState([0, 0]);
  const [specialRedirect, setSpecialRedirect] = useState(false);
  const [videoEl, setVideoEl] = useState(null);
  const [gestureRecEl, setGestureRecEl] = useState(null);
  const [lastVideoTimeStore, setLastVideoTimeStore] = useState(-1);
  const container = useRef(null);
  const router = useRouter();

  const handleOnChange = (result) => {
    const index = result.landmarks[0][1];
    const depth = result.worldLandmarks[0][1].z * 10;
    const containerElement = container.current;
    setPointCoords([
      (1 - index.x) * containerElement.clientWidth,
      index.y * containerElement.clientHeight,
    ]);
    callback(
      [
        (1 - index.x) * containerElement.clientWidth,
        index.y * containerElement.clientHeight,
        depth,
      ],
      result.gestures[0][0].categoryName,
      [1 - index.x, index.y, depth]
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
        handleOnChange(result);
      }
    }

    requestAnimationFrame(predict);
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
            color: "#63bdf5",
          }}
        >
          *
        </div>
      </div>
    </div>
  );
};
