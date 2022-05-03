# navi脚手架

- [navi脚手架](#navi脚手架)
  - [使用(use)](#使用(use))
  - [创建项目](#创建项目)
  - [使用ui](#使用ui)
  - [template](#template)
    - [setting.json](#setting.json)
  - [添加命令](#添加命令)

## 使用(use)

```shell
npm i -g @navi-cli/cli
```

安装之后，你就可以在命令行中访问`navi`命令。你可以通过简单运行`navi`，看看是否展示出了一份所有可用命令的帮助信息，来验证它是否安装成功。

你也可以选择[添加自己的命令](#添加命令)，让`navi`更符合你的习惯。

查看帮助:
```shell
navi
# OR
navi -h
# OR
navi --help
```

检查版本:
```shell
navi -v
# OR
navi --version
```

## [创建项目](#创建项目)

你也可以选择vue-cli或者是create-react-app来创建。

### navi init
运行以下命令来创建一个新项目：
```shell
navi init hello-world
```

### `vue-cli` or `create-react-app`
运行以下命令来创建一个新项目：
```shell
navi vue hello-world
# OR
navi react hello-world
```

## 使用ui

运行以下命令来启动ui：
```shell
navi ui
```

## 添加自己的模板

您需要将模板[发布npm](https://docs.npmjs.com/cli/v6/commands/npm-publish)。

模板包应当有如下结构
```
|- package
|-- template
|-- package.json
|-- setting.json
```
### template

模板内容需要放在template文件夹中，为了生成项目name与项目存放文件夹一致，`package.json`中`name`项的值应当为`<%= projectName %>`。

您可以在除`html`的任意文件中使用`<%= key %>`的指定渲染。

### setting.json

setting.json:
```JSON
{
  "installCommand": "npm install",
  "startCommand": "npm run serve",
  "buildCommand": "npm run build",
  "template": [{
    "name": "title",
    "message": "请输入 title:",
    "tip": "请输入 title"
  }],
  "ignore": ["**/public/**", "**.png"]
}
```
参数介绍:

- template:
  - name: 模板渲染位置字段。
  - message: 交互说明字段。
  - tip: 校验提示字段。
- ignore: 忽略文件，参考[glob](https://github.com/isaacs/node-glob)

## 添加自己的命令

```JS
function command(options) {

}
```
- options
 - cmds: 命令参数
 - args: 选项值
 - command: command对象

## 创建更多模板

开发中
