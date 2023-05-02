import { isNumber, forEach } from '@/utils';

export const request: Http.Request = function request(config) {
  return new Promise((resolve, reject) => {
    const {
      url,
      method = 'get',
      headers = {},
      data,
      params,
      timeout,
      onDownloadProgress,
      onUploadProgress
    } = config;

    const queryUrl = new URLSearchParams(params).toString();

    const xhr = new XMLHttpRequest();
    xhr.open(method, queryUrl ? `${url}?${queryUrl}` : url, true);

    forEach(headers, (header, key) => xhr.setRequestHeader(key, header));

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
        const json: string = xhr.responseText || xhr.response;
        let data = null;
        try {
          data = JSON.parse(json);
        } catch (e) {
          data = json;
        }
        resolve(data);
      }
    };

    xhr.onabort = reject;
    xhr.onerror = reject;
    xhr.ontimeout = reject;

    onDownloadProgress && xhr.addEventListener('progress', onDownloadProgress);
    onUploadProgress &&
      xhr.upload.addEventListener('progress', onUploadProgress);

    isNumber(timeout) && (xhr.timeout = timeout);

    xhr.send(data);
  });
};
