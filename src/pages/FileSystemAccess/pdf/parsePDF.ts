import { Flag } from './enum';
import { isNumber } from '@/utils/';
import drawPDF from './drawPDF';
import {
  isPDF,
  getBufferView,
  isSplit,
  isEnd,
  toText,
  isStartXref,
  isTrailer,
  isDictionaryStart,
  isDictionaryEnd,
  isLeftArrow,
  isRightArrow,
  isLeftSquareBracket,
  isRightSquareBracket,
  isLeftParentheses,
  isRightParentheses,
  isInclined
} from './utils';

type FlagKeys = keyof typeof Flag;

async function parsePDF(file: File) {
  const view = await getBufferView(file);

  if (!isPDF(view)) return false;

  const stateStack: FlagKeys[] = [];

  let offset = 0;

  const forwardOffset = (value?: number) =>
    isNumber(value) ? (offset += value) : ++offset;

  const resetOffset = (value: number) => (offset = value);

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

  function parseXref() {
    const xref = {
      startserial: Number(parseValue()) || 0,
      Size: Number(parseValue()) || 0,
      address: [] as unknown as PDFInfo['xref']['address']
    } as PDFInfo['xref'];

    for (; offset < view.length; offset++) {
      xref.address.push({
        offset: Number(parseValue()) || 0,
        byte: Number(parseValue()) || 0,
        flag: parseValue() as 'f' | 'n'
      });

      if (xref.address.length === xref.Size) break;
    }

    return xref;
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

  function parseInfo() {
    let startxref = 0;
    let xref = {} as Xref;
    let trailer = {} as PDFInfo['trailer'];

    offset = view.length;

    while (offset--) {
      if (isStartXref(view, offset)) {
        const cacheOffset = offset;

        forwardOffset(Flag.START_XREF.length);

        startxref = Number(parseValue()) || 0;

        offset = +startxref + Flag.XREF.length;

        xref = parseXref();

        resetOffset(cacheOffset);

        continue;
      }

      if (isTrailer(view, offset)) {
        const cacheOffset = offset;

        forwardOffset(Flag.TRAILER.length);

        trailer = parseDictionary() as PDFInfo['trailer'];

        resetOffset(cacheOffset);

        break;
      }
    }

    return { startxref, trailer, xref } as PDFInfo;
  }

  function parsePage() {
    const { Kids } = pages;

    const arr: Page[] = [];

    let i = 0;

    while (i < Kids.length) {
      offset = info.xref.address[Kids[i].serial].offset;

      arr.push(parseDictionary() as Page);

      i++;
    }

    return arr;
  }

  const info = parseInfo();

  offset =
    info.xref.address[info.trailer.Root.serial].offset + Flag.ROOT.length;

  const root = parseDictionary() as Root;

  offset = info.xref.address[root.Pages.serial].offset + Flag.PAGES.length;

  const pages = parseDictionary() as Pages;

  const pageList = parsePage();

  drawPDF(view, { info, root, pages, pageList });
}

export default parsePDF;
