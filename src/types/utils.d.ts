declare enum PollingSubscribeType {
  failed = 'failed'
}

declare interface PollingOptions {
  delay?: number;
  maxRetryCount?: number;
}

declare interface PollingResult {
  cacelPolling(): void;
  subscribe<T extends Fn>(type: PollingSubscribeType, fn: T): void;
}

declare type Polling = <T extends Fn>(
  fn: T,
  options?: PollingOptions,
  ...args: Parameters<T>
) => void;

declare type OrdinaryObject = {
  [key: string | symbol]: unknown;
};

declare interface CreateCanvasContextOptions {
  width?: number;
  height?: number;
  willReadFrequently?: boolean;
}

declare interface CreateCanvasContextResult {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
}

declare type CreateCanvasContext = (
  options?: CreateCanvasContextOptions
) => CreateCanvasContextResult;
