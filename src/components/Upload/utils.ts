import { isValidElement } from 'react';
import { hasData } from '@/utils';
import type { NameSlot } from './types';

export function stopPropagation<T extends Event, U extends React.DragEvent>(
  e: T | U
) {
  e.preventDefault();
  e.stopPropagation();
}

/** 生成文件 id */
export function generateId() {
  return 'File_' + Math.random().toString(32).substring(4) + Date.now();
}

/** 是否是命名插槽 */
export function isNameSlot(data: unknown): data is NameSlot {
  return (
    hasData(data) &&
    (typeof (data as NameSlot).default === 'function' ||
      isValidElement((data as NameSlot).default))
  );
}

/** 获取最大字节长度 */
export function getLength(types: string[]) {
  return types.reduce((prev, curr) => {
    const len = curr.split('0x')[1].length || 0;
    return len > prev ? len : prev;
  }, 0);
}

/** 读取文件数据 */
export function readAsArrayBuffer(blob: Blob) {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
}

/**
 *
 * @description 严格检查文件类型
 * @param files fileList 实例
 * @param types 文件头，16 进制数据，如 jpeg 的文件头数据为 0xFFD8FF
 * @param cb 执行回调
 */
export async function strictInspection(file: File, types: string[]) {
  const maxLength = getLength(types);

  const buffer = await readAsArrayBuffer(file.slice(0, maxLength));

  const hex = new Uint8Array(buffer).reduce(
    (prev, curr) => (prev += curr.toString(16)),
    '0x'
  );

  return types.some(
    (type) =>
      type === hex.slice(0, type.length) ||
      type.toLowerCase() === hex.slice(0, type.length)
  );
}
