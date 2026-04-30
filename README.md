# Geode — AI Chat by YG

A full-stack, premium AI chat application with a cinematic dark aesthetic, advanced animations, and modern AI assistant features.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Lucide React
- **Backend**: Node.js, Express, node-fetch
- **AI API**: OpenRouter (using `openrouter/auto` model)

## Features

- **Cinematic Dark Theme**: Deep charcoal/slate blacks, muted grays, and aged off-whites with liquid glass morphism.
- **Advanced Animations**: Stagger reveals, spring physics sidebars, magnification dock, and cinematic loading states.
- **AI Chat Features**: Multi-turn conversation, streaming responses, markdown rendering, and code artifacts.
- **Task Tracking**: Integrated `PlanView` for visualizing AI's complex reasoning steps.
- **Productivity Tools**: Image and file upload support, custom system prompt editor, and keyboard shortcuts.
- **Persistence**: Full conversation history and settings stored in `localStorage`.

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher recommended)
- An OpenRouter API Key

### Installation

1. Clone the repository and navigate to the project directory.
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Create a `.env` file in the root directory and add your API key:
   ```env
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   PORT=3001
   ```

### Running the Application

1. Start the backend server:
   ```bash
   npm run server
   ```
2. In a separate terminal, start the frontend development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to `http://localhost:5173`.

## Keyboard Shortcuts

- `Enter`: Send message
- `Shift + Enter`: New line
- `Ctrl + /`: Focus input box

## Development

- `npm run build`: Build the application for production.
- `npm run preview`: Preview the production build locally.
