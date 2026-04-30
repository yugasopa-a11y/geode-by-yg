# Geode — AI Chat by YG

A full-stack, premium AI chat application with a cinematic dark aesthetic, advanced animations, and modern AI assistant features.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Lucide React
- **AI API**: OpenRouter (direct frontend integration)

## Features

- **Cinematic Dark Theme**: Deep charcoal/slate blacks, muted grays, and aged off-whites with liquid glass morphism.
- **Advanced Animations**: Stagger reveals, spring physics sidebars, magnification dock, and cinematic loading states.
- **AI Chat Features**: Multi-turn conversation, streaming responses, markdown rendering, and code artifacts.
- **Task Tracking**: Integrated `PlanView` for visualizing AI's complex reasoning steps.
- **Productivity Tools**: Image and file upload support, custom system prompt editor, and keyboard shortcuts.
- **Persistence**: Full conversation history and settings stored in `localStorage`.

## Deployment to GitHub Pages

This application is configured for easy deployment to GitHub Pages.

1. **Build the project**:
   ```bash
   npm run build
   ```
2. **Deploy the `dist` folder**:
   - You can use the `gh-pages` package:
     ```bash
     npm install -D gh-pages
     npx gh-pages -d dist
     ```
   - Or manually upload the contents of the `dist` folder to your GitHub repository's `gh-pages` branch.

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher recommended)

### Installation

1. Clone the repository and navigate to the project directory.
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

### Running the Application Locally

1. Start the frontend development server:
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to `http://localhost:5173`.

## Keyboard Shortcuts

- `Enter`: Send message
- `Shift + Enter`: New line
- `Ctrl + /`: Focus input box

## Development

- `npm run build`: Build the application for production.
- `npm run preview`: Preview the production build locally.
