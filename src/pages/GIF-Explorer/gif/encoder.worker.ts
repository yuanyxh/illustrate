import { MAX_CODE_SIZE } from './config';
import Trie from './Trie';
import GIFByte from './GIFByte';
import bulidColor from './bulidColor';
import type { ImageOptions, ColorObject } from '../types';

const _self = self as unknown as Worker;
function encoder(e: MessageEvent<ImageOptions>) {
  const { data } = e;

  const {
    data: { data: pixels },
    options
  } = data;

  const {
    offsetLeft = 0,
    offsetTop = 0,
    width = 0,
    height = 0,
    disposalMethod = 4,
    userInput = 0,
    transparency = 0,
    delay = 40,
    transparencyIndex = 0
  } = options;

  const map = new Map<ColorObject, number>();
  const input: number[] = [];

  // const octree = new Octree();
  // console.log('start', self.performance.now());
  // 八叉树颜色量化
  // for (let i = 0; i < pixels.length; i += 4) {
  //   octree.insertColor({ r: pixels[i], g: pixels[i + 1], b: pixels[i + 2] });
  // }
  // 减色至 256 色
  // octree.shrink(256);

  // 获取颜色列表
  const { colorList, octree } = bulidColor(pixels);

  // 颜色转换为调色盘中颜色的索引
  for (let i = 0; i < pixels.length; i += 4) {
    const color = octree.quantizeColor({
      r: pixels[i],
      g: pixels[i + 1],
      b: pixels[i + 2]
    });

    if (color) {
      if (map.has(color)) {
        input.push(map.get(color) || 0);
      } else {
        const index = colorList.indexOf(color);
        map.set(color, index);
        input.push(index);

        if (index < 0 || index > 255) {
          throw Error(
            'the color disk compilation fails, exceeding the expected value'
          );
        }
      }
    } else {
      throw Error(
        'the color disk compilation fails, and there is a problem with the quantification of the color'
      );
    }
  }

  if (input.length !== width * height) {
    throw Error('index length error');
  }

  // 本地颜色表
  const localColorTable = colorList.map(({ r, g, b }) => [r, g, b]);

  // 初始化最小代码大小
  let lzwMiniCodeSize = 2;
  while (localColorTable.length > 1 << lzwMiniCodeSize) lzwMiniCodeSize++;

  // 填充色盘, 防止色盘大小错误
  for (
    let i = 0, len = localColorTable.length;
    i < (1 << lzwMiniCodeSize) - len;
    i++
  ) {
    localColorTable.push([0, 0, 0]);
  }

  // 初始化清除码、结束码、码表
  const clearCode = 1 << lzwMiniCodeSize;
  const eoiCode = clearCode + 1;

  // 初始化查找表、字节输出
  const trie = new Trie();
  const out = new GIFByte();

  // 输出图形控制器
  out.writeGraphicControlExtension(
    disposalMethod | userInput | transparency,
    delay / 10,
    transparencyIndex
  );
  // 输出图像描述符
  out.writeImageDescriptor(
    width,
    height,
    0x80 | (lzwMiniCodeSize - 1),
    offsetLeft,
    offsetTop
  );
  // 输出本地颜色表
  out.writeBytes(localColorTable.flat());
  // 输出最小代码大小
  out.writeByte(lzwMiniCodeSize);

  // 初始化可变代码大小、前缀、当前输入 k
  let codeSize = lzwMiniCodeSize + 1;
  let prefix: number[] = [];
  let k: number[] = [];

  // 初始化输入长度、当前索引 point
  const len = input.length;
  let point = 0;

  // 剩余位
  let bit = 0;
  // 偏移位
  let offset = 0;

  // 字节
  const bytes: number[] = [];

  const set = (code: number) => {
    code <<= offset;
    code |= bit;

    offset += codeSize;

    while (offset >= 8) {
      bytes[bytes.length] = code & 0xff;

      if (bytes.length === 0xff) {
        out.writeByte(0xff);
        out.writeBytes(bytes);

        bytes.length = 0;
      }

      code >>>= 8;
      offset -= 8;
    }

    bit = code;
  };

  // 首先输出清除码
  set(clearCode);

  // 取第一个输入作为初始化的当前前缀
  prefix = [input[point++]];

  // 初始化查找表
  for (let i = 0; i <= eoiCode; i++) trie.insert([i]);

  // 主循环体
  while (point < len) {
    // 获取下一个输入作为 k
    k = [input[point++]];

    // 查找表中查找 前缀 + k
    const current = prefix.concat(k);
    const result = trie.search(current);

    // 找到则 前缀 = 前缀 + k
    if (result) {
      prefix = current;
      k = [];

      continue;
    }

    // 未找到在查找表中插入
    trie.insert(current);

    // 获取前缀对应的码
    const prefixCode = trie.search(prefix);

    // 添加至码表
    prefixCode && set(prefixCode.code);

    // 前缀 = k
    prefix = k;
    // k 重置
    k = [];

    // 获取刚刚添加的码
    const preCode = trie.count - 1;

    // 如果码大于 codeSize 所能表示的数字且 codeSize 小于 12, codeSize + 1
    if (preCode > (1 << codeSize) - 1 && codeSize < MAX_CODE_SIZE) {
      codeSize++;
    } else if (preCode === 1 << MAX_CODE_SIZE) {
      // 如果码等于最大代码所能表示的值, 重新初始化查找表
      trie.clear();
      for (let i = 0; i <= eoiCode; i++) trie.insert([i]);

      // 输出清除码
      set(clearCode);

      // 重置 codeSize
      codeSize = lzwMiniCodeSize + 1;
    }
  }

  // 已完成输出最后的码
  const val = trie.search(prefix);
  val && set(val.code);

  // 输出信息结束码
  set(eoiCode);

  // 如果还有剩余的位, 添加至字节列表
  if (offset !== 0) {
    bytes[bytes.length] = bit;
  }

  // 如果字节还有数据, 输出至字节数组
  if (bytes.length) {
    out.writeByte(bytes.length);
    out.writeBytes(bytes);
  }

  // 块结束
  out.writeByte(0x00);

  const image = out.export();

  _self.postMessage({ index: options.index, data: image });

  // console.log('end', self.performance.now());
}

_self.addEventListener('message', encoder);
