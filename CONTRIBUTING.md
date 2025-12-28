# Contributing to WePub

Thank you for your interest in contributing to WePub! We welcome contributions from everyone.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:

- A clear, descriptive title
- Steps to reproduce the problem
- Expected behavior vs actual behavior
- Screenshots if applicable
- Your environment (browser, OS, etc.)

### Suggesting Features

We love new ideas! Please open an issue with:

- A clear description of the feature
- Why this feature would be useful
- Any implementation suggestions

### Pull Requests

1. **Fork the repository** and create your branch from `main`

2. **Make your changes**
   - Write clear, readable code
   - Follow the existing code style
   - Add comments where necessary

3. **Test your changes**
   - Open `index.html` in your browser
   - Test various Markdown inputs and color schemes
   - Test on different browsers if possible

4. **Commit your changes**
   - Use clear and meaningful commit messages
   - Reference any related issues

5. **Push to your fork** and submit a pull request

### Code Style

- Use consistent indentation (2 spaces)
- Use meaningful variable and function names
- Keep functions small and focused
- Comment complex logic

### Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Keep the first line under 72 characters
- Reference issues and pull requests when relevant

## Development Setup

This is a pure static project with no build dependencies.

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/layouttools.git

# Navigate to the project
cd layouttools

# Open directly in browser
open index.html

# Or use a local server (optional)
python3 -m http.server 8080
# Then visit http://localhost:8080
```

### CLI Tool

The project includes a Node.js CLI tool that can be run directly:

```bash
# Basic conversion
node format-wechat.js your-article.md

# With preview
node format-wechat.js your-article.md --preview
```

## Questions?

Feel free to open an issue with your question. We're here to help!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
