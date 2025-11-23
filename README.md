# ASCII QR Forge

A retro-futuristic tool to generate scannable ASCII art QR codes.

## Features

- **Block Mode**: Uses Unicode block elements (█, ▀, ▄) for high-fidelity scanning.
- **Text Mode**: Uses standard ASCII characters (e.g., #, @) for a classic look.
- **Customization**: Adjust error correction levels, colors, and invert logic.
- **Privacy**: runs entirely in your browser. No data is sent to any server.

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start local development server:
   ```bash
   npm run dev
   ```

## Deployment to GitHub Pages

This project is configured to automatically deploy to GitHub Pages using the `gh-pages` branch.

1. **Configure Git**:
   Ensure your project is initialized as a git repo and connected to GitHub.
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   ```

2. **Deploy**:
   Run the deploy script. This handles building the app and pushing the `dist` folder to the `gh-pages` branch for you.
   ```bash
   npm run deploy
   ```

3. **Activate in GitHub**:
   - Go to your repository **Settings**.
   - Click **Pages** in the sidebar.
   - Under **Build and deployment** > **Branch**, select `gh-pages`.
   - Click **Save**.

## Technologies

- React
- TypeScript
- Vite
- TailwindCSS
- QRCode (node-qrcode)
