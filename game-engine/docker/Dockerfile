FROM caddy:2-builder AS caddy-builder
RUN xcaddy build --with github.com/caddy-dns/cloudflare

FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

COPY --from=caddy-builder /usr/bin/caddy /usr/local/bin/caddy
COPY docker/Caddyfile /etc/caddy/Caddyfile

ENV PYTHONUNBUFFERED=1
EXPOSE 8000

CMD ["python", "server.py", "--port", "8000", "--packed", "https://folder.morgen.qzz.io/revcdos.bin"]
