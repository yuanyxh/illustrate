import {
  GIF_MAGIC_NUMBER,
  APPLICATION_EXTENSION,
  GRAPHIC_CONTROL_EXTENSION,
  PLAIN_TEXT_EXTENSION,
  COMMENT_EXTENSION,
  IMAGE_DESCRIPTOR,
  APPLICATION_IDENTIFY,
  END_GIF,
  MAX_LENGTH
} from './config';

class GIFByte {
  pages: Uint8Array[];
  cursor = 0;

  constructor() {
    this.pages = [];
    this.newPage();
  }

  newPage() {
    this.pages[this.pages.length] = new Uint8Array(MAX_LENGTH);
    this.cursor = 0;
  }

  writeByte(byte: number) {
    this.pages[this.pages.length - 1][this.cursor++] = byte;

    if (this.cursor === MAX_LENGTH) this.newPage();
  }

  writeBytes(bytes: ArrayLike<number>) {
    for (let i = 0; i < bytes.length; i++) {
      this.writeByte(bytes[i]);
    }
  }

  writeShort(short: number) {
    const bytes = [short & 0xff, (short >> 8) & 0xff];

    this.writeBytes(bytes);
  }

  writeGifMagic() {
    this.writeBytes(GIF_MAGIC_NUMBER);
  }

  writeLogicalScreenDescriptor(
    width: number,
    height: number,
    info: number,
    backgroundIndex = 0,
    pixelAspectRatio = 0
  ) {
    this.writeShort(width);
    this.writeShort(height);
    this.writeBytes([info, backgroundIndex, pixelAspectRatio]);
  }

  writeApplicationExtension(Cycles = 0) {
    this.writeBytes(APPLICATION_EXTENSION);
    this.writeByte(0x0b);
    this.writeBytes(Array.from(new TextEncoder().encode(APPLICATION_IDENTIFY)));
    this.writeByte(0x03);
    this.writeByte(0x01);

    this.writeShort(Cycles);

    this.writeByte(0);
  }

  writeGraphicControlExtension(info = 0, delay = 40, transparent = 0) {
    this.writeBytes(GRAPHIC_CONTROL_EXTENSION);
    this.writeByte(0x04);

    this.writeByte(info);
    this.writeShort(delay);
    this.writeByte(transparent);

    this.writeByte(0);
  }

  writePlainTextExtension() {
    this.writeBytes(PLAIN_TEXT_EXTENSION);
  }

  writeCommentExtension() {
    this.writeBytes(COMMENT_EXTENSION);
  }

  writeImageDescriptor(
    width: number,
    height: number,
    info = 0,
    offsetLeft = 0,
    offsetTop = 0
  ) {
    this.writeBytes(IMAGE_DESCRIPTOR);

    this.writeShort(offsetLeft);
    this.writeShort(offsetTop);

    this.writeShort(width);
    this.writeShort(height);

    this.writeByte(info);
  }

  export() {
    let size = 0;

    const len = this.pages.length;
    const cursor = this.cursor;

    if (cursor === 0) {
      size = len * MAX_LENGTH;
    } else {
      size = len > 0 ? (len - 1) * MAX_LENGTH + cursor : 0;
    }

    const uint8 = new Uint8Array(size);

    for (let i = 0; i < len; i++) {
      const curr = this.pages[i];

      const last = len - 1;
      if (cursor && i === last) {
        const slice = curr.slice(0, cursor);

        uint8.set(slice, i * MAX_LENGTH);

        break;
      }

      uint8.set(curr, i * MAX_LENGTH);
    }

    return uint8;
  }

  end() {
    this.writeBytes(END_GIF);

    return this.export();
  }
}

export default GIFByte;
