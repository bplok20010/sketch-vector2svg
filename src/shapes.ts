import { forEach } from "lodash";
import { Layer } from "./types";

function parsePoints(
  points: string,
  size: {
    width: number;
    height: number;
  }
): [number, number] {
  const r = JSON.parse(points.replace("{", "[").replace("}", "]"));
  r[0] *= size.width;
  r[1] *= size.height;
  return r;
}

export function shapePath(layer: Layer) {
  const { _class, name, frame, points, isClosed } = layer;
  const path: string[] = [];
  const { width, height } = frame;
  const size = {
    width,
    height,
  };

  forEach(points, (point, i) => {
    const p = parsePoints(point.point, size);

    let CMD = i === 0 ? "M" : "L";

    if (i === 0) {
      path.push(`${CMD}${p[0]} ${p[1]}`);
      return;
    }

    const prevPoint = points![i - 1];

    // 只要存在控制点就说明需要使用贝塞尔曲线
    if (
      prevPoint.hasCurveFrom ||
      prevPoint.hasCurveTo ||
      point.hasCurveFrom ||
      point.hasCurveTo
    ) {
      CMD = "C";
    }

    switch (CMD) {
      case "L":
        path.push(`${CMD}${p[0]} ${p[1]}`);
        break;
      case "C":
        path.push(CMD);
        const cPath: number[] = [];
        // 控制点1
        if (prevPoint.hasCurveFrom) {
          cPath.push(...parsePoints(prevPoint.curveFrom, size));
        } else {
          //控制点1和坐标1相同
          cPath.push(...parsePoints(prevPoint.point, size));
        }
        //控制点2
        if (point.hasCurveTo) {
          cPath.push(...parsePoints(point.curveTo, size));
        } else {
          //控制点2和坐标2相同
          cPath.push(...parsePoints(point.point, size));
        }

        // 坐标2
        cPath.push(...parsePoints(point.point, size));

        path.push(cPath.join(" "));
        break;
    }
  });

  if (isClosed) {
    path.push("Z");
  }

  // TODO: 最终以添加边框或阴影的2倍高度
  const strokeWidth = 5;
  const viewBox = {
    x: -strokeWidth * 2,
    y: -strokeWidth * 2,
    width: width + strokeWidth * 4,
    height: height + strokeWidth * 4,
  };

  return `<svg width="${viewBox.width}px" height="${
    viewBox.height
  }px" viewBox="${viewBox.x} ${viewBox.y} ${viewBox.width} ${
    viewBox.height
  }" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>${name}</title>
   <path fill="none" stroke="#979797" d="${path.join("")}"></path>
</svg>`;
}

export function oval(layer: Layer) {
  const { _class, name, frame, points, isClosed } = layer;
  const path: string[] = [];
  const { width, height } = frame;

  return shapePath({
    ...layer,
    points: [...layer.points, layer.points[0]],
  });
}
