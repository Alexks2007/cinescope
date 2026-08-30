# CineScope

**CineScope** is a modern, responsive movie discovery web application built with React, TypeScript, and Vite. It provides a dark cinematic interface for discovering trending titles, searching movies in real time, applying genre/year/sort filters, inspecting detailed movie information, and persisting favorite films locally.

---

## Features

- **Movie Discovery**: Browse popular and trending feature films powered by The Movie Database (TMDB) API.
- **Real-Time Search**: Search movies dynamically with input debouncing and in-flight request cancellation (`AbortController`).
- **Discovery Filters**: Filter titles by genre and release year, and sort by popularity, highest rating, or newest releases.
- **Movie Details**: View comprehensive movie details including backdrop artwork, poster, rating, vote count, formatted runtime, genre pills, tagline, and full overview.
- **Favorites Watchlist**: Save and remove favorite movies with persistent storage via `localStorage`. Synchronized in real-time across all application views.
- **Responsive & Accessible**: Optimized for mobile, tablet, and desktop viewports with dark cinematic styling, zero horizontal overflow, and visible keyboard focus states.
- **Resilient UI States**: Built-in loading skeletons, error messages with retry actions, and empty states.

---

## Tech Stack

- **Core**: React 19, TypeScript, Vite
- **Routing**: React Router (`react-router-dom` v7)
- **Styling**: Vanilla CSS (CSS Variables, Flexbox, Grid)
- **Icons**: Lucide React
- **Data Source**: TMDB API v3

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or pnpm package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Alexks2007/cinescope.git
   cd cinescope
   ```

2. Install project dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory (you can copy `.env.example`):
   ```bash
   cp .env.example .env
   ```

   Add your TMDB API v3 Read Access Token:
   ```env
   VITE_TMDB_ACCESS_TOKEN=your_tmdb_read_access_token_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

---

## Available Scripts

- `npm run dev` - Starts local Vite development server.
- `npm run build` - Compiles TypeScript and builds production bundle in `dist/`.
- `npm run lint` - Runs ESLint code quality checks.
- `npm run preview` - Locally previews the production build.

---

## Project Structure

```
src/
├── components/         # Reusable UI components (Navbar, MovieCard, MovieGrid, SearchBar, FilterBar, LoadingSkeleton, ErrorMessage)
├── context/            # Shared state contexts (FavoritesContext, FavoritesProvider)
├── hooks/              # Custom React hooks (useFavorites)
├── pages/              # Page view routes (Discover, Favorites, MovieDetails)
├── services/           # External API & storage services (movieApi.ts, favorites.ts)
├── types/              # TypeScript definitions and data interfaces (movie.ts)
├── App.tsx             # Main application layout shell and route definitions
├── index.css           # Global dark cinematic styling system and CSS variables
└── main.tsx            # Application entry point
```

---

## Notes & Data Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB. Movie metadata and images are provided courtesy of [The Movie Database](https://www.themoviedb.org/).
