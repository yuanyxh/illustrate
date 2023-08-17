declare interface Classnames {
  /**
   *
   * @description css class 生成工具
   * @param classes 传入的 css class 数组 或对象, 如果传入的是对象, 则会根据 value 值决定是否添加对应的 css class
   * @param items 可选的项, 用于添加全局类
   */
  generateClass(
    classes: { [key: string]: boolean } | string[],
    ...items: string[]
  ): string;
  /**
   *
   * @description css class 管理工具
   * @param style 一个 css module 对象, 会缓存它并在适当的时机(调用 generateClass 时)去获取其中的数据
   */
  classnames(style: {
    readonly [key: string]: string;
  }): Classnames['generateClass'];
}

declare interface TransitionClass {
  active: string;
  from?: string;
  to?: string;
}
