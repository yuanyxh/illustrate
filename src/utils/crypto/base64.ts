import { isNumber } from '@/utils';

/** base64 字符映射 */
const CHARACTER_SET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/**
 * @description 文本转字节
 * @param str 需要转为字节数组的文本
 * @returns 字节数组
 */
const toBytes = (str: string) => new TextEncoder().encode(str);

/**
 * @description 获取字符串在 base64 字符映射中的索引
 * @param str base64 字符串
 * @returns 字符索引数组
 */
const toCodeAt = (str: string) => {
  const codeAt = [];

  for (let i = 0; i < str.length; i++) {
    const index = CHARACTER_SET.indexOf(str[i]);

    index >= 0 && (codeAt[i] = index);
  }

  return codeAt;
};

/**
 *
 * @param str 需要 base64 编码的字符串
 * @returns base64 字符串
 */
const encode = (str: string) => {
  const bytes = toBytes(str);

  let i = 0,
    output = '';

  while (i < bytes.length) {
    const a = bytes[i++],
      b = bytes[i++] || 0,
      c = bytes[i++] || 0;

    // 3 个 8 位 二进制组合为一个 24 位二进制
    const total = (a << 16) + (b << 8) + c;

    output += CHARACTER_SET.charAt(
      /* 右移 18 位，截取 6 位 */ (total >>> 18) & 63
    );
    output += CHARACTER_SET.charAt(
      /* 右移 12 位，截取 6 位 */ (total >>> 12) & 63
    );
    output +=
      b !== 0
        ? CHARACTER_SET.charAt(/* 右移 6 位，截取 6 位 */ (total >>> 6) & 63)
        : '=';
    output += c !== 0 ? CHARACTER_SET.charAt(/* 截取 6 位 */ total & 63) : '=';
  }

  return output;
};

/**
 *
 * @description 解码 base64 字符串
 * @param str 需要解码的 base64 字符串
 * @returns 解码后的字符串
 */
const decode = (str: string) => {
  const codeAt = toCodeAt(str);

  let i = 0;

  const original = [];

  while (i < codeAt.length) {
    const a = codeAt[i++],
      b = codeAt[i++],
      c = codeAt[i++],
      d = codeAt[i++];

    const n_a = a,
      n_b = b,
      n_c = c || 0,
      n_d = d || 0;

    const total = (n_a << 18) + (n_b << 12) + (n_c << 6) + n_d;

    original.push((total >> 16) & 255);
    isNumber(c) && original.push((total >> 8) & 255);
    isNumber(d) && original.push(total & 255);
  }

  return window.decodeURIComponent(
    new TextDecoder().decode(new Uint8Array(original))
  );
};

export default { encode, decode };
