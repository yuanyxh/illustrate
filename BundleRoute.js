/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * @author yuanyxh
 * @description 路由表编译, 当添加一个案例时运行 npm run newpage 自动编译路由表
 */

const fs = require('fs');
const path = require('path');

/**
 * @description 路由配置, 模板路径
 */
const TEMPLATE = './src/router/template.tsx';
/**
 * @description 路由配置路径
 */
const ROUTE_PATH = './src/router/index.tsx';
/**
 * @description 演示页面路径
 */
const ROOT_PATH = resolve(__dirname, './src/pages');

/**
 * @description 演示页面 meta 数据, 匹配正则
 */
const REGEXP = {
  title: createCommonRegexp('title'),
  image: createCommonRegexp('image')
};

/**
 * @description 记录演示页面数量
 */
let pageCount = 0;

/**
 * @description 待拼接路由表配置
 * @type {string}
 */
let pagesRoute = ``;

/**
 * @description 导入组件数据
 * @type {string[]}
 */
const imports = [];

/**
 *
 * @description path.resolve 别名
 * @param  {...string} paths
 * @returns {string}
 */
function resolve(...paths) {
  return path.resolve(...paths);
}

/**
 *
 * @description 转换名字
 * @param {string} name
 * @returns
 */
function transformPageName(name) {
  if (name.includes('-')) {
    name = name.replace(/-/g, '');
  }

  return name;
}

/**
 *
 * @description Array.prototype.forEach 别名
 * @param {Array<string>} target
 * @param {(name: string, index: number, self: Array<string>) => void} callback
 */
function forEach(target, callback) {
  target.forEach(callback);
}

/**
 *
 * @description 创建匹配正则
 * @param {string} tag
 * @returns {RegExp}
 */
function createCommonRegexp(tag) {
  return new RegExp(`(?<=\\/\\/\\s*--${tag}:\\s*).+(?=\\s*--)`);
}

/**
 *
 * @description 获取包名
 * @param {string} way
 */
function getPageName(way) {
  return way.slice(way.lastIndexOf('\\') + 1).replace('.tsx', '');
}

/**
 *
 * @description 获取路径
 * @param {string} pageName
 */
function getPath(pageName) {
  if (pageName.includes('-')) return pageName.toLocaleLowerCase();

  return pageName.replace(/[A-Z]/g, (char, index) => {
    if (index === 0) return char.toLowerCase();

    return '-' + char.toLowerCase();
  });
}

/**
 *
 * @description 提取匹配字符串
 * @param {string} source
 * @param {RegExp} flag
 */
function match(source, flag) {
  return source.match(flag);
}

/**
 *
 * @description 提取 title, 必须提供
 * @param {string} source
 */
function getTitle(source) {
  return match(source, REGEXP.title);
}

/**
 *
 * @description 提取图片信息, 可选
 * @param {string} source
 */
function getImage(source) {
  return match(source, REGEXP.image);
}

/**
 *
 * @description 生成 import 导入信息
 * @param {string} pageName
 */
function generateImport(pageName) {
  let variable = transformPageName(pageName);

  return `const ${variable} = lazy(() => import('@/pages/${pageName}/${pageName}'));`;
}

/**
 *
 * @description 写入路由信息
 * @param {string} route
 */
function writeRouter(route) {
  fs.readFile(resolve(__dirname, TEMPLATE), 'utf-8', (err, data) => {
    if (err) throw Error(err);

    const newRoute = data
      .replace(/\/\/\s*--import--/, imports.join('\n'))
      .replace(/\/\/\s*--children--/, route);

    fs.writeFile(resolve(__dirname, ROUTE_PATH), newRoute, (err) => {
      if (err) throw Error(err);
    });
  });
}

/**
 *
 * @description 读取 page 文件内容获取必要信息
 * @param {string} way
 */
function createPage(way) {
  pageCount++;
  fs.readFile(way, 'utf-8', (err, data) => {
    if (err) throw Error(err);

    pageCount--;

    let pageName = getPageName(way);
    const path = getPath(pageName);
    const title = getTitle(data)[0].trim();
    const image = getImage(data)?.[0].trim() || '';

    imports.push(generateImport(pageName));

    pagesRoute += `{
      path: '${path}',
      title: '${title}',
      image: '${image}',
      element: <${transformPageName(pageName)} />
    },
    `;

    if (pageCount === 0) {
      writeRouter(pagesRoute);
    }
  });
}

/**
 *
 * @description 递归读取文件夹
 * @param {string} way
 */
function readFiles(way) {
  fs.readdir(way, 'utf-8', (err, files) => {
    if (err) throw Error(err);

    forEach(files, (fileOrDir) => {
      const curr = resolve(way, fileOrDir);

      const stat = fs.lstatSync(curr);

      if (stat.isDirectory()) return readFiles(curr);
      if (!stat.isFile() || !curr.endsWith('.tsx')) return;

      const directory = way.substring(way.lastIndexOf('\\') + 1);

      if (directory !== getPageName(curr)) return;

      createPage(curr);
    });
  });
}

readFiles(ROOT_PATH);
