declare namespace Http {
  interface HttpOptions {
    method?:
      | 'get'
      | 'post'
      | 'options'
      | 'head'
      | 'put'
      | 'delete'
      | 'connect'
      | 'trace';
    headers?: { [key: string]: string };
    data?: Document | XMLHttpRequestBodyInit;
    params?: { [key: string]: string };
    timeout?: number;
    onUploadProgress?: (
      this: XMLHttpRequestUpload,
      ev: ProgressEvent<XMLHttpRequestEventTarget>
    ) => unknown;
    onDownloadProgress?: (
      this: XMLHttpRequest,
      ev: ProgressEvent<XMLHttpRequestEventTarget>
    ) => unknown;
  }

  interface RequestOptions extends HttpOptions {
    url: string;
  }

  type Request = {
    <T>(request: RequestOptions): Promise<T>;
  };
}
