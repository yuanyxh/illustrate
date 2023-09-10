import React, { useRef, useState, useEffect } from 'react';
import { buttonText, TypeComponentsMap } from './config';
import {
  classnames,
  createClass,
  isRenderElement,
  composeClass,
  createConsistentClick
} from '@/utils';
import MessageBox from './utils';
import { useTransition, useModel } from '@/hooks';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import Overlay from '@/components/Overlay/Overlay';
import type {
  Action,
  MessageBoxOnAction,
  MessageBoxInternalType,
  MessageBoxOptions
} from './types';
import style from './MessageBox.module.css';

interface _MessageBoxProps extends MessageBoxOptions {
  appendTo: undefined;
  callback: undefined;
  internalType?: MessageBoxInternalType;
  onAction: MessageBoxOnAction;
}

const generateClass = classnames(style);

/**
 * @description 消息提示
 */
export function _MessageBox(props: _MessageBoxProps) {
  const {
    title,
    message,
    type,
    internalType,
    inputType,
    inputPlaceholder,
    showClose = true,
    showInput = false,
    inputValue = '',
    inputErrorMessage = '',
    showCancelButton = false,
    cancelButtonText,
    showConfirmButton = true,
    confirmButtonText,
    closeOnClickModal = true,
    closeOnHashChange = true,
    inputPattern,
    distinguishCancelAndClose = false,
    beforeClose,
    inputValidator,
    onAction,
    appendTo,
    ...nativeProps
  } = props;

  appendTo;

  const [init, setInit] = useState(true);
  const [visible, setVisible] = useState(false);
  const [action, setAction] = useState<Action>('close');
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { value: modelValue, change: setModelValue } = useModel(inputValue);

  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisible(true);
    setInit(false);

    if (closeOnHashChange) window.addEventListener('hashchange', doClose);

    return () => {
      if (closeOnHashChange) window.addEventListener('hashchange', doClose);
    };
  }, []);

  const overlay = useTransition(
    visible,
    overlayRef,
    createClass(style['overlay-enter-active']),
    createClass(style['overlay-leave-active'])
  );

  useEffect(() => {
    setHasError(false);

    internalType === 'prompt' && modelValue !== '' && validate();
  }, [modelValue]);

  useEffect(() => {
    if (init) return;

    if ((+visible | +overlay) === 0) {
      onAction(action, modelValue);
    }
  }, [visible, overlay]);

  const messageBoxClass = generateClass(['message-box']);

  const typeIcon = type && TypeComponentsMap[type];

  const iconClass = composeClass(
    style['message-box-status'],
    style[`message-box-status-${type || 'info'}`],
    'iconfont',
    typeIcon ? typeIcon : ''
  );

  const stopPropagation: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
  };

  const validate = () => {
    if (internalType === 'prompt') {
      if (inputPattern && !inputPattern.test(modelValue)) {
        setHasError(true);
        setErrorMessage(inputErrorMessage || '');

        return false;
      } else {
        const result = inputValidator && inputValidator(modelValue);

        if (result === false) {
          setErrorMessage(inputErrorMessage || '');
          setHasError(true);

          return false;
        }

        if (typeof result === 'string') {
          setErrorMessage(result);
          setHasError(true);

          return false;
        }
      }
    }

    setErrorMessage('');
    setHasError(false);

    return true;
  };

  const clickModal = () => {
    closeOnClickModal &&
      handleAction(distinguishCancelAndClose ? 'close' : 'cancel');
  };

  const { onMouseDown, onMouseUp, onClick } = createConsistentClick(clickModal);

  function doClose() {
    setVisible(false);
  }

  const handleChange = (s: string) => {
    setModelValue(s);
  };
  const handleEnter = () => {
    if (inputType !== 'textarea') {
      return handleAction('confirm');
    }
  };

  const handleAction = (action: Action) => {
    if (internalType === 'prompt' && action === 'confirm' && !validate()) {
      return;
    }

    setAction(action);

    beforeClose
      ? beforeClose({ action, value: modelValue }, doClose)
      : doClose();
  };

  return (
    <Overlay ref={overlayRef} className={style['overlay']}>
      <div
        role="dialog"
        aria-modal={true}
        aria-label={title}
        className={style['message-box-overlay']}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onClick={onClick}
      >
        <div
          className={messageBoxClass}
          tabIndex={-1}
          onClick={stopPropagation}
          {...nativeProps}
        >
          {isRenderElement(title) && (
            <div className={style['message-box-header']}>
              <div className={style['message-box-title']}>{title}</div>

              {isRenderElement(showClose) && (
                <button
                  className={style['message-box-header-close']}
                  type="button"
                  aria-label="close"
                  onClick={() =>
                    handleAction(distinguishCancelAndClose ? 'close' : 'cancel')
                  }
                  onKeyDown={(e) => {
                    e.preventDefault();
                    e.key === 'Enter' &&
                      handleAction(
                        distinguishCancelAndClose ? 'close' : 'cancel'
                      );
                  }}
                >
                  <i className="iconfont icon-guanbi"></i>
                </button>
              )}
            </div>
          )}

          <div className={style['message-box-content']}>
            <div className={style['message-box-container']}>
              {isRenderElement(type && typeIcon && message) && (
                <i className={iconClass}></i>
              )}

              {isRenderElement(message) && (
                <div className={style['message-box-message']}>
                  {showInput ? <label>{message}</label> : <p>{message}</p>}
                </div>
              )}
            </div>

            {isRenderElement(showInput) && (
              <div className={style['message-box-input']}>
                <Input
                  type={inputType}
                  placeholder={inputPlaceholder}
                  value={modelValue}
                  change={handleChange}
                  enter={handleEnter}
                />

                {isRenderElement(hasError) && (
                  <div className={style['message-box-input-error-message']}>
                    {errorMessage}
                  </div>
                )}
              </div>
            )}
          </div>

          <footer className={style['message-box-footer']}>
            {isRenderElement(showCancelButton) && (
              <Button onClick={() => handleAction('cancel')}>
                {cancelButtonText || buttonText.CANCEL}
              </Button>
            )}

            {isRenderElement(showConfirmButton) && (
              <Button type="primary" onClick={() => handleAction('confirm')}>
                {confirmButtonText || buttonText.CONFIRM}
              </Button>
            )}
          </footer>
        </div>
      </div>
    </Overlay>
  );
}

export default MessageBox;
