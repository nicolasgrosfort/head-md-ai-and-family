.PHONY: build predict help clean start-api start-ollama pull-models

build:
	docker compose build

start-ml-sharp:
	docker compose up api
	
predict:
	$(eval STEM := $(notdir $(basename $(IMG))))
	$(eval RATIO := $(or $(RATIO),1))
	$(eval RX := $(or $(RX),0))
	$(eval RY := $(or $(RY),0))
	$(eval RZ := $(or $(RZ),0))
	@echo "━━━ 1/4 Prédiction SHARP ━━━"
	docker compose run --rm sharp predict -i /data/input/$(IMG) -o /data/output
	@echo "━━━ 2/4 Conversion couleurs ━━━"
	docker compose run --rm --entrypoint python sharp /app/convert.py \
		/data/output/$(STEM).ply /data/output/$(STEM)_tmp1.ply
	@echo "━━━ 3/4 Décimation (ratio=$(RATIO)) ━━━"
	docker compose run --rm --entrypoint python sharp /app/decimate.py \
		/data/output/$(STEM)_tmp1.ply /data/output/$(STEM)_tmp2.ply \
		--ratio $(RATIO)
	@echo "━━━ 4/4 Rotation (X=$(RX)° Y=$(RY)° Z=$(RZ)°) ━━━"
	docker compose run --rm --entrypoint python sharp /app/rotate.py \
		/data/output/$(STEM)_tmp2.ply -o /data/output/$(STEM)_tmp3.ply \
		-x $(RX) -y $(RY) -z $(RZ)
	@mv ./output/$(STEM)_tmp3.ply ./output/$(STEM).ply
	@rm -f ./output/$(STEM)_tmp1.ply ./output/$(STEM)_tmp2.ply
	@echo "✔ Fichier final : output/$(STEM).ply"

help:
	docker compose run --rm sharp --help

clean:
	rm -rf ./output/*

start-ollama:
	ollama serve

pull-models:
	ollama pull llama3.2

pull-image-model:
	ollama pull x/flux2-klein

init-ml-sharp:
	git clone https://github.com/apple/ml-sharp.git
	brew install python@3.13
	cd ml-sharp && python3.13 -m venv .venv
	cd ml-sharp && .venv/bin/pip install torch torchvision
	cd ml-sharp && .venv/bin/pip install -r requirements.txt
	cd ml-sharp && .venv/bin/pip install plyfile numpy fastapi uvicorn[standard] python-multipart

	cp api/api.py ml-sharp/api.py
	cp scripts/convert.py ml-sharp/convert.py
	cp scripts/decimate.py ml-sharp/decimate.py
	cp scripts/rotate.py ml-sharp/rotate.py

	mkdir -p ml-sharp/input ml-sharp/output

start-ml-sharp:
	cd ml-sharp && .venv/bin/uvicorn api:app --host 0.0.0.0 --port 8000
