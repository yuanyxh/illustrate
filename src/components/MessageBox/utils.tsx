/* eslint-disable @typescript-eslint/no-explicit-any */
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { MessageBoxEncapsulate } from './config';
import { _MessageBox as MessageBoxComponent } from './MessageBox';
import type {
  TMessageBox,
  MessageBoxOptions,
  MessageBoxResolve,
  MessageBoxResult,
  MessageBoxOnAction
} from './types';

const getAppendToElement = (el?: HTMLElement) => el || window.document.body;

const getContainer = () => window.document.createElement('div');

function init(
  options: MessageBoxOptions & {
    onAction: MessageBoxOnAction;
  },
  container: HTMLElement
) {
  const { appendTo, ...props } = options;

  getAppendToElement(appendTo).appendChild(container);

  const node = createElement(
    MessageBoxComponent,
    Object.assign({}, props, { appendTo: undefined, callback: undefined })
  );
  const root = createRoot(container);

  root.render(node);

  return root;
}

function showMessage(
  options: MessageBoxOptions,
  resolve: MessageBoxResolve,
  reject: (reason?: any) => void
) {
  const container = getContainer();

  const onAction: MessageBoxOnAction = (action, value) => {
    const result: MessageBoxResult = { value: value, action };

    if (options.callback) {
      options.callback(result);
    } else {
      if (action === 'cancel' || action === 'close') {
        if (options.distinguishCancelAndClose && action !== 'cancel') {
          reject('close');
        } else {
          reject('cancel');
        }
      } else {
        resolve(result);
      }
    }

    Promise.resolve().then(() => {
      root.unmount();
      container.remove();
    });
  };

  const newOptions = Object.assign({}, options, { onAction });

  const root = init(newOptions, container);

  return root;
}

const MessageBox: TMessageBox = ((
  options: MessageBoxOptions
): Promise<MessageBoxResult> => {
  return new Promise((resolve, reject) => {
    showMessage(options, resolve, reject);
  });
}) as TMessageBox;

MessageBoxEncapsulate.forEach(function (val) {
  MessageBox[val] = function (options) {
    const closeOnClickModal =
      val !== 'alert' ? options.closeOnClickModal : false;

    const showCancelButton =
      val !== 'confirm' && val !== 'prompt' ? options.showCancelButton : true;
    const showInput = val !== 'prompt' ? options.showInput : true;

    return MessageBox(
      Object.assign({}, options, {
        internalType: val,
        closeOnClickModal: closeOnClickModal,
        showCancelButton: showCancelButton,
        showInput: showInput
      })
    );
  };
});

export default MessageBox;
