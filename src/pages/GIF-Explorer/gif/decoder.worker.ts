import { isEmpty } from '@/utils';
import { INTERCEPT_BIT, MAX_CODE_SIZE } from './config';
import type { GIFPattern } from '../types';

type Frames = GIFPattern['frames'][number];

type Message = Frames & { globalColor: boolean; globalColorTable?: number[][] };

const _self = self as unknown as Worker;

_self.addEventListener('message', ({ data }: MessageEvent<Message>) => {
  // 获取必要数据
  const {
    width,
    height,
    globalColor,
    globalColorTable,
    statistics: { localColor },
    localColorTable,
    lzwMiniCodeSize,
    blocks,
    control
  } = data;

  const { transparency = false, transparencyIndex = 0 } = control || {};

  if ((globalColor || localColor) === false) {
    throw Error(
      "can't find the corresponding color disk, please confirm whether there are valid data"
    );
  }

  function getByte() {
    if (cursor === block?.length) {
      block = blocks.shift();
      cursor = 0;
    }

    return block?.[cursor++];
  }

  function getCode() {
    while (offset < codeSize) {
      const byte = getByte();

      if (byte === undefined) {
        const result = bit & INTERCEPT_BIT[codeSize];

        bit >>>= codeSize;
        offset = 0;

        return result;
      }

      bit = (byte << offset) | bit;
      offset += 8;
    }

    const result = bit & INTERCEPT_BIT[codeSize];

    bit >>>= codeSize;
    offset -= codeSize;

    return result;
  }

  const clearCode = 1 << lzwMiniCodeSize;
  const eoiCode = clearCode + 1;
  const trie = new Map<number, number[]>();
  const indexStream: number[] = [];

  let codeSize = lzwMiniCodeSize + 1;

  let code = -1;
  let $code: number[] = [];
  let prevCode = -1;
  let perfix: number[] = [];
  let k = -1;
  let block = blocks.shift();
  let offset = 0;
  let bit = 0;
  let cursor = 0;

  let isFinish = false;

  code = getCode();
  if (code !== clearCode) {
    throw new Error(
      'invalid data, the first code in the code stream should be Clear Code'
    );
  }

  for (let i = 0; i <= eoiCode; i++) trie.set(i, [i]);

  code = getCode();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  $code = trie.get(code)!;
  indexStream.push(...$code);
  prevCode = code;

  while (block) {
    if (trie.size - 1 === (1 << codeSize) - 1 && codeSize < MAX_CODE_SIZE) {
      codeSize++;
    }

    code = getCode();

    switch (true) {
      case code === clearCode:
        trie.clear();
        for (let i = 0; i <= eoiCode; i++) trie.set(i, [i]);
        codeSize = lzwMiniCodeSize + 1;

        code = getCode();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        $code = trie.get(code)!;
        indexStream.push(...$code);
        prevCode = code;
        break;

      case code === eoiCode:
        isFinish = true;
        break;

      default:
        if (trie.has(code)) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          $code = trie.get(code)!;
          indexStream.push(...$code);

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          perfix = trie.get(prevCode)!;
          k = $code[0];

          perfix = perfix.concat(k);

          trie.set(trie.size, perfix);
          prevCode = code;
        } else {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          perfix = trie.get(prevCode)!;
          k = perfix[0];
          perfix = perfix.concat(k);
          indexStream.push(...perfix);
          trie.set(trie.size, perfix);
          prevCode = code;
        }

        break;
    }

    if (isFinish) break;
  }

  let table: number[][] = [];
  if (localColor && localColorTable) {
    table = localColorTable;
  } else if (globalColor && globalColorTable) {
    table = globalColorTable;
  }

  const transparent = transparency ? 0x00 : 0xff;
  const imageData = new ImageData(width, height);

  for (let i = 0; i < indexStream.length; i++) {
    const index = indexStream[i];
    const color = table[index];

    if (isEmpty(color)) {
      throw new Error(
        `can't find the corresponding color, please confirm that the color disc index ${index} exists`
      );
    }

    const j = i * 4;

    imageData.data[j] = color[0];
    imageData.data[j + 1] = color[1];
    imageData.data[j + 2] = color[2];
    imageData.data[j + 3] =
      index === transparencyIndex ? 0xff & transparent : 0xff;
  }

  const { globalColor: _, globalColorTable: __, ...result } = data;

  _;
  __;

  result.data = imageData;

  _self.postMessage(result);
});
