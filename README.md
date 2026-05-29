# GTA Vice City: Browser Port

Self-hostable GTA Vice City that runs in the browser. Two pieces: a backend that streams the game, and a standalone landing page that wraps it.

## Quick start (pull the prebuilt image)

```bash
docker run -d \
  --name gtavc-engine \
  -p 8443:8443 \
  --restart unless-stopped \
  ghcr.io/developeranku/gta-vc-browser-port-engine:latest
```

Open `http://localhost:8443` and play.

The image has `PACKED=https://folder.morgen.qzz.io/revcdos.bin` baked in, so first start downloads the asset archive once and serves from it.

### Update later

```bash
docker pull ghcr.io/developeranku/gta-vc-browser-port-engine:latest
docker rm -f gtavc-engine
# re-run the `docker run` command above
```

## Quick start (clone and compose)

```bash
git clone https://github.com/developeranku/gta-vc-browser-port.git
cd gta-vc-browser-port/game-engine
docker compose up -d
```

Compose pulls the same `:latest` image. Add `--build` only if you want to rebuild locally.

## Repo layout

```
gta-vc-browser-port/
├── game-engine/        Backend. FastAPI + WASM runtime. Builds the published image.
│   ├── docker/         Dockerfile
│   ├── docker-compose.yml
│   ├── server.py       Entrypoint
│   └── README.md       Backend docs, all server flags, env vars
│
├── web-launcher/       Standalone landing page wrapping the backend in an iframe.
│   ├── src/            Astro sources
│   └── README.md       Launcher docs, dev setup, sandbox details
│
└── .github/workflows/
    └── build-engine.yml   Builds and pushes the engine image to GHCR on push to main
```

## Components

| Component | Path | Docs |
|---|---|---|
| Backend engine | [`game-engine/`](./game-engine) | [game-engine/README.md](./game-engine/README.md) |
| Web launcher | [`web-launcher/`](./web-launcher) | [web-launcher/README.md](./web-launcher/README.md) |

## Configuration

Default image runs with sane defaults. To override (custom port, auth, local assets, packed/unpacked modes, language), use the compose flow and read [game-engine/README.md](./game-engine/README.md) for the full env var and CLI flag tables.

## License and credit

Backend is MIT, originally by [DOS Zone](https://dos.zone) and [@Lolendor](https://github.com/Lolendor). See [game-engine/LICENSE](./game-engine/LICENSE). Not affiliated with Rockstar Games.
