import React, { useRef, useMemo, useState, useEffect } from 'react';
import { isEmpty, createCanvasContext } from '@/utils';
import bulidColor from './gif/bulidColor';
import GIF from './gif/GIF';
import Card from '@/components/Card/Card';
import Button from '@/components/Button/Button';
import MessageBox from '@/components/MessageBox/MessageBox';
import Configuration from './component/Configuration';
import type { BulidColor, ImageOptions } from './types';
import type { Options } from './component/Configuration';
import style from './GIFPicture.module.css';

export default function GIFPicture() {
  const drawRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const configurationRef = useRef<Options>(null);

  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const gif = useRef(new GIF());

  const [isDisabled, setIsDisabled] = useState(false);
  const [isDrawBackground, setIsDrawBackground] = useState(false);
  const [isMove, setIsMove] = useState(false);
  const [rect, setRect] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const [frames, setFrames] = useState<ImageOptions[]>([]);
  const [currentImage, setCurrentImage] = useState<HTMLImageElement | null>(
    null
  );

  useMemo(() => {
    gif.current.on('finished', (blob) => {
      window.open(window.URL.createObjectURL(blob));

      setIsDisabled(false);
      setFrames([]);
      reset();
      context?.beginPath();
    });
  }, []);

  useEffect(() => {
    const context = drawRef.current?.getContext('2d', {
      willReadFrequently: true
    });

    setContext(context as CanvasRenderingContext2D);
    setIsDrawBackground(true);
  }, []);

  useEffect(() => {
    drawRef.current?.addEventListener('wheel', preventDefault);
    return () => {
      drawRef.current?.removeEventListener('wheel', preventDefault);
    };
  }, []);

  useEffect(() => {
    if (isDrawBackground) {
      drawBakcground();
      setIsDrawBackground(false);
    }
  }, [isDrawBackground]);

  useEffect(() => {
    if (isEmpty(currentImage)) return;

    const { canvas: _canvas, context } = createCanvasContext({
      width: currentImage.width,
      height: currentImage.height
    });

    context?.drawImage(currentImage, 0, 0);
    const imageData = context?.getImageData(
      0,
      0,
      _canvas.width,
      _canvas.height
    );

    if (imageData) {
      const colorTable = bulidColor(imageData.data);

      configurationRef.current?.setColorTable(colorTable);
    }
  }, [currentImage]);

  const preventDefault = (e: Event) => e.preventDefault();

  const reset = () => {
    if (isEmpty(drawRef.current) || isEmpty(context)) return;

    context.clearRect(0, 0, drawRef.current.width, drawRef.current.height);

    setCurrentImage(null);
    setIsMove(false);
    setRect({ left: 0, top: 0, width: 0, height: 0 });
    setIsDrawBackground(true);
    configurationRef.current?.setColorTable({
      colorList: [],
      octree: null
    } as BulidColor);
  };

  const drawBakcground = () => {
    if (isEmpty(context)) return;

    const width = drawRef.current?.width || 0;
    const height = drawRef.current?.height || 0;

    const imageData = context.createImageData(width, height);

    const { data } = imageData;

    // 通过 canvas宽高 来遍历一下 canvas 上的所有像素点
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const point = (i * width + j) << 2;
        const rgb = ((i >> 2) + (j >> 2)) & 1 ? 204 : 255;
        data[point] = rgb;
        data[point + 1] = rgb;
        data[point + 2] = rgb;
        data[point + 3] = 0xff;
      }
    }

    context.putImageData(imageData, 0, 0);
  };

  const drawPath = (x: number, y: number, width: number, height: number) => {
    if (isEmpty(context)) return;

    context.beginPath();
    context.lineWidth = 0;
    context.moveTo(x, y);
    context.lineTo(x + width, y);
    context.lineTo(x + width, y + height);
    context.lineTo(x, y + height);
    context.strokeStyle = 'transparent';
    context.stroke();
    context.closePath();
  };

  const handleSelect = () => inputRef.current?.click();

  const handleUpload: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { files } = e.target;

    if (isEmpty(files) || files.length === 0) return;

    reset();

    const url = window.URL.createObjectURL(files[0]);
    const image = new Image();
    image.src = url;

    image.onload = () => {
      if (Math.max(image.width, image.height) > 400) {
        MessageBox({
          type: 'warning',
          title: '图片限制',
          message: '请不要上传大于 400 x 400 的图像'
        });
      } else {
        const x = ((drawRef.current?.width || 0) - image.width) / 2;
        const y = ((drawRef.current?.height || 0) - image.height) / 2;

        context?.drawImage(image, x, y, image.width, image.height);

        drawPath(x, y, image.width, image.height);

        setCurrentImage(image);
        setRect({ left: x, top: y, width: image.width, height: image.height });
      }

      window.URL.revokeObjectURL(url);
    };

    image.onerror = () => {
      MessageBox.alert({
        type: 'error',
        title: '加载失败',
        message: '图像加载失败，请确认图片格式'
      });
    };

    e.target.value = '';
  };

  const handleMouseDown: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    if (context?.isPointInPath(x, y)) {
      setIsMove(true);
    }
  };
  const handleMouseUp: React.MouseEventHandler<HTMLCanvasElement> = () => {
    setIsMove(false);
  };

  const handleMove: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    if (isEmpty(drawRef.current) || isEmpty(context) || isEmpty(currentImage)) {
      return;
    }

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    if (context.isPointInPath(x, y)) {
      drawRef.current.style.cursor = 'move';
    } else {
      drawRef.current.style.cursor = 'revert';
    }

    if (isMove) {
      const { left, top, width, height } = rect;

      const _left = Math.min(
        drawRef.current.width - width,
        Math.max(0, left + e.movementX)
      );
      const _top = Math.min(
        drawRef.current.height - height,
        Math.max(0, top + e.movementY)
      );
      context.clearRect(0, 0, drawRef.current.width, drawRef.current.height);

      drawBakcground();

      context.drawImage(
        currentImage,
        0,
        0,
        currentImage.width,
        currentImage.height,
        _left,
        _top,
        width,
        height
      );

      drawPath(_left, _top, width, height);

      setRect({ left: _left, top: _top, width, height });
    }
  };

  const handleWheel: React.WheelEventHandler<HTMLCanvasElement> = (e) => {
    if (isEmpty(drawRef.current) || isEmpty(context) || isEmpty(currentImage)) {
      return;
    }

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    if (context.isPointInPath(x, y)) {
      const { left, top, width, height } = rect;

      const _width = Math.round(width * (e.deltaY < 0 ? 1.2 : 0.8));
      const _height = Math.round(height * (e.deltaY < 0 ? 1.2 : 0.8));

      if (
        left + _width > drawRef.current.width ||
        top + _height > drawRef.current.height
      ) {
        return;
      }

      context.clearRect(0, 0, drawRef.current.width, drawRef.current.height);

      drawBakcground();

      context.drawImage(
        currentImage,
        0,
        0,
        currentImage.width,
        currentImage.height,
        left,
        top,
        _width,
        _height
      );

      drawPath(left, top, _width, _height);

      setRect({ left, top, width: _width, height: _height });
    }
  };

  const handleNext = () => {
    if (
      isEmpty(drawRef.current) ||
      isEmpty(context) ||
      isEmpty(currentImage) ||
      isEmpty(configurationRef.current)
    ) {
      return;
    }

    const { context: _context } = createCanvasContext({
      width: rect.width,
      height: rect.height
    });

    _context.drawImage(currentImage, 0, 0, rect.width, rect.height);

    const imageData = _context.getImageData(0, 0, rect.width, rect.height);

    const { width, height, time, scaling, background, ...options } =
      configurationRef.current.getOptions();

    setFrames((prev) => [
      ...prev,
      { data: imageData, options: { index: prev.length, ...options } }
    ]);

    reset();

    width & height & time & scaling;
    background;

    return { data: imageData, options: { index: frames.length, ...options } };
  };

  const handleEncode = () => {
    const last = handleNext() as ImageOptions;

    if (isEmpty(last)) return;

    setIsDisabled(true);

    const _frames = [...frames, last];

    let maxWidth = Number.MIN_SAFE_INTEGER;
    let maxHeight = Number.MIN_SAFE_INTEGER;
    for (let i = 0; i < _frames.length; i++) {
      const { data } = _frames[i];

      maxWidth = Math.max(maxWidth, data.width);
      maxHeight = Math.max(maxHeight, data.height);
    }

    for (let i = 0; i < _frames.length; i++) {
      const {
        data: { width, height },
        options
      } = _frames[i];

      options.offsetLeft = Math.floor((maxWidth - width) / 2);
      options.offsetTop = Math.floor((maxHeight - height) / 2);

      gif.current.addFrame(_frames[i]['data'], { width, height, ...options });
    }

    gif.current.setCycles(configurationRef.current?.getOptions().cycles || 0);
    gif.current.setConfig({
      width: maxWidth,
      height: maxHeight,
      background: configurationRef.current?.getOptions().background
    });

    gif.current.render();
  };

  return (
    <Card
      style={{ marginTop: 40, overflow: 'revert' }}
      shadow="never"
      bodyClassName={style['gif-picture']}
    >
      <div className={style['drawing-board-container']}>
        <canvas
          ref={drawRef}
          width={400}
          height={400}
          className={style['drawing-board']}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMove}
          onMouseLeave={() => setIsMove(false)}
          onWheel={handleWheel}
        ></canvas>
      </div>

      <div className={style['form']}>
        <Configuration
          ref={configurationRef}
          className={style['gif-picture-config']}
          showList={[
            'cycles',
            'delay',
            'disposalMethod',
            'background',
            'transparency',
            'transparencyIndex',
            'userInput'
          ]}
          perfix="gif-picture"
        />

        <div className={style['opterator']}>
          <Button type="default" disabled={isDisabled} onClick={handleSelect}>
            上传图片
          </Button>

          <Button
            type="success"
            disabled={isDisabled || currentImage === null}
            onClick={handleNext}
          >
            下一帧
          </Button>

          <Button
            type="primary"
            onClick={handleEncode}
            disabled={frames.length === 0 && currentImage === null}
            loading={isDisabled}
          >
            编码 GIF
          </Button>
        </div>

        <input
          ref={inputRef}
          hidden
          type="file"
          accept="image/*"
          onChange={handleUpload}
        />
      </div>
    </Card>
  );
}
