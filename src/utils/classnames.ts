import { isArray, forEach } from '.';

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

/**
 * @description 组合多个类
 */
export const composeClass = (...classes: string[]) => {
  const results: string[] = [];

  forEach(classes, (_class) => {
    const _classes = _class.split(/\s+/).filter((val) => !!val.trim());

    results.push(..._classes);
  });

  return results.join(' ');
};

/**
 * @description 创建过渡、动画所需类
 */
export const createClass = (active: string, from?: string, to?: string) => {
  return { active, from, to };
};
