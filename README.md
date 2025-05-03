# StreamDeck Plugin Manager

A desktop application for managing StreamDeck plugins with an intuitive interface built on Electron.

## Features

- Browse and search plugin marketplace
- Install/uninstall plugins with one click
- Manage plugin settings and configuration
- Automatic update checking
- Plugin categorization and filtering

## Installation

1. Clone the repository
```bash
git clone https://github.com/0xSterling/StreamDeck.git
cd StreamDeck
```

2. Install dependencies
```bash
npm install
```

3. Run the application
```bash
npm start
```

## Development

### Prerequisites
- Node.js 16+
- npm or yarn

### Scripts
- `npm start` - Run the application
- `npm run dev` - Run in development mode with DevTools
- `npm run build` - Build for production

## Project Structure

```
src/
├── main.js          # Electron main process
├── index.html       # Main window HTML
├── styles.css       # Application styles
├── renderer.js      # Renderer process logic
└── plugins.js       # Plugin management system
```

## License

MIT