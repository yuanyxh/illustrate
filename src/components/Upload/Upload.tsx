import React, {
  createElement,
  isValidElement,
  forwardRef,
  useRef,
  useMemo,
  useImperativeHandle,
  useEffect
} from 'react';
import { isArray, isFun, isNumber, hasData, forEach, request } from '@/utils';
import {
  stopPropagation,
  generateId,
  isNameSlot,
  strictInspection
} from './utils';
import { Message } from './types';
import type { Children, Request, UploadFile, UploadProps } from './types';

/**
 * @description 文件上传组件
 */
export default forwardRef(function Upload(props: Readonly<UploadProps>, ref) {
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

  let defaultSlot: Children, tipsSlot: Children;

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
      return onMessage(Message.Overflow, files, clearFiles);

    beforeUploadHandler(files);

    e.target.value = '';
  };

  const dropFile: React.DragEventHandler<HTMLDivElement> = function (e) {
    stopPropagation(e);

    const { files } = e.dataTransfer;

    if (disabled || !files.length) return;

    if (!multiple && files.length > 1)
      return onMessage(Message.Overflow, files, clearFiles);

    beforeUploadHandler(files);
  };

  const beforeUploadHandler = async function beforeUploadHandler(
    files: FileList
  ) {
    if (isNumber(limit) && limit < files.length + value.length)
      return onMessage(Message.Overflow, files, clearFiles);

    forEach(files, async function (file) {
      const pause =
        beforeUpload && (await beforeUpload(file, strictInspection));

      if (pause === false) return;

      const id = generateId();

      const curr: UploadFile = {
        id,
        status: 'loading',
        file: file,
        name: file.name,
        percent: 0
      };

      change((prev) => [...prev, curr]);

      uploadHandler(curr);
    });
  };

  /** 文件上传处理 */
  const uploadHandler = async function uploadHandler(curr: UploadFile) {
    const { id, file } = curr;

    if (!file)
      throw Error(
        'please check the file, if the file exist, go to the https://github.com/yuanyxh/illustrate/issues feedback'
      );

    try {
      const response = transformResponse(
        await http(file, {
          headers,
          data,
          onUploadProgress(e) {
            const progress = e.lengthComputable
              ? Math.floor((e.loaded / e.total) * 100)
              : 0;

            change((prev) => {
              const index = prev.findIndex((file) => file.id === id);
              if (index < 0) return prev;

              prev[index].percent = progress;

              return [...prev];
            });
          }
        }),
        curr
      );

      change((prev) => {
        const index = prev.findIndex((file) => file.id === id);

        if (index < 0) return prev;

        prev[index] = {
          ...response,
          name: response.name || file.name,
          id: response.id || curr.id,
          status: 'done',
          percent: 100
        };

        return [...prev];
      });

      onMessage(Message.Success, file, clearFiles);
    } catch (err) {
      change((prev) => {
        const index = prev.findIndex((file) => file.id === id);

        if (index < 0) return prev;

        prev[index] = { ...prev[index], percent: 0, status: 'error', file };

        return [...prev];
      });

      console.error(err);

      onMessage(Message.Fail, file, clearFiles);
    }
  };

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

  /** 清除文件 */
  function clearFiles(index?: number) {
    if (hasData(index)) change((prev) => prev.filter((_, i) => i !== index));
    else change(() => []);
  }

  if (isArray(children) || isValidElement(children)) defaultSlot = children;

  if (isNameSlot(children)) {
    const { default: defaultElement, tips } = children;

    defaultSlot = isFun(defaultElement) ? defaultElement() : defaultElement;

    tipsSlot = isFun(tips) ? tips() : tips;
  }

  const fileRef = useRef<HTMLInputElement>(null);

  const http = useMemo(
    () => (isFun(customRequest) ? customRequest : uploader),
    [customRequest]
  );

  useImperativeHandle(
    ref,
    () => {
      return {
        retry(id: string) {
          change((prev) => {
            const index = prev.findIndex((file) => file.id === id);

            if (index < 0) return prev;

            const curr = prev[index];

            curr.status = 'loading';

            uploadHandler(curr);

            return [...prev];
          });
        }
      };
    },
    []
  );

  useEffect(() => {
    document.addEventListener('dragover', stopPropagation);
    document.addEventListener('drop', stopPropagation);

    return () => {
      document.removeEventListener('dragover', stopPropagation);
      document.removeEventListener('drop', stopPropagation);
    };
  }, []);

  return (
    <>
      {createElement(
        'div',
        {
          onClick: triggerUpload,
          onDragOver: (e) => e.preventDefault(),
          onDrop: drag ? dropFile : undefined,
          ...nativeProps
        },
        defaultSlot
      )}

      {tipsSlot}

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
});
