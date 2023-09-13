export type DisposalMethod = 0 | 4 | 8 | 12;

export type UserInput = 0 | 2;

export type Transparency = 0 | 1;

export interface ImageOptions {
  data: ImageData;
  options: {
    index: number;
    width?: number;
    height?: number;
    offsetLeft?: number;
    offsetTop?: number;
    delay?: number;
    userInput?: UserInput;
    disposalMethod?: DisposalMethod;
    transparency?: Transparency;
    transparencyIndex?: number;
    colorTable?: BulidColor;
  };
}

export interface GIFConfig {
  width?: number;
  height?: number;
  workers?: number;
  background?: string;
}

export interface InputData extends Pick<ImageOptions, 'options'> {
  width: data.data.width;
  height: data.data.height;
  colorTable: number[][];
  inputStream: number[];
}

export interface OutputData {
  index: number;
  data: Uint8Array;
}

export type Color = 'color';
export type Encode = 'encode';
export type EventOn = 'message' | 'error';
export type ColorTypeOn = `${Color}/${EventOn}`;
export type EncodeTypeOn = `${Encode}/${EventOn}`;
export type MergeTypeOn = ColorTypeOn | EncodeTypeOn;
export type ColorTypeSend = `${Color}/postMessage`;
export type EncodeTypeSend = `${Encode}/postMessage`;
export type MergeTypeSend = ColorTypeSend | EncodeTypeSend;

export type ColorObject = {
  r: number;
  g: number;
  b: number;
  normalize?: boolean;
};

export interface ProgressParams {
  loaded: number;
  total: number;
  activeWorkers: number;
  duration: number;
  surplus: number;
  percentage: number;
}

export interface BulidColor {
  colorList: ColorObject[];
  octree: Octree;
}

export type Progress = 'progress';

export type Finished = 'finished';

export type BusEvent = Progress | Finished;

export type FinishedCallback = (blob: Blob) => void;

export type ProgressCallback = (event: ProgressParams) => void;

export type GIFEventOn = <T extends BusEvent>(
  type: T,
  fn: T extends Progress ? ProgressCallback : FinishedCallback
) => void;

export interface GIFPattern {
  header: string;
  logicalScreenDescriptor: {
    width: number;
    height: number;
    statistics: {
      globalColor: boolean;
      colorResolution: number;
      sort: boolean;
      globalColorSize: number;
    };
    backgroundIndex: number;
    pixelAspectRatio: number;
  };
  frames: {
    index: number;
    cursor: number;
    data?: ImageData;
    offsetLeft: number;
    offsetTop: number;
    width: number;
    height: number;
    statistics: {
      localColor: boolean;
      interlace: boolean;
      sort: boolean;
      localColorSize: number;
    };
    lzwMiniCodeSize: number;
    blocks: Uint8Array[];
    localColorTable?: number[][];
    control?: GIFPattern['graphicControlExtension'];
  }[];

  globalColorTable?: number[][];
  applicationExtension?: {
    id: number;
    cursor: number;
    application: string;
    loop: number;
  };
  graphicControlExtension?: {
    disposal: number;
    userInput: boolean;
    transparency: boolean;
    delay: number;
    transparencyIndex: number;
  };
  plainTextExtension?: {
    index: number;
    cursor: number;
    offsetLeft: number;
    offsetTop: number;
    gridWidth: number;
    gridHeight: number;
    charWidth: number;
    charHeight: number;
    textColorIndex: number;
    textBackgroundIndex: number;
    text: string;
    control?: GIFPattern['graphicControlExtension'];
  }[];
  commentExtension?: {
    index: number;
    cursor: number;
    comments: string;
  }[];
}
