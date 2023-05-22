import { Feature } from './enum';

declare namespace PDF {
  /** 状态栈 key */
  type StateStackKeys = keyof typeof Feature;
  /** 状态栈 */
  type StateStack = StateStackKeys[];

  /** 间接引用 */
  interface Quote {
    /** type: quote, 标识数据为间接引用 */
    type: 'quote';
    /** 对象序号, 在交叉引用表中的索引 */
    serial: number;
    /** 对象版本 */
    version: number;
  }

  /** 名称 */
  interface Names<T extends string> {
    /** type: name, 标识数据为名称 */
    type: 'name';
    /** 名称 */
    value: T;
  }

  /** 资源 */
  interface Resources {
    /** 资源对象, 可以是图片或其他可重用的图形资源 */
    XObject?: {
      [key: string]: Quote;
    };
    /** 图形状态对象, 扩展设置 透明度、线条宽度、颜色空间等 */
    ExtGState?: {
      [key: string]: Quote;
    };
    /** 字体资源对象 */
    Font?: {
      [key: string]: Quote;
    };
  }

  /** 内容 */
  interface Contents {
    /** 内容流字节长度 */
    Length: number;
    /** 过滤器, 指示压缩算法 */
    Filter: Names<'FlateDecode'> | Names<'FlateDecode'>[];
    /** 页面行间距, 文本行的垂直间距 */
    DL?: number;
  }

  /** trailer */
  interface Trailter {
    /** id */
    ID: [string, string];
    /** 对象个数 */
    Size: number;
    /** 指向文档目录 */
    Root: Quote;
    /** 指向 pdf 文档信息 */
    Info?: Quote;
  }

  /** 文档目录 */
  interface Catalog {
    /** Type: Catalog, 标识数据为文档目录 */
    Type: 'Catalog';
    /** 指向 pdf 根页面 */
    Pages: Quote;
    /** 名称映射, 将值映射到指定的名称 */
    Names?: {
      /** 命名目标 */
      Dests?: Quote;
    };
    /** 指向文档元数据 */
    Metadata?: Quote;
    /* 指向文档大纲 */
    Outlines?: Quote;
  }

  /** 文档元数据 */
  interface Info {
    /** 作者信息 */
    Author: string;
    /** 注释, 非标准 */
    Comments: string;
    /** 企业, 非标准 */
    Company: string;
    /** 文档创建日期 */
    CreationDate: string;
    /** 原始文档创建使用的程序 */
    Creator: string;
    /** 文档关键词 */
    Keywords: string;
    /** 文档最近一次修改日期 */
    ModDate: string;
    /** 文档创建使用的程序 */
    Producer: string;
    /** 原始文档最近一次修改日期 */
    SourceModified: string;
    /** 文档主题 */
    Subject: string;
    /** 文档标题 */
    Title: string;
    /** 指示是否含有附加信息 */
    Trapped: Names<string>;
  }

  /** 根页面 */
  interface RootPage {
    /** Type: Names<'Pages'>, 标识数据为根页面 */
    Type: Names<'Pages'>;
    /** 页面数量 */
    Count: number;
    /** 页面引用集合 */
    Kids: Quote[];
    /** 页面盒子大小 */
    MediaBox?: [number, number, number, number];
  }

  /** 页面 */
  interface Page {
    /** Type: Names<'Page'>, 标识数据为页面 */
    Type: Names<'Page'>;
    /** 指向父页面 */
    Parent: Quote;
    /** 页面内容 */
    Contents: Quote | Quote[];
    /** 页面资源 */
    Resources: Resources;
    /** 注释对象 */
    Annots?: Quote[];
    /** 页面盒子大小 */
    MediaBox?: [number, number, number, number];
  }

  /** 图形状态 */
  interface ExtGState {
    Type: Names<'ExtGState'>;
    AIS: Names<string>;
    Normal: Names<string>;
    ca: number;
  }

  /** 字体字典 */
  interface Font {
    Type: Names<'Font'>;
    /** 子类型 */
    Subtype: Names<string>;
    /** 基本字体族 */
    BaseFont: Names<string>;
    /** 字体信息 */
    DescendantFonts: Quote[];
    /** 字体编码 */
    Encoding: Names<string>;
    /** 字体映射 */
    ToUnicode: Quote;
  }

  /** XObject 字典 */
  interface XObject {
    Type: Names<'XObject'>;
    /** 子类型 */
    Subtype: Names<string>;
    /** 字节长度 */
    Length: number;
    Filter: Names<string> | Names<string>[];
    /** 位图, 每个颜色的位数 */
    BitsPerComponent: number;
    /** 颜色空间 */
    ColorSpace: Names<string>;
    /** 图像宽度 */
    Width: number;
    /** 图像高度 */
    Height: number;
    /** 透明通道 */
    Matte: [number, number, number];
    /** 遮罩图像 */
    SMask?: Quote;
  }

  /** 字体信息 */
  interface DescendantFont {
    Type: Names<'Font'>;
    Subtype: Names<string>;
    BaseFont: Names<string>;
    CIDSystemInfo: Quote;
    CIDToGIDMap: Quote;
    DW: number;
    FontDescriptor: Quote;
    W: (number & Array<number>)[];
  }

  interface ToUnicode {
    /** 内容流字节长度 */
    Length: number;
    /** 过滤器, 指示压缩算法 */
    Filter: Names<'FlateDecode'> | Names<'FlateDecode'>[];
  }
}

export = PDF;

export as namespace PDF;
