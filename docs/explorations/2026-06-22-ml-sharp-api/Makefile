.PHONY: build predict help clean

build:
	docker compose build
	
predict:
	docker compose run --rm sharp predict -i /data/input/$(IMG) -o /data/output

help:
	docker compose run --rm sharp --help

clean:
	rm -rf ./output/*