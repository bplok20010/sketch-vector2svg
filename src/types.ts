export interface Layer {
  _class: "oval" | "shapePath" | "rectangle";
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
  fixedRadius: number;
  points: {
    _class: "shapePath" | "oval" | "rectangle";
    cornerRadius: number;
    /**
     * 当前坐标作为起始坐标时，该属性为控制点1坐标
     */
    curveFrom: string;
    curveMode: number;
    /**
     * 当前坐标作为终点坐标时，该属性为控制点2坐标
     */
    curveTo: string;
    /**
     * 当前坐标作为起始坐标时，是否存在控制点1
     */
    hasCurveFrom: boolean;
    /**
     * 当前坐标作为终点坐标时，是否存在控制点2
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
