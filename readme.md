# AI and Family

A workshop to explore creations of devices, installations, or experiences that invite people to explore AI agents within family contexts.

## Installation

### Setup node version

```bash
sudo npm install -g n
sudo n 24.14.0
```

### Install certificates (https)

```bash
# Install mkcert
sudo apt install mkcert

# Install the local certificate (inside `client` folder)
mkcert -install
mkcert localhost 127.0.0.1 ::1

```