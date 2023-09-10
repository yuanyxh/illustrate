export const GIF_MAGIC_NUMBER = [0x47, 0x49, 0x46, 0x38, 0x39, 0x61];

export const APPLICATION_EXTENSION = [0x21, 0xff];

export const PLAIN_TEXT_EXTENSION = [0x21, 0x01];

export const COMMENT_EXTENSION = [0x21, 0xfe];

export const GRAPHIC_CONTROL_EXTENSION = [0x21, 0xf9];

export const IMAGE_DESCRIPTOR = [0x2c];

export const APPLICATION_IDENTIFY = 'NETSCAPE2.0';

export const END_GIF = [0x3b];

export const MAX_LENGTH = 4096;

export const MAX_CODE_SIZE = 12;

export const INTERCEPT_BIT = [
  0x00, 0x01, 0x03, 0x07, 0x0f, 0x1f, 0x3f, 0x7f, 0xff, 0x01ff, 0x03ff, 0x07ff,
  0x0fff
];
