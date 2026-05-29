# VICE CITY // Browser Port Launcher

A small Astro frontend that wraps the [reVCDOS](../reVCDOS) browser port of GTA: Vice City inside a sandboxed iframe, with a Vice City themed landing page.

```
revc-launcher (Astro, :4321)  ──iframe──►  reVCDOS (Docker, :8000)
                  ▲
                  └── you open http://localhost:4321 in the browser
```

The wrapper never proxies game traffic. The browser fetches the wrapper from the Astro dev server and loads the iframe directly from the Docker backend, cross-origin, sandboxed.

## Quick start

### 1. Start the reVCDOS backend

From the `reVCDOS` directory (sibling of this one):

```bash
cd ../reVCDOS
docker compose up -d --build
```

Wait until `http://localhost:8000` responds (the first build downloads the asset archive, can take a minute).

### 2. Install + run the wrapper

```bash
cd revc-launcher
pnpm install     # or npm install / yarn / bun install
pnpm dev         # or npm run dev
```

Open http://localhost:4321 and click **PRESS PLAY**.

## Configuration

The iframe target is set by `PUBLIC_GAME_URL`. Default: `http://localhost:8000`.

```bash
cp .env.example .env
# edit PUBLIC_GAME_URL if your backend runs elsewhere
```

Examples:

```bash
PUBLIC_GAME_URL=http://localhost:3000   # custom port
PUBLIC_GAME_URL=http://192.168.1.50:8000  # backend on LAN
```

## How the sandbox works

The game runs in an `<iframe>` with:

- `sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms allow-popups-to-escape-sandbox allow-modals"`
- `allow="fullscreen; gamepad; autoplay; clipboard-read; clipboard-write"`
- `referrerpolicy="no-referrer"`

What this gives you:

| Capability | Why |
|---|---|
| `allow-scripts` | Required, the game IS JavaScript + WASM |
| `allow-same-origin` | The iframe needs its own origin to use IndexedDB for saves. Note the iframe is already on a different origin from the parent, so this does NOT grant access to the parent. |
| `allow-pointer-lock` | Mouse capture for camera control |
| `allow-forms` | The "js-dos key" save identifier input |
| `allow-popups-to-escape-sandbox` | External links in cheat menu / about screens |
| `allow-modals` | `alert()` and `confirm()` dialogs the game uses |
| `fullscreen` | Game's own fullscreen button + wrapper's FULLSCREEN button |
| `gamepad` | Controller support |
| `autoplay` | Game audio without a user gesture inside the iframe |

The sandbox blocks top-level navigation, so the game cannot navigate the parent away.

## What's on the page

- **Landing** with hot pink Monoton title, animated sunset, perspective grid horizon, palm silhouettes, VHS scanlines and grain.
- **Backend status** indicator in the top-left HUD. Green = reachable, red = down. Pings `PUBLIC_GAME_URL` every 8 seconds while the landing is visible.
- **PRESS PLAY** button mounts the iframe into a full-viewport overlay. WASM only loads after the click.
- **FULLSCREEN** button in the overlay bar requests true browser fullscreen.
- **EXIT** button or `Esc` unmounts the iframe (frees the WASM context) and returns to the landing.

If the backend is offline when you click PLAY, you'll see an inline error card with the exact command to start it.

## Project layout

```
revc-launcher/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── .env.example
├── public/
│   └── favicon.svg
└── src/
    ├── env.d.ts
    ├── pages/
    │   └── index.astro    # landing + iframe overlay + styles
    └── scripts/
        └── launcher.ts    # backend ping, mount/unmount, keybinds
```

## Build for static hosting

```bash
pnpm build      # outputs ./dist
pnpm preview    # serves the built site
```

The output is static HTML/CSS/JS. You can serve `dist/` from any static host. The iframe still points at `PUBLIC_GAME_URL`, which is baked into the JS at build time, so set it before building if you deploy.

## Notes

- Cross-origin iframe storage (IndexedDB, cookies) works in Chrome and Firefox on `localhost` by default. Safari's ITP can block third-party storage even on localhost. If saves don't persist in Safari, run the wrapper and backend on the same hostname (e.g. both behind nginx).
- The reVCDOS port itself is MIT licensed by DOS Zone. This launcher only wraps it. Not affiliated with Rockstar Games.
