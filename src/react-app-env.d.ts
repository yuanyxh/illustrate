/// <reference types="react-scripts" />

declare module '*.ts';

declare type FileSystemHandlePermissionDescriptor = {
  mode: 'read' | 'readwrite';
};

declare type FileSystemHandleCreateOptions = {
  create: boolean;
};

declare type FileSystemHandleRecursiveOptions = {
  recursive: boolean;
};

declare type FileSystemHandleKeepExistingDataOptions = {
  keepExistingData: boolean;
};

declare interface PermissionStatus {
  state: 'granted' | 'denied' | 'prompt';
}

declare interface FileSystemSyncOptions {
  at: number;
}

declare interface FileSystemSyncAccessHandle {
  readonly close(): undefined;
  readonly flush(): undefined;
  readonly getSize(): Promise<number>;
  readonly read(buffer: ArrayBuffer, options?: FileSystemSyncOptions): number;
  readonly truncate(newSize: number): undefined;
  readonly write(buffer: ArrayBuffer, options?: FileSystemSyncOptions): number;
}

declare interface FileSystemHandle {
  readonly kind: 'file' | 'directory';
  readonly name: string;
  readonly isSameEntry(arg: FileSystemHandle): boolean;
  readonly queryPermission(
    arg: FileSystemHandlePermissionDescriptor
  ): Promise<PermissionStatus>;
  requestPermission(
    arg: FileSystemHandlePermissionDescriptor
  ): Promise<PermissionStatus>;
  /** @deprecated 非标准特性 */
  readonly remove(
    options?: FileSystemHandleRecursiveOptions
  ): Promise<undefined>;
}

declare interface FileSystemDirectoryHandle extends FileSystemHandle {
  readonly kind: 'directory';
  readonly entries(): AsyncIterableIterator<
    [string, FileSystemDirectoryHandle | FileSystemFileHandle]
  >;
  readonly keys(): AsyncIterableIterator<string>;
  readonly values(): AsyncIterableIterator<
    FileSystemDirectoryHandle | FileSystemFileHandle
  >;
  readonly getDirectoryHandle(
    name: string,
    options?: FileSystemHandleCreateOptions
  ): Promise<FileSystemDirectoryHandle>;
  readonly getFileHandle(
    name: string,
    options?: FileSystemHandleCreateOptions
  ): Promise<FileSystemFileHandle>;
  readonly removeEntry(
    name: string,
    options?: FileSystemHandleRecursiveOptions
  ): Promise<undefined>;
  readonly resolve(
    possibleDescendant: FileSystemHandle
  ): Promise<string[] | null>;
}

declare interface FileSystemFileHandle extends FileSystemHandle {
  readonly kind: 'file';
  readonly createSyncAccessHandle(): Promise<FileSystemSyncAccessHandle>;
  readonly createWritable(
    options?: FileSystemHandleKeepExistingDataOptions
  ): Promise<FileSystemWritableFileStream>;
  readonly getFile(): Promise<File>;
}

declare enum PublicDirectory {
  'desktop',
  'documents',
  'downloads',
  'music',
  'pictures',
  'videos'
}

declare interface DirectoryPickerOptions {
  id?: string;
  mode?: 'read' | 'readwrite';
  startIn?: FileSystemHandle | PublicDirectory;
}

declare interface TypeDiscription {
  description: string;
  accept: { [key: string]: string[] };
}

declare interface FilePickerOptions {
  multiple?: boolean;
  excludeAcceptAllOption?: boolean;
  types?: TypeDiscription[];
}

declare interface SaveFilePickerOptions {
  excludeAcceptAllOption?: boolean;
  suggestedName?: string;
  types?: TypeDiscription[];
}

declare interface Window {
  showDirectoryPicker: (
    options?: DirectoryPickerOptions
  ) => Promise<FileSystemDirectoryHandle>;
  showOpenFilePicker(
    options?: FilePickerOptions
  ): Promise<FileSystemFileHandle[]>;
  showSaveFilePicker(
    options?: SaveFilePickerOptions
  ): Promise<FileSystemFileHandle>;
}
