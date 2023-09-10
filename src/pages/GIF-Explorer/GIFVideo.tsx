import React, { useRef, useState, useEffect } from 'react';
import {
  classnames,
  isRenderElement,
  polling,
  createCanvasContext
} from '@/utils';
import GIF from './gif/GIF';
import Card from '@/components/Card/Card';
import Button from '@/components/Button/Button';
import MessageBox from '@/components/MessageBox/MessageBox';
import Progress from '@/components/Progress/Progress';
import Text from '@/components/Text/Text';
import Configuration from './component/Configuration';
import type { Options } from './component/Configuration';
import type { ProgressParams } from './types';
import style from './GIFVideo.module.css';

const generateClass = classnames(style);

export default function GIFVideo() {
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const configurationRef = useRef<Options>(null);

  const [disabled, setDisabled] = useState(false);

  const [collect, setCollect] = useState(false);

  const [progress, setProgress] = useState<ProgressParams>({
    loaded: 0,
    total: 0,
    activeWorkers: 0,
    duration: 0,
    surplus: 0,
    percentage: 0
  });

  const [blobObject, setBlobObject] = useState('');
  const [download, setDownload] = useState<Blob | null>(null);

  useEffect(() => {
    window.document.addEventListener('dragover', stopPropagation);
    window.document.addEventListener('drop', stopPropagation);

    return () => {
      if (blobObject) {
        window.URL.revokeObjectURL(blobObject);
      }

      window.document.removeEventListener('dragover', stopPropagation);
      window.document.removeEventListener('drop', stopPropagation);
    };
  }, []);

  const videoContinerClass = generateClass(
    { 'gif-video-upload': !blobObject, 'gif-video-disabled': disabled },
    style['gif-video-container']
  );
  const iconClass = generateClass(['icon-upload'], 'iconfont', 'icon-upload');

  const stopPropagation = (e: Event) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleSelect = () => disabled || inputRef.current?.click();

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    if (disabled) return;

    const { files } = e.dataTransfer;

    if (files === null || files.length === 0) return;

    const file = files[0];

    if (blobObject) {
      window.URL.revokeObjectURL(blobObject);
    }

    setBlobObject(window.URL.createObjectURL(file));
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { files } = e.target;

    if (files == null || files.length === 0) return;

    if (blobObject) {
      window.URL.revokeObjectURL(blobObject);
    }

    const url = window.URL.createObjectURL(files[0]);

    setBlobObject(url);
  };

  const handleError = () => {
    MessageBox.alert({
      type: 'error',
      title: '播放异常',
      message: '视频播放失败， 请检查视频格式'
    });

    window.URL.revokeObjectURL(blobObject);
  };

  const handlePlay = () => {
    if (videoRef.current === null) return;

    if (videoRef.current.readyState !== HTMLMediaElement.HAVE_ENOUGH_DATA) {
      return MessageBox.alert({
        type: 'warning',
        title: '视频数据不满足条件',
        message: '请确认当前视频数据是否已加载'
      });
    }

    videoRef.current.load();

    setDisabled(true);
    setCollect(true);
    setDownload(null);

    polling(() => {
      if (videoRef.current === null || videoRef.current.videoWidth === 0) {
        return false;
      }

      const {
        time = 5,
        scaling = 3,
        cycles = 0,
        delay = 40,
        disposalMethod = 4,
        userInput = 0
      } = configurationRef.current?.getOptions() || {};

      const width = videoRef.current.videoWidth;
      const height = videoRef.current.videoHeight;

      const { canvas: _canvas, context } = createCanvasContext({
        width: Math.round(width / scaling),
        height: Math.round(height / scaling),
        willReadFrequently: true
      });

      const gif = new GIF({
        width: _canvas.width,
        height: _canvas.height,
        workers: 2
      });

      gif.setCycles(cycles);
      gif.setDelay(delay);
      gif.setDisposalMethod(disposalMethod);
      gif.setUserInput(userInput);

      gif.on('progress', (e) => {
        setProgress(e);
      });

      gif.on('finished', (e) => {
        setDisabled(false);

        setDownload(e);
      });

      const timer = window.setInterval(() => {
        if (videoRef.current === null) return;

        if (videoRef.current.currentTime > time) {
          setCollect(false);
          gif.render();
          return window.clearInterval(timer);
        }

        context?.clearRect(0, 0, _canvas.width, _canvas.height);
        context?.drawImage(
          videoRef.current,
          0,
          0,
          width,
          height,
          0,
          0,
          _canvas.width,
          _canvas.height
        );

        gif.addFrame(_canvas);
      }, 1000 / 24);

      return true;
    });
  };

  const handleDownload = async () => {
    if (download === null) return;

    if (typeof window.showSaveFilePicker === 'function') {
      const fileHandle = await window.showSaveFilePicker({
        excludeAcceptAllOption: true,
        suggestedName: 'illustrate.gif',
        types: [
          { description: '图像文件 gif', accept: { 'image/gif': ['.gif'] } }
        ]
      });

      const writeable = await fileHandle.createWritable();

      const write = writeable.getWriter();
      await write.write(download);
      await write.close();
    } else {
      const a = window.document.createElement('a');
      const url = window.URL.createObjectURL(download);
      a.href = url;
      a.download = 'illustrate.gif';
      window.document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <>
      <Card shadow="never">
        <div className={style['gif-transfer']}>
          <div style={{ width: '40%' }}>
            <div
              className={videoContinerClass}
              onDragOver={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              onDrop={handleDrop}
              onClick={handleSelect}
            >
              {blobObject ? (
                <video
                  ref={videoRef}
                  className={style['gif-video']}
                  src={blobObject}
                  muted
                  loop
                  autoPlay
                  onError={handleError}
                ></video>
              ) : (
                <>
                  <i className={iconClass}></i>
                  <p style={{ marginTop: 5 }}>
                    <Text type="info">点击或拖拽上传视频文件</Text>
                  </p>
                </>
              )}
            </div>

            {isRenderElement(collect) && (
              <Text block type="primary" style={{ marginBottom: 15 }}>
                正在收集视频帧，稍后开始编译。。。
              </Text>
            )}

            <div className={style['gif-video-status']}>
              <Text block style={{ marginTop: 5 }}>
                总帧数：{progress.total}
              </Text>
              <Text block style={{ marginTop: 5 }}>
                已完成：{progress.loaded}
              </Text>
              <Text block style={{ marginTop: 5 }}>
                活动线程： {progress.activeWorkers}
              </Text>
              <Text block style={{ marginTop: 5 }}>
                已编译：{progress.duration}秒
              </Text>
              <Text block style={{ marginTop: 5 }}>
                预计剩余： {progress.surplus}秒
              </Text>

              <Progress
                style={{ marginTop: 20 }}
                percentage={progress.percentage}
              ></Progress>
            </div>
          </div>

          <Configuration
            ref={configurationRef}
            showList={[
              'time',
              'delay',
              'cycles',
              'disposalMethod',
              'scaling',
              'userInput'
            ]}
          />
        </div>

        <div style={{ marginTop: 10 }}>
          <Button type="primary" loading={disabled} onClick={handlePlay}>
            开始转码
          </Button>

          <Button
            type="success"
            style={{ marginLeft: 15 }}
            disabled={download === null}
            onClick={handleDownload}
          >
            下载 GIF
          </Button>

          <p style={{ marginTop: 10 }}>
            <Text type="info">
              前端转换较慢，限制 gif 时长为 60
              秒；色盘在编码时确认，无法提前选择透明色（PS：显示背景色）。
            </Text>
          </p>
        </div>
      </Card>

      <input
        ref={inputRef}
        hidden
        type="file"
        accept="video/*"
        onChange={handleChange}
      />
    </>
  );
}
