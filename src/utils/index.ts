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

export * from './classnames';
