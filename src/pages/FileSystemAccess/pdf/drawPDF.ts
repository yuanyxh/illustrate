/* eslint-disable @typescript-eslint/ban-ts-comment */
import pako from 'pako';
import { isNumber, isArray } from '@/utils';
import { Flag } from './enum';
import {
  isLineBreak,
  isStream,
  isEndStream,
  isSplit,
  isEnd,
  toText,
  isRightArrow,
  isRightParentheses,
  isRightSquareBracket,
  isInclined,
  isDictionaryEnd,
  isDictionaryStart,
  isLeftArrow,
  isLeftParentheses,
  isLeftSquareBracket,
  isSave,
  isTransform,
  isRect,
  isClipEvenodd,
  isClipNonZero,
  isClosePath,
  isLineWidth,
  isOperations,
  isMiterLimit,
  isLineCap,
  isLineJoin,
  isRG,
  isGS,
  isOutput,
  isRestore,
  isFillNonZero,
  isFillStyle,
  isStartText,
  isSetFontFamily,
  isSetFontPosition,
  isDrawText,
  isBeginChar,
  isEndChar,
  isTranslateFont,
  isEndText
} from './utils';

interface PDF {
  info: PDFInfo;
  root: Root;
  pages: Pages;
  pageList: Page[];
}

type FlagKeys = keyof typeof Flag;

type GetQuote = (dictionary: Dictionary, val: string) => Quote | null;

function drawPDF(view: Uint8Array, { info, root, pages, pageList }: PDF) {
  const stateStack: FlagKeys[] = [];

  let offset = 0;

  const forwardOffset = (value?: number) =>
    isNumber(value) ? (offset += value) : ++offset;

  const resetOffset = (value: number) => (offset = value);

  const createCanvas = (mediabox: Page['MediaBox']) => {
    const canvas = document.createElement('canvas');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const context = canvas.getContext('2d')!;

    const [_0, _1, _2, _3] = mediabox || [0, 0, 0, 0];

    canvas.width = _2;
    canvas.height = _3;

    return { canvas, context };
  };

  const getTopStack = () => stateStack[stateStack.length - 1];

  const popStack = (key: FlagKeys) => {
    if (stateStack.pop() === key) return;

    throw Error('analyze the PDF error, please contact the plug -in developer');
  };

  function parseValue() {
    let beforeOffset = offset;

    for (; offset < view.length; offset++) {
      if (isSplit(view, offset)) continue;

      beforeOffset = offset;

      for (; offset < view.length; offset++) {
        if (!isSplit(view, offset) && !isEnd(view, offset)) continue;

        return toText(view.slice(beforeOffset, offset));
      }
    }
  }

  function parseDrawValue(stream: Uint8Array) {
    let beforeOffset = offset;

    for (; offset < stream.length; offset++) {
      if (isSplit(stream, offset)) continue;

      beforeOffset = offset;

      for (; offset < stream.length; offset++) {
        if (!isSplit(stream, offset) && !isEnd(stream, offset)) continue;

        if (isOperations(stream, beforeOffset)) {
          resetOffset(beforeOffset);
          return;
        }

        return toText(stream.slice(beforeOffset, offset));
      }
    }
  }

  function parseNumberOrQuote() {
    const verifyNumber = /^\d+$/;

    let beforeOffset = offset;

    const numOrSerial = parseValue() || '';

    if (
      !verifyNumber.test(numOrSerial.split('.')[0]) &&
      !verifyNumber.test(numOrSerial.split('.')[1])
    ) {
      resetOffset(beforeOffset);

      return;
    }

    beforeOffset = offset;

    const version = parseValue() || '';

    if (!verifyNumber.test(version) || parseValue() !== 'R') {
      resetOffset(beforeOffset);

      return window.parseFloat(numOrSerial);
    }

    return { serial: +numOrSerial, version: +version };
  }

  function parseArray() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const arr: any[] = [];

    for (; offset < view.length; offset++) {
      if (isRightSquareBracket(view, offset - 1)) {
        resetOffset(offset - 1);
        break;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const value: any = parseNumberOrQuote();

      if (value !== undefined) {
        arr.push(value);

        continue;
      }

      if (isDictionaryStart(view, offset)) {
        arr.push(parseDictionary());

        continue;
      }

      if (isLeftSquareBracket(view, offset)) {
        arr.push(parseArray());

        continue;
      }

      if (isLeftParentheses(view, offset) || isLeftArrow(view, offset)) {
        forwardOffset(1);

        arr.push(parseValue());

        continue;
      }
    }

    return arr;
  }

  function parseDictionary() {
    const dictionary = {} as Dictionary;

    let jumpOut = false;
    let key = '';

    while (offset < view.length) {
      switch (true) {
        case isDictionaryStart(view, offset):
          forwardOffset(Flag.DICTIONARY_START.length);

          stateStack.push('DICTIONARY_START');

          if (key !== '') {
            dictionary[key] = parseDictionary();
          }

          break;

        case getTopStack() === 'DICTIONARY_START' &&
          isDictionaryEnd(view, offset):
          forwardOffset(Flag.DICTIONARY_END.length);

          popStack('DICTIONARY_START');

          jumpOut = true;

          break;

        case isLeftSquareBracket(view, offset):
          forwardOffset(Flag.LEFT_SQUARE_BRACKET.length);

          stateStack.push('LEFT_SQUARE_BRACKET');

          dictionary[key] = parseArray();

          break;

        case isRightSquareBracket(view, offset):
          forwardOffset(Flag.RIGHT_SQUARE_BRACKET.length);

          popStack('LEFT_SQUARE_BRACKET');

          break;

        case isLeftParentheses(view, offset):
          forwardOffset(Flag.LEFT_PARENTHESES.length);

          stateStack.push('LEFT_PARENTHESES');

          break;

        case isRightParentheses(view, offset):
          forwardOffset(Flag.RIGHT_PARENTHESES.length);

          popStack('LEFT_PARENTHESES');

          break;

        case isLeftArrow(view, offset):
          forwardOffset(Flag.LEFT_ARROW.length);

          stateStack.push('LEFT_ARROW');

          break;

        case isRightArrow(view, offset):
          forwardOffset(Flag.RIGHT_ARROW.length);

          popStack('LEFT_ARROW');

          break;

        case isInclined(view, offset):
          forwardOffset(Flag.INCLINED.length);

          if (key !== '' && dictionary[key] === undefined) {
            dictionary[key] = { type: 'name', value: parseValue() };

            key = '';
          } else {
            key = parseValue() || '';

            dictionary[key] = parseNumberOrQuote();
          }

          break;

        default:
          forwardOffset();
          break;
      }

      if (jumpOut) break;
    }

    return dictionary;
  }

  function parseStream(_offset: number) {
    offset = _offset;

    let start!: number, end!: number;

    for (; offset < view.length; offset++) {
      if (view[offset] === Flag.STREAM[0] && isStream(view, offset)) {
        forwardOffset(Flag.STREAM.length);

        start = isLineBreak(view, offset)
          ? forwardOffset(Flag.LINE_BREAK.length)
          : forwardOffset(Flag.LINE_FEED.length);
      }

      if (view[offset] === Flag.ENDSTREAM[0] && isEndStream(view, offset)) {
        while (offset--) {
          if (isSplit(view, offset)) {
            end = isLineBreak(view, offset - 1) ? forwardOffset(-1) : offset;

            break;
          }
        }
      }

      if (start && end) break;
    }

    return view.slice(start, end);
  }

  function parseResources(quote: Quote | null) {
    if (!quote) return false;
    /*  */
    resetOffset(info.xref.address[quote.serial].offset);
  }

  function getImage(val: Dictionary) {
    if (val.Subtype.value === 'Image') {
      const image = new Image();

      image.src = URL.createObjectURL(new File([parseStream(offset)], 'none'));

      return image;
    }
  }

  // TODO: 获取当前字体映射
  function getFontMap(_offset: number) {
    resetOffset(_offset);

    const ToUnicode = parseDictionary().ToUnicode;

    const zip = parseStream(info.xref.address[ToUnicode.serial].offset);

    const unzip = pako.ungzip(zip);

    resetOffset(0);

    const map: { [key: string]: string } = {};

    let start = 0,
      end = 0;

    let key = '';

    for (; offset < unzip.length; offset++) {
      if (!isBeginChar(unzip, offset)) continue;

      while (offset < unzip.length) {
        switch (true) {
          case isLeftArrow(unzip, offset):
            start = forwardOffset(Flag.LEFT_ARROW.length);

            break;

          case isRightArrow(unzip, offset):
            end = offset;

            if (key === '') {
              key = toText(unzip.slice(start, end));

              map[key] = '';
            } else if (key in map) {
              map[key] = toText(unzip.slice(start, end));

              key = '';
            }

            forwardOffset(Flag.RIGHT_ARROW.length);

            break;

          default:
            forwardOffset();

            break;
        }

        if (isEndChar(unzip, offset)) {
          forwardOffset(Flag.END_CHAR.length);

          break;
        }
      }
    }

    return map;
  }

  async function draw(
    stream: Uint8Array,
    context: CanvasRenderingContext2D,
    page: Page
  ) {
    offset = 0;

    let beforeOffset = 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = undefined;

    let fontMap = {} as { [key: string]: string };

    const lineCaps = ['butt', 'round', 'square'] as const;
    const lineJoins = ['miter', 'round', 'bevel'] as const;

    const {
      xref: { address }
    } = info;

    const operations = [];

    const getPixel = (num: number | string | undefined) =>
      (Number(num) / 2.54) * 72;

    const getQuote: GetQuote = (dictionary: Dictionary, val: string) => {
      let cache;

      for (const key in dictionary) {
        if (key === val) {
          return dictionary[key];
        } else if (
          typeof dictionary[key] === 'object' &&
          dictionary[key].type !== 'name'
        ) {
          cache = getQuote(dictionary[key], val);

          if (cache) return cache;
        }
      }

      return null;
    };

    while (offset < stream.length) {
      switch (true) {
        case isSave(stream, offset):
          forwardOffset(Flag.SAVE.length);

          context.save();

          break;

        case isTransform(stream, offset):
          forwardOffset(Flag.TRANSFORM.length);

          // @ts-ignore
          context.setTransform(...operations.map((item) => Number(item)));

          operations.length = 0;

          break;

        case isSetFontPosition(stream, offset):
          forwardOffset(Flag.SET_FONT_POSITION.length);

          // @ts-ignore
          context.transform(...operations.map((item) => Number(item)));

          break;

        case isRect(stream, offset):
          forwardOffset(Flag.RECT.length);

          // @ts-ignore
          context.rect(...operations.map((item) => Number(item)));

          operations.length = 0;

          break;

        case isClipEvenodd(stream, offset):
          forwardOffset(Flag.CLIP_EVENODD.length);

          context.clip('evenodd');

          break;

        case isClipNonZero(stream, offset):
          forwardOffset(Flag.CLIP_NONZERO.length);

          context.clip('nonzero');

          break;

        case isClosePath(stream, offset):
          forwardOffset(Flag.CLOSE_PATH.length);

          context.closePath();

          break;

        case isLineWidth(stream, offset):
          forwardOffset(Flag.LINE_WIDTH.length);

          // @ts-ignore
          context.lineWidth = getPixel(operations.shift());

          break;

        case isMiterLimit(stream, offset):
          forwardOffset(Flag.MITER_LIMIT.length);

          // @ts-ignore
          context.miterLimit = getPixel(operations.shift());

          break;

        case isLineCap(stream, offset):
          forwardOffset(Flag.LINE_CAP.length);

          context.lineCap = lineCaps[Number(operations.shift())];

          break;

        case isLineJoin(stream, offset):
          forwardOffset(Flag.LINE_JOIN.length);

          context.lineJoin = lineJoins[Number(operations.shift())];

          break;

        case isRG(stream, offset):
          forwardOffset(Flag.RG.length);

          context.fillStyle = `rgb(${operations.join(',')})`;

          operations.length = 0;

          break;

        case isInclined(stream, offset):
          forwardOffset(Flag.INCLINED.length);

          value = parseDrawValue(stream);

          value = getQuote(page.Resources, value as string);

          value && operations.push(value);

          value = undefined;

          break;

        case isGS(stream, offset):
          beforeOffset = forwardOffset(Flag.GS.length);

          operations.shift();

          // TODO: 设置图形参数，根据指定对象字典

          break;

        case isOutput(stream, offset):
          beforeOffset = forwardOffset(Flag.OUTPUT.length);

          value = operations.shift() as Quote;

          resetOffset(address[value.serial].offset);

          value = parseDictionary();

          value = getImage(value);

          // eslint-disable-next-line no-case-declarations
          const { e, f } = context.getTransform();

          if (value) {
            value.onload = (ev: { target: CanvasImageSource }) => {
              context.drawImage(ev.target, e, f);
            };
          }

          resetOffset(beforeOffset);

          break;

        case isRestore(stream, offset):
          forwardOffset(Flag.RESTORE.length);

          context.restore();

          break;

        case isTranslateFont(stream, offset):
          forwardOffset(Flag.TRANSLATE_FONT.length - 1);

          context.textBaseline = 'bottom';

          // @ts-ignore
          context.translate(...operations.map((item) => Number(item)));

          operations.length = 0;

          break;

        case isDrawText(stream, offset):
          forwardOffset(Flag.DRAW_TEXT.length);

          if ((value = fontMap[operations.shift().slice(1)])) {
            value = String.fromCodePoint(parseInt(value, 16));

            // @ts-ignore
            const { a, b, c, d, e, f } = context.getTransform();

            context.setTransform(1, b, c, 1, e, f);

            // TODO: 转换系数，缩放导致字体太小无法肉眼观察
            context.font = 'bold sans-serif';

            context.fillText(value, e, f);

            context.setTransform(a, b, c, d, e, f);
          }

          break;

        case isEndText(stream, offset):
          forwardOffset(Flag.END_TEXT.length);

          break;

        case isFillStyle(stream, offset):
          forwardOffset(Flag.FILL_STYLE.length);

          context.fillStyle = `rgb(${operations.join(',')})`;

          operations.length = 0;

          break;

        case isSetFontFamily(stream, offset):
          beforeOffset = forwardOffset(Flag.SET_FONT_FAMILY.length);

          // @ts-ignore
          fontMap = getFontMap(address[operations.shift().serial].offset);

          context.font =
            (operations.shift() * window.devicePixelRatio * 96) / 72 + 'px';

          resetOffset(beforeOffset);

          operations.length = 0;

          break;

        case isFillNonZero(stream, offset):
          forwardOffset(Flag.FILL_NONZERO.length);

          context.beginPath();

          context.fill('nonzero');

          break;

        case isStartText(stream, offset):
          forwardOffset(Flag.START_TEXT.length);

          // TODO: 开始一个文本对象

          break;

        default:
          forwardOffset();

          value = parseDrawValue(stream);

          value !== undefined && operations.push(value);

          value = undefined;

          break;
      }
    }
  }

  function parsePage() {
    const {
      xref: { address }
    } = info;

    let page = null;

    while ((page = pageList.shift())) {
      const { canvas, context } = createCanvas(page.MediaBox || pages.MediaBox);

      const contents = isArray(page.Contents) ? page.Contents : [page.Contents];

      for (let i = 0; i < contents.length; i++) {
        const content = contents[i];

        const zip = parseStream(resetOffset(address[content.serial].offset));

        const stream = pako.ungzip(zip);

        draw(stream, context, page);
      }

      document.querySelector('main > div')?.appendChild(canvas);
    }
  }

  parsePage();
}

export default drawPDF;
