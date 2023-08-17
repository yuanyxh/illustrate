import { checkCharacter, forEach, classnames } from '@/utils';
import { Icon, New } from './config';
import type {
  DirectoryChildren,
  CreateHandle,
  EntityHandle,
  TreeIndex
} from './types';

export const addDirectory = (list: DirectoryChildren[]) => {
  const index = list.findIndex(
    (item) => item.type !== 'create' && item.handle.kind === 'file'
  );

  const newEle: CreateHandle = { type: 'create', name: 'directory' };

  index === -1 ? list.push(newEle) : list.splice(index, 0, newEle);

  return [...list];
};

export const isValidFileName = (s: string) =>
  !checkCharacter(/[\\\\/:*?\\"<>|]/)(s);

export const getIconName = (ele: DirectoryChildren) =>
  ele.type === 'create'
    ? ele.name === 'directory'
      ? Icon.DIRECTORY
      : Icon.FILE
    : ele.type === 'directory'
    ? Icon.DIRECTORY
    : Icon.FILE;

export const resolveName = (list: DirectoryChildren[], name: string) => {
  if (name !== New.DIRECTORY && name !== New.FILE) return name;

  const temp = name;
  let i = 1;

  list = list.filter((item) => item.name.startsWith(name));

  (function find() {
    const val = list.find((item) => item.name === name);

    if (val) {
      name = temp + `(${++i})`;
      find();
    }
  })();

  return name;
};

export const resolvePath = (vals: string[]) => {
  let path = '';

  if (vals.length === 0) return '/';

  forEach(vals, (val) => {
    path += '/';
    path += val;
  });

  return path;
};

export const isCreate = (handle: DirectoryChildren) => handle.type === 'create';

export const generateTreeIndex = async (root: FileSystemDirectoryHandle) => {
  const children: TreeIndex[] = [];

  for await (const [name, handle] of root.entries()) {
    if (handle.kind === 'directory') {
      children.push(await generateTreeIndex(handle));
    } else {
      children.push({ name, type: handle.kind });
    }
  }

  return { name: root.name, type: root.kind, children };
};

export const filterNode = (root: TreeIndex, keyword: string, path: string) => {
  if (root.type !== 'directory') return [];

  path += '/';

  const { children } = root;

  const results: (TreeIndex & { path: string })[] = [];

  forEach(children, (val) => {
    if (val.type === 'directory') {
      if (val.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())) {
        results.push(Object.assign({}, val, { path: path + val.name }));
      }

      results.push(...filterNode(val, keyword, path + val.name));
    } else {
      if (val.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())) {
        results.push(Object.assign({}, val, { path: path + val.name }));
      }
    }
  });

  return results;
};

export const getParentName = (path: string) => {
  const strs = path.split('/');

  return strs[strs.length - 2];
};

export class FileSystemHistory {
  stack: FileSystemDirectoryHandle[];
  forwardStack: FileSystemDirectoryHandle[];

  constructor(init: FileSystemDirectoryHandle) {
    this.stack = [init];
    this.forwardStack = [];
  }

  push(path: FileSystemDirectoryHandle) {
    return this.stack.push(path);
  }

  pop() {
    return this.stack.pop();
  }

  back() {
    if (this.stack.length === 1) return this.stack[this.stack.length - 1];

    const back = this.stack.pop();

    const last = this.forwardStack[this.forwardStack.length - 1];

    if (this.forwardStack.length === 0 && back) {
      this.forwardStack.push(back);
    } else if (back && last.isSameEntry(back)) {
      this.forwardStack.push(back);
    }

    return this.stack[this.stack.length - 1];
  }

  forward() {
    const forward = this.forwardStack.pop();

    if (forward) {
      this.stack.push(forward);
    }

    return forward;
  }
}

export class FileSystemClipboard {
  state: 'copy' | 'cut' = 'copy';
  datatransfer: EntityHandle[];
  update;

  constructor(update: React.Dispatch<React.SetStateAction<EntityHandle[]>>) {
    this.datatransfer = [];
    this.update = update;
  }

  copy(val: EntityHandle[]) {
    this.state = 'copy';
    this.datatransfer = val;
    this.update(val);
  }

  cut(val: EntityHandle[]) {
    this.state = 'cut';
    this.datatransfer = val;
    this.update(val);
  }

  paste() {
    const val = this.datatransfer;
    this.datatransfer = [];
    this.update([]);

    return val;
  }
}
