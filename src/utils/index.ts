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
export const hasData = (data: unknown) => data != null;

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

export * from './http';

export * from './classnames';

export { default as base64 } from './crypto/base64';
