import subprocess
import uuid
from pathlib import Path

from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

INPUT_DIR = Path("/data/input")
OUTPUT_DIR = Path("/data/output")


@app.post("/process")
async def process(
    file: UploadFile = File(...),
    ratio: float = Form(1.0),
    rx: float = Form(0.0),
    ry: float = Form(0.0),
    rz: float = Form(0.0),
):
    job_id = uuid.uuid4().hex
    input_path = INPUT_DIR / f"{job_id}.jpg"
    raw_ply   = OUTPUT_DIR / f"{job_id}.ply"
    tmp1      = OUTPUT_DIR / f"{job_id}_tmp1.ply"
    tmp2      = OUTPUT_DIR / f"{job_id}_tmp2.ply"
    tmp3      = OUTPUT_DIR / f"{job_id}_tmp3.ply"

    try:
        # Sauvegarder l'image
        input_path.write_bytes(await file.read())

        # 1. SHARP predict
        r = subprocess.run(
            ["sharp", "predict", "-i", str(input_path), "-o", str(OUTPUT_DIR)],
            capture_output=True, text=True,
        )
        if r.returncode != 0:
            raise HTTPException(500, f"SHARP error: {r.stderr}")

        # 2. Conversion couleurs
        r = subprocess.run(
            ["python", "/app/convert.py", str(raw_ply), str(tmp1)],
            capture_output=True, text=True,
        )
        if r.returncode != 0:
            raise HTTPException(500, f"Convert error: {r.stderr}")

        # 3. Décimation
        r = subprocess.run(
            ["python", "/app/decimate.py", str(tmp1), str(tmp2), "--ratio", str(ratio)],
            capture_output=True, text=True,
        )
        if r.returncode != 0:
            raise HTTPException(500, f"Decimate error: {r.stderr}")

        # 4. Rotation
        r = subprocess.run(
            ["python", "/app/rotate.py", str(tmp2), "-o", str(tmp3),
             "-x", str(rx), "-y", str(ry), "-z", str(rz)],
            capture_output=True, text=True,
        )
        if r.returncode != 0:
            raise HTTPException(500, f"Rotate error: {r.stderr}")

        return FileResponse(
            path=tmp3,
            media_type="application/octet-stream",
            filename="output.ply",
            background=None,
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, str(e))
    finally:
        input_path.unlink(missing_ok=True)
        raw_ply.unlink(missing_ok=True)
        tmp1.unlink(missing_ok=True)
        tmp2.unlink(missing_ok=True)
        # tmp3 nettoyé après envoi par FileResponse


@app.get("/health")
def health():
    return {"status": "ok"}