import React, { useRef } from 'react';
import { useModel } from '@/hooks';
import { classnames } from '@/utils';
import Upload from '@/components/Upload/Upload';
import { Message, ExposeMethod } from '@/components/Upload/types';
import type { UploadProps } from '@/components/Upload/types';
import style from './UploadFile.module.css';

interface UploadResult {
  message: string;
  status: number;
  result: { name: string; link: string }[];
}

// --title: 文件上传--

const generateClass = classnames(style);

export default function UploadFile() {
  const baseUploadModel = useModel<UploadProps['value']>([]);
  const controlUploadModel = useModel<UploadProps['value']>([]);
  const imageInputUploadModel = useModel<UploadProps['value']>([]);
  const audioInputUploadModel = useModel<UploadProps['value']>([]);
  const retryInputUploadModel = useModel<UploadProps['value']>([]);
  const dragInputUploadModel = useModel<UploadProps['value']>([]);

  const uploadRef = useRef<ExposeMethod>(null);

  const transformResponse: UploadProps['transformResponse'] = (
    data: UploadResult
  ) => {
    return {
      name: data.result[0].name,
      url: data.result[0].link
    };
  };

  const beforeUpload: UploadProps['beforeUpload'] = async (file, check) => {
    const isValid = await check(file, ['0xffd8ffe', '0x89504e47']);

    if (!isValid || file.size > 5 * 1024 * 1024 * 1024) {
      window.alert('非法文件，请检查文件类型或文件大小');

      return false;
    }
  };

  const onMessage: UploadProps['onMessage'] = (type) => {
    switch (type) {
      case Message.Overflow:
        window.alert('文件超出限制');
        break;
      case Message.Success:
        break;
      case Message.Fail:
        break;
      default:
        console.warn(`unknown type of ${type}`);
        break;
    }
  };

  return (
    <div className={style['upload-file']}>
      <h1 className={style.title}>文件上传</h1>

      <p className={style.description}>
        文件上传组件效果展示，案例使用的接口是 node 写的本地接口，有需要可前往{' '}
        <a
          href="https://github.com/yuanyxh/services"
          target="_blank"
          rel="noreferrer"
        >
          services
        </a>
      </p>

      <div className={style.content}>
        <h2 className={style.subtitle}>普通上传</h2>
        <p className={style.description}>
          最基本的文件上传，通过默认插槽触发选择文件的事件，同时需要以下必传属性：
        </p>
        <ul className={style.list}>
          <li className={style['list-item']}>
            <code>value</code>
            ：绑定的文件数据，是一个数组，数组元素必须是以下数据结构：
            <ul className={style.list}>
              <li className={style['list-item']}>
                <code>id</code>：文件 id
              </li>
              <li className={style['list-item']}>
                <code>name</code>：文件名称
              </li>
              <li className={style['list-item']}>
                <code>status</code>
                ：当前状态，loading：上传中、done：已上传、error：上传失败
              </li>
              <li className={style['list-item']}>
                <code>percent</code>：上传进度，范围在 0 -
                100，对于上传成功的文件应始终为 100，对于上传失败的文件应始终为
                0
              </li>
              <li className={style['list-item']}>
                <code>url</code>：上传成功后返回的文件 url，在{' '}
                <code>status</code> 为 <code>done</code> 时存在
              </li>
              <li className={style['list-item']}>
                <code>file</code>：当前文件指向的 <code>File</code> 对象，在{' '}
                <code>status</code> 为 <code>loading</code> 或{' '}
                <code>error</code> 时存在
              </li>
              <li className={style['list-item']}>
                <code>size</code>：可选的，当前文件大小
              </li>
              <li className={style['list-item']}>
                <code>type</code>：可选的，当前文件类型
              </li>
            </ul>
          </li>
          <li className={style['list-item']}>
            <code>action</code>：文件上传的接口
          </li>
          <li className={style['list-item']}>
            <code>change()</code>：改变 <code>value</code> 的方法
          </li>
          <li className={style['list-item']}>
            <code>transformResponse()</code>
            ：处理响应数据，并返回一个对象，对象格式为：
            <ul className={style.list}>
              <li className={style['list-item']}>
                <code>url</code>：文件 url
              </li>
              <li className={style['list-item']}>
                <code>id</code>：可选的，该数据会覆盖默认生成的文件 id
              </li>
              <li className={style['list-item']}>
                <code>name</code>
                ：可选的，文件名称，可使用服务端文件名称替代默认文件名称
              </li>
            </ul>
          </li>
        </ul>

        <section className={style.section}>
          <Upload
            {...baseUploadModel}
            action="http://localhost:8362/upload"
            transformResponse={transformResponse}
          >
            <button className="primary">upload file</button>
          </Upload>
          <ul className={style['file-list']}>
            {baseUploadModel.value.map((file) => (
              <li
                key={file.id}
                className={generateClass({
                  file: true,
                  error: file.status === 'error'
                })}
              >
                <em>{file.name}</em>
                {file.status === 'loading' && (
                  <div className={style.loading}>
                    <div
                      className={style['inner-loading']}
                      style={{ width: file.percent + '%' }}
                    ></div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className={style.content}>
        <h2 className={style.subtitle}>上传控制</h2>
        <p className={style.description}>
          控制上传的行为，通过 <code>tips</code>{' '}
          插槽提示用户，同时提供以下属性以控制上传的文件类型、大小等：
        </p>
        <ul className={style.list}>
          <li className={style['list-item']}>
            <code>accept</code>
            ：指定选择的文件类型，该选项并不能强制用户选择正确的文件类型
          </li>
          <li className={style['list-item']}>
            <code>multiple</code>：是否允许多选
          </li>
          <li className={style['list-item']}>
            <code>limit</code>：限制上传的文件个数
          </li>
          <li className={style['list-item']}>
            <code>beforeUpload()</code>：文件正式上传前的回调，返回{' '}
            <code>false</code>{' '}
            可取消上传当前文件，同时提供了一个严格检查文件类型的函数
          </li>
        </ul>

        <section className={style.section}>
          <Upload
            {...controlUploadModel}
            action="http://localhost:8362/upload"
            accept={['image/jpeg', 'image/png']}
            multiple
            limit={5}
            transformResponse={transformResponse}
            beforeUpload={beforeUpload}
            onMessage={onMessage}
          >
            {{
              default() {
                return <button className="primary">upload file</button>;
              },
              tips() {
                return (
                  <p className={style.tips}>
                    请上传 jpeg/png 格式、5mb 内的图像，不要超过 5 张
                  </p>
                );
              }
            }}
          </Upload>
          <ul className={style['file-list']}>
            {controlUploadModel.value.map((file) => (
              <li
                key={file.id}
                className={generateClass({
                  file: true,
                  error: file.status === 'error'
                })}
              >
                <em>{file.name}</em>
                {file.status === 'loading' && (
                  <div className={style.loading}>
                    <div
                      className={style['inner-loading']}
                      style={{ width: file.percent + '%' }}
                    ></div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className={style.content}>
        <h2 className={style.subtitle}>外部媒体输入</h2>
        <p className={style.description}>
          允许外部设备（录音，摄像头）输入，只在移动端浏览器生效；选择的外部输入设备与{' '}
          <code>accept</code> 属性有关，如 <code>accept</code>{' '}
          指示期望的输入是图片或视频，则用户代理会调起手机相机，期望的输入是音频，则用户代理会调起手机录音机。
        </p>

        <section className={style.section}>
          <Upload
            {...imageInputUploadModel}
            action="http://localhost:8362/upload"
            accept={['image/jpeg', 'image/png']}
            capture="user"
            transformResponse={transformResponse}
            beforeUpload={beforeUpload}
            onMessage={onMessage}
          >
            {{
              default() {
                return <button className="primary">upload file</button>;
              },
              tips() {
                return (
                  <p className={style.tips}>
                    图像上传，请在移动端浏览器触发上传操作
                  </p>
                );
              }
            }}
          </Upload>
          <ul className={style['file-list']}>
            {imageInputUploadModel.value.map((file) => (
              <li
                key={file.id}
                className={generateClass({
                  file: true,
                  error: file.status === 'error'
                })}
              >
                <em>{file.name}</em>
                {file.status === 'loading' && (
                  <div className={style.loading}>
                    <div
                      className={style['inner-loading']}
                      style={{ width: file.percent + '%' }}
                    ></div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className={style.section} style={{ marginTop: 10 }}>
          <Upload
            {...audioInputUploadModel}
            action="http://localhost:8362/upload"
            accept={['audio/*']}
            capture="user"
            transformResponse={transformResponse}
            onMessage={onMessage}
          >
            {{
              default() {
                return <button className="primary">upload file</button>;
              },
              tips() {
                return (
                  <p className={style.tips}>
                    音频上传，请在移动端浏览器触发上传操作
                  </p>
                );
              }
            }}
          </Upload>
          <ul className={style['file-list']}>
            {audioInputUploadModel.value.map((file) => (
              <li
                key={file.id}
                className={generateClass({
                  file: true,
                  error: file.status === 'error'
                })}
              >
                <em>{file.name}</em>
                {file.status === 'loading' && (
                  <div className={style.loading}>
                    <div
                      className={style['inner-loading']}
                      style={{ width: file.percent + '%' }}
                    ></div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className={style.content}>
        <h2 className={style.subtitle}>拖拽上传</h2>
        <p className={style.description}>
          启用拖拽上传，以拖拽的方式上传文件，需要注意的是，从网站中拖拽图像时，Firefox
          可能有不同的行为。
        </p>

        <section className={style.section}>
          <Upload
            style={{ width: '100%' }}
            {...dragInputUploadModel}
            action="http://localhost:8362/upload"
            drag
            transformResponse={transformResponse}
            onMessage={onMessage}
          >
            <div className={style.dragarea}>
              <h4 className={style.subtitle}>File Uplaod</h4>
              <p style={{ marginTop: 8, fontSize: '1.1em', color: '#aaa' }}>
                drag file to the area
              </p>
            </div>
          </Upload>
          <ul className={style['file-list']}>
            {dragInputUploadModel.value.map((file) => (
              <li
                key={file.id}
                className={generateClass({
                  file: true,
                  error: file.status === 'error'
                })}
              >
                <div className={style['list-content']}>
                  <em>{file.name}</em>
                  {file.status === 'error' && (
                    <span onClick={() => uploadRef.current?.retry(file.id)}>
                      重试
                    </span>
                  )}
                </div>
                {file.status === 'loading' && (
                  <div className={style.loading}>
                    <div
                      className={style['inner-loading']}
                      style={{ width: file.percent + '%' }}
                    ></div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className={style.content}>
        <h2 className={style.subtitle}>上传错误重试</h2>
        <p className={style.description}>
          组件暴露了一个重新上传的方法，传入对应的 id 会尝试重新上传文件
        </p>

        <section className={style.section}>
          <Upload
            ref={uploadRef}
            {...retryInputUploadModel}
            action="http://localhost:8362/upload"
            transformResponse={transformResponse}
          >
            <button className="primary">upload file</button>
          </Upload>
          <ul className={style['file-list']}>
            {retryInputUploadModel.value.map((file) => (
              <li
                key={file.id}
                className={generateClass({
                  file: true,
                  error: file.status === 'error'
                })}
              >
                <div className={style['list-content']}>
                  <em>{file.name}</em>
                  {file.status === 'error' && (
                    <span onClick={() => uploadRef.current?.retry(file.id)}>
                      重试
                    </span>
                  )}
                </div>
                {file.status === 'loading' && (
                  <div className={style.loading}>
                    <div
                      className={style['inner-loading']}
                      style={{ width: file.percent + '%' }}
                    ></div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
