# Geode — AI Chat by YG (V2 Intelligence Overhaul)

A premium, agentic AI chat application with a cinematic dark aesthetic, reactive planning, and advanced tool integration.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Lucide React
- **AI API**: OpenRouter (direct frontend integration for static hosting)
- **Visualization**: KaTeX (Math), Mermaid.js (Diagrams), Monaco Editor (Code)

## Architecture & Security Note

Geode is designed as a **Static Web Application** optimized for deployment on services like **GitHub Pages**.

- **Frontend-Only Mode**: By default, Geode calls the OpenRouter API directly using the `VITE_OPENROUTER_API_KEY` from your environment. This is ideal for quick deployment on static hosts.
- **Backend Proxy Mode**: For production environments where you wish to keep your API key hidden from the client, you can deploy the included `server.js` (Express) to a Node.js-capable host (like Vercel, Railway, or Heroku) and update the `src/api.ts` to point to your proxy endpoint.

## Deployment to GitHub Pages

This application is ready for GitHub Actions deployment.

1. **Configure Environment Secrets**:
   - In your GitHub Repository, go to `Settings > Secrets and variables > Actions`.
   - Add a new repository secret named `VITE_OPENROUTER_API_KEY` with your OpenRouter key.
2. **Push to GitHub**:
   - The included `.github/workflows/deploy.yml` will automatically build and deploy the app to GitHub Pages whenever you push to the `main` branch.

## Features

- **Agentic Planning**: Real-time task breakdown and reactive status updates as the AI thinks.
- **Tool System**: Skills Registry including Web Search, Vision, and Data Analysis capabilities.
- **Cinematic UI**: Liquid glass morphism, grain film overlays, and golden particle systems.
- **Visual Intelligence**: Support for LaTeX math formulas and interactive Mermaid diagrams in an Artifacts Panel.
- **Voice Intelligence**: Integrated Web Speech API for hands-free dictation.

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Create a `.env` file with:
   ```env
   VITE_OPENROUTER_API_KEY=your_key_here
   ```

### Running Locally

1. Start the development server:
   ```bash
   npm run dev
   ```
2. (Optional) Start the proxy server:
   ```bash
   npm run server
   ```

## Keyboard Shortcuts

- `Enter`: Send message
- `Shift + Enter`: New line
- `⌘K`: Open Command Palette
- `⌘N`: New Chat
