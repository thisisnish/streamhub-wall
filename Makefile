.PHONY: all build clean run server

all: build

build: node_modules

clean:
	rm -rf node_modules lib dist

env=dev
deploy: dist
	./node_modules/.bin/lfcdn -e $(env)

dist: build src requirejs.conf.js tools lint
	mkdir -p dist
	./node_modules/requirejs/bin/r.js -o ./tools/build.conf.js

lint:
	npm run lint

# if package.json changes, install
node_modules: package.json
	npm install --dev
	touch $@

package: build

run: server

server: build
	npm start

test: build
	npm test
