.PHONY: build predict help clean

build:
	docker compose build
	
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