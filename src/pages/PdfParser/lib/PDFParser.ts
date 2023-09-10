/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import pako from 'pako';
import { isNumber, isArray, isUndef, createCanvasContext } from '@/utils';
import {
  Flag,
  Feature,
  InvisibleChar,
  Graphic,
  LINE_CAPS,
  LINE_JOINS
} from './enum';
import {
  /* 工具函数 */
  isEqual,
  getBufferView,
  toText,
  isTypeOf,
  /* 标识函数 */
  isPdf,
  isQuote,
  isStreamStart,
  isStreamEnd,
  isBeginChar,
  isEndChar,
  /* 特征函数 */
  isDictionaryStart,
  isDictionaryEnd,
  isSquareBracketStart,
  isSquareBracketEnd,
  isInclined,
  isArrowStart,
  isArrowEnd,
  isParenthesesStart,
  isParenthesesEnd,
  isStart,
  isEnd,
  /* 断点函数 */
  isBreakPoint,
  isLineBreak,
  /* 绘图函数 */
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
} from './utils';

export class PDFParser {
  /** 字节数组 */
  bytes: Uint8Array;
  /** 字节偏移 */
  offset = 0;
  /** 原字节偏移 */
  beforeOffset = 0;
  /** 数组解析深度 */
  depth = 0;
  /** 状态栈 */
  stateStack: PDF.StateStack = [];

  constructor(bytes: Uint8Array) {
    this.bytes = bytes;
  }

  /** 字节偏移控制 */
  forward(step?: number) {
    return isNumber(step) ? (this.offset += step) : ++this.offset;
  }

  back(step?: number) {
    return isNumber(step) ? (this.offset -= step) : --this.offset;
  }

  /** 字节偏移设置 */
  set(before: number) {
    return (this.offset = before);
  }

  /** 缓存当前字节偏移 */
  cache() {
    this.beforeOffset = this.offset;
  }

  /** 重置字节偏移 */
  reset() {
    this.offset = this.beforeOffset;
  }

  /** 解压数据 */
  ungzip(zip: Uint8Array) {
    return pako.ungzip(zip);
  }

  /** 查找标记偏移 */
  findFlag(
    stream: Uint8Array,
    intent: number[],
    direction: 'left' | 'right' = 'left'
  ) {
    let offset = direction === 'left' ? 0 : stream.length - 1;

    const isIntent = isTypeOf(intent);

    const action = () => (direction === 'left' ? offset++ : offset--);

    const stop = () =>
      direction === 'left' ? offset < stream.length : offset >= 0;

    while (stop()) {
      if (stream[offset] === intent[0] && isIntent(stream, offset)) {
        return (offset += intent.length);
      }

      action();
    }

    return false;
  }

  /** 解析值 */
  parseValue(stream: Uint8Array, decision?: ReturnType<typeof isTypeOf>) {
    /** 数据开始 */
    let startOffset = this.offset;

    const isBreak = (bytes: Uint8Array, offset?: number) =>
      decision
        ? !decision(bytes, offset)
        : !isBreakPoint(bytes, offset) &&
          !isEnd(bytes, offset) &&
          !isStart(bytes, offset);

    for (; ; this.forward()) {
      /** 不为断点则视为数据开始 */
      if (isBreakPoint(stream, this.offset)) continue;

      startOffset = this.offset;

      for (; ; this.forward()) {
        /** 为断点处或为特征数据结尾则视为数据结束 */
        if (isBreak(stream, this.offset)) continue;

        return stream.slice(startOffset, this.offset);
      }
    }
  }

  parseNumber(stream: Uint8Array) {
    /** 缓存偏移, 不为数字时重置偏移 */
    this.cache();

    const num = window.parseFloat(toText(this.parseValue(stream)));

    if (!isNumber(num)) {
      this.reset();

      return false;
    }

    return num;
  }

  /** 解析引用 */
  parseQuote(stream: Uint8Array) {
    const serial = this.parseNumber(stream);

    if (!isNumber(serial)) return false;

    /** 缓存偏移, 不为间接引用时重置偏移 */
    this.cache();

    const version = window.parseFloat(toText(this.parseValue(stream)));
    const isQuoteFlag = isQuote(this.parseValue(stream));

    if (!isNumber(version) || !isQuoteFlag) {
      this.reset();

      return serial;
    }

    return { type: 'quote', serial, version } as const;
  }

  /** 解析数组 */
  parseMultivalued(stream: Uint8Array) {
    const values: unknown[] = [];

    let value: unknown = undefined;

    /** 解析引用或数字 */
    const addQuote = () => {
      value = this.parseQuote(stream);

      value !== false && values.push(value);
    };

    /** 默认执行一次 */
    addQuote();

    while (!isSquareBracketEnd(stream, this.offset)) {
      switch (true) {
        /** 解析字典 */
        case isDictionaryStart(stream, this.offset):
          values.push(this.parseDictionary(stream));

          break;

        /** 解析数组 */
        case isSquareBracketStart(stream, this.offset):
          this.forward(Feature.SQUARE_BRACKET_START.length);

          this.depth++;

          values.push(this.parseMultivalued(stream));

          break;

        /** 解析数组 */
        case isInclined(stream, this.offset):
          this.forward(Feature.INCLINED.length);

          values.push({ type: 'name', value: toText(this.parseValue(stream)) });

          break;

        /** 解析字符串 */
        case isArrowStart(stream, this.offset):
          this.forward();

          // @ts-ignore
          values.push(toText(this.parseValue(stream, isArrowEnd)));

          break;

        /** 解析字符串 */
        case isParenthesesStart(stream, this.offset):
          this.forward();

          // @ts-ignore
          values.push(toText(this.parseValue(stream, isParenthesesEnd)));

          break;

        default:
          this.forward();

          addQuote();

          break;
      }
    }

    /** 递归解析数据, 如果解析深度不为 0, 则上层数组还需继续解析数组元素 */
    if (this.depth !== 0) {
      this.forward(Feature.SQUARE_BRACKET_END.length);
      this.depth--;
    }

    return values;
  }

  /** 解析字典 */
  parseDictionary<T>(stream: Uint8Array): T {
    /** 字典数据 */
    const dictionary = {} as T;

    /** 是否结束当前解析 */
    let jumpOut = false;

    /** 当前键 */
    let key = '';

    /** 顶部栈数据 */
    const top = () => this.stateStack[this.stateStack.length - 1];

    /** 状态栈弹出 */
    const popStack = (key: PDF.StateStackKeys) => {
      const topKey = this.stateStack.pop();

      /** 顶部栈数据与当前数据不一致时，则解析出错 */
      if (!isEqual(topKey, key)) {
        throw Error(
          'analyze the PDF error, please contact the plug -in developer'
        );
      }
    };

    while (!jumpOut) {
      switch (true) {
        /** 字典开头 */
        case isDictionaryStart(stream, this.offset):
          this.forward(Feature.DICTIONARY_START.length);

          this.stateStack.push('DICTIONARY_START');

          if (key !== '') {
            // TODO: 类型定义与字典解析
            // @ts-ignore
            dictionary[key] = this.parseDictionary(this.bytes);

            key = '';
          }

          break;

        /** 可能是字符串与字典结尾 >>>，因此需要判断顶部栈是否是字典结尾 */
        case isEqual(top(), 'DICTIONARY_START') &&
          isDictionaryEnd(stream, this.offset):
          this.forward(Feature.DICTIONARY_END.length);

          popStack('DICTIONARY_START');

          jumpOut = true;

          break;

        /** 数组开始 */
        case isSquareBracketStart(stream, this.offset):
          this.forward(Feature.SQUARE_BRACKET_START.length);

          this.stateStack.push('SQUARE_BRACKET_START');

          // TODO: 类型定义与数组解析
          // @ts-ignore
          dictionary[key] = this.parseMultivalued(stream);

          key = '';

          break;

        /** 数组结束 */
        case isSquareBracketEnd(stream, this.offset):
          this.forward(Feature.SQUARE_BRACKET_END.length);

          popStack('SQUARE_BRACKET_START');

          break;

        /** 名称 */
        case isInclined(stream, this.offset):
          this.forward(Feature.INCLINED.length);

          // TODO: 解析名称
          // @ts-ignore
          if (key !== '' && key in dictionary && isUndef(dictionary[key])) {
            // @ts-ignore
            dictionary[key] = {
              type: 'name',
              value: toText(this.parseValue(stream))
            };

            key = '';
          } else {
            key = toText(this.parseValue(stream));

            // @ts-ignore
            dictionary[key] = this.parseQuote(stream) || undefined;
          }

          break;

        /** 字符串开始 */
        case isArrowStart(stream, this.offset):
          this.forward(Feature.ARROW_START.length);

          this.stateStack.push('ARROW_START');

          // TODO: 类型定义与字符串解析

          // @ts-ignore
          dictionary[key] = toText(this.parseValue(stream, isArrowEnd));

          key = '';

          break;

        /** 字符串结束 */
        case isArrowEnd(stream, this.offset):
          this.forward(Feature.ARROW_END.length);

          popStack('ARROW_START');

          break;

        /** 字符串开始 */
        case isParenthesesStart(stream, this.offset):
          this.forward(Feature.PARENTHESES_START.length);

          this.stateStack.push('PARENTHESES_START');

          // TODO: 类型定义与字符串解析

          // @ts-ignore
          dictionary[key] = toText(this.parseValue(stream, isParenthesesEnd));

          key = '';

          break;

        /** 字符串结束 */
        case isParenthesesEnd(stream, this.offset):
          this.forward(Feature.PARENTHESES_END.length);

          popStack('PARENTHESES_START');

          break;

        default:
          this.forward();

          break;
      }
    }

    return dictionary;
  }

  parseStream(stream: Uint8Array, offset: number) {
    this.set(offset);

    let start!: number, end!: number;

    while (!isStreamEnd(stream, this.offset)) {
      if (
        stream[this.offset] === Flag.STREAM_START[0] &&
        isStreamStart(stream, this.offset)
      ) {
        this.forward(Flag.STREAM_START.length);

        start = isLineBreak(stream, this.offset)
          ? this.forward(InvisibleChar.LINE_BREAK.length)
          : this.forward(InvisibleChar.LINE_FEED.length);
      } else {
        this.forward();
      }
    }

    while (this.back()) {
      if (isBreakPoint(stream, this.offset)) {
        end = isLineBreak(stream, this.offset - 1) ? this.back() : this.offset;

        break;
      }
    }

    return stream.slice(start, end);
  }
}

export class PDF extends PDFParser {
  bytes: Uint8Array;

  startxref: number;
  xref: number[];
  trailer: PDF.Trailter | undefined;
  catalog: PDF.Catalog | undefined;
  info: PDF.Info | undefined;
  rootpage: PDF.RootPage | undefined;

  constructor(bytes: Uint8Array) {
    super(bytes);

    this.bytes = bytes;
    this.xref = [];
    this.startxref = 0;

    /** 获取交叉引用表偏移与 trailer */
    this.getPdfInfo(bytes);
    /** 获取交叉引用表 */
    this.getPdfXref(bytes);
    /** 获取 PDF 详细信息，如作者、创建日期等信息 */
    this.getPdfDetail(bytes);
    /** 获取文档目录 */
    this.getCatalog(bytes);
    /** 获取根页面数据 */
    this.getRootPage(bytes);
  }

  getPdfInfo(stream: Uint8Array) {
    /** 解析 startxref(记录交叉引用表偏移) */
    let offset = this.findFlag(stream, Flag.START_XREF, 'right');

    if (isNumber(offset)) {
      this.set(offset);

      this.startxref = window.parseFloat(toText(this.parseValue(stream)));
    }

    /** 解析 trailer */
    offset = this.findFlag(stream, Flag.TRAILER, 'right');

    if (isNumber(offset)) {
      this.set(offset);

      this.trailer = this.parseDictionary<PDF.Trailter>(stream);
    }
  }

  getPdfXref(stream: Uint8Array) {
    /** 设置偏移为 startxref + xref 的长度 */
    this.set(this.startxref + Flag.XREF.length);

    /** 解析对象开始编号 */
    this.parseValue(stream);

    /** 解析对象个数 */
    let size = window.parseFloat(toText(this.parseValue(stream)));

    while (size--) {
      /** 解析对象偏移 */
      this.xref.push(window.parseFloat(toText(this.parseValue(stream))));

      /** 未知 */
      this.parseValue(stream);

      /** 标识 */
      this.parseValue(stream);
    }
  }

  /** 获取 pdf 详细信息 */
  getPdfDetail(stream: Uint8Array) {
    if (!this.trailer) return false;

    if (!this.trailer['Info']) return;

    this.set(this.xref[this.trailer['Info'].serial]);

    try {
      this.info = this.parseDictionary<PDF.Info>(stream);
    } catch (err) {
      /** empty */
      this.stateStack.length = 0;
    }
  }

  /** 获取文档目录 */
  getCatalog(stream: Uint8Array) {
    if (!this.trailer) return false;

    this.set(this.xref[this.trailer.Root.serial]);

    this.catalog = this.parseDictionary<PDF.Catalog>(stream);
  }

  /** 获取根页面 */
  getRootPage(stream: Uint8Array) {
    if (!this.catalog) return false;

    this.set(this.xref[this.catalog.Pages.serial]);

    this.rootpage = this.parseDictionary<PDF.RootPage>(stream);
  }

  /** 绘制 pdf */
  public createDrawPdf() {
    return new Draw(this);
  }
}

export class Draw {
  pdf: PDF;
  fontMap = new Map();

  constructor(pdf: PDF) {
    this.pdf = pdf;
  }

  drawImage(
    x: PDF.XObject,
    context: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) {
    if (x.Type.value !== 'XObject' || x.Subtype.value !== 'Image') return false;

    const pdf = this.pdf;
    const xref = pdf.xref;
    const stream = pdf.bytes;

    const { SMask, Width, Height, Filter } = x;

    const { e, f } = context.getTransform();

    const zip = pdf.parseStream(stream, pdf.offset);

    const ungzip =
      (isArray(Filter) ? Filter[0] : Filter).value === 'FlateDecode'
        ? pdf.ungzip(zip)
        : zip;

    const image = document.createElement('img');

    image.width = Width;
    image.height = Height;

    image.src = URL.createObjectURL(new File([ungzip], 'default'));

    image.onload = () => {
      context.drawImage(image, e, f);
    };

    if (SMask) {
      pdf.set(xref[SMask.serial]);
      this.drawImage(pdf.parseDictionary<PDF.XObject>(stream), context, canvas);
    }
  }

  getFont(f: PDF.Font) {
    if (f.Type.value !== 'Font' || f.Encoding.value !== 'Identity-H')
      return false;

    const pdf = this.pdf;
    const xref = pdf.xref;
    const stream = pdf.bytes;

    const { ToUnicode /* DescendantFonts 字体信息 */ } = f;

    // pdf.set(xref[DescendantFonts[0].serial]);

    pdf.set(xref[ToUnicode.serial]);

    const { Filter } = pdf.parseDictionary<PDF.ToUnicode>(stream);

    const filter = isArray(Filter) ? Filter[0] : Filter;

    if (filter.value !== 'FlateDecode') return false;

    const ungzip = pdf.ungzip(pdf.parseStream(stream, pdf.offset));

    const _ = new PDFParser(ungzip);

    const map: { [key: string]: string } = {};

    let key = '';

    for (; _.offset < ungzip.length; _.forward()) {
      if (!isBeginChar(ungzip, _.offset)) continue;

      _.forward(Flag.BEGIN_CHAR.length);

      while (_.offset < ungzip.length) {
        switch (true) {
          case isArrowStart(ungzip, _.offset):
            _.forward(Feature.ARROW_START.length);

            const result = _.parseValue(ungzip, isArrowEnd);

            if (isEqual(key, '')) {
              key = result.join('');

              map[key] = '';
            } else if (key in map) {
              map[key] = toText(result);

              key = '';
            }

            break;

          default:
            _.forward();

            break;
        }
      }

      if (isEndChar(ungzip, _.offset)) {
        _.forward(Flag.END_CHAR.length);

        break;
      }
    }

    return map;
  }

  drawContent(
    stream: Uint8Array,
    context: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    page: PDF.Page,
    resources: PDF.Resources
  ) {
    /** 解析器实例 */
    const _ = new PDFParser(stream);

    /** pdf 实例 */
    const pdf = this.pdf;

    /** 交叉引用表 */
    const xref = pdf.xref;

    /** 操作栈 */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const operations: any[] = [];

    /** 解析完成 */
    let jumpOut = false;

    let currentFont: { [key: string]: string } = {};

    /** 是否是名称 */
    function isNames(data: unknown): data is PDF.Names<string> {
      return (data as PDF.Names<string>).type === 'name';
    }

    /** 获取引用 */
    const getQuote = (val: PDF.Names<string>, type: 'gs' | 'do' | 'tf') => {
      const { ExtGState = {}, Font = {}, XObject = {} } = resources;

      switch (type) {
        case 'gs':
          return ExtGState[val.value];
        case 'do':
          return XObject[val.value];
        case 'tf':
          return Font[val.value];
        default:
          break;
      }
    };

    while (!jumpOut) {
      switch (true) {
        /** 设置线宽 */
        case isLineWidth(stream, _.offset):
          _.forward(Graphic.LINE_WIDTH.length);

          const pt = operations.pop();

          if (!isNumber(pt)) throw Error('args is not a number');

          context.lineWidth = pt;

          break;

        /** 设置线端点样式 */
        case isLineCap(stream, _.offset):
          _.forward(Graphic.LINE_CAP.length);

          const lineCap = operations.pop();

          if (!isNumber(lineCap)) throw Error('args is not a number');

          context.lineCap = LINE_CAPS[lineCap];

          break;

        /** 设置线交叉样式 */
        case isLineJoin(stream, _.offset):
          _.forward(Graphic.LINE_JOIN.length);

          const lineJoin = operations.pop();

          if (!isNumber(lineJoin)) throw Error('args is not a number');

          context.lineJoin = LINE_JOINS[lineJoin];

          break;

        /** 设置斜接面限制 */
        case isMiterLimit(stream, _.offset):
          _.forward(Graphic.MITER_LIMIT.length);

          const miterLimit = operations.pop();

          if (!isNumber(miterLimit)) throw Error('args is not a number');

          context.miterLimit = miterLimit;

          break;

        /** 设置图形状态参数 */
        case isGS(stream, _.offset):
          _.forward(Graphic.GS.length);

          const gsName = operations.pop();

          if (!isNames(gsName)) throw Error('args not a name');

          const gs = getQuote(gsName, 'gs');

          if (!gs) throw Error('quote does not exist');

          pdf.set(xref[gs.serial]);

          break;

        /** 保存状态 */
        case isSave(stream, _.offset):
          _.forward(Graphic.SAVE.length);

          context.save();

          break;

        /** 回退状态 */
        case isRestore(stream, _.offset):
          _.forward(Graphic.RESTORE.length);

          context.restore();

          break;

        /** 设置矩阵 */
        case isSetTransform(stream, _.offset):
          _.forward(Graphic.SET_TRANSFORM.length);

          if (operations.length < 6) throw Error('args count is lt 6');

          // @ts-ignore
          context.transform(...operations.map((val) => Number(val)));

          operations.length = 0;

          break;

        /** 添加矩形 */
        case isRect(stream, _.offset):
          _.forward(Graphic.RECT.length);

          // @ts-ignore
          context.rect(...operations.map((item) => Number(item)));

          operations.length = 0;

          break;

        /** 填充路径 */
        case isFillNonZero(stream, _.offset):
          _.forward(Graphic.FILL_NONZERO.length);

          context.beginPath();

          context.fill('nonzero');

          break;

        /** 关闭路径 */
        case isClosePath(stream, _.offset):
          _.forward(Graphic.CLOSE_PATH.length);

          context.closePath();

          break;

        /** 裁剪路径 */
        case isClipNonZero(stream, _.offset):
          _.forward(Graphic.CLIP_NONZERO.length);

          context.clip('nonzero');

          break;

        /** 裁剪路径 */
        case isClipEvenodd(stream, _.offset):
          _.forward(Graphic.CLIP_EVENODD.length);

          context.clip('evenodd');

          break;

        /** 开始一个文本对象 */
        case isStartText(stream, _.offset):
          _.forward(Graphic.START_TEXT.length);

          context.save();

          break;

        /** 结束一个文本对象 */
        case isEndText(stream, _.offset):
          _.forward(Graphic.END_TEXT.length);

          context.restore();

          break;

        /** 设置字体 */
        case isSetFontFamily(stream, _.offset):
          _.forward(Graphic.SET_FONT_FAMILY.length);

          const fontSize = operations.pop();

          const fontName = operations.pop();

          if (!isNames(fontName)) throw Error('args not a name');

          const font = getQuote(fontName, 'tf');

          if (!font) throw Error('quote does not exist');

          if (this.fontMap.has(fontName.value)) {
            currentFont = this.fontMap.get(fontName.value);
          } else {
            pdf.set(xref[font.serial]);

            const mapValue = this.getFont(
              pdf.parseDictionary<PDF.Font>(pdf.bytes)
            );

            if (!mapValue) throw Error('parse font error');

            this.fontMap.set(fontName.value, mapValue);

            currentFont = mapValue;
          }

          context.font = (fontSize * 3) / 72 + 'px';

          break;

        /** 移动字体指针 */
        case isTranslateFont(stream, _.offset):
          _.forward(Graphic.TRANSLATE_FONT.length);

          // @ts-ignore
          context.translate(...operations.map((item) => Number(item)));

          operations.length = 0;

          break;

        /** 设置字体矩阵 */
        case isSetFontPosition(stream, _.offset):
          _.forward(Graphic.SET_FONT_POSITION.length);

          // @ts-ignore
          context.setTransform(...operations.map((item) => Number(item)));

          operations.length = 0;

          break;

        /** 展示文本 */
        case isDrawText(stream, _.offset):
          _.forward(Graphic.DRAW_TEXT.length);

          const fontKey = operations.pop();

          if (!currentFont[fontKey]) throw Error('parse error, font dot exist');

          const char = String.fromCodePoint(
            window.parseInt(currentFont[fontKey], 16)
          );

          const { b, c, e, f } = context.getTransform();

          context.save();

          context.setTransform(1, b, c, 1, e, f);

          context.fillText(
            char,
            context.getTransform().e,
            context.getTransform().f
          );

          context.restore();

          break;

        /** fill 颜色 */
        case isFillColor(stream, _.offset):
          _.forward(Graphic.FILL_COLOR.length);

          context.fillStyle = `rgb(${operations.join(',')})`;

          operations.length = 0;

          break;

        /** stroke 颜色 */
        case isStrokeColor(stream, _.offset):
          _.forward(Graphic.STROKE_COLOR.length);

          context.strokeStyle = `rgb(${operations.join(',')})`;

          operations.length = 0;

          break;

        /** 输出一个外部对象 */
        case isOutput(stream, _.offset):
          _.forward(Graphic.OUTPUT.length);

          const xName = operations.pop();

          if (!isNames(xName)) throw Error('args not a name');

          const XObject = getQuote(xName, 'do');

          if (!XObject) throw Error('quote does not exist');

          pdf.set(xref[XObject.serial]);

          this.drawImage(
            pdf.parseDictionary<PDF.XObject>(pdf.bytes),
            context,
            canvas
          );

          break;

        /*名称*/
        case isInclined(stream, _.offset):
          _.forward(Feature.INCLINED.length);

          operations.push({
            type: 'name',
            value: toText(_.parseValue(stream))
          });

          break;

        /** 字符串开始 */
        case isArrowStart(stream, _.offset):
          _.forward(Feature.ARROW_START.length);

          operations.push(_.parseValue(stream, isArrowEnd).join(''));

          _.forward(Feature.ARROW_END.length);

          break;

        default:
          _.forward();

          const num = _.parseNumber(stream);

          num !== false && operations.push(num);

          if (_.offset + InvisibleChar.LINE_BREAK.length >= stream.length) {
            jumpOut = true;
          }

          break;
      }
    }
  }

  drawPage(
    page: PDF.Page,
    context: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) {
    const { Contents, Resources /* Annots = [] 注释对象 */ } = page;

    const contents = isArray(Contents) ? Contents : [Contents];

    const pdf = this.pdf;

    let i = 0;

    while (i < contents.length) {
      pdf.set(pdf.xref[contents[i].serial]);

      const { /* DL, 行间距 */ Filter /* Length 流字节长度 */ } =
        pdf.parseDictionary<PDF.Contents>(pdf.bytes);

      /** 对于压缩算法, 需要考虑太多, 这里只处理第一个压缩且压缩算法为 FlateDecode 的数据 */
      const [filter] = isArray(Filter) ? Filter : [Filter];

      if (!isEqual(filter.value, 'FlateDecode')) {
        i++;
        continue;
      }

      const ungzip = pdf.ungzip(pdf.parseStream(pdf.bytes, pdf.offset));

      this.drawContent(ungzip, context, canvas, page, Resources);

      i++;
    }
  }

  displayPage(pageNumber: number) {
    const pdf = this.pdf;

    if (!pdf.rootpage) return false;

    const offset = pdf.xref[pdf.rootpage.Kids[pageNumber].serial];

    if (!isNumber(offset)) return false;

    pdf.set(offset);

    const page = pdf.parseDictionary<PDF.Page>(pdf.bytes);

    pdf.set(pdf.xref[page.Parent.serial]);

    const rootPage = pdf.parseDictionary<PDF.RootPage>(pdf.bytes);

    const mediaBox = page.MediaBox || rootPage.MediaBox || [0, 0, 0, 0];

    const { canvas, context } = createCanvasContext({
      width: mediaBox[2],
      height: mediaBox[3]
    });

    try {
      this.drawPage(page, context, canvas);
    } catch (err) {
      console.error(`error of rendering on page ${pageNumber}`);

      console.error(err);

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillText(String(err), 0, 0);
    }

    return canvas;
  }
}

/** pdf 解析 */
async function pdfParser(file: File) {
  const bytes = await getBufferView(file);

  if (!isPdf(bytes)) {
    return false;
  }

  const pdf = new PDF(bytes);

  return pdf;
}

export default pdfParser;
