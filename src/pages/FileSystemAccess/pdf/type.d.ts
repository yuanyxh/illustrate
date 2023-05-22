declare interface Address {
  offset: number;
  byte: number;
  flag: 'f' | 'n';
}

declare interface Quote {
  serial: number;
  version: number;
}

declare interface Name<T> {
  type: 'name';
  value: T | string;
}

type PDFArray = (number & string & Dictionary & Quote & Name & PDFArray)[];

declare interface Dictionary {
  [key: string]: number | string | Dictionary | Quote | Name | PDFArray;
}

declare interface Root {
  Type: Name<'Catalog'>;
  Pages: Quote;
  Outlines?: Quote;
  Metadata?: Quote;
  Names?: Dictionary;
}

declare interface Pages {
  Type: Name<'Pages'>;
  Count: number;
  Kids: Quote[];
  MediaBox?: [number, number, number, number];
}

declare interface Page {
  Type: Name<'Page'>;
  Contents: Quote | Quote[];
  Resources: Dictionary;
  Parent: Quote;
  MediaBox?: [number, number, number, number];
}

declare interface Trailer {
  ID: [string, string];
  Root: Quote;
  Size: number;
  Info?: Quote;
}

declare interface Xref {
  startserial: number;
  Size: number;
  address: Address[];
}

declare interface PDFInfo {
  startxref: number;
  trailer: Trailer;
  xref: Xref;
}
