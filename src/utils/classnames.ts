import { isArray } from '.';

/**
 *
 * @param style css module object
 * @returns generate class with style and component state
 */
export const classnames: Classnames['classnames'] = function classnames(style) {
  return function generateClass(classes, ...names) {
    const isStatic = isArray(classes);
    const fileds = isStatic ? classes : Object.keys(classes);

    let filed;
    const classnames = [];

    while ((filed = fileds.shift())) {
      if (isStatic) {
        classnames.push(style[filed]);
      } else {
        classes[filed as keyof typeof classes] && classnames.push(style[filed]);
      }
    }

    return classnames.concat(names).join(' ');
  };
};
