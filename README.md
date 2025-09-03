# 🧮 macOS Calculator

A pixel-perfect recreation of the macOS Calculator app built with modern web technologies. Features authentic macOS design elements, smooth animations, and full keyboard support.

[macOS Calculator Demo](./src/assets/calc_demo.gif)

## ✨ Features

- **🎨 Authentic macOS Design**: Complete with traffic light buttons and system fonts
- **⌨️ Full Keyboard Support**: Use your keyboard for seamless calculations
- **🔗 Chain Calculations**: Perform multiple operations in sequence
- **📱 Responsive Display**: Dynamic font sizing for long numbers
- **🎯 Scientific Notation**: Automatic formatting for large numbers
- **🔄 State Management**: Proper calculator logic with operation chaining
- **⚡ Real-time Updates**: Instant visual feedback for all interactions

## 🚀 Live Demo

[View Live Demo](https://ryanstephanusadiyasa.github.io/MacOs-Calculator)

## 🛠️ Technologies Used

- **TypeScript** - Type-safe application logic
- **HTML5** - Semantic markup structure
- **CSS3** - Custom properties, Grid, Flexbox
- **Tailwind CSS** - Utility-first CSS framework
- **SF Pro Display** - Apple's system font
- **Vanilla JavaScript** - No framework dependencies

## 🎮 Usage

### Mouse/Touch Controls
- Click number buttons (0-9) to input digits
- Click operators (+, -, ×, ÷) for mathematical operations
- Click equals (=) to calculate results
- Use AC to clear all, +/- to negate, % for percentage

### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| `0-9` | Number input |
| `+` `-` `*` `/` | Mathematical operators |
| `Enter` or `=` | Calculate result |
| `.` | Decimal point |
| `Escape` or `c` | Clear (AC) |
| `%` | Percentage |

## 🏗️ Project Structure

```
MacOs Calculator/
├── src/
│   ├── calculator.html      # Main HTML structure
│   ├── css/
│   │   ├── input.css       # Source CSS with custom properties
│   │   └── output.css      # Compiled Tailwind CSS
│   └── ts/
│       ├── calculator.ts   # TypeScript source code
│       └── calculator.js   # Compiled JavaScript
├── dist/                   # TypeScript compilation output
├── package.json           # Project dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ryanstephanusadiyasa/MacOs-Calculator.git
   cd MacOs-Calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development**
   ```bash
   npm run dev
   ```
   This runs both TypeScript compilation and Tailwind CSS in watch mode.

4. **Open in browser**
   Open `src/calculator.html` in your browser to see the calculator.

### Build Commands

```bash
# Compile TypeScript
npm run tsc

# Build CSS (production)
npm run build

# Build everything
npm run build:all

# Watch files during development
npm run dev
```

## 🎨 Design Features

### Color Scheme
The calculator uses a carefully crafted color palette with descriptive CSS custom properties:
- `--color-golden-amber` and `--color-harvest-gold` for gradients
- `--color-slate-charcoal` for the calculator body
- `--color-vivid-orange` for operator buttons
- `--color-crimson-red`, `--color-school-bus-yellow`, `--color-lime-green` for traffic lights

### Typography
- **SF Pro Display** - Apple's system font for authenticity
- **Responsive sizing** - Font scales based on number length
- **Proper fallbacks** - System font stack for cross-platform compatibility

### Interactions
- **Smooth transitions** - 0.1s ease transitions for all interactions
- **Button states** - Hover and active states for visual feedback
- **Operator highlighting** - Active operator buttons stay highlighted

## 🧮 Calculator Logic

The calculator implements proper mathematical operation chaining:

1. **State Management**: Tracks current value, previous value, and active operator
2. **Chain Calculations**: Each operator press calculates the previous operation
3. **Display Formatting**: Handles long numbers with scientific notation
4. **Error Prevention**: Division by zero returns 0
5. **Keyboard Integration**: Full keyboard support with proper key mapping

For detailed logic flow documentation, see the comments in `src/ts/calculator.ts`.

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Maintain the existing code style
- Add comments for complex logic
- Test thoroughly across different browsers

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Apple** - For the beautiful macOS Calculator design inspiration
- **SF Pro Display** - Apple's elegant system font
- **Tailwind CSS** - For the utility-first CSS framework

## 📞 Contact

**Your Name** - [@illustriousreed](https://x.com/illustriousreed) - ryan.stephanus@gmail.com

**Project Link**: [https://github.com/ryanstephanusadiyasa/MacOs-Calculator](https://github.com/ryanstephanusadiyasa/MacOs-Calculator)

---

⭐ **Star this repository if you found it helpful!**