import { assign } from '@/utils';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import _Worker from './encoder.worker';
import Queue from './Queue';
import GIFByte from './GIFByte';
import type {
  Transparency,
  UserInput,
  DisposalMethod,
  ImageOptions,
  GIFConfig
} from '../types';

class GIF {
  private _width = 0;
  private _height = 0;

  private frames = new Queue<ImageOptions>();

  private options = {
    delay: 40,
    cycles: 0,
    disposalMethod: 4,
    userInput: 0,
    transparency: 0,
    transparencyIndex: 0
  };

  private workers: Worker[];

  private config: GIFConfig;

  private _canvas = window.document.createElement('canvas');
  private _context = this._canvas.getContext('2d', {
    willReadFrequently: true
  });

  private firstFrame = true;

  constructor(config?: GIFConfig) {
    this.config = config || {};

    const { workers = 2 } = this.config;

    this.workers = [];

    for (let i = 0; i < workers; i++)
      this.workers[this.workers.length] = new _Worker();
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  setDelay(num: number) {
    this.options.delay = num;
  }

  setCycles(num: number) {
    this.options.cycles = num;
  }

  setDisposalMethod(num: DisposalMethod) {
    this.options.disposalMethod = num;
  }

  setUserInput(num: UserInput) {
    this.options.userInput = num;
  }

  setTransparency(num: Transparency) {
    this.options.transparency = num;
  }

  setTransparencyIndex(num: number) {
    if (num < 0 || num > 255) return this;

    this.options.transparencyIndex = window.parseInt(num.toString());
  }

  getOptions() {
    return { ...this.options };
  }

  getConfig() {
    return { ...this.config };
  }

  addFrame(
    element:
      | HTMLImageElement
      | HTMLCanvasElement
      | ImageData
      | CanvasRenderingContext2D,
    options?: ImageOptions['options']
  ) {
    const frame = {} as ImageOptions;

    if (this.firstFrame) {
      this.firstFrame = false;

      if (element instanceof CanvasRenderingContext2D) {
        this._width = element.canvas.width;
        this._height = element.canvas.height;
      } else {
        this._width = this.config.width || element.width;
        this._height = this.config.height || element.height;
      }
    }

    if (element instanceof ImageData) {
      frame.data = element;
    } else {
      frame.data = this.getImageData(element);
    }

    frame.options = assign(
      {},
      this.options,
      { width: this.width, height: this.height },
      options || {}
    );

    this.frames.enqueue(frame);
  }

  getImageData(
    element: HTMLImageElement | HTMLCanvasElement | CanvasRenderingContext2D
  ) {
    let context!: CanvasRenderingContext2D | null;

    if (element instanceof HTMLImageElement) {
      context = this._context;

      context?.clearRect(0, 0, this.width, this.height);
      context?.drawImage(element, 0, 0, this.width, this.height);
    } else if (element instanceof HTMLCanvasElement) {
      context = element.getContext('2d', { willReadFrequently: true });
    } else {
      context = element;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return context!.getImageData(0, 0, this.width, this.height);
  }

  render() {
    const frame = this.frames.dequeue();

    if (frame?.value === null || frame?.value === undefined)
      throw Error('no frame, please add first');

    const out = new GIFByte();
    out.writeGifMagic();
    out.writeLogicalScreenDescriptor(this.width, this.height, 0x70);
    out.writeApplicationExtension(this.options.cycles);

    const worker = this.workers[0];

    worker.postMessage(frame.value);

    worker.addEventListener('message', (e: MessageEvent<Uint8Array>) => {
      const { data } = e;

      out.writeBytes(data);

      if (this.frames.isEmpty()) {
        out.end();

        const file = new File([out.export()], 'test.gif', {
          type: 'image/gif'
        });

        window.open(window.URL.createObjectURL(file));
      } else {
        const next = this.frames.dequeue();

        if (next?.value) {
          worker.postMessage(next.value);
        }
      }
    });
  }
}

export default GIF;
