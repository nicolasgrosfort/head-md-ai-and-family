# Apple ML Sharp API

## Requirements

1. Docker
2. Docker Compose

## Structure

```bash
2026-06-22-ml-sharp-api/
├── Dockerfile
├── docker-compose.yml
├── Makefile
├── input/      ← pictures
├── output/     ← generated .ply
└── models/     ← cache
```

## Starting

```bash
# Build image (first time only)
make build

# Convert and image to .ply
make predict IMG=yiayia.jpg RX=180 RATIO=1.0
```

