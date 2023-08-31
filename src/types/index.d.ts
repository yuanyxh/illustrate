declare interface CommonProps<T>
  extends Omit<React.HTMLAttributes<T>, 'children'> {
  /** css class */
  readonly className?: string;
  /** inline style */
  readonly style?: React.CSSProperties;
}

/**
 * 公用组件 Props 参数类型定义
 */
declare type Props<T = HTMLElement> = CommonProps<T>;

declare interface ChildProps<T = HTMLElement> extends CommonProps<T> {
  /** function slot */
  readonly children?: React.ReactNode | React.ReactNode[];
}
