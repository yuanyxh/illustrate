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
import _style from './Upload.module.css';

type Children = ChildProps['children'];
type Default = Children | (() => Children);
/** 命名插槽 */
type NameSlot = {
  /** 默认插槽, 触发选择文件动作 */ default: Default;
  /** tips 提示插槽 */ tips?: Default;
};
type UploadChild = Children | NameSlot;
type ClearFiles = (index?: number) => void;

type BeforeUpload = (
  /** 待上传的文件列表 */
  file: File,
  /** 严格检查文件类型的工具函数 */
  check: typeof strictInspection
) => unknown;
type OnMessage = {
  (
    /** 通知类型，Overflow：文件个数超出限制、Success：文件上传成功、Fail：文件上传失败 */
    type: Message.Overflow,
    /** 文件列表或具体文件，文件超出限制时为文件列表，否则为具体文件 */
    files: FileList,
    clearFiles: ClearFiles
  ): unknown;
  (type: Message.Success, file: File, clearFiles?: ClearFiles): unknown;
  (type: Message.Fail, file: File, clearFiles?: ClearFiles): unknown;
};
type Request = (
  /** 上传的文件 */ files: File,
  /** 上传额外配置 */ options: {
    headers: Headers;
    data: Data;
    onUploadProgress: OnUploadProgress;
  }
) => Promise<unknown>;
type OnUploadProgress = Http.HttpOptions['onUploadProgress'];
type TransformResponse = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  /** 响应数据 */ data: any,
  /** 上传的文件 */ file: UploadFile
) => { id?: string; name?: string; url: string };
type Headers = { [key: string]: string };
type Data = { [key: string]: string | Blob };

interface UploadFile {
  /** 文件唯一标识符 */
  id: string;
  /** 文件名称 */
  name: string;
  /** 当前文件状态，loading：上传中、done：已上传、error：上传失败 */
  status: 'loading' | 'done' | 'error';
  /** 上传进度 */
  percent: number;
  /** 上传中文件 */
  file?: File;
  /** 文件 URL */
  url?: string;
  /** 文件大小 */
  size?: number;
  /** 文件类型 */
  type?: string;
}

export enum Message {
  /** 文件超出限制 */
  Overflow = 'Overflow',
  /** 文件上传成功 */
  Success = 'Success',
  /** 文件上传失败 */
  Fail = 'Fail'
}

export interface ExposeMethod {
  retry(id: string): void;
}

export interface UploadProps extends Props {
  className?: string;
  style?: React.CSSProperties;
  /** 文件列表 */
  value: UploadFile[];
  /** 文件上传接口 */
  action: string;
  /** 请求方式 */
  method?: Http.HttpOptions['method'];
  headers?: Headers;
  data?: Data;
  /** 文件上传字段 */
  name?: string;
  /** 允许选择的文件类型 */
  accept?: string[];
  /** 是否允许多选 */
  multiple?: boolean;
  directory?: boolean;
  /**
   * 该属性只在移动设备中生效，指示文件是否来自外部输入，如音频录入、视频拍摄等，具体采用何种方式由用户代理决定；
   * 在现代浏览器中，使用的外部输入设备可能与 accept 属性有关，如 accept 指定允许的文件类型为音频时，用户代理
   * 可能调用手机音频录入设备来获取音频文件；
   * 为保证跨浏览器兼容，accept 应该是标准的 MIME type 类型
   * */
  capture?: 'user' | 'environment';
  /** 启用拖拽上传 */
  drag?: boolean;
  /** 禁用上传 */
  disabled?: boolean;
  /** 限制上传的最大数量 */
  limit?: number;
  children?: UploadChild;
  /** 修改文件列表 */
  change: React.Dispatch<React.SetStateAction<UploadFile[]>>;
  /** 转换响应数据 */
  transformResponse: TransformResponse;
  /** 上传前动作，返回 false 可取消上传当前文件 */
  beforeUpload?: BeforeUpload;
  /** 消息通知，在文件超出 limit 限制、文件上传成功、文件上传失败时触发 */
  onMessage?: OnMessage;
  /** 自定义上传逻辑，返回一个 Promise */
  request?: Request;
}

function stopPropagation<T extends Event, U extends React.DragEvent>(e: T | U) {
  e.preventDefault();
  e.stopPropagation();
}

/** 生成文件 id */
function generateId() {
  return 'File_' + Math.random().toString(32).substring(4) + Date.now();
}

/** 是否是命名插槽 */
function isNameSlot(data: unknown): data is NameSlot {
  return hasData(data) && hasData((data as NameSlot).default);
}

/** 获取最大字节长度 */
function getLength(types: string[]) {
  return types.reduce((prev, curr) => {
    const len = curr.split('0x')[1].length || 0;
    return len > prev ? len : prev;
  }, 0);
}

/** 读取文件数据 */
function readAsArrayBuffer(blob: Blob) {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
}

/**
 *
 * @description 严格检查文件类型
 * @param files filelist 实例
 * @param types 文件头，16 进制数据，如 jpeg 的文件头数据为 0xFFD8FF
 * @param cb 执行回调
 */
async function strictInspection(file: File, types: string[]) {
  const maxLength = getLength(types);

  const buffer = await readAsArrayBuffer(file.slice(0, maxLength));

  const hex = new Uint8Array(buffer).reduce(
    (prev, curr) => (prev += curr.toString(16)),
    '0x'
  );

  return types.some(
    (type) =>
      type === hex.slice(0, type.length) ||
      type.toLowerCase() === hex.slice(0, type.length)
  );
}

/**
 * @description 文件上传组件
 */
export default forwardRef(function Upload(props: Readonly<UploadProps>, ref) {
  const {
    className,
    style,
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
    request: customRequest
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

    if (!files || !files.length) return;

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
        'plase check the file, if the file exist, go to the https://github.com/yuanyxh/illustrate/issues feedback'
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
    const formdata = new FormData();

    forEach(data, (value, key) => formdata.append(key, value));

    formdata.append(name, file, file.name);

    return request({
      url: action,
      method,
      headers,
      data: formdata,
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
          className: _style.upload + ' ' + className,
          style,
          onClick: triggerUpload,
          onDragOver: (e) => e.preventDefault(),
          onDrop: drag ? dropFile : undefined
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
