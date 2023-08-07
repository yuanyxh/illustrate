export type Children = ChildProps['children'];

export type Default = Children | (() => Children);

/** 命名插槽 */
export type NameSlot = {
  /** 默认插槽, 触发选择文件动作 */ default: Default;
  /** tips 提示插槽 */ tips?: Default;
};

export type UploadChild = Children | NameSlot;

export type ClearFiles = (index?: number) => void;

export type BeforeUpload = (
  /** 待上传的文件列表 */
  file: File
  /** 严格检查文件类型的工具函数 */
  // check: typeof strictInspection
) => unknown;

export type OnMessage = {
  (
    /** 通知类型，Overflow：文件个数超出限制、Success：文件上传成功、Fail：文件上传失败 */
    type: Message.Overflow,
    /** 文件列表或具体文件，文件超出限制时为文件列表，否则为具体文件 */
    files: File[],
    clearFiles: ClearFiles
  ): unknown;
  (type: Message.Success, file: File, clearFiles?: ClearFiles): unknown;
  (type: Message.Fail, file: File, clearFiles?: ClearFiles): unknown;
};

export type Request = (
  /** 上传的文件 */ files: File,
  /** 上传额外配置 */ options: {
    headers: Headers;
    data: Data;
    onUploadProgress: OnUploadProgress;
  }
) => Promise<unknown>;

export type OnUploadProgress = Http.HttpOptions['onUploadProgress'];

export type TransformResponse = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  /** 响应数据 */ data: any,
  /** 上传的文件 */ file: UploadFile
) => { id?: string; name?: string; url: string };

export type Headers = { [key: string]: string };

export type Data = { [key: string]: string | Blob };

export interface UploadFile {
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
