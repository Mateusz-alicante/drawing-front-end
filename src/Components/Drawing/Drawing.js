import { useEffect, useState, useRef } from "react";
import { options, getSvgPathFromStroke } from "../../utils/strokeOptions";
import { getStroke } from "perfect-freehand";
import { useRouter } from "next/navigation";

export default ({ data, renderProgressively = false }) => {
  const container = useRef(null);
  const router = useRouter();
  const [toRender, setToRender] = useState([[]]);
  const [paths, setPaths] = useState([]);

  const isInViewPort = () => {
    if (!container.current) return false;
    const rect = container.current.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  const addToRender = () => {
    if (data.length === 0) return;
    if (data[0].length === 0) {
      data.shift();
      setToRender((p) => [...p, []]);
      return addToRender();
    } else {
      setToRender((p) => {
        const lastInRender = p.pop();
        lastInRender.push(data[0].shift());
        return [...p, lastInRender];
      });
    }
    setTimeout(addToRender, 5);
  };

  useEffect(() => {
    const updatedOptions = {
      ...options,
      size: (20 / window.innerHeight) * container.current.clientHeight,
    };
    const consider = renderProgressively ? toRender : data;
    console.log(consider);
    const points = consider.map((point) =>
      point.map((p) => ({
        x: p[0] * container.current.clientWidth,
        y: p[1] * container.current.clientHeight,
        pressure: p[2],
      }))
    );
    const strokes = points.map((stroke) => getStroke(stroke, updatedOptions));
    const svgPaths = strokes.map(getSvgPathFromStroke);
    setPaths(svgPaths);
  }, [container, toRender]);

  const checkIfInViewPort = () => {
    if (isInViewPort()) {
      addToRender();
      console.log("new in viewport");
    } else {
      setTimeout(checkIfInViewPort, 50);
    }
  };

  useEffect(() => {
    if (renderProgressively) {
      checkIfInViewPort();
    }
  }, []);

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
