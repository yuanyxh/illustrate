import React from 'react';
import { classnames } from '@/utils';
import Text from '@/components/Text/Text';
import Progress from '@/components/Progress/Progress';
import UploadImage from './UploadImage';
import type { UploadFile } from '@/components/Upload/types';
import style from './UploadList.module.css';

interface UploadListProps extends Props {
  type?: 'image-list';
  files: UploadFile[];
}

interface ListItemProps extends Props {
  file: UploadFile;
}

const generateClass = classnames(style);

function ListItem(props: ListItemProps) {
  const { file } = props;

  const listItemClass = generateClass(['list-item', `is-${file.status}`]);

  return (
    <>
      <div className={listItemClass}>
        <Text
          type={file.status === 'error' ? 'danger' : undefined}
          size="small"
        >
          {file.name}
        </Text>
      </div>

      {file.status === 'loading' ? (
        <Progress percentage={file.percent} strokeWidth={3}></Progress>
      ) : undefined}
    </>
  );
}

export default function UploadList(props: UploadListProps) {
  const { type, files } = props;

  return (
    <div className={style['upload-list']}>
      {files.map((file) =>
        type === 'image-list' ? (
          <UploadImage key={file.id} url={file.url}></UploadImage>
        ) : (
          <ListItem key={file.id} file={file} />
        )
      )}
    </div>
  );
}
