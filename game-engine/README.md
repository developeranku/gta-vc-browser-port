# game-engine

Backend for [gta-vc-browser-port](https://github.com/developeranku/gta-vc-browser-port). FastAPI server that streams the GTA: Vice City WebAssembly build to the browser and handles saves, auth, and asset packing.

The published image at `ghcr.io/developeranku/gta-vc-browser-port-engine:latest` has the asset URL `PACKED=https://folder.morgen.qzz.io/revcdos.bin` baked in.

## Run with Docker (pull the image)

```bash
docker run -d \
  --name gtavc-engine \
  -p 8443:8443 \
  --restart unless-stopped \
  ghcr.io/developeranku/gta-vc-browser-port-engine:latest
```

Open `http://localhost:8443`. First start downloads the asset archive once and serves from it.

To update later:

```bash
docker pull ghcr.io/developeranku/gta-vc-browser-port-engine:latest
docker rm -f gtavc-engine
# re-run the docker run command above
```

## Run with Docker Compose

```bash
docker compose up -d
```

Compose pulls the same `:latest` image by default. Override settings with env vars before the command:

```bash
IN_PORT=3000 AUTH_LOGIN=admin AUTH_PASSWORD=secret CUSTOM_SAVES=1 docker compose up -d
```

To rebuild locally instead of pulling:

```bash
docker compose up -d --build
```

## Run with Python (no Docker)

```bash
pip install -r requirements.txt
python server.py --packed https://folder.morgen.qzz.io/revcdos.bin
```

Server listens on `http://localhost:8443`.

## Compose env vars

| Variable | Default | Description |
|---|---|---|
| `OUT_HOST` | `0.0.0.0` | External bind host |
| `OUT_PORT` | `8443` | External port |
| `IN_PORT` | `8443` | Internal container port |
| `AUTH_LOGIN` | none | HTTP Basic Auth username |
| `AUTH_PASSWORD` | none | HTTP Basic Auth password |
| `CUSTOM_SAVES` | off | `1` to enable local saves |
| `VCSKY_LOCAL` | off | `1` or path to serve vcsky locally |
| `VCBR_LOCAL` | off | `1` or path to serve vcbr locally |
| `VCSKY_URL` | DOS Zone CDN | Custom vcsky proxy URL |
| `VCBR_URL` | DOS Zone CDN | Custom vcbr proxy URL |
| `VCSKY_CACHE` | off | `1` to cache vcsky while proxying |
| `VCBR_CACHE` | off | `1` to cache vcbr while proxying |
| `PACKED` | baked URL | Packed archive path or URL |
| `UNPACKED` | off | Unpack archive then serve from disk |
| `PACK` | off | Pack a folder into archive at startup |

HTTP Basic Auth is only on when both `AUTH_LOGIN` and `AUTH_PASSWORD` are set.

## Server flags (Python mode)

| Flag | Description |
|---|---|
| `--port` | Server port (default `8443`) |
| `--packed <path-or-url>` | Serve from packed `.bin` archive |
| `--unpacked <path-or-url>` | Unpack to `unpacked/{md5}/` and serve |
| `--pack <folder-or-hash>` | Pack folder, then serve from result |
| `--vcsky_local [path]` | Serve vcsky from disk |
| `--vcbr_local [path]` | Serve vcbr from disk |
| `--vcsky_url <url>` | Custom vcsky proxy URL |
| `--vcbr_url <url>` | Custom vcbr proxy URL |
| `--vcsky_cache` | Cache proxied vcsky locally |
| `--vcbr_cache` | Cache proxied vcbr locally |
| `--custom_saves` | Enable local save files |
| `--login` / `--password` | Enable HTTP Basic Auth |

## URL params (in-game)

| Param | Values | Description |
|---|---|---|
| `lang` | `en`, `ru` | Game language |
| `cheats` | `1` | Enable cheat menu (F3) |
| `fullscreen` | `0` | Disable auto-fullscreen |
| `max_fps` | `1-240` | Limit frame rate |
| `configurable` | `1` | Show config UI before play |
| `request_original_game` | `1` | Prompt for original game files |

Examples: `http://localhost:8443/?lang=ru`, `http://localhost:8443/?cheats=1&max_fps=60`.

## Local saves

When `--custom_saves` (or `CUSTOM_SAVES=1`) is on, enter any 5-character identifier in the "js-dos key" input on the start page. Saves land in `saves/<key>_vcsky.saves` on the server.

## License and credit

MIT. Originally built by the DOS Zone team and deobfuscated by [@Lolendor](https://github.com/Lolendor). See [LICENSE](./LICENSE). Not affiliated with Rockstar Games.
