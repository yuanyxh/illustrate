import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  composeClass,
  createClass,
  isRenderElement,
  createConsistentClick
} from '@/utils';
import { useTransition } from '@/hooks';
import Overlay from '@/components/Overlay/Overlay';
import style from './Dialog.module.css';

type Node = React.ReactNode | React.ReactNode[];

type DialogSlots = {
  header?(): Node;
  body(): Node;
  footer?(): Node;
};

interface DialogProps extends Props {
  show: boolean;
  change: React.Dispatch<React.SetStateAction<boolean>>;
  children: Node | DialogSlots;
  onClose?(): void;
  showClose?: boolean;
  modal?: boolean;
  title?: string;
  closeOnClickModal?: boolean;
  lockScroll?: boolean;
}

function isDialogSlots(data: unknown): data is DialogSlots {
  return data ? typeof (data as DialogSlots).body === 'function' : false;
}

/**
 * @description dialog 弹窗
 */
export default function Dialog(props: DialogProps) {
  const {
    show,
    change,
    onClose,
    children,
    title = '',
    modal,
    showClose = true,
    closeOnClickModal = true,
    className = '',
    style: _style,
    ...nativeProps
  } = props;

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const dialogOverlayRef = useRef<HTMLDivElement | null>(null);

  useTransition(
    show,
    overlayRef,
    createClass(style['overlay-enter-active']),
    createClass(style['overlay-leave-active'])
  );

  useTransition(
    show,
    dialogOverlayRef,
    createClass(style['dialog-overlay-enter-active']),
    createClass(style['dialog-overlay-leave-active'])
  );

  const modalClick = () => {
    if (closeOnClickModal) {
      change(false);
      onClose && onClose();
    }
  };

  const { onMouseDown, onMouseUp, onClick } = createConsistentClick(modalClick);

  return createPortal(
    <Overlay ref={overlayRef} className={style['overlay']} mask={modal}>
      <div
        ref={dialogOverlayRef}
        role="dialog"
        aria-modal={true}
        aria-label={title}
        className={composeClass(style['dialog-overlay'])}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onClick={onClick}
      >
        <div
          className={composeClass(style['dialog'], className)}
          style={_style}
          {...nativeProps}
        >
          <header className={style['dialog-header']}>
            {isDialogSlots(children) && children.header ? (
              children.header()
            ) : (
              <span className={style['dialog-header-title']}>{title}</span>
            )}

            {isRenderElement(showClose) && (
              <button
                className={style['dialog-header-close']}
                aria-label="close"
                type="button"
                onClick={() => {
                  change(false);
                  onClose && onClose();
                }}
              >
                <i
                  className={composeClass(
                    'iconfont icon-guanbi',
                    style['dialog-header-icon']
                  )}
                ></i>
              </button>
            )}
          </header>

          <section className={style['dialog-body']}>
            {isDialogSlots(children) ? children.body() : children}
          </section>

          <footer className={style['dialog-footer']}>
            {isDialogSlots(children) && children.footer
              ? children.footer()
              : ''}
          </footer>
        </div>
      </div>
    </Overlay>,
    window.document.body
  );
}
