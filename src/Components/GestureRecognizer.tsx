import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import {
  FilesetResolver,
  GestureRecognizer,
  GestureRecognizerResult,
} from "@mediapipe/tasks-vision";

let video: HTMLVideoElement;
let gestureRecognizer: GestureRecognizer;
let lastVideoTime = -1;

export default ({ callback }: any) => {
  const [pointCoords, setPointCoords] = useState([0, 0]);
  const [specialRedirect, setSpecialRedirect] = useState(false);
  const container = useRef(null);
  const router = useRouter();

  const handleOnChange = (result: GestureRecognizerResult) => {
    const index = result.landmarks[0][1];
    const depth = result.worldLandmarks[0][1].z * 10;
    const containerElement = container.current as unknown as HTMLDivElement;
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

    video = document.getElementById("video") as HTMLVideoElement;
    navigator.mediaDevices
      .getUserMedia({ video: { width: 1280, height: 720 }, audio: false })
      .then((stream) => {
        video.srcObject = stream;
        video.addEventListener("loadeddata", predict);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const predict = () => {
    try {
      const nowInMs = Date.now();
      if (lastVideoTime !== video.currentTime) {
        lastVideoTime = video.currentTime;
        const result: GestureRecognizerResult =
          gestureRecognizer.recognizeForVideo(video, nowInMs);
        if (result.landmarks.length > 0) {
          handleOnChange(result);
        }
      }
    } catch {
      location.reload();
    }

    requestAnimationFrame(predict);
  };

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
