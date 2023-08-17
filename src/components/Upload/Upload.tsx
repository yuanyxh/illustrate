import React, {
  createElement,
  isValidElement,
  useState,
  useRef,
  useMemo,
  useEffect
} from 'react';
import {
  isArray,
  isFun,
  isNumber,
  hasData,
  forEach,
  request,
  composeClass,
  isRenderElement
} from '@/utils';
import { stopPropagation, generateId, isNameSlot } from './utils';
import { Message } from './types';
import type { Children, Request, UploadFile, UploadProps } from './types';
import style from './Upload.module.css';

/**
 * @description 文件上传组件
 */
export default function Upload(props: Readonly<UploadProps>) {
  const {
    value,
    action,
    headers = {},
    data = {},
    method = 'post',
    name = 'file',
    accept = [],
    multiple = false,
    directory = false,
    disabled = false,
    drag = false,
    capture,
    limit,
    children,
    change,
    transformResponse,
    beforeUpload,
    onMessage = () => {
      /* empty */
    },
    request: customRequest,
    ...nativeProps
  } = props;

  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  /** 默认上传动作 */
  const uploader: Request = function uploader(
    file,
    { headers, data, onUploadProgress }
  ) {
    const formData = new FormData();

    forEach(data, (value, key) => formData.append(key, value));

    formData.append(name, file, file.name);

    return request({
      url: action,
      method,
      headers,
      data: formData,
      onUploadProgress
    });
  };

  const http = useMemo(
    () => (isFun(customRequest) ? customRequest : uploader),
    [customRequest]
  );

  useEffect(() => {
    document.addEventListener('dragover', stopPropagation);
    document.addEventListener('drop', stopPropagation);

    return () => {
      document.removeEventListener('dragover', stopPropagation);
      document.removeEventListener('drop', stopPropagation);
    };
  }, []);

  useEffect(() => {
    if (isNumber(limit) && limit < uploadFiles.length + value.length) {
      onMessage(Message.Overflow, uploadFiles, clearFiles);

      return;
    }

    const file = uploadFiles.shift();

    if (!file) return;

    const pause = beforeUpload && beforeUpload(file);

    if (pause === false) return;

    setUploadFile(file);
    setUploadFiles([...uploadFiles]);
  }, [uploadFiles]);

  useEffect(() => {
    if (!uploadFile) return;

    const file = uploadFile;

    const id = generateId();

    const curr: UploadFile = {
      id,
      status: 'loading',
      file: file,
      name: file.name,
      percent: 0
    };

    change((prev) => [...prev, curr]);

    http(file, {
      headers,
      data,
      onUploadProgress(e) {
        const progress = e.lengthComputable
          ? Math.floor((e.loaded / e.total) * 100)
          : 0;

        change((prev) => {
          const index = prev.findIndex((file) => file.id === curr.id);

          if (index < 0) return prev;

          prev[index] = { ...prev[index], percent: progress };

          return [...prev];
        });
      }
    })
      .then((res) => {
        const result = transformResponse(res, curr);

        change((prev) => {
          const index = prev.findIndex((file) => file.id === curr.id);

          if (index < 0) return prev;

          prev[index] = {
            ...result,
            name: result.name || curr.name,
            id: result.id || curr.id,
            status: 'done',
            percent: 100
          };

          return [...prev];
        });

        onMessage(Message.Success, file, clearFiles);
      })
      .catch((err) => {
        change((prev) => {
          const index = prev.findIndex((file) => file.id === id);

          if (index < 0) return prev;

          console.log(prev[index].percent);

          prev[index] = {
            ...prev[index],
            status: 'error',
            file: file
          };

          return [...prev];
        });

        console.error(err);

        onMessage(Message.Fail, file, clearFiles);
      });

    return () => {
      /* TODO: 请求取消 */
    };
  }, [uploadFile]);

  let defaultSlot: Children, tipsSlot: Children;

  if (isArray(children) || isValidElement(children)) defaultSlot = children;

  if (isNameSlot(children)) {
    const { default: defaultElement, tips } = children;

    defaultSlot = isFun(defaultElement) ? defaultElement() : defaultElement;

    tipsSlot = isFun(tips) ? tips() : tips;
  }

  /** 触发点击上传 */
  const triggerUpload: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    fileRef.current?.click();
  };

  /** 处理点击上传后的文件 */
  const queryFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files;

    if (disabled || !files || !files.length) return;

    if (!multiple && files.length > 1)
      return onMessage(Message.Overflow, Array.from(files), clearFiles);

    setUploadFiles(Array.from(files));

    e.target.value = '';
  };

  const dropFile: React.DragEventHandler<HTMLDivElement> = function (e) {
    stopPropagation(e);

    const { files } = e.dataTransfer;

    if (disabled || !files.length) return;

    if (!multiple && files.length > 1)
      return onMessage(Message.Overflow, Array.from(files), clearFiles);

    setUploadFiles(Array.from(files));
  };

  /** 清除文件 */
  function clearFiles(index?: number) {
    if (hasData(index)) change((prev) => prev.filter((_, i) => i !== index));
    else change(() => []);
  }

  return (
    <>
      {createElement(
        'div',
        {
          className: composeClass(style['upload'], nativeProps.className || ''),
          style: nativeProps.style,
          onClick: triggerUpload,
          onDragOver: (e) => e.preventDefault(),
          onDrop: drag ? dropFile : undefined
        },
        defaultSlot
      )}

      {isRenderElement(tipsSlot) && <p className={style['tips']}>{tipsSlot}</p>}

      {createElement('input', {
        style: {
          display: 'none',
          visibility: 'hidden'
        },
        directory: directory ? 'directory' : undefined,
        webkitdirectory: directory ? 'webkitdirectory' : undefined,
        type: 'file',
        ref: fileRef,
        disabled,
        capture,
        multiple,
        accept,
        onChange: queryFile
      })}
    </>
  );
}
