import {
  GIF_MAGIC_NUMBER,
  APPLICATION_EXTENSION,
  GRAPHIC_CONTROL_EXTENSION,
  PLAIN_TEXT_EXTENSION,
  COMMENT_EXTENSION,
  IMAGE_DESCRIPTOR,
  END_GIF
} from './config';

export const isTypeOf =
  (nums: number[]) =>
  (bytes: Uint8Array, cursor = 0) =>
    nums.every((byte, i) => byte === bytes[i + cursor]);

export const isGIF = isTypeOf(GIF_MAGIC_NUMBER);

export const isApplicationExtension = isTypeOf(APPLICATION_EXTENSION);

export const isGraphicControlExtension = isTypeOf(GRAPHIC_CONTROL_EXTENSION);

export const isPlainTextExtension = isTypeOf(PLAIN_TEXT_EXTENSION);

export const isCommentExtension = isTypeOf(COMMENT_EXTENSION);

export const isImageDescriptor = isTypeOf(IMAGE_DESCRIPTOR);

export const isEnd = isTypeOf(END_GIF);
