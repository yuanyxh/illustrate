# Illustrate 网站效果演示项目

闲来无事，想开发一个收录网站效果的网站（各类 CSS 动画，JS 交互等），同时学习一下 `React`（网站使用 `React` 开发），也能以此驱动自己不断学习，记录所学的知识。

项目使用 `create-react-app` + `react` 开发，目前除了基础库 `react`、`react-router` 和一些限制规范的包外未使用其他依赖，想法是尽可能自己实现来达到最好的学习效果（进度：新建文件夹）。

## 项目结构

```tree
│  .cssrem                 # px to rem 配置
│  .editorconfig           # 编码格式统一
│  .eslintrc.js            # eslint 配置
│  .lintstagedrc           # 代码检查
│  .prettierrc             # 代码格式化配置
│  .stylelintrc.js         # 样式检查
│  BundleRoute.js          # 路由编译
│  commitlint.config.js    # 提交规范配置
│  craco.config.js         # 扩展 cra
│
├─.husky/                  # git hooks
|
├─public/                  # 公有资源
│
└─src
    │
    ├─components           # 组件
    │
    ├─enum                 # 枚举数据
    │
    ├─hooks                # hooks
    │
    ├─pages                # 效果演示
    │
    ├─router               # 路由
    │
    ├─styles               # 样式
    │
    ├─types                # 类型声明
    │
    └─utils                # 工具库
```

## 响应式

项目的响应式设计依赖于 rem，而 rem 对应的 `html` 字号大小由 **_媒体查询 + 视口宽度_** 计算得来，计算规则来自《CSS 新世界》，规则如下：

![image-20230408124751119](http://qkc148.bvimg.com/18470/a77d26583dd11329.png)

在不同分辨率的电脑中开发时，需修改 `.cssrem` 文件的 `rootFontSize` 为正确的值。

## 提交检查与规范

为了保证提交的代码是可运行的，并统一提交格式，项目配置了提交时的代码检查与提交规范检查。

为了在提交时触发对应的动作，使用 `husky` 配置 git hooks。

### 提交检查

使用 `lint-staged` 包搭配 git hooks 在提交时运行检查，如果代码中存在错误会取消本次提交，直到问题被修复。

### 提交规范

使用 `git-cz` 包搭配 git hooks 在提交时运行检查，如果提交不符合规范则取消本次提交。

## 路由构建

当案例过多时手动编写路由表会变得不够方便，因此编写了自动构建路由表的脚本 `BundleRoute.js`，构建规则为：

- 遍历 `src/pages/` 下的所有目录与文件

- 获取后缀为 `.tsx ` 的文件，取文件名为组件名

- 获取文件内容，根据规则取案例标题（看下面 👇）

- 获取路由表模板 `src/router/template.tsx`

- 混合内容并写入到 `src/router/index.tsx`

**_tips:_** 为了使路由构建正常，请按照以下规则编写案例：

- 路径格式为 `pages/Test/Test.tsx`
- 组件内容应标记案例标题，标记格式为 `//--title:(yourtitle)--`

![image-20230408143604838](http://qkc148.bvimg.com/18470/31055e104ee43bc2.png)

![image-20230408145712852](http://qkc148.bvimg.com/18470/350820caf5bf6fc5.png)

当添加了一个新案例时可以使用 `npm run newpage` 来生成新的路由表。

## scripts

- start：本地运行项目
- newpage：构建路由表并启动项目
- build：编译项目
- prettier：项目编码格式化
- commit：执行 git commit 并检查提交规范
