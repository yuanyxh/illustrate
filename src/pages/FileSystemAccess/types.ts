import type { FileSystemHistory, FileSystemClipboard } from './utils';

export interface DirectoryItem {
  type: 'file' | 'directory' | 'create';
}

export interface DirectoryHandle extends DirectoryItem {
  type: 'directory';
  name: string;
  handle: FileSystemDirectoryHandle;
}

export interface FileHandle extends DirectoryItem {
  type: 'file';
  name: string;
  handle: FileSystemFileHandle;
}

export interface CreateHandle extends DirectoryItem {
  type: 'create';
  name: 'directory' | 'file';
}

export interface Node {
  name: string;
  type: 'directory' | 'file';
}

export interface FileIndex extends Node {
  type: 'file';
  children?: undefined;
}

export interface DirectoryIndex extends Node {
  type: 'directory';
  children: TreeIndex[];
}

export interface FileSystemContext {
  history: FileSystemHistory | null;
  clipboard: FileSystemClipboard | null;
}

export type TreeIndex = DirectoryIndex | FileIndex;

export type EntityHandle = DirectoryHandle | FileHandle;

export type DirectoryChildren = DirectoryHandle | FileHandle | CreateHandle;

export type NodeType =
  | 'copy'
  | 'cut'
  | 'paste'
  | 'move-to'
  | 'copy-to'
  | 'remove'
  | 'rename'
  | 'create'
  | 'list'
  | 'thumbnail';

export type DisplayType = 'list' | 'thumbnail';
