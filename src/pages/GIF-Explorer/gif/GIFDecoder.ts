// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import _Worker from './decoder.worker';
import { isEmpty } from '@/utils';
import {
  GIF_MAGIC_NUMBER,
  APPLICATION_EXTENSION,
  GRAPHIC_CONTROL_EXTENSION,
  PLAIN_TEXT_EXTENSION,
  COMMENT_EXTENSION,
  IMAGE_DESCRIPTOR,
  END_GIF
} from './config';
import {
  isGIF,
  isApplicationExtension,
  isGraphicControlExtension,
  isPlainTextExtension,
  isCommentExtension,
  isImageDescriptor,
  isEnd
} from './utils';
import type { GIFPattern } from '../types';

class GIFDecoder {
  cursor = 0;

  private pattern!: GIFPattern;
  private mark: 'never' | 'graphic' | 'end' = 'never';
  private index = 0;

  private bus = new Map<'finished', ((e: GIFPattern) => void)[]>();
  private maxWorkers: number;
  private workers: Worker[] = [];
  private activeWorkers: Worker[] = [];

  private isRunning = false;

  constructor(maxWorkers = 2) {
    this.maxWorkers = maxWorkers;
  }

  private async getBytes(binary: Blob) {
    return new Uint8Array(await binary.arrayBuffer());
  }

  private toText(binary: Uint8Array) {
    return new TextDecoder().decode(binary);
  }

  private initWorkers() {
    for (let i = 0; i < this.maxWorkers; i++) {
      this.workers[this.workers.length] = new _Worker();
    }

    return this.workers;
  }

  private parseShort(bytes: Uint8Array) {
    const lowBit = bytes[this.cursor++];
    const highBit = bytes[this.cursor++];

    return highBit * 256 + lowBit;
  }

  private parseSubBlocks(bytes: Uint8Array) {
    const blocks: Uint8Array[] = [];

    let len = bytes[this.cursor++];

    while (len !== 0) {
      blocks.push(bytes.slice(this.cursor, (this.cursor += len)));

      len = bytes[this.cursor++];
    }

    return blocks;
  }

  private parse(bytes: Uint8Array) {
    this.parseHeader(bytes);
    this.parseLogicalScreenDescriptor(bytes);

    while (this.cursor < bytes.length) {
      switch (true) {
        case bytes[this.cursor] === 0x21:
          this.parseExtension(bytes);
          break;

        case isImageDescriptor(bytes, this.cursor):
          this.cursor += IMAGE_DESCRIPTOR.length;

          this.parseImage(bytes);
          break;

        case isEnd(bytes, this.cursor):
          this.cursor += END_GIF.length;

          this.mark = 'end';

          break;

        default:
          if (this.mark !== 'end') {
            throw new Error(
              `unknown byte ${bytes[this.cursor]} in ${this.cursor}`
            );
          } else {
            this.cursor++;
          }
      }

      if (this.mark === 'end') break;
    }
  }

  private parseHeader(bytes: Uint8Array) {
    if (isGIF(bytes)) {
      this.pattern.header = this.toText(
        bytes.slice(0, (this.cursor += GIF_MAGIC_NUMBER.length))
      );

      return;
    }

    throw Error('it must be a gif file and the version is 89a');
  }

  private parseLogicalScreenDescriptor(bytes: Uint8Array) {
    const width = this.parseShort(bytes);
    const height = this.parseShort(bytes);

    const byte = bytes[this.cursor++];

    const globalColor = !!(byte & 0x80);
    const colorResolution = (byte & 0x70) >> 4;
    const sort = !!(byte & 0x8);
    const globalColorSize = byte & 0x7;

    const backgroundIndex = bytes[this.cursor++];
    const pixelAspectRatio = bytes[this.cursor++];

    this.pattern.logicalScreenDescriptor = {
      width,
      height,
      statistics: { globalColor, colorResolution, sort, globalColorSize },
      backgroundIndex,
      pixelAspectRatio
    };

    if (globalColor) {
      this.pattern.globalColorTable = this.parseColorTable(
        bytes,
        globalColorSize
      );
    }
  }

  private parseExtension(bytes: Uint8Array) {
    switch (true) {
      case isApplicationExtension(bytes, this.cursor):
        if (this.mark !== 'never') {
          console.warn(
            `analysis of the analytical step -by -step, it may be an irregular GIF file. block in ${this.cursor}`
          );
        }

        this.parseApplicationExtension(bytes);
        break;

      case isGraphicControlExtension(bytes, this.cursor):
        if (this.mark !== 'never') {
          console.warn(
            `is there a consecutive image control block? is this intentional? block in ${this.cursor}`
          );
        }

        this.mark = 'graphic';

        this.parseGraphicControlExtension(bytes);
        break;

      case isPlainTextExtension(bytes, this.cursor):
        this.parsePlainTextExtension(bytes);
        break;

      case isCommentExtension(bytes, this.cursor):
        if (this.mark !== 'never') {
          console.warn(
            `analysis of the analytical step -by -step, it may be an irregular GIF file. block in ${this.cursor}`
          );
        }

        this.parseCommentExtension(bytes);
        break;

      default:
        throw Error(
          `invalid extension ${bytes
            .slice(this.cursor, this.cursor + 2)
            .join(', ')} in ${this.cursor}`
        );
    }
  }

  private parseColorTable(bytes: Uint8Array, colorSize: number) {
    const len = 1 << (colorSize + 1);

    const table: number[][] = [];

    for (let i = 0; i < len; i++) {
      table.push([
        bytes[this.cursor++],
        bytes[this.cursor++],
        bytes[this.cursor++]
      ]);
    }

    return table;
  }

  private parseApplicationExtension(bytes: Uint8Array) {
    this.cursor += APPLICATION_EXTENSION.length;

    const len = bytes[this.cursor++];
    const application = this.toText(
      bytes.slice(this.cursor, (this.cursor += len))
    );

    this.cursor++;
    const id = bytes[this.cursor++];
    const loop = this.parseShort(bytes);

    this.pattern.applicationExtension = {
      id,
      application,
      loop
    };

    if (bytes[this.cursor++] !== 0) {
      throw Error(
        `unknown byte, it should be the ending character 0x00, but encountered ${
          bytes[this.cursor]
        }`
      );
    }

    console.log('exec parseApplicationExtension');
  }

  private parseGraphicControlExtension(bytes: Uint8Array) {
    this.cursor += GRAPHIC_CONTROL_EXTENSION.length;

    this.cursor++;

    const byte = bytes[this.cursor++];

    const disposal = (byte & 0x1c) >> 2;
    const userInput = !!(byte & 0x02);
    const transparency = !!(byte & 0x01);
    const delay = this.parseShort(bytes) * 10;
    const transparencyIndex = bytes[this.cursor++];

    this.pattern.graphicControlExtension = {
      disposal,
      userInput,
      transparency,
      delay,
      transparencyIndex
    };

    if (bytes[this.cursor++] !== 0) {
      throw Error(
        `unknown byte, it should be the ending character 0x00, but encountered ${
          bytes[this.cursor]
        }`
      );
    }
  }

  private parsePlainTextExtension(bytes: Uint8Array) {
    this.cursor += PLAIN_TEXT_EXTENSION.length;
    this.cursor++;

    const offsetLeft = this.parseShort(bytes);
    const offsetTop = this.parseShort(bytes);
    const gridWidth = this.parseShort(bytes);
    const gridHeight = this.parseShort(bytes);
    const charWidth = bytes[this.cursor++];
    const charHeight = bytes[this.cursor++];
    const textColorIndex = bytes[this.cursor++];
    const textBackgroundIndex = bytes[this.cursor++];

    const blocks = this.parseSubBlocks(bytes);

    let text = '';

    for (let i = 0; i < blocks.length; i++) {
      for (let j = 0; j < blocks[i].length; j++) {
        text += String.fromCharCode(blocks[i][j]);
      }
    }

    if (isEmpty(this.pattern.plainTextExtension)) {
      this.pattern.plainTextExtension = [];
    }

    this.pattern.plainTextExtension.push({
      index: this.index++,
      offsetLeft,
      offsetTop,
      gridWidth,
      gridHeight,
      charWidth,
      charHeight,
      textColorIndex,
      textBackgroundIndex,
      text,
      control:
        this.mark === 'graphic'
          ? this.pattern.graphicControlExtension
          : undefined
    });

    this.mark = 'never';
  }

  private parseCommentExtension(bytes: Uint8Array) {
    this.cursor += COMMENT_EXTENSION.length;

    const blocks = this.parseSubBlocks(bytes);

    let comments = '';

    for (let i = 0; i < blocks.length; i++) {
      for (let j = 0; j < blocks[i].length; j++) {
        comments += String.fromCharCode(blocks[i][j]);
      }
    }

    if (isEmpty(this.pattern.commentExtension)) {
      this.pattern.commentExtension = [];
    }

    this.pattern.commentExtension.push({ index: this.index++, comments });
  }

  private parseImage(bytes: Uint8Array) {
    const offsetLeft = this.parseShort(bytes);
    const offsetTop = this.parseShort(bytes);
    const width = this.parseShort(bytes);
    const height = this.parseShort(bytes);

    const byte = bytes[this.cursor++];

    const localColor = !!(byte & 0x80);
    const interlace = !!(byte & 0x40);
    const sort = !!(byte & 0x20);
    const localColorSize = byte & 0x07;

    let localColorTable: number[][] | undefined;

    if (localColor) {
      localColorTable = this.parseColorTable(bytes, localColorSize);
    }

    const lzwMiniCodeSize = bytes[this.cursor++];

    const blocks = this.parseSubBlocks(bytes);

    if (isEmpty(this.pattern.frames)) {
      this.pattern.frames = [];
    }

    this.pattern.frames.push({
      index: this.index++,
      offsetLeft,
      offsetTop,
      width,
      height,
      statistics: {
        localColor,
        interlace,
        sort,
        localColorSize
      },
      localColorTable,
      lzwMiniCodeSize,
      blocks,
      control:
        this.mark === 'graphic'
          ? this.pattern.graphicControlExtension
          : undefined
    });

    this.mark = 'never';
  }

  private unzip() {
    const workers = this.initWorkers();

    const globalColorTable = this.pattern.globalColorTable;
    const globalColor =
      this.pattern.logicalScreenDescriptor.statistics.globalColor;
    const frames = this.pattern.frames.slice(0);

    this.pattern.frames = [];

    for (let i = 0; i < workers.length; i++) {
      const message = frames.shift();

      if (isEmpty(message)) break;

      workers[i].postMessage({ ...message, globalColorTable, globalColor });

      this.activeWorkers.push(workers[i]);

      workers[i].addEventListener(
        'message',
        ({ data }: MessageEvent<GIFPattern['frames'][number]>) => {
          this.pattern.frames.push(data);

          const index = this.activeWorkers.indexOf(workers[i]);
          this.activeWorkers.splice(index, 1);

          const message = frames.shift();

          if (message) {
            workers[i].postMessage({
              ...message,
              globalColorTable,
              globalColor
            });

            this.activeWorkers[this.activeWorkers.length] = workers[i];
          } else if (this.activeWorkers.length === 0) {
            this.isRunning = false;
            this.cursor = 0;
            this.mark = 'never';
            this.index = 0;

            for (let i = 0; i < this.workers.length; i++) {
              this.workers[i].terminate();
            }
            this.workers = [];

            this.complete();
          }
        }
      );
    }
  }

  private complete() {
    this.pattern.frames.sort((a, b) => a.index - b.index);

    const events = this.bus.get('finished') || [];

    for (let i = 0; i < events.length; i++) {
      events[i](this.pattern);
    }

    this.pattern = {} as GIFPattern;
  }

  on(type: 'finished', fn: (e: GIFPattern) => void) {
    if (this.bus.has(type)) {
      const events = this.bus.get(type);
      events?.push(fn);
      this.bus.set(type, events || []);
    } else {
      this.bus.set(type, [fn]);
    }
  }

  async decode(binary: Blob) {
    if (this.isRunning) return false;

    this.isRunning = true;

    const bytes = await this.getBytes(binary);

    this.pattern = {} as GIFPattern;
    this.parse(bytes);
    this.unzip();
  }
}

export default GIFDecoder;
