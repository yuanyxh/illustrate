export type DisposalMethod = 0 | 4 | 8 | 12;

export type UserInput = 0 | 2;

export type Transparency = 0 | 1;

export interface ImageOptions {
  data: ImageData;
  options: {
    width?: number;
    height?: number;
    offsetLeft?: number;
    offsetTop?: number;
    delay?: number;
    userInput?: UserInput;
    disposalMethod?: DisposalMethod;
    transparency?: Transparency;
    transparencyIndex?: number;
  };
}

export interface GIFConfig {
  width?: number;
  height?: number;
  workers?: number;
}

export interface InputData extends Pick<ImageOptions, 'options'> {
  width: data.data.width;
  height: data.data.height;
  colorTable: number[][];
  inputStream: number[];
}

export interface OutputData {
  index: number;
  data: number[];
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
