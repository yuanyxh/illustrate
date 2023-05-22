/** 标志 */
export const Flag = {
  /** pdf */
  IS_PDF: [0x25, 0x50, 0x44, 0x46],
  /** startxref */
  START_XREF: [0x73, 0x74, 0x61, 0x72, 0x74, 0x78, 0x72, 0x65, 0x66],
  /** trailer */
  TRAILER: [0x74, 0x72, 0x61, 0x69, 0x6c, 0x65, 0x72],
  /** xref */
  XREF: [0x78, 0x72, 0x65, 0x66],
  /** 间接引用, 格式为: number number R */
  QUOTE: [0x52],
  /** 流开始 */
  STREAM_START: [0x73, 0x74, 0x72, 0x65, 0x61, 0x6d],
  /** 流结束 */
  STREAM_END: [0x65, 0x6e, 0x64, 0x73, 0x74, 0x72, 0x65, 0x61, 0x6d],
  /** 字体映射开始 */
  BEGIN_CHAR: [
    0x62, 0x65, 0x67, 0x69, 0x6e, 0x62, 0x66, 0x63, 0x68, 0x61, 0x72
  ],
  /** 字体映射结束 */
  END_CHAR: [0x65, 0x6e, 0x64, 0x62, 0x66, 0x63, 0x68, 0x61, 0x72]
};

/** 特征 */
export const Feature = {
  /** 字典开头 */
  DICTIONARY_START: [0x3c, 0x3c],
  /** 字典结尾 */
  DICTIONARY_END: [0x3e, 0x3e],
  /** 数组开始 */
  SQUARE_BRACKET_START: [0x5b],
  /** 数组结束 */
  SQUARE_BRACKET_END: [0x5d],
  /** 名称 */
  INCLINED: [0x2f],
  /** 字符串开始 */
  ARROW_START: [0x3c],
  /** 字符串结束 */
  ARROW_END: [0x3e],
  /** 字符串开始 */
  PARENTHESES_START: [0x28],
  /** 字符串结束 */
  PARENTHESES_END: [0x29]
};

/** 不可见字符 */
export const InvisibleChar = {
  SPACE: [0x20],
  LINE_FEED: [0x0a],
  CARRIAGE_RETURN: [0x0d],
  LINE_BREAK: [0x0d, 0x0a]
};

/** 线断点风格 */
export const LINE_CAPS = ['butt', 'round', 'square'] as const;

/** 线交叉风格 */
export const LINE_JOINS = ['miter', 'round', 'bevel'] as const;

/** 图形操作符 */
export const Graphic = {
  // 普通图像状态操作符 =======
  /** w 操作符, 线宽, 对应 canvas 的 lineWidth */
  LINE_WIDTH: [0x77],
  /** J 操作符, 线端点风格, 对应 canvas 的 lineCap */
  LINE_CAP: [0x4a],
  /** j 操作符, 线交叉风格, 对应 canvas 的 lineJoin */
  LINE_JOIN: [0x6a],
  /** M 操作符, 斜接面限制比例的数字, 对应 canvas 的 miterLimit */
  MITER_LIMIT: [0x4d],

  // d 操作符, 设置虚线风格
  // ri 操作符, 设置Rendering Intent(呈色意向)
  // i 操作符, 设置平面化容忍度

  /** gs 操作符, 设置图形状态, 依赖于 Resources 资源对象 */
  GS: [0x67, 0x73],
  // ===========

  // 特殊图形状态操作符 =======
  /** q 操作符, 存储当前状态, 对应 canvas 的 save() */
  SAVE: [0x71],
  /** Q 操作符, 回退状态, 对应 canvas 的 restore() */
  RESTORE: [0x51],
  /** cm 操作符, 转换矩阵, 对应 canvas 的 setTransform() */
  SET_TRANSFORM: [0x63, 0x6d],
  // ===========

  // 路径构建操作符 =======

  // m 操作符, 移动当前指针到指定位置
  // l 操作符, 添加一条连接当前指针到指定位置的线段
  // c 操作符, 添加一条Bezier曲线, 有 2 个控制点, 2 个端点
  // v 操作符, 添加一条Bezier曲线, 2 个控制点重合
  // y 操作符, 添加一条Bezier曲线, 第二个控制点和第二个端点重合
  // h 操作符, 闭合路径

  /** re 操作符, 绘制矩形, 对应 canvas 的 rect() */
  RECT: [0x72, 0x65],
  // ===========

  // 路径绘制操作符 =======

  // S 操作符, 描绘路径
  // s 操作符, 闭合路径并描绘路径

  /** f 操作符, 闭合并填充路径, 对应 canvas 的 { beginPath() fill('nonzero') } */
  FILL_NONZERO: [0x66],

  // f* 操作符, 填充路径, 使用奇偶规则确定区域
  // B 操作符, 填充路径, 使用非零回转数规则确定区域, 并描绘路径
  // B* 操作符, 填充路径, 使用奇偶规则确定区域, 并描绘路径
  // b 操作符, 闭合路径, 填充路径, 使用非零回转数规则确定区域, 并描绘路径
  // b* 操作符, 闭合路径, 使用奇偶规则确定区域, 并描绘路径

  /** n 操作符, 关闭路径, 对应 canvas 的 closePath() */
  CLOSE_PATH: [0x6e],
  // ===========

  // 路径修剪操作符 =======
  /** W 操作符, 裁剪路径, 对应 canvas 的 clip('nonzero'); */
  CLIP_NONZERO: [0x57],
  /** W* 操作符, 裁剪路径, 对应 canvas 的 clip('evenodd'); */
  CLIP_EVENODD: [0x57, 0x2a],
  // ===========

  // 文本对象操作符 ========
  /** BT, 开始一个文本对象 */
  START_TEXT: [0x42, 0x54],
  /** ET 操作符, 结束一个文本对象 */
  END_TEXT: [0x45, 0x54],
  // ===========

  // 文本状态操作符 =======
  // Tc 操作符, 设置字符间隔
  // Tw 操作符, 设置单词间隔
  // Tz 操作符, 设置水平缩放
  // TL 操作符, 设置Leading

  /** Tf 操作符, 设置字体, 对应 canvas 的 font */
  SET_FONT_FAMILY: [0x54, 0x66],

  // Tr 操作符, 设置Render(渲染)模式
  // Ts 操作符, 设置Rise
  // ===========

  // 文本位置操作符 ========
  // Td 操作符, 移动到下一行的开始, 通过偏移(tx,ty).

  /** TD 操作符, 移动指针至下一行, 通过参数 (x, y) 同时设置行间距为 y, 对应 canvas 的 translate() */
  TRANSLATE_FONT: [0x54, 0x44],

  /** Tm 操作符, 设置字体矩阵, 对应 canvas 的 transform() */
  SET_FONT_POSITION: [0x54, 0x6d],

  // T* 操作符, 移动到下一行的开始位置, 和 0 Tl Td 相同.
  // ===========

  // 文本显示操作符 =======
  /** Tj 操作符, 绘制文本, 对应 canvas 的 fillText() */
  DRAW_TEXT: [0x54, 0x6a],

  // TJ 操作符, 显示一个或者多个文本字符串, 允许独立的制定各个字型的位置
  // ' 操作符, 移动到下一行并显示一个文本字符串
  // " 操作符, 移动到下一行并显示一个文本字符串, 并指定字符间距为 ac, 单词间距为 aw
  // ===========

  // type3 字体操作符 =======
  // d0 操作符, 设置字型的宽度
  // d1 操作符, 设置字型的宽度及自行的 bounding box(边界矩形)
  // ===========

  // 颜色操作符 ========
  // CS 操作符, 设置描绘颜色空间
  // cs 操作符, 设置非描绘颜色空间
  // SC 操作符, 设置描绘颜色值, 针对一般颜色空间
  // SCN 操作符, 设置描绘颜色值, 允许特殊颜色空间
  // sc 操作符, 设置非描绘颜色值, 针对一般颜色空间
  // scn 操作符, 设置非描绘颜色值, 允许特殊颜色空间
  // G 操作符, 设置描绘颜色空间为 DeviceGray, 并设置颜色值
  // g 操作符, 设置非描绘颜色空间为 DeviceGray, 并设置颜色值

  /** RG 操作符, 设置颜色空间为 DeviceRGB, 并设置颜色, 对应 canvas 的 fillStyle */
  FILL_COLOR: [0x52, 0x47],
  /** rg 操作符, 设置非颜色空间为 DeviceRGB, 并设置颜色, 对应 canvas 的 strokeStyle */
  STROKE_COLOR: [0x72, 0x67],

  // K 操作符, 设置描绘颜色空间为 DeviceCMYK, 并设置颜色值
  // k 操作符, 设置非描绘颜色空间为 DeviceCMYK, 并设置颜色值
  // ===========

  // 渐变样式操作符 =========
  // sh, 输出一个 shading 对象
  // ===========

  // 内联图像操作符 =========
  // BI 操作符, 开始一个内联图像
  // ID 操作符, 开始内联图像数据
  // EI 操作符, 结束一个内敛图像
  // ===========

  // 外部对象操作符 ========
  /** Do 操作符, 输出一个外部对象, 一般为图像资源 */
  OUTPUT: [0x44, 0x6f]
  // ===========

  // 标记内容操作符 ========
  // MP, 定义一个标记内容点
  // DP, 定义一个带属性列表的标记内容点
  // BMC, 开始一个标记内容序列
  // BDC, 开始一个带属性列表的标记内容序列
  // EMC, 结束一个标记内容序列
  // ===========

  // 兼容性操作符 ========
  // BX: 开始一个兼容段
  // EX: 结束一个兼容段
  // ===========
};
