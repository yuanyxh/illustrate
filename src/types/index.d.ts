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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare type Fn = (...args: unknown[]) => any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare type ComponentElement = (...args: any[]) => JSX.Element;

declare module '*.worker.ts' {
  // You need to change `Worker`, if you specified a different value for the `workerType` option
  class WebpackWorker extends Worker {
    constructor();
  }

  // Uncomment this if you set the `esModule` option to `false`
  // export = WebpackWorker;
  export default WebpackWorker;
}
