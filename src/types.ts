export interface Layer {
  _class: "oval" | "shapePath";
  name: string;
  frame: {
    _class: string;
    constrainProportions: boolean;
    height: number;
    width: number;
    x: number;
    y: number;
  };
  style: any;
  isClosed: boolean;
  points: {
    _class: "shapePath" | "oval";
    cornerRadius: number;
    curveFrom: string;
    curveMode: number;
    curveTo: string;
    /**
     * 控制点1，开启时取上一个点的curveFrom
     */
    hasCurveFrom: boolean;
    /**
     * 控制点2，开启时取当前点数的curveTo
     */
    hasCurveTo: boolean;
    point: string;
  }[];
}

export interface PageLayer {
  layers: Layer[];
}

export interface SketchPageData {
  layers: PageLayer[];
}
