declare interface Classnames {
  generateClass(
    classes: { [key: string]: boolean } | string[],
    ...items: string[]
  ): string;
  classnames(style: {
    readonly [key: string]: string;
  }): Classnames['generateClass'];
}
