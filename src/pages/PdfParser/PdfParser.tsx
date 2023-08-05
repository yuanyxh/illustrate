import React, { useRef, useState, useEffect } from 'react';
import { forEach } from '@/utils';
import pdfParser from './lib/PDFParser';
import Button from '@/components/Button/Button';
import Text from '@/components/Text/Text';
import style from './PdfParser.module.css';

// --title: PDF 解析--

export default function PdfParser() {
  const inputRef = useRef<HTMLInputElement>(null);
  const drawBoardRef = useRef<HTMLElement>(null);
  const [pages, setPages] = useState<HTMLCanvasElement[]>([]);

  useEffect(() => {
    forEach(pages, (page) => {
      const div = document.createElement('div');

      div.classList.add(style['page']);

      div.appendChild(page);

      drawBoardRef.current?.appendChild(div);
    });
  }, [pages]);

  const clickHandle = () => inputRef.current?.click();

  const changeHandle: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { files } = e.target;

    if (!files) return;

    const file = files[0];

    parse(file);
  };

  const clearDrawBoard = () => {
    setPages([]);

    if (drawBoardRef.current) {
      const children = drawBoardRef.current.children;

      for (let i = children.length - 1; i >= 0; i--) {
        if (children[i].classList.contains(style['page'])) {
          children[i].remove();
        }
      }
    }
  };

  const parse = async (pdf: File) => {
    const parser = await pdfParser(pdf);

    // TODO: 弹出提示，完成 Message 组件
    if (parser === false) return;

    const draw = parser.createDrawPdf();

    const pages = parser.rootpage?.Kids || [];

    const images: HTMLCanvasElement[] = [];

    forEach(pages, (page, i) => {
      const image = draw.displayPage(i);

      image !== false && images.push(image);
    });

    setPages(images);
  };

  return (
    <>
      <div className={style['pdf-parser']}>
        <Button type="primary" onClick={clickHandle}>
          上传解析 PDF
        </Button>

        <Button style={{ marginLeft: 10 }} onClick={clearDrawBoard}>
          清除画板
        </Button>

        <Text
          className={style['desc']}
          block
          truncated
          type="info"
          size="small"
        >
          解析器用于学习交流，仅实现部分功能且兼容度不高，如遇无法解析属于正常情况
        </Text>

        <section
          ref={drawBoardRef}
          className={style['drawing-board']}
        ></section>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        style={{ display: 'none' }}
        onChange={changeHandle}
      />
    </>
  );
}
