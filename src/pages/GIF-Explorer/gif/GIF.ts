import { assign, isEmpty } from '@/utils';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import _Worker from './encoder.worker';
import Queue from './Queue';
import GIFByte from './GIFByte';
import GIFDecoder from './GIFDecoder';
import type {
  Transparency,
  UserInput,
  DisposalMethod,
  ImageOptions,
  GIFConfig,
  OutputData,
  BusEvent,
  GIFEventOn,
  ProgressCallback,
  FinishedCallback
} from '../types';

class GIF {
  private _width = 0;
  private _height = 0;
  private config: GIFConfig;
  private options = {
    delay: 40,
    cycles: 0,
    disposalMethod: 4,
    userInput: 0,
    transparency: 0,
    transparencyIndex: 0
  };

  private bus = new Map<BusEvent, (ProgressCallback | FinishedCallback)[]>();

  private frames = new Queue<ImageOptions>();
  private workers: Worker[];
  private activeWorkers: Worker[];
  private response: Uint8Array[];

  private _canvas = window.document.createElement('canvas');
  private _context = this._canvas.getContext('2d', {
    willReadFrequently: true
  });

  private firstFrame = true;

  public decoder: GIFDecoder;

  constructor(config?: GIFConfig) {
    this.config = config || {};
    this.workers = [];
    this.activeWorkers = [];
    this.response = [];

    this.decoder = new GIFDecoder(config?.workers);
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

    this.options.transparencyIndex = Math.floor(num);
  }

  getOptions() {
    return { ...this.options };
  }

  setOptions(options: Omit<ImageOptions['options'], 'index'>) {
    this.options = assign({}, this.options, options);
  }

  getConfig() {
    return { ...this.config };
  }

  setConfig(config: GIFConfig) {
    this.config = assign(
      {},
      this.config as OrdinaryObject,
      config as OrdinaryObject
    );
  }

  on: GIFEventOn = function (this: GIF, type, fn) {
    if (this.bus.has(type)) {
      const cbs = this.bus.get(type);

      if (cbs) {
        cbs.push(fn);
        return this.bus.set(type, cbs);
      }
    }

    this.bus.set(type, [fn]);
  };

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
      { index: this.frames.size },
      this.options,
      { width: this.width, height: this.height },
      options || {}
    );

    this.frames.enqueue(frame);
  }

  render() {
    if (this.frames.isEmpty()) throw Error('no frame, please add first');

    const workers = this.initWorkers();

    const total = this.frames.size;
    const startTime = window.performance.now();

    for (let i = 0; i < workers.length; i++) {
      const worker = workers[i];
      const next = this.frames.dequeue();

      if (isEmpty(next) || isEmpty(next.value)) return;

      worker.postMessage(next.value);

      this.activeWorkers.push(worker);

      worker.addEventListener('message', (e: MessageEvent<OutputData>) => {
        const {
          data: { index, data }
        } = e;

        this.response[index] = data;

        const i = this.activeWorkers.indexOf(worker);
        this.activeWorkers.splice(i, 1);

        const next = this.frames.dequeue();

        if (next?.value) {
          worker.postMessage(next.value);
          this.activeWorkers.push(worker);
        }

        const cbs = this.bus.get('progress');
        if (cbs) {
          const duration = window.performance.now() - startTime;
          const loaded = this.response.length;
          const average = duration / loaded;
          const surplus = average * (total - loaded);

          const params = {
            total: total,
            loaded: this.response.length,
            activeWorkers: this.activeWorkers.length,
            duration: +(duration / 1000).toFixed(2),
            surplus: +(surplus / 1000).toFixed(2),
            percentage: Math.round((loaded / total) * 100)
          };

          for (let i = 0; i < cbs.length; i++) {
            (cbs[i] as ProgressCallback)(params);
          }
        }

        if (this.frames.isEmpty() && this.activeWorkers.length === 0) {
          return this.complete();
        }
      });
    }
  }

  private getImageData(
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

  private initGif() {
    const out = new GIFByte();
    out.writeGifMagic();

    const globalColorTable: number[][] = [];

    if (this.config.background) {
      const background = window.parseInt(this.config.background.slice(1), 16);
      const bytes = [
        (background >> 16) & 0xff,
        (background >> 8) & 0xff,
        background & 0xff
      ];

      globalColorTable.push(bytes, [0, 0, 0], [0, 0, 0], [0, 0, 0]);
    }

    let colorSize = 2;

    while (globalColorTable.length > 1 << colorSize) colorSize++;

    const result = globalColorTable.length !== 0 ? 0x80 | (colorSize - 1) : 0;

    out.writeLogicalScreenDescriptor(
      this.config.width || this.width,
      this.config.height || this.height,
      0x70 | result
    );

    out.writeBytes(globalColorTable.flat());

    out.writeApplicationExtension(this.options.cycles);

    return out;
  }

  private initWorkers() {
    const { workers = 2 } = this.config;

    const count = Math.min(this.frames.size, workers);

    for (let i = 0; i < count; i++) {
      this.workers[this.workers.length] = new _Worker();
    }

    return this.workers;
  }

  private complete() {
    const frames = this.response;

    const out = this.initGif();

    for (let i = 0; i < frames.length; i++) {
      out.writeBytes(frames[i]);
    }

    const uint8 = out.end();

    const cbs = this.bus.get('finished');

    if (isEmpty(cbs)) return;

    for (let i = 0; i < cbs.length; i++) {
      (cbs[i] as FinishedCallback)(new Blob([uint8], { type: 'image/gif' }));
    }

    for (let i = 0; i < this.workers.length; i++) this.workers[i].terminate();

    this.firstFrame = true;
    this.workers = [];
    this.response = [];
  }
}

export default GIF;
