export type Action = 'confirm' | 'close' | 'cancel';

export type MessageBoxResult = {
  value?: string;
  action: Action;
};

export type MessageBoxResolve = (
  value: MessageBoxResult | PromiseLike<MessageBoxResult>
) => void;

export type MessageBoxBeforeClose = (
  result: MessageBoxResult,
  doClose: () => void
) => void;

export type MessageBoxOnAction = (action: Action, value?: string) => void;

export type MessageBoxType = 'success' | 'warning' | 'error' | 'info';

export type MessageBoxInternalType = 'alert' | 'prompt' | 'confirm';

export interface MessageBoxOptions {
  title?: string;
  appendTo?: HTMLElement;
  type?: MessageBoxType;
  message?: React.ReactNode;
  showClose?: boolean;
  distinguishCancelAndClose?: boolean;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  cancelButtonText?: string;
  confirmButtonText?: string;
  closeOnClickModal?: boolean;
  closeOnHashChange?: boolean;
  showInput?: boolean;
  inputPlaceholder?: string;
  inputType?: React.HTMLInputTypeAttribute;
  inputValue?: string;
  inputPattern?: RegExp;
  inputErrorMessage?: string;
  callback?(result: MessageBoxResult): void;
  inputValidator?(val: string): string | boolean;
  beforeClose?: MessageBoxBeforeClose;
}

export interface TMessageBox {
  (options: MessageBoxOptions): Promise<MessageBoxResult>;
  confirm: (options: MessageBoxOptions) => Promise<MessageBoxResult>;
  alert: (options: MessageBoxOptions) => Promise<MessageBoxResult>;
  prompt: (options: MessageBoxOptions) => Promise<MessageBoxResult>;
}
