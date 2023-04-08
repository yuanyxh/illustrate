/**
 * 公用组件 Props 参数类型定义
 */
declare interface Props {
  /** css class */
  className?: string;
  /** inline style */
  style?: React.CSSProperties;
  /** function slot */
  children?: React.ReactNode | React.ReactNode[];
}
