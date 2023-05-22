import { Flag } from './enum';

export const isTypeOf =
  (binary: number[]) => (maybe: Uint8Array, offset?: number) =>
    binary.every((correct, i) => correct === maybe[i + (offset || 0)]);

export const toText = (binary: Uint8Array) => new TextDecoder().decode(binary);

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

/**
 * 标识数据
 */
export const isPDF = isTypeOf(Flag.IS_PDF);

export const isStartXref = isTypeOf(Flag.START_XREF);

export const isTrailer = isTypeOf(Flag.TRAILER);

export const isR = isTypeOf(Flag.IS_R);

export const isStream = isTypeOf(Flag.STREAM);

export const isEndStream = isTypeOf(Flag.ENDSTREAM);

/**
 * 特征数据
 */
export const isLeftArrow = isTypeOf(Flag.LEFT_ARROW);

export const isRightArrow = isTypeOf(Flag.RIGHT_ARROW);

export const isDictionaryStart = isTypeOf(Flag.DICTIONARY_START);

export const isDictionaryEnd = isTypeOf(Flag.DICTIONARY_END);

export const isLeftSquareBracket = isTypeOf(Flag.LEFT_SQUARE_BRACKET);

export const isRightSquareBracket = isTypeOf(Flag.RIGHT_SQUARE_BRACKET);

export const isLeftParentheses = isTypeOf(Flag.LEFT_PARENTHESES);

export const isRightParentheses = isTypeOf(Flag.RIGHT_PARENTHESES);

export const isInclined = isTypeOf(Flag.INCLINED);

/**
 * 特殊符号
 */
export const isSpace = isTypeOf(Flag.SPACE);

export const isLineFeed = isTypeOf(Flag.LINE_FEED);

export const isCarriageReturn = isTypeOf(Flag.CARRIAGE_RETURN);

export const isLineBreak = isTypeOf(Flag.LINE_BREAK);

/** 数据断点 */
export const isSplit = (view: Uint8Array, offset?: number) =>
  isSpace(view, offset) ||
  isLineFeed(view, offset) ||
  isCarriageReturn(view, offset) ||
  isLineBreak(view, offset);

export const isEnd = (view: Uint8Array, offset?: number) =>
  isRightArrow(view, offset) ||
  isDictionaryEnd(view, offset) ||
  isRightSquareBracket(view, offset) ||
  isRightParentheses(view, offset);

// ---------- 绘图操作符标识 ----------
export const isSave = isTypeOf(Flag.SAVE);

export const isTransform = isTypeOf(Flag.TRANSFORM);

export const isRect = isTypeOf(Flag.RECT);

export const isClipNonZero = isTypeOf(Flag.CLIP_NONZERO);

export const isClipEvenodd = isTypeOf(Flag.CLIP_EVENODD);

export const isClosePath = isTypeOf(Flag.CLOSE_PATH);

export const isLineWidth = isTypeOf(Flag.LINE_WIDTH);

export const isMiterLimit = isTypeOf(Flag.MITER_LIMIT);

export const isLineCap = isTypeOf(Flag.LINE_CAP);

export const isLineJoin = isTypeOf(Flag.LINE_JOIN);

export const isRG = isTypeOf(Flag.RG);

export const isGS = isTypeOf(Flag.GS);

export const isOutput = isTypeOf(Flag.OUTPUT);

export const isRestore = isTypeOf(Flag.RESTORE);

export const isFillNonZero = isTypeOf(Flag.FILL_NONZERO);

export const isFillStyle = isTypeOf(Flag.FILL_STYLE);

export const isStartText = isTypeOf(Flag.START_TEXT);

export const isSetFontFamily = isTypeOf(Flag.SET_FONT_FAMILY);

export const isSetFontPosition = isTypeOf(Flag.SET_FONT_POSITION);

// 字体

export const isDrawText = isTypeOf(Flag.DRAW_TEXT);

export const isBeginChar = isTypeOf(Flag.BEGIN_CHAR);

export const isEndChar = isTypeOf(Flag.END_CHAR);

export const isTranslateFont = isTypeOf(Flag.TRANSLATE_FONT);

export const isEndText = isTypeOf(Flag.END_TEXT);

export const isOperations = (view: Uint8Array, offset?: number) =>
  isSave(view, offset) ||
  isTransform(view, offset) ||
  isRect(view, offset) ||
  isClipEvenodd(view, offset) ||
  isClipNonZero(view, offset) ||
  isClosePath(view, offset) ||
  isLineWidth(view, offset) ||
  isMiterLimit(view, offset) ||
  isLineCap(view, offset) ||
  isLineJoin(view, offset) ||
  isRG(view, offset) ||
  isInclined(view, offset) ||
  isGS(view, offset) ||
  isOutput(view, offset) ||
  isRestore(view, offset) ||
  isFillNonZero(view, offset) ||
  isClipNonZero(view, offset) ||
  isFillStyle(view, offset) ||
  isStartText(view, offset) ||
  isSetFontFamily(view, offset) ||
  isSetFontPosition(view, offset) ||
  isDrawText(view, offset) ||
  isTranslateFont(view, offset) ||
  isEndText(view, offset);
