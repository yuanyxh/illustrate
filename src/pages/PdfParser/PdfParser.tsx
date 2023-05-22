/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useRef, useState, useEffect } from 'react';
import { useThrottle } from '@/hooks';
import pdfparser from './lib/PDFParser';
import style from './PdfParser.module.css';
import type { MouseEventHandler, ChangeEventHandler } from 'react';
import type { Draw } from './lib/PDFParser';

// --title: PDF 解析--

let count = 1;
export default function PdfParser() {
  const fileRef = useRef<HTMLInputElement>(null);
  const showRef = useRef<HTMLDivElement>(null);

  const [draw, setDraw] = useState<Draw>();

  const clickHandler: MouseEventHandler<HTMLButtonElement> = async () => {
    if (!('showOpenFilePicker' in window)) {
      return fileRef.current?.click();
    }

    try {
      // @ts-ignore
      const [fileHandle] = await window.showOpenFilePicker({
        types: [
          { description: 'pdf 文件', accept: { 'application/pdf': ['.pdf'] } }
        ]
      });

      const pdf = await pdfparser(await fileHandle.getFile());

      if (!pdf) return;

      const draw = pdf.createDrawPdf();

      const canvas = draw.displayPage(count);

      if (!canvas) return;

      count++;

      showRef.current?.appendChild(canvas);

      setDraw(draw);
    } catch (err) {
      console.log(err);
      /** empty */
    }
  };

  const inputHandler: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const files = e.target.files;

    if (!files) return;

    const file = files[0];

    const pdf = await pdfparser(file);

    if (!pdf) return;

    const draw = pdf.createDrawPdf();

    const canvas = draw.displayPage(count);

    count++;

    if (!canvas) return;

    showRef.current?.appendChild(canvas);

    setDraw(draw);

    e.target.value = '';
  };

  const scrollHandler = useThrottle(() => {
    const dcl = document.documentElement;

    if (dcl.scrollHeight - (dcl.scrollTop + dcl.clientHeight) <= 40) {
      setDraw((prev) => {
        const kids = prev?.pdf.rootpage?.Kids;

        if (!kids) return;

        if (count > kids.length) return;

        const canvas = prev.displayPage(count);

        if (!canvas) return;

        count++;

        showRef.current?.appendChild(canvas);

        return prev;
      });
    }
  });

  useEffect(() => {
    window.addEventListener('scroll', scrollHandler);
  }, []);

  return (
    <div className={style['pdf-parser']}>
      <div className={style.line}>
        <button className="primary" onClick={clickHandler}>
          点击上传 PDF
        </button>

        <input
          type="file"
          style={{ display: 'none' }}
          accept=".pdf"
          ref={fileRef}
          onChange={inputHandler}
        />
      </div>

      <div className={style['show-canvas']} ref={showRef}></div>
    </div>
  );
}
