export const controllerOptions = [
  {
    id: 'group_1',
    items: [
      {
        id: 'copy',
        type: 'copy',
        name: '复制',
        icon: 'icon-fuzhi'
      },
      {
        id: 'cut',
        type: 'cut',
        name: '剪切',
        icon: 'icon-jianqie'
      },
      {
        id: 'paste',
        type: 'paste',
        name: '粘贴',
        icon: 'icon-niantie'
      }
    ]
  },
  {
    id: 'group_2',
    items: [
      {
        id: 'move-to',
        type: 'move-to',
        name: '移动到',
        icon: 'icon-yidongdaowenjianjia'
      },
      {
        id: 'copy-to',
        type: 'copy-to',
        name: '复制到',
        icon: 'icon-fuzhi1'
      }
    ]
  },
  {
    id: 'group_3',
    items: [
      {
        id: 'remove',
        type: 'remove',
        name: '删除',
        icon: 'icon-shanchu'
      },
      {
        id: 'rename',
        type: 'rename',
        name: '重命名',
        icon: 'icon-zhongmingming'
      }
    ]
  },
  {
    id: 'group_4',
    items: [
      {
        id: 'create',
        type: 'create',
        name: '新建文件夹',
        icon: 'icon-xinjianwenjianjia'
      }
    ]
  },
  {
    id: 'group_5',
    items: [
      {
        id: 'list',
        type: 'list',
        name: '列表',
        icon: 'icon-liebiao'
      },
      {
        id: 'thumbnail',
        type: 'thumbnail',
        name: '缩略图',
        icon: 'icon-dasuolvetuliebiao'
      }
    ]
  }
];

export const ignoreType = ['paste', 'create', 'list', 'thumbnail'];

export const New = {
  DIRECTORY: '新建文件夹',
  FILE: '新建文件'
};

export const Icon = {
  DIRECTORY: 'icon-wenjianjia',
  FILE: 'icon-wenjian'
};

export const MessageBoxConfig = {
  title: {
    REPLACE: '确认文件夹替换',
    FILE_RENAME: '重命名文件',
    FOLDER_RENAME: '重命名文件夹'
  },
  message: {
    REPLACE: '此目标已包含名为“{{name}}”的文件夹，确认合并两个文件夹吗？',
    FILE_RENAME: '指定的文件名与已存在的文件夹重名，请指定其他名称。',
    FOLDER_RENAME: '指定的文件夹和已有的某个文件重名，请指定其他名称。'
  }
};

export const CatalogConfig = {
  move: {
    TITLE: '移动项目',
    DESC: '选择你要将文件移动到的地方，然后单击移动按钮。',
    BUTTON_TEXT: '移动'
  },
  copy: {
    TITLE: '复制项目',
    DESC: '选择你要将文件复制到的地方，然后单击复制按钮。',
    BUTTON_TEXT: '复制'
  }
};
