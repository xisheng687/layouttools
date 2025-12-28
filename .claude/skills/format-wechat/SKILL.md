---
name: format-wechat
description: Converts Markdown articles to WeChat public account-friendly HTML format with professional typography. Use when formatting articles for WeChat, converting Markdown to WeChat HTML, or when user mentions WeChat formatting or publishing.
allowed-tools: Bash(node:*)
---

# 微信公众号排版工具

将 Markdown 文章转换为微信公众号友好的 HTML 格式，风格参考小马宋文章排版。

## 使用方法

```
/format-wechat <文件路径>
/format-wechat <文件路径> --preview
```

## 参数说明

- `<文件路径>`: 要转换的 Markdown 文件路径
- `--preview`: 可选，生成完整 HTML 预览文件（可直接在浏览器打开查看效果）

## 执行步骤

当用户调用此 skill 时，执行以下操作：

1. 确认输入文件存在
2. 运行转换命令：
   ```bash
   node "./format-wechat.js" "<文件路径>" [--preview]
   ```
3. 告知用户输出文件位置
4. 提示用户：打开生成的 HTML 文件，复制内容到微信公众号编辑器

## 排版规范

- **标题**: 蓝色 (#1d4ed8)，加粗
- **加粗文字**: 浅蓝色 (#60a5fa)
- **正文**: 16px，行高 1.8，段落间距 1.5em
- **列表**: 转为普通段落（无圆点/数字）
- **链接**: 蓝色，无下划线
- **代码**: 灰色背景，等宽字体
- **特殊处理**: 「」转为""，移除残留*号

## 示例

```
/format-wechat 你的选题方法可能从第一步就错了.md
/format-wechat article.md --preview
```

## 输出

转换后会生成：
- `原文件名_wechat.html` - 可复制到微信公众号编辑器
- `原文件名_formatted.md` - 格式化后的 Markdown
