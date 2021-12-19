import * as DecompressZip from "decompress-zip";
import * as fs from "fs-extra";
import { SketchPageData, Layer } from "./types";
import { forEach, isEmpty } from "lodash";
import { oval, shapePath } from "./shapes";

// sketch解压文件夹
const outputPath = "output";
// 生成矢量图的文件夹
const svgPah = "svg";

/**
 * 读取pages/*.json的数据，并提取svg信息
 */
function readPages() {
  const files = fs.readdirSync(outputPath + "/pages");
  forEach(files, (file) => {
    const data = JSON.parse(
      fs.readFileSync(`${outputPath}/pages/${file}`) + ""
    ) as SketchPageData;

    forEach(data.layers, (page) => {
      toSvg(page.layers);
    });
  });
}

/**
 * 将矢量图层数据生成svg数据
 * @param layers
 */
function toSvg(layers: Layer[]) {
  fs.ensureDirSync(svgPah);

  fs.emptyDirSync(svgPah);

  forEach(layers, (layer, i) => {
    const { _class, name, frame, points } = layer;

    if (isEmpty(points)) return;

    let svg = "";

    switch (_class) {
      case "oval":
        svg = oval(layer);
        break;
      default:
        svg = shapePath(layer);
        break;
    }

    svg && fs.writeFileSync(`${svgPah}/${name}.svg`, svg);

    svg && console.log(`生成 ${svgPah}/${name}.svg 完成`);
  });
}

export function vector2svg(filePath: string) {
  var unzipper = new DecompressZip(filePath);

  unzipper.on("error", function (err) {
    console.log("Caught an error", err);
  });

  unzipper.on("extract", function () {
    readPages();
  });

  unzipper.extract({
    path: outputPath,
  });
}

vector2svg("./test.sketch");
