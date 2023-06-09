import { useEffect, useState, useRef } from "react";
import { options, getSvgPathFromStroke } from "../../utils/strokeOptions";
import { getStroke } from "perfect-freehand";
import { useRouter } from "next/navigation";
import { faColonSign, faL } from "@fortawesome/free-solid-svg-icons";

export default ({
  originalData,
  renderProgressively = false,
  redrawOnClick = false,
  svgRefCallback = false,
}) => {
  const container = useRef(null);
  const [data, setData] = useState(JSON.parse(JSON.stringify(originalData))); // This is the data that will be used to render the drawing
  const router = useRouter();
  const [toRender, setToRender] = useState([[]]);
  const [paths, setPaths] = useState([]);
  const [imgError, setImgError] = useState(false); // This will be used to show a message if there is an error loading the image
  const [reRender, setReRender] = useState(false);
  const svgRef = useRef(null);

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
    if (data?.length === 0) return;
    if (data && data[0].length === 0) {
      data.shift();
      setToRender((p) => [...p, []]);
      return addToRender();
    } else {
      setToRender((p) => {
        const lastInRender = p.pop();
        if (data) lastInRender.push(data[0].shift());
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
    if (!consider) return setImgError(true);
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
    } else {
      setTimeout(checkIfInViewPort, 50);
    }
  };

  useEffect(() => {
    if (renderProgressively) {
      checkIfInViewPort();
    }
  }, []);

  const reDraw = () => {
    if (redrawOnClick && data.length == 0) {
      setPaths([]);
      setData(JSON.parse(JSON.stringify(originalData)));
      setToRender([[]]);
      setReRender(true);
    }
  };

  useEffect(() => {
    if (reRender) {
      console.log(data.length);
      console.log(originalData.length);
      setReRender(false);
      addToRender();
    }
  }, [reRender]);

  useEffect(() => {
    if (svgRefCallback && svgRef && paths.length) {
      console.log(paths.length);
      svgRefCallback(svgRef);
    }
  }, [svgRef, paths]);

  return (
    <div ref={container} className="w-full h-full" onClick={reDraw}>
      <svg
        ref={svgRef}
        style={{
          touchAction: "none",
          height: "100%",
          width: "100%",
          fill: "#63bdf5",
        }}
      >
        {paths.map((p, ind) => {
          if (imgError) {
            return (
              <div>
                <h2>The image could not be loaded!</h2>
                <h4>Try refreshing the page and logging in</h4>
              </div>
            );
          } else {
            return <path d={p} key={ind} />;
          }
        })}
      </svg>
    </div>
  );
};
