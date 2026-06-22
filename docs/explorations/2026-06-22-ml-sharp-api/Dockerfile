FROM python:3.13-slim

# System dependencies required by PyTorch and gsplat
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libgomp1 \
    libglib2.0-0 \
    libsm6 \
    libxrender1 \
    libxext6 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN git clone https://github.com/apple/ml-sharp.git .

# Install the dependencies
# Install Torch CPU-only first to avoid using CUDA (~5GB)
RUN pip install --no-cache-dir \
    torch torchvision --index-url https://download.pytorch.org/whl/cpu
RUN pip install --no-cache-dir -r requirements.txt

# Install scripts dependencies
RUN pip install --no-cache-dir plyfile fastapi uvicorn[standard] python-multipart

# Copy scripts
COPY scripts/convert.py /app/convert.py
COPY scripts/decimate.py /app/decimate.py
COPY scripts/rotate.py /app/rotate.py
COPY api/api.py /app/api.py

# Directories for data
RUN mkdir -p /data/input /data/output

# The checkpoint is automatically downloaded to ~/.cache
# It can also be pre-downloaded to the /models volume.
ENV TORCH_HOME=/models

ENTRYPOINT ["sharp"]
CMD ["--help"]