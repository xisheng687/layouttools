# 公众号排版大师

[English](#english) | [中文](#中文)

---

## 中文

### 简介

公众号排版大师是一款专为微信公众号设计的在线排版工具。通过简洁直观的界面，帮助内容创作者快速将 Markdown 文本转换为精美的公众号文章格式。

### 功能特性

- **10套精选配色方案** - 从商务深蓝到暗夜霓虹，覆盖多种风格场景
- **Markdown 实时转换** - 支持标准 Markdown 语法，即写即转
- **实时预览** - 所见即所得，编辑同时预览最终效果
- **一键复制** - 转换后的内容可直接复制到公众号编辑器
- **代码高亮** - 支持多种编程语言的语法高亮
- **自定义样式** - 可调整字号、行高、段落间距等
- **列表样式** - 支持自定义无序/有序列表标记
- **引用块美化** - 精心设计的引用样式
- **字符替换** - 自动替换特殊字符
- **响应式设计** - 支持多种设备访问

### 本地运行

这是一个纯静态项目，无需安装依赖：

1. 克隆仓库

```bash
git clone https://github.com/xisheng687/layouttools.git
cd layouttools
```

2. 直接在浏览器中打开 `index.html`

或使用本地服务器：

```bash
# Python 3
python3 -m http.server 8080

# 然后访问 http://localhost:8080
```

### 命令行工具

项目还包含一个 Node.js 命令行工具：

```bash
# 基本转换
node format-wechat.js <文件.md>

# 带预览
node format-wechat.js <文件.md> --preview
```

---

## English

### Introduction

公众号排版大师 (WeChat Layout Master) is an online formatting tool designed specifically for WeChat Official Accounts. With a clean and intuitive interface, it helps content creators quickly convert Markdown text into beautifully formatted articles.

### Features

- **10 Curated Color Schemes** - From Business Navy to Neon Night, covering various style scenarios
- **Real-time Markdown Conversion** - Support for standard Markdown syntax with instant conversion
- **Live Preview** - WYSIWYG experience, preview while editing
- **One-click Copy** - Converted content can be directly copied to the WeChat editor
- **Code Highlighting** - Syntax highlighting for multiple programming languages
- **Custom Styles** - Adjustable font size, line height, paragraph spacing, etc.
- **List Styles** - Customizable markers for ordered/unordered lists
- **Quote Beautification** - Carefully designed quote block styles
- **Character Replacement** - Automatic special character replacement
- **Responsive Design** - Accessible from various devices

### Local Development

This is a pure static project, no dependencies required:

1. Clone the repository

```bash
git clone https://github.com/xisheng687/layouttools.git
cd layouttools
```

2. Open `index.html` directly in your browser

Or use a local server:

```bash
# Python 3
python3 -m http.server 8080

# Then visit http://localhost:8080
```

### CLI Tool

The project also includes a Node.js command-line tool:

```bash
# Basic conversion
node format-wechat.js <file.md>

# With preview
node format-wechat.js <file.md> --preview
```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.
