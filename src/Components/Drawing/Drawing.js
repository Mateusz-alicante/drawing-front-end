import { useEffect, useState, useRef } from "react";
import { options, getSvgPathFromStroke } from "../../utils/strokeOptions";
import { getStroke } from "perfect-freehand";
import { useRouter } from "next/navigation";

export default ({ data }) => {
  const container = useRef(null);
  const router = useRouter();
  const [paths, setPaths] = useState([]);
  useEffect(() => {
    const updatedOptions = {
      ...options,
      size: (20 / window.innerHeight) * container.current.clientHeight,
    };
    if (!data) return router.push("/play");
    console.log(data);
    const points = data.map((point) =>
      point.map((p) => ({
        x: p[0] * container.current.clientWidth,
        y: p[1] * container.current.clientHeight,
        pressure: p[2],
      }))
    );
    const strokes = points.map((stroke) => getStroke(stroke, updatedOptions));
    const svgPaths = strokes.map(getSvgPathFromStroke);
    setPaths(svgPaths);
  }, [container]);
  return (
    <div ref={container} className="w-full h-full">
      <svg
        style={{
          touchAction: "none",
          height: "100%",
          width: "100%",
          fill: "#63bdf5",
        }}
      >
        {paths.map((p, ind) => {
          return <path d={p} key={ind} />;
        })}
      </svg>
    </div>
  );
};
