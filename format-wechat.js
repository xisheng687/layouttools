#!/usr/bin/env node
/**
 * 微信公众号排版工具
 * 将 Markdown 转换为微信公众号友好的 HTML 格式
 * 风格参考：小马宋文章排版
 */

const fs = require('fs');
const path = require('path');

// 配置：可根据需要调整
const CONFIG = {
  // 标题颜色（深蓝色）
  headingColor: '#1d4ed8',
  // 加粗颜色（浅蓝色）
  boldColor: '#60a5fa',
  // 正文颜色
  textColor: '#333333',
  // 正文字号
  fontSize: '16px',
  // 行高
  lineHeight: '1.8',
  // 段落间距
  paragraphMargin: '1.5em',
  // 标题字号
  h1Size: '24px',
  h2Size: '20px',
  h3Size: '18px',
};

/**
 * 转换 Markdown 为微信公众号 HTML
 */
function convertMarkdownToWechat(markdown) {
  let html = markdown;

  // 1. 处理代码块（先保护起来，使用不会被其他正则匹配的占位符）
  const codeBlocks = [];
  html = html.replace(/```[\s\S]*?```/g, (match) => {
    codeBlocks.push(match);
    return `\x00CODEBLOCK${codeBlocks.length - 1}\x00`;
  });

  // 2. 处理行内代码
  const inlineCodes = [];
  html = html.replace(/`([^`]+)`/g, (match, code) => {
    inlineCodes.push(code);
    return `\x00INLINECODE${inlineCodes.length - 1}\x00`;
  });

  // 3. 处理图片语法（微信不支持直接嵌入，移除或转为描述文字）
  html = html.replace(/!\[([^\]]*)\]\([^)]+\)/g, '');

  // 3. 处理标题（# ## ### 等）
  html = html.replace(/^### (.+)$/gm, (match, title) => {
    return `<h3 style="color:${CONFIG.headingColor}; font-size:${CONFIG.h3Size}; font-weight:bold; margin:1.2em 0 0.8em 0; line-height:1.4;">${title.trim()}</h3>`;
  });

  html = html.replace(/^## (.+)$/gm, (match, title) => {
    return `<h2 style="color:${CONFIG.headingColor}; font-size:${CONFIG.h2Size}; font-weight:bold; margin:1.5em 0 0.8em 0; line-height:1.4;">${title.trim()}</h2>`;
  });

  html = html.replace(/^# (.+)$/gm, (match, title) => {
    return `<h1 style="color:${CONFIG.headingColor}; font-size:${CONFIG.h1Size}; font-weight:bold; margin:0 0 1em 0; line-height:1.4;">${title.trim()}</h1>`;
  });

  // 4. 处理加粗+斜体组合 ***text*** 或 ___text___（必须先处理）
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, `<strong style="color:${CONFIG.boldColor};"><em>$1</em></strong>`);
  html = html.replace(/___(.+?)___/g, `<strong style="color:${CONFIG.boldColor};"><em>$1</em></strong>`);

  // 5. 处理加粗 **text** 或 __text__（蓝色加粗）
  html = html.replace(/\*\*(.+?)\*\*/g, `<strong style="color:${CONFIG.boldColor};">$1</strong>`);
  html = html.replace(/__(.+?)__/g, `<strong style="color:${CONFIG.boldColor};">$1</strong>`);

  // 6. 处理斜体 *text* 或 _text_（单个下划线/星号）
  // 注意：要在加粗处理之后，且不能跨行匹配（添加\n到排除列表）
  html = html.replace(/(?<!\*)\*([^*\n]+?)\*(?!\*)/g, '<em>$1</em>');
  html = html.replace(/(?<!_)_([^_\n]+?)_(?!_)/g, '<em>$1</em>');

  // 6. 处理链接 [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" style="color:#3b82f6; text-decoration:none;">$1</a>');

  // 7. 处理无序列表（去掉圆点，转为普通段落）
  html = html.replace(/^[-*+] (.+)$/gm, (match, item) => {
    return `<p style="color:${CONFIG.textColor}; font-size:${CONFIG.fontSize}; line-height:${CONFIG.lineHeight}; margin:0 0 0.8em 0; text-align:justify;">${item.trim()}</p>`;
  });

  // 8. 处理有序列表（去掉数字，转为普通段落）
  html = html.replace(/^\d+\. (.+)$/gm, (match, item) => {
    return `<p style="color:${CONFIG.textColor}; font-size:${CONFIG.fontSize}; line-height:${CONFIG.lineHeight}; margin:0 0 0.8em 0; text-align:justify;">${item.trim()}</p>`;
  });

  // 9. 处理引用块
  html = html.replace(/^> (.+)$/gm, (match, quote) => {
    return `<blockquote style="border-left:4px solid ${CONFIG.headingColor}; padding-left:1em; margin:1em 0; color:#666; font-style:italic;">${quote.trim()}</blockquote>`;
  });

  // 10. 处理分割线
  html = html.replace(/^[-*_]{3,}$/gm,
    `<hr style="border:none; border-top:1px solid #e0e0e0; margin:2em 0;">`);

  // 11. 恢复代码块（微信公众号不太支持代码块，转为简单的灰色背景文本）
  codeBlocks.forEach((block, i) => {
    const code = block.replace(/```(\w*)\n?([\s\S]*?)```/, (m, lang, content) => {
      return `<pre style="background:#f5f5f5; padding:1em; border-radius:4px; overflow-x:auto; font-family:Consolas,Monaco,monospace; font-size:14px; line-height:1.5; margin:1em 0;"><code>${escapeHtml(content.trim())}</code></pre>`;
    });
    html = html.replace(`\x00CODEBLOCK${i}\x00`, code);
  });

  // 12. 恢复行内代码
  inlineCodes.forEach((code, i) => {
    html = html.replace(`\x00INLINECODE${i}\x00`,
      `<code style="background:#f5f5f5; padding:0.2em 0.4em; border-radius:3px; font-family:Consolas,Monaco,monospace; font-size:0.9em;">${escapeHtml(code)}</code>`);
  });

  // 13. 处理段落（将连续的非HTML行包装成段落）
  const lines = html.split('\n');
  const result = [];
  let paragraph = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // 跳过空行
    if (!trimmed) {
      if (paragraph.length > 0) {
        result.push(wrapParagraph(paragraph.join('<br>')));
        paragraph = [];
      }
      continue;
    }

    // 如果已经是HTML标签开头（块级元素），直接添加
    if (trimmed.startsWith('<h') ||
        trimmed.startsWith('<p') ||
        trimmed.startsWith('<ul') ||
        trimmed.startsWith('<ol') ||
        trimmed.startsWith('<li') ||
        trimmed.startsWith('<blockquote') ||
        trimmed.startsWith('<hr') ||
        trimmed.startsWith('<pre') ||
        trimmed.startsWith('</')) {
      if (paragraph.length > 0) {
        result.push(wrapParagraph(paragraph.join('<br>')));
        paragraph = [];
      }
      result.push(trimmed);
    } else {
      paragraph.push(trimmed);
    }
  }

  // 处理最后的段落
  if (paragraph.length > 0) {
    result.push(wrapParagraph(paragraph.join('<br>')));
  }

  let output = result.join('\n\n');

  // 14. 替换中文角括号为双引号
  output = output.replace(/「/g, '"');
  output = output.replace(/」/g, '"');

  // 15. 移除残留的 * 号（不在HTML标签内的）
  output = output.replace(/\*/g, '');

  // 16. 确保标题前后有额外空行（更好的视觉分隔）
  output = output.replace(/(<h[1-3][^>]*>)/g, '\n$1');
  output = output.replace(/(<\/h[1-3]>)/g, '$1\n');

  return output;
}

/**
 * 包装段落
 */
function wrapParagraph(text) {
  if (!text.trim()) return '';
  // 只有块级元素标签才不包装
  const blockTags = ['<h1', '<h2', '<h3', '<h4', '<h5', '<h6', '<ul', '<ol', '<li', '<blockquote', '<hr', '<pre', '<div', '<table'];
  const trimmedText = text.trim();
  for (const tag of blockTags) {
    if (trimmedText.startsWith(tag)) return text;
  }
  // 其他内容（包括 <strong>、<em> 等行内元素）都包装成段落
  return `<p style="color:${CONFIG.textColor}; font-size:${CONFIG.fontSize}; line-height:${CONFIG.lineHeight}; margin:0 0 ${CONFIG.paragraphMargin} 0; text-align:justify;">${text}</p>`;
}

/**
 * HTML转义
 */
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * 生成完整的HTML文档（用于预览）
 */
function wrapFullHtml(content, markdown) {
  // 提取标题和正文
  const titleMatch = content.match(/<h1[^>]*>(.*?)<\/h1>/);
  const title = titleMatch ? titleMatch[0] : '';
  const bodyContent = titleMatch ? content.replace(titleMatch[0], '').trim() : content;

  // 计算字数统计（基于原始 markdown）
  const plainText = markdown
    .replace(/^#+\s+/gm, '')  // 去掉标题标记
    .replace(/\*\*(.+?)\*\*/g, '$1')  // 去掉加粗
    .replace(/\*(.+?)\*/g, '$1')  // 去掉斜体
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // 去掉链接
    .replace(/[-*+] /gm, '')  // 去掉列表标记
    .replace(/^\d+\. /gm, '')  // 去掉有序列表
    .replace(/\n+/g, '\n')  // 合并换行
    .trim();

  const charCount = plainText.length;
  const charCountNoSpace = plainText.replace(/\s/g, '').length;
  // 中文字数：匹配中文字符
  const chineseChars = (plainText.match(/[\u4e00-\u9fa5]/g) || []).length;
  // 英文单词数
  const englishWords = (plainText.match(/[a-zA-Z]+/g) || []).length;
  const wordCount = chineseChars + englishWords;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>微信公众号预览</title>
  <style>
    * { box-sizing: border-box; }
    body {
      max-width: 700px;
      margin: 0 auto;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #f5f5f5;
    }
    .stats {
      background: #1d4ed8;
      color: white;
      padding: 12px 20px;
      border-radius: 8px 8px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
    }
    .stats-item {
      display: flex;
      gap: 20px;
    }
    .stats span {
      opacity: 0.9;
    }
    .stats strong {
      font-size: 18px;
      margin-left: 4px;
    }
    .section {
      background: white;
      margin-bottom: 16px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .section:first-of-type {
      border-radius: 0 0 8px 8px;
      margin-top: 0;
    }
    .section-header {
      background: #f8fafc;
      padding: 10px 16px;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .section-title {
      font-size: 13px;
      color: #64748b;
      font-weight: 500;
    }
    .copy-btn {
      background: #1d4ed8;
      color: white;
      border: none;
      padding: 6px 14px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      transition: background 0.2s;
    }
    .copy-btn:hover {
      background: #1e40af;
    }
    .copy-btn.copied {
      background: #16a34a;
    }
    .section-content {
      padding: 20px;
    }
    .title-content h1 {
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="stats">
    <div class="stats-item">
      <span>字数<strong>${wordCount}</strong></span>
      <span>字符<strong>${charCount}</strong></span>
      <span>不含空格<strong>${charCountNoSpace}</strong></span>
    </div>
    <span style="opacity:0.7">微信公众号排版预览</span>
  </div>

  <div class="section">
    <div class="section-header">
      <span class="section-title">全文</span>
      <button class="copy-btn" onclick="copyContent('full-content', this)" style="background:#059669;">复制全文</button>
    </div>
    <div class="section-content" id="full-content">
${title}
${bodyContent}
    </div>
  </div>

  <div class="section">
    <div class="section-header">
      <span class="section-title">标题</span>
      <button class="copy-btn" onclick="copyContent('title-content', this)">复制标题</button>
    </div>
    <div class="section-content title-content" id="title-content">
${title}
    </div>
  </div>

  <div class="section">
    <div class="section-header">
      <span class="section-title">正文内容</span>
      <button class="copy-btn" onclick="copyContent('body-content', this)">复制正文</button>
    </div>
    <div class="section-content" id="body-content">
${bodyContent}
    </div>
  </div>

  <script>
    function copyContent(id, btn) {
      const element = document.getElementById(id);
      const range = document.createRange();
      range.selectNodeContents(element);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);

      try {
        document.execCommand('copy');
        btn.textContent = '已复制!';
        btn.classList.add('copied');
        setTimeout(() => {
          const btnTexts = {'title-content': '复制标题', 'body-content': '复制正文', 'full-content': '复制全文'};
          btn.textContent = btnTexts[id] || '复制';
          btn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        alert('复制失败，请手动选择复制');
      }

      selection.removeAllRanges();
    }
  </script>
</body>
</html>`;
}

/**
 * 格式化 Markdown（清理并优化格式）
 */
function formatMarkdown(markdown) {
  let result = markdown;

  // 1. 统一换行符
  result = result.replace(/\r\n/g, '\n');

  // 2. 确保标题前后有空行
  result = result.replace(/([^\n])\n(#{1,6} )/g, '$1\n\n$2');
  result = result.replace(/(#{1,6} .+)\n([^\n#])/g, '$1\n\n$2');

  // 3. 确保段落之间有空行（连续的非空行之间）
  const lines = result.split('\n');
  const formatted = [];
  let prevLineEmpty = true;
  let prevLineIsListOrHeading = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    const isEmpty = trimmed === '';
    const isHeading = /^#{1,6} /.test(trimmed);
    const isList = /^[-*+] |^\d+\. /.test(trimmed);
    const isBlockquote = /^> /.test(trimmed);
    const isCodeBlock = /^```/.test(trimmed);

    if (isEmpty) {
      if (!prevLineEmpty) {
        formatted.push('');
      }
      prevLineEmpty = true;
      prevLineIsListOrHeading = false;
    } else {
      // 在标题前添加空行
      if (isHeading && !prevLineEmpty) {
        formatted.push('');
      }
      formatted.push(line);
      prevLineEmpty = false;
      prevLineIsListOrHeading = isHeading || isList;
    }
  }

  // 4. 移除开头和结尾的多余空行
  result = formatted.join('\n').trim();

  // 5. 确保文件以换行符结尾
  result += '\n';

  return result;
}

// 主程序
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('用法: node format-wechat.js <输入文件.md> [选项]');
    console.log('');
    console.log('选项:');
    console.log('  --preview    生成完整HTML预览文件（可在浏览器打开）');
    console.log('  --html       仅输出HTML格式');
    console.log('  --md         仅输出格式化的MD文件');
    console.log('  （默认同时输出 HTML 和 MD 两种格式）');
    console.log('');
    console.log('示例:');
    console.log('  node format-wechat.js article.md');
    console.log('  node format-wechat.js article.md --preview');
    console.log('  node format-wechat.js article.md --html');
    process.exit(1);
  }

  const inputFile = args[0];
  const isPreview = args.includes('--preview');
  const htmlOnly = args.includes('--html');
  const mdOnly = args.includes('--md');

  // 读取输入文件
  let markdown;
  try {
    markdown = fs.readFileSync(inputFile, 'utf-8');
  } catch (err) {
    console.error(`错误: 无法读取文件 ${inputFile}`);
    process.exit(1);
  }

  const baseName = path.basename(inputFile, path.extname(inputFile));
  const dirName = path.dirname(inputFile);

  // 输出 HTML
  if (!mdOnly) {
    const htmlContent = convertMarkdownToWechat(markdown);
    const finalHtml = isPreview ? wrapFullHtml(htmlContent, markdown) : htmlContent;
    const htmlFile = path.join(dirName, `${baseName}_wechat.html`);
    try {
      fs.writeFileSync(htmlFile, finalHtml, 'utf-8');
      console.log(`✅ HTML 输出: ${htmlFile}`);
    } catch (err) {
      console.error(`❌ 错误: 无法写入文件 ${htmlFile}`);
      console.error(`   原因: ${err.message}`);
      process.exit(1);
    }
  }

  // 输出格式化的 MD
  if (!htmlOnly) {
    const formattedMd = formatMarkdown(markdown);
    const mdFile = path.join(dirName, `${baseName}_formatted.md`);
    try {
      fs.writeFileSync(mdFile, formattedMd, 'utf-8');
      console.log(`✅ MD 输出: ${mdFile}`);
    } catch (err) {
      console.error(`❌ 错误: 无法写入文件 ${mdFile}`);
      console.error(`   原因: ${err.message}`);
      process.exit(1);
    }
  }

  console.log('');
  if (!mdOnly) {
    console.log('📋 HTML文件: 复制内容到微信公众号编辑器');
  }
  if (!htmlOnly) {
    console.log('📝 MD文件: 格式化后的Markdown，可用于其他平台');
  }
}

// 导出函数供其他模块使用
module.exports = { convertMarkdownToWechat, wrapFullHtml, CONFIG };

// 如果直接运行
if (require.main === module) {
  main();
}
