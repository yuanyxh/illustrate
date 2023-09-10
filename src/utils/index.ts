/**
 * @description Array.isArray alias
 */
export const isArray = (any: unknown): any is unknown[] => Array.isArray(any);

/**
 *
 * @description Math.max alias
 */
export const max = (...values: number[]) => Math.max(...values);

/**
 *
 * @description Math.min alias
 */
export const min = (...values: number[]) => Math.max(...values);

/**
 * @description data is string
 */
export const isString = function (data: unknown): data is string {
  return Object.prototype.toString.call(data) === '[object String]';
};

/**
 * @description data is number
 */
export const isNumber = function (data: unknown): data is number {
  return (
    Object.prototype.toString.call(data) === '[object Number]' &&
    !Number.isNaN(data)
  );
};

/**
 * @description data is symbol
 */
export const isSymbol = function (data: unknown): data is symbol {
  return Object.prototype.toString.call(data) === '[object Symbol]';
};

/**
 * @description data is boolean
 */
export const isBoolean = function (data: unknown): data is boolean {
  return Object.prototype.toString.call(data) === '[object Boolean]';
};

/**
 * @description data is undefined
 */
export const isUndef = function (data: unknown): data is undefined {
  return data === undefined;
};

/**
 * @description data is null
 */
export const isNull = function (data: unknown): data is null {
  return data === null;
};

/**
 * @description data is function
 */
export const isFun = function <T extends (...any: unknown[]) => unknown>(
  data: unknown
): data is T {
  return typeof data === 'function';
};

/**
 * @description data is not undefined and null
 */
export const hasData = (data: unknown) => data !== null || data !== undefined;

export function isEmpty(data: unknown): data is undefined | null {
  return data === null || data === undefined;
}

/**
 * @description data is basic type
 */
export const isBasicType = (data: unknown) =>
  isUndef(data) ||
  isNull(data) ||
  isString(data) ||
  isNumber(data) ||
  isBoolean(data) ||
  isSymbol(data);

export function forEach(
  target: string,
  cb: (value: string, index: number, self: string) => unknown
): void;
export function forEach<T>(
  target: T[],
  cb: (value: T, index: number, self: T[]) => unknown
): void;
export function forEach(
  target: FileList,
  cb: (value: File, index: number, self: FileList) => unknown
): void;
export function forEach(
  target: DataTransferItemList,
  cb: (
    value: DataTransferItem,
    index: number,
    self: DataTransferItemList
  ) => unknown
): void;
export function forEach<T extends object>(
  target: T,
  cb: (value: T[keyof T], key: string, self: T) => unknown
): void;
/**
 * @description 迭代器
 */
export function forEach<T extends (...anys: unknown[]) => unknown>(
  target: unknown,
  cb: T
) {
  if (
    isArray(target) ||
    isString(target) ||
    target instanceof FileList ||
    target instanceof DataTransferItemList
  ) {
    const len = target.length;
    let i = 0;

    for (; i < len; i++) {
      if (cb(target[i], i, target) === false) break;
    }
  } else if (target && typeof target === 'object') {
    const keys = Object.keys(target);
    const len = keys.length;
    let i = 0;

    for (; i < len; i++) {
      if (cb(target[keys[i] as keyof typeof target], keys[i], target) === false)
        break;
    }
  }
}

/** @description 字符检查工具 */
export const checkCharacter = (reg: RegExp) => (s: string) => reg.test(s);

/**
 * @description 判断是否可以渲染，同时返回一个无意义字符串通过 react 的检查
 */
export const isRenderElement = (condition: unknown) =>
  condition ? 'render' : undefined;

export const assign = <T>(
  obj: OrdinaryObject,
  ...args: OrdinaryObject[]
): T => {
  for (let i = 0; i < args.length; i++) {
    const curr = args[i];
    const _names = Object.getOwnPropertyNames(args[i]);
    const _symbols = Object.getOwnPropertySymbols(args[i]);

    for (let j = 0; j < _names.length; j++) {
      if (
        typeof curr[_names[j]] === 'undefined' &&
        typeof obj[_names[j]] !== 'undefined'
      ) {
        continue;
      }

      obj[_names[j]] = curr[_names[j]];
    }

    for (let j = 0; j < _symbols.length; j++) {
      if (
        typeof curr[_symbols[j]] === 'undefined' &&
        typeof obj[_symbols[j]] !== 'undefined'
      ) {
        continue;
      }

      obj[_symbols[j]] = curr[_symbols[j]];
    }
  }

  return obj as T;
};

/**
 *
 * @param width canvas 宽
 * @param height canvas 高
 * @returns canvas 及对应上下文
 */
export const createCanvasContext: CreateCanvasContext = (options) => {
  const _canvas = window.document.createElement('canvas');
  const context = _canvas.getContext('2d', {
    willReadFrequently: options?.willReadFrequently
  });

  if (options?.width) {
    _canvas.width = options.width;
  }
  if (options?.height) {
    _canvas.height = options.height;
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return { canvas: _canvas, context: context! };
};

export * from './http';

export * from './classnames';

export * from './elements';

export * from './events';

export * from './polling';

export { default as base64 } from './crypto/base64';
