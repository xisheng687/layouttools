# Changelog

All notable changes to WePub will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-01

### Added
- Initial release of WePub
- 10 curated color schemes with high differentiation
  - Business Navy (商务深蓝)
  - Warm Orange (热情红橙)
  - Natural Forest (自然森林)
  - Elegant Violet (优雅紫罗兰)
  - Tech Cyan (科技青蓝)
  - Chinese Red (中国红)
  - Morandi Gray (莫兰迪灰)
  - Japanese Fresh (日系清新)
  - Neon Night (暗夜霓虹)
  - Vintage Coffee (复古咖啡)
- Real-time Markdown to HTML conversion
- Live preview with WYSIWYG editing
- One-click copy to clipboard
- Custom typography settings (font size, line height, paragraph spacing)
- Character replacement rules
- List style customization (ordered and unordered)
- Responsive design for various devices
- CLI tool for command-line conversion
- Drag and drop file support

### Security
- XSS protection for link URLs (blocks javascript:, data:, vbscript: protocols)

### Accessibility
- ARIA labels for interactive elements
- Keyboard navigation support for color presets
- Screen reader compatible toast notifications
- Focus indicators for keyboard users

### Browser Support
- CSS :has() selector fallback for Firefox compatibility
- Mobile sidebar with overlay for touch devices
