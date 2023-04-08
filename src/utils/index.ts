/**
 * @description Array.isArray alias
 */
export const isArray = (any: unknown): any is unknown[] => Array.isArray(any);

export * from './classnames';
