/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');

let count = 0;

/**
 * @type {string}
 */
let pagesRoute = `,
  children: [
`;
/**
 * @type {string[]}
 */
const imports = [];

/**
 *
 * @param  {...string} paths
 * @returns {string}
 */
function resolve(...paths) {
  return path.resolve(...paths);
}

/**
 *
 * @param {Array<string>} target
 * @param {(name: string, index: number, self: Array<string>) => void} callback
 */
function forEach(target, callback) {
  target.forEach(callback);
}

/**
 *
 * @param {string} way
 */
function getPageName(way) {
  return way.slice(way.lastIndexOf('\\') + 1).replace('.tsx', '');
}

/**
 *
 * @param {string} pageName
 */
function getPath(pageName) {
  return pageName.replace(/[A-Z]/g, (char, index) => {
    if (index === 0) return char.toLowerCase();

    return '-' + char.toLowerCase();
  });
}

/**
 *
 * @param {string} source
 */
function getTitle(source) {
  const regexp = /(?<=\/\/\s*--title:\s*).+(?=\s*--)/;
  return source.match(regexp)[0].trim();
}

/**
 *
 * @param {string} pageName
 */
function generateImport(pageName) {
  return `const ${pageName} = lazy(() => import('@/pages/${pageName}/${pageName}'));`;
}

function writeRouter() {
  fs.readFile(
    resolve(__dirname, './src/router/template.tsx'),
    'utf-8',
    (err, data) => {
      if (err) throw Error(err);

      const newRoute = data
        .replace(/\/\/\s*--import--/, imports.join('\n'))
        .replace(/\/\/\s*--children--/, pagesRoute);

      fs.writeFile(
        resolve(__dirname, './src/router/index.tsx'),
        newRoute,
        (err) => {
          if (err) throw Error(err);
        }
      );
    }
  );
}

/**
 *
 * @param {string} way
 */
function readFile(way) {
  count++;
  fs.readFile(way, 'utf-8', (err, data) => {
    if (err) throw Error(err);

    count--;

    const pageName = getPageName(way);
    const path = getPath(pageName);
    const title = getTitle(data);

    imports.push(generateImport(pageName));

    pagesRoute += `{
      path: '${path}',
      title: '${title}',
      element: <${pageName} />
    },
    `;

    if (count === 0) {
      pagesRoute += ']';
      writeRouter();
    }
  });
}

const root = resolve(__dirname, './src/pages');

/**
 *
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

      readFile(curr);
    });
  });
}

readFiles(root);
