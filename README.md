# [Momentum](https://app-momentum-with-widgets.netlify.app/)

An analogue of the app of the same name in the Chrome Web Store.

## Features

- Clock
- Custom music player
- Weather
- To do list
- Three sources for background
- Internationalization
- Random quote
- Changing visibility for blocks

## Tech Stack

- Typescript
- Vite
- Scss
- Eslint
- Prettier
- Boxicons
- Normalize.css
- i18next
- Netlify / GitHub Pages

## How to use

1. Clone the repo

```bash
git clone https://github.com/SavitskayaKseniya22/momentum.git
```

2. Install dependencies

```bash
npm install
```

3. Copy `.env.example` to `.env.local` and fill in the API keys for Unsplash,
   Flickr, and OpenWeather. Env files containing keys are ignored by Git.
   Configure the same `VITE_*` variables in your hosting provider before building.
   Restart the dev server after changing an env file.

Vite embeds `VITE_*` values in the browser bundle. These variables keep keys out
of source files; a server-side proxy is required to keep them secret from visitors.

4. Start the dev server

```bash
npm run dev
```

## Netlify deployment

The site is served from the domain root (`base: "/"`). Netlify build settings
are defined in `netlify.toml`: build with `npm run build` and publish `dist`.
Set `VITE_UNSPLASH_API_KEY`, `VITE_FLICKR_API_KEY`, and `VITE_OPENWEATHER_API_KEY`
in the Netlify environment variables before building; `.env.local` is not in Git.
Trigger a new deployment after changing these variables.

For GitHub Pages hosting under `/momentum/`, build separately with
`npm run build -- --base=/momentum/`.

### screenshots:

![изображение](https://github.com/SavitskayaKseniya22/momentum/assets/77901301/7101493d-12ba-4f04-9d45-1923045c7351)
![изображение](https://github.com/SavitskayaKseniya22/momentum/assets/77901301/5f2eb418-8ebe-46a6-8496-760f7b1fe5cd)
