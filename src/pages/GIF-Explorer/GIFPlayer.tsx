import React, { useRef, useMemo, useState, useEffect } from 'react';
import { isEmpty, isRenderElement, createCanvasContext } from '@/utils';
import GIF from './gif/GIF';
import Card from '@/components/Card/Card';
import Button from '@/components/Button/Button';
import Text from '@/components/Text/Text';
import MessageBox from '@/components/MessageBox/MessageBox';
import type { GIFPattern } from './types';
import style from './GIFPlayer.module.css';

export default function GIFPlayer() {
  const drawRef = useRef<HTMLCanvasElement>(null);
  const gif = useRef(new GIF());
  const inputRef = useRef<HTMLInputElement>(null);

  const [pattern, setPattern] = useState<GIFPattern | null>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [frames, setFrames] = useState<GIFPattern['frames'] | null>(null);
  const [restore, setRestore] = useState<ImageData | null>(null);
  const [loop, setLoop] = useState(0);
  const [views, setViews] = useState(0);
  const [cursor, setCursor] = useState(0);
  const [timer, setTimer] = useState(-1);
  const [play, setPlay] = useState(true);

  useMemo(() => {
    gif.current.decoder.on('finished', (e) => {
      setPattern(e);
    });
  }, []);

  useEffect(() => {
    if (isEmpty(drawRef.current)) return;

    const context = drawRef.current.getContext('2d', {
      willReadFrequently: true
    });

    setContext(context);
  }, []);

  useEffect(() => {
    if (isEmpty(file)) return;

    gif.current.decoder.decode(file);
  }, [file]);

  useEffect(() => {
    if (isEmpty(pattern) || isEmpty(drawRef.current) || isEmpty(context)) {
      return;
    }

    drawRef.current.width = pattern.logicalScreenDescriptor.width;
    drawRef.current.height = pattern.logicalScreenDescriptor.height;

    fillBackground(0, 0, drawRef.current.width, drawRef.current.height);

    const { applicationExtension, frames } = pattern;
    const { loop = 0 } = applicationExtension || {};

    setFrames(frames);
    setLoop(loop);
  }, [pattern]);

  useEffect(() => {
    if (isEmpty(frames) || isEmpty(context) || isEmpty(drawRef.current)) return;

    const current = frames[cursor];

    if (isEmpty(current?.data)) return;

    const prev = frames[cursor === 0 ? frames.length - 1 : cursor - 1];

    const { control } = prev;

    const disposal = control?.disposal || 0;

    switch (disposal) {
      case 2:
        context.clearRect(
          prev.offsetLeft,
          prev.offsetTop,
          prev.width,
          prev.height
        );
        fillBackground(
          prev.offsetLeft,
          prev.offsetTop,
          prev.width,
          prev.height
        );
        break;
      case 3:
        if (restore) {
          context.putImageData(restore, prev.offsetLeft, prev.offsetTop);
        } else {
          fillBackground(
            prev.offsetLeft,
            prev.offsetTop,
            prev.width,
            prev.height
          );
        }
        break;

      default:
        break;
    }

    const currentDisposal = current.control?.disposal || 0;

    if (currentDisposal === 2) {
      const imageData = context.getImageData(
        current.offsetLeft,
        current.offsetTop,
        current.width,
        current.height
      );

      setRestore(imageData);
    }

    context.putImageData(current.data, current.offsetLeft, current.offsetTop);

    if (play === false) return;

    const timer = window.setTimeout(() => {
      if (cursor === frames.length - 1) {
        if (loop === 0 || views < loop - 1) {
          setCursor(0);
          setViews((prev) => ++prev);
        } else {
          setPlay(false);
          window.clearTimeout(timer);
        }
      } else {
        setCursor((prev) => ++prev);
      }
    }, current.control?.delay || 10);

    setTimer(timer);

    return () => window.clearTimeout(timer);
  }, [cursor, frames]);

  useEffect(() => {
    if (isEmpty(frames)) return;

    if (play) {
      setCursor((prev) => {
        if (prev === frames.length - 1) {
          return 0;
        } else {
          return ++prev;
        }
      });

      setViews(0);
    } else {
      window.clearTimeout(timer);
    }
  }, [play]);

  function fillBackground(x: number, y: number, w: number, h: number) {
    if (isEmpty(pattern) || isEmpty(context)) {
      return;
    }

    const backgroundIndex = pattern.logicalScreenDescriptor.backgroundIndex;

    if (pattern.logicalScreenDescriptor.statistics.globalColor) {
      const background = toColor(pattern?.globalColorTable?.[backgroundIndex]);
      context.fillStyle = background;
      context.fillRect(x, y, w, h);
    }
  }

  function toColor(rgb = [0xff, 0xff, 0xff]) {
    const [r, g, b] = rgb;

    return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
  }

  const handleUpload = () => inputRef.current?.click();

  const handleSelect: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { files } = e.target;

    if (isEmpty(files) || files.length === 0) return;

    if (files[0].type.includes('image/gif')) {
      window.clearTimeout(timer);

      if (drawRef.current && context) {
        context.clearRect(0, 0, drawRef.current.width, drawRef.current.height);
        drawRef.current.width = 0;
        drawRef.current.height = 0;
      }

      setFile(files[0]);
      setPattern(null);
      setFrames(null);
      setRestore(null);
      setLoop(0);
      setViews(0);
      setTimer(-1);
      setPlay(true);
    } else {
      MessageBox.alert({
        type: 'error',
        title: '图片格式错误',
        message: '请上传 GIF 图片文件'
      });
    }

    e.target.value = '';
  };

  const handleFrame = (direction: 'prev' | 'next') => {
    if (isEmpty(frames)) return;

    setPlay(false);
    if (direction === 'prev') {
      setCursor((prev) => {
        return prev === 0 ? frames.length - 1 : --prev;
      });
    } else if (direction === 'next') {
      setCursor((prev) => {
        return prev === frames.length - 1 ? 0 : ++prev;
      });
    }
  };

  const download = async () => {
    if (isEmpty(frames)) return;

    const { canvas, context } = createCanvasContext({
      willReadFrequently: true
    });

    if (typeof window.showDirectoryPicker === 'function') {
      const directory = await window.showDirectoryPicker({ mode: 'readwrite' });

      for (let i = 0; i < frames.length; i++) {
        canvas.width = frames[i].width;
        canvas.height = frames[i].height;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        context.putImageData(frames[i].data!, 0, 0);
        canvas.toBlob(async (blob) => {
          const fileHandle = await directory.getFileHandle(
            i.toString().padStart(frames.length.toString().length, '0') +
              '.jpg',
            { create: true }
          );

          const writable = await fileHandle.createWritable();

          const write = writable.getWriter();
          write.write(blob);
          write.close();
        }, 'image/jpeg');
      }
    } else {
      MessageBox.alert({
        type: 'warning',
        title: '下载失败',
        message:
          '当前浏览器不支持 window.showDirectoryPicker 方法，建议使用最新浏览器，或前往 MDN 查看浏览器兼容性'
      });
    }
  };

  return (
    <Card style={{ marginTop: 40 }} shadow="never">
      <h1 className={style['title']}>GIF Player</h1>

      <div className={style['gif-player-container']} onClick={handleUpload}>
        <canvas ref={drawRef} width={0} height={0}></canvas>

        {isRenderElement(frames) && (
          <div
            className={style['operator']}
            onClick={(e) => e.stopPropagation()}
          >
            <Button type="default" onClick={() => setPlay((v) => !v)}>
              {play ? '暂停' : '播放'}
            </Button>
            <Button type="default" onClick={() => handleFrame('prev')}>
              上一帧
            </Button>
            <Button type="default" onClick={() => handleFrame('next')}>
              下一帧
            </Button>
            <Button type="success" onClick={download}>
              下载全部
            </Button>

            <Text type="info">{`${cursor
              .toString()
              .padStart((frames?.length || 1).toString().length, '0')}/${
              (frames?.length || 1) - 1
            }`}</Text>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        hidden
        type="file"
        accept="image/gif"
        onChange={handleSelect}
      />
    </Card>
  );
}
