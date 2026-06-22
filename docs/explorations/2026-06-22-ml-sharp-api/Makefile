.PHONY: build predict help clean

build:
	docker compose build

# All images in /data/input will be processed
predict-all:
	docker compose run --rm sharp predict -i /data/input -o /data/output


# Specific image (usage : make run IMG=photo.jpg)
predict:
	docker compose run --rm sharp predict -i /data/input/$(IMG) -o /data/output

help:
	docker compose run --rm sharp --help

clean:
	rm -rf ./output/*