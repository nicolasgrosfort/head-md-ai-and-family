# Client

## Installation

### Setup local certificates (https)

Certificates are used to be able to record sound from the browser.

```bash
# Install mkcert
sudo apt install mkcert

# Install the local certificate (inside `client` folder)
cd client
mkcert -install
mkcert localhost 127.0.0.1 ::1
```

