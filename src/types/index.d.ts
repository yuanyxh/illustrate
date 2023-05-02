declare interface CommonProps {
  /** css class */
  readonly className?: string;
  /** inline style */
  readonly style?: React.CSSProperties;
}

/**
 * 公用组件 Props 参数类型定义
 */
declare type Props = CommonProps;

declare interface ChildProps extends CommonProps {
  /** function slot */
  readonly children?: React.ReactNode | React.ReactNode[];
}
