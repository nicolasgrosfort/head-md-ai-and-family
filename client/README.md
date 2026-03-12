# Tales Through Things (client)

## Installation

### Install certificates (https)

```bash
# Install mkcert
sudo apt install mkcert

# Install the local certificate (inside `client` folder)
mkcert -install
mkcert localhost 127.0.0.1 ::1


