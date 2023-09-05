import React, { useRef, useState, useEffect } from 'react';
import { classnames, polling } from '@/utils';
import { useModel } from '@/hooks';
import GIF from './gif/GIF';
import Card from '@/components/Card/Card';
import Button from '@/components/Button/Button';
import MessageBox from '@/components/MessageBox/MessageBox';
import InputNumber from '@/components/InputNumber/InputNumber';
import Select from '@/components/Select/Select';
import Switch from '@/components/Switch/Switch';
import Text from '@/components/Text/Text';
import TimePicker from './component/TimePicker';
import type { Transparency, UserInput, DisposalMethod } from './types';
import style from './GIFVideo.module.css';

const instructOptions = [
  { label: '不处理', value: 0 },
  { label: '下一帧覆盖当前帧', value: 4 },
  { label: '恢复到背景颜色', value: 8 },
  { label: '恢复到渲染当前帧之前', value: 12 }
];

const generateClass = classnames(style);

export default function GIFVideo() {
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [blobObject, setBlobObject] = useState('');

  const timeModel = useModel('00 : 00 : 05');

  const delay = useModel(40);

  const disposalMethod = useModel<DisposalMethod>(4);

  const userInputModel = useModel<UserInput>(0);

  const transparencyModel = useModel<Transparency>(0);

  const transparencyIndexModel = useModel(0);

  const cyclesModel = useModel(0);

  const scalingModel = useModel(3);

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
    { 'gif-video-upload': !blobObject },
    style['gif-video-container']
  );
  const iconClass = generateClass(['icon-upload'], 'iconfont', 'icon-upload');

  const stopPropagation = (e: Event) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleSelect = () => inputRef.current?.click();

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
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

    polling(() => {
      if (videoRef.current === null || videoRef.current.videoWidth === 0) {
        return false;
      }

      const time = +timeModel.value.split(':')[2].trim();

      const width = videoRef.current.videoWidth;
      const height = videoRef.current.videoHeight;

      const _canvas = window.document.createElement('canvas');
      const context = _canvas.getContext('2d', { willReadFrequently: true });

      _canvas.width = Math.round(width / scalingModel.value);
      _canvas.height = Math.round(height / scalingModel.value);

      const gif = new GIF({
        width: _canvas.width,
        height: _canvas.height,
        workers: 2
      });

      gif.setCycles(cyclesModel.value);
      gif.setDelay(delay.value);
      gif.setDisposalMethod(disposalMethod.value);
      gif.setUserInput(userInputModel.value);

      const timer = window.setInterval(() => {
        if (videoRef.current === null) return;

        if (videoRef.current.currentTime > time) {
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

  return (
    <>
      <Card shadow="never">
        <div className={style['gif-transfer']}>
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

          <div className={style['gif-transfer-form']}>
            <div className={style['gif-transfer-form-item']}>
              <label htmlFor="duration">视频截取时长：</label>
              <TimePicker id="duration" {...timeModel}></TimePicker>
            </div>

            <div className={style['gif-transfer-form-item']}>
              <label htmlFor="scaling">缩放倍数：</label>
              <InputNumber id="scaling" min={1} {...scalingModel}></InputNumber>
            </div>

            <div className={style['gif-transfer-form-item']}>
              <label htmlFor="delay">帧间隔(ms)：</label>
              <InputNumber
                id="delay"
                min={40}
                max={0xffff * 10}
                step={10}
                {...delay}
              ></InputNumber>
            </div>

            <div className={style['gif-transfer-form-item']}>
              <label htmlFor="user-input">允许用户操作：</label>
              <Switch
                id="user-input"
                activeValue={2}
                inactiveValue={0}
                {...userInputModel}
              ></Switch>
            </div>

            <div className={style['gif-transfer-form-item']}>
              <label htmlFor="cycles">循环次数(0:无限)：</label>
              <InputNumber
                id="cycles"
                {...cyclesModel}
                min={0}
                max={0xffff}
              ></InputNumber>
            </div>

            <div className={style['gif-transfer-form-item']}>
              <label htmlFor="dispoal">帧替换时当前帧：</label>
              <Select
                id="dispoal"
                options={instructOptions}
                {...disposalMethod}
              ></Select>
            </div>

            <div className={style['gif-transfer-form-item']}>
              <label htmlFor="transparency">透明(背景色)：</label>
              <Switch
                id="transparency"
                disabled
                activeValue={1}
                inactiveValue={0}
                {...transparencyModel}
              ></Switch>
            </div>

            <div className={style['gif-transfer-form-item']}>
              <label htmlFor="transparency-index">透明颜色索引：</label>
              <InputNumber
                id="transparency-index"
                disabled
                min={0}
                max={255}
                {...transparencyIndexModel}
              ></InputNumber>
            </div>
          </div>
        </div>

        <Button style={{ marginLeft: 15 }} type="primary" onClick={handlePlay}>
          开始转码
        </Button>

        <p style={{ marginTop: 10 }}>
          <Text type="info">
            前端转换较慢，限制 gif 时长为 60
            秒；色盘在编码时确认，无法提前选择透明索引。
          </Text>
        </p>
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
