import React, { useRef, useState, useEffect } from 'react';
import { useModel } from '@/hooks';
import Card from '@/components/Card/Card';
import Button from '@/components/Button/Button';
import MessageBox from '@/components/MessageBox/MessageBox';
import InputNumber from '@/components/InputNumber/InputNumber';
import Select from '@/components/Select/Select';
import Switch from '@/components/Switch/Switch';
import Text from '@/components/Text/Text';
import TimePicker from './component/TimePicker';
import style from './GIFVideo.module.css';

const instructOptions = [
  { label: '不处理', value: 0 },
  { label: '下一帧覆盖当前帧', value: 4 },
  { label: '恢复到背景颜色', value: 8 },
  { label: '恢复到渲染当前帧之前', value: 12 }
];

export default function GIFVideo() {
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [blobObject, setBlobObject] = useState('');

  const [timer, setTimer] = useState<number | null>(null);

  const timeModel = useModel('00 : 00 : 05');

  const delay = useModel<number | string>(50);

  const disposalMethod = useModel(0);

  const userInputModel = useModel(0);

  const transparencyModel = useModel(0);

  const transparencyIndexModel = useModel<number | string>(0);

  useEffect(() => {
    return () => {
      if (timer) window.clearInterval(timer);
    };
  }, []);

  const handleSelect = () => inputRef.current?.click();

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { files } = e.target;

    if (files == null || files.length === 0) return;

    if (blobObject) {
      window.URL.revokeObjectURL(blobObject);
    }

    setBlobObject(window.URL.createObjectURL(files[0]));
  };

  const handleError = () => {
    MessageBox.alert({
      type: 'error',
      title: '播放异常',
      message: '视频播放失败， 请检查视频格式'
    });
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

    loop(1000 / 24);
  };

  const loop = (millisecond: number) => {
    const val = window.setInterval(captureScreen, Math.ceil(millisecond));

    if (timer) window.clearInterval(timer);

    setTimer(val);
  };

  const captureScreen = () => {
    if (videoRef.current === null) return;

    // const width = videoRef.current.videoWidth;
    // const height = videoRef.current.videoHeight;
  };

  return (
    <>
      <Card shadow="never">
        <div className={style['gif-transfer']}>
          <div className={style['gif-video-container']}>
            <video
              ref={videoRef}
              className={style['gif-video']}
              src={blobObject}
              muted
              loop
              autoPlay
              onError={handleError}
            ></video>
          </div>

          <div className={style['gif-transfer-form']}>
            <div className={style['gif-transfer-form-item']}>
              <label htmlFor="duration">GIF 时长：</label>
              <TimePicker id="duration" {...timeModel}></TimePicker>
            </div>

            <div className={style['gif-transfer-form-item']}>
              <label htmlFor="delay">帧间隔(ms)：</label>
              <InputNumber
                id="delay"
                min={50}
                step={10}
                {...delay}
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
              <label htmlFor="user-input">允许用户操作：</label>
              <Switch
                id="user-input"
                activeValue={2}
                inactiveValue={0}
                {...userInputModel}
              ></Switch>
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

        <Button onClick={handleSelect}>上传视频文件</Button>

        <Button style={{ marginLeft: 15 }} type="primary" onClick={handlePlay}>
          开始编码
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
