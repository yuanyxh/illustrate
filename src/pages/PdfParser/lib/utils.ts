import { Flag, Feature, InvisibleChar, Graphic } from './enum';

/** point to px */
export const getCurrentPixel = (pt: number, scale = 1) =>
  ((pt * (window.devicePixelRatio * 96)) / 72) * scale;

/** 相等判断 */
export const isEqual = (variable1: unknown, variable2: unknown) =>
  Object.is(variable1, variable2);

/** 组合判断 */
export const combination =
  (...fns: ReturnType<typeof isTypeOf>[]) =>
  (maybe: Uint8Array, offset?: number) =>
    fns.some((fn) => fn(maybe, offset));

/** 柯里化函数，匹配字节数据 */
export const isTypeOf =
  (binary: number[]) => (maybe: Uint8Array, offset?: number) =>
    binary.every((correct, i) => correct === maybe[i + (offset || 0)]);

export const toText = (binary: Uint8Array) => new TextDecoder().decode(binary);

// 获取文件缓冲区视图
export const getBufferView = (file: File) => {
  return new Promise<Uint8Array>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(new Uint8Array(reader.result as ArrayBuffer));
    };

    reader.onerror = reject;

    reader.readAsArrayBuffer(file);
  });
};

/** 是否是 pdf 文件, 标识数据: %PDF */
export const isPdf = isTypeOf(Flag.IS_PDF);

/** 是否是字典头, 特征数据: << */
export const isDictionaryStart = isTypeOf(Feature.DICTIONARY_START);

/** 是否是字典结尾, 特征数据: >> */
export const isDictionaryEnd = isTypeOf(Feature.DICTIONARY_END);

/** 是否是数组开始, 特征数据: [ */
export const isSquareBracketStart = isTypeOf(Feature.SQUARE_BRACKET_START);

/** 是否是数组结束, 特征数据: ] */
export const isSquareBracketEnd = isTypeOf(Feature.SQUARE_BRACKET_END);

/** 是否是名称, 特征数据: / */
export const isInclined = isTypeOf(Feature.INCLINED);

/** 是否是字符串开头, 特征数据: < */
export const isArrowStart = isTypeOf(Feature.ARROW_START);

/** 是否是字符串结尾, 特征数据: > */
export const isArrowEnd = isTypeOf(Feature.ARROW_END);

/** 是否是字符串开头, 特征数据: ( */
export const isParenthesesStart = isTypeOf(Feature.PARENTHESES_START);

/** 是否是字符串结尾, 特征数据: ) */
export const isParenthesesEnd = isTypeOf(Feature.PARENTHESES_END);

/** 是否是特征数据开头 */
export const isStart = combination(
  isDictionaryStart,
  isSquareBracketStart,
  isArrowStart,
  isParenthesesStart
);

/** 是否是特征数据结尾 */
export const isEnd = combination(
  isDictionaryEnd,
  isSquareBracketEnd,
  isArrowEnd,
  isParenthesesEnd
);

/** 是否是空格 */
export const isSpace = isTypeOf(InvisibleChar.SPACE);

/** 是否是换行 */
export const isLineFeed = isTypeOf(InvisibleChar.LINE_FEED);

/** 是否是回车 */
export const isCarriageReturn = isTypeOf(InvisibleChar.CARRIAGE_RETURN);

/** 是否是换行 */
export const isLineBreak = isTypeOf(InvisibleChar.LINE_BREAK);

/** 是否是数据断点, 假定空格、换行为数据断点处 */
export const isBreakPoint = combination(
  isSpace,
  isLineFeed,
  isCarriageReturn,
  isLineBreak
);

/** 是否是间接引用 */
export const isQuote = isTypeOf(Flag.QUOTE);

/** 是否是流开始 */
export const isStreamStart = isTypeOf(Flag.STREAM_START);

/** 是否是流结束 */
export const isStreamEnd = isTypeOf(Flag.STREAM_END);

/** 是否是线宽 */
export const isLineWidth = isTypeOf(Graphic.LINE_WIDTH);

/** 是否是线端点 */
export const isLineCap = isTypeOf(Graphic.LINE_CAP);

/** 是否是线交叉 */
export const isLineJoin = isTypeOf(Graphic.LINE_JOIN);

/** 是否是斜接面限制比例 */
export const isMiterLimit = isTypeOf(Graphic.MITER_LIMIT);

/** 是否是图形状态 */
export const isGS = isTypeOf(Graphic.GS);

/** 是否是保存状态 */
export const isSave = isTypeOf(Graphic.SAVE);

/** 是否是回退状态 */
export const isRestore = isTypeOf(Graphic.RESTORE);

/** 是否是回退状态 */
export const isSetTransform = isTypeOf(Graphic.SET_TRANSFORM);

/** 是否是绘制矩形 */
export const isRect = isTypeOf(Graphic.RECT);

/** 是否是填充路径 */
export const isFillNonZero = isTypeOf(Graphic.FILL_NONZERO);

/** 是否是闭合路径 */
export const isClosePath = isTypeOf(Graphic.CLOSE_PATH);

/** 是否是裁剪路径 */
export const isClipNonZero = isTypeOf(Graphic.CLIP_NONZERO);

/** 是否是裁剪路径 */
export const isClipEvenodd = isTypeOf(Graphic.CLIP_EVENODD);

/** 是否是开始文本对象 */
export const isStartText = isTypeOf(Graphic.START_TEXT);

/** 是否是结束文本对象 */
export const isEndText = isTypeOf(Graphic.END_TEXT);

/** 是否设置字体 */
export const isSetFontFamily = isTypeOf(Graphic.SET_FONT_FAMILY);

/** 是否设置文字偏移 */
export const isTranslateFont = isTypeOf(Graphic.TRANSLATE_FONT);

/** 是否设置文字矩阵 */
export const isSetFontPosition = isTypeOf(Graphic.SET_FONT_POSITION);

/** 是否显示文字 */
export const isDrawText = isTypeOf(Graphic.DRAW_TEXT);

/** 是否是 fill 样式 */
export const isFillColor = isTypeOf(Graphic.FILL_COLOR);

/** 是否 stroke 样式 */
export const isStrokeColor = isTypeOf(Graphic.STROKE_COLOR);

/** 是否 output */
export const isOutput = isTypeOf(Graphic.OUTPUT);

export const isOperator = combination(
  isLineWidth,
  isLineCap,
  isLineJoin,
  isMiterLimit,
  isGS,
  isSave,
  isRestore,
  isSetTransform,
  isRect,
  isFillNonZero,
  isClosePath,
  isClipNonZero,
  isClipEvenodd,
  isStartText,
  isEndText,
  isSetFontFamily,
  isTranslateFont,
  isSetFontPosition,
  isDrawText,
  isFillColor,
  isStrokeColor,
  isOutput
);

/** 开始字体映射区域 */
export const isBeginChar = isTypeOf(Flag.BEGIN_CHAR);

/** 结束字体映射区域 */
export const isEndChar = isTypeOf(Flag.BEGIN_CHAR);
