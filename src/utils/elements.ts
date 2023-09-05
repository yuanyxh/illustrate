/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */

/**
 * @description 原生元素处理接口
 */
export class ElementPort<T extends HTMLElement> {
  private ele: React.RefObject<T>;

  constructor(eleRef: React.RefObject<T>) {
    this.ele = eleRef;
  }

  private run(cb: (ref: T) => unknown) {
    const ele = this.ele.current;

    if (!ele) return false;

    cb(ele);

    return this;
  }

  css(
    key: keyof React.CSSProperties,
    value: React.CSSProperties[keyof React.CSSProperties]
  ) {
    this.run((ele) => {
      // @ts-ignore
      ele.style[key] = value;
    });

    return this;
  }

  on<T extends keyof HTMLElementEventMap>(
    type: T,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[T]) => any
  ) {
    this.run((ele) => {
      ele.addEventListener(type, listener);
    });

    return this;
  }

  once<T extends keyof HTMLElementEventMap>(
    type: T,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[T]) => any
  ) {
    this.run((ele) => {
      const _listener: typeof listener = (e) => {
        listener.call(ele, e);

        this.off(type, _listener);
      };

      ele.addEventListener(type, _listener);
    });

    return this;
  }

  off<T extends keyof HTMLElementEventMap>(
    type: T,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[T]) => any
  ) {
    this.run((ele) => {
      ele.removeEventListener(type, listener);
    });

    return this;
  }

  show() {
    this.run((ele) => {
      ele.style.display = 'revert';
    });

    return this;
  }

  hide() {
    this.run((ele) => {
      ele.style.display = 'none';
    });

    return this;
  }

  exec(cb: (ref: T) => unknown) {
    this.run(cb);

    return this;
  }
}

/**
 * @description 检测元素是否相交工具类
 */
export class Rectangle {
  width;
  height;
  center;
  middle;

  constructor(width: number, height: number, center: number, middle: number) {
    this.width = width;
    this.height = height;
    this.center = center;
    this.middle = middle;
  }

  intersectRectangle(target: Rectangle) {
    const horizontalIntersection =
      Math.abs(this.center - target.center) < (this.width + target.width) / 2;
    const verticalIntersection =
      Math.abs(this.middle - target.middle) < (this.height + target.height) / 2;

    return horizontalIntersection && verticalIntersection;
  }

  static from<T extends HTMLElement>(el: T) {
    const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = el;

    return new Rectangle(
      offsetWidth,
      offsetHeight,
      offsetLeft + offsetWidth / 2,
      offsetTop + offsetHeight / 2
    );
  }
}

/**
 * @description 创建原生元素处理接口对象
 */
export const createPort = <T extends HTMLElement>(
  eleRef: React.RefObject<T>
) => {
  return new ElementPort(eleRef);
};
