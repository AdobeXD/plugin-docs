PROJECT := $(realpath $(dir $(lastword $(MAKEFILE_LIST))))
MD_PATH := $(PROJECT)/doc/md/
HTML_PATH := $(PROJECT)/doc/html/
NODE_BIN := $(PROJECT)/node_modules/.bin/
MARKDOX := $(NODE_BIN)markdox
DOX_FOUNDATION := $(NODE_BIN)dox-foundation
MOCHA := $(NODE_BIN)mocha

test:
	@NODE_ENV=test $(MOCHA) --require should --reporter spec

doc: $(PROJECT)/lib/*.js
	$(MARKDOX) -o $(MD_PATH)$(patsubst %.js,%.md,$(notdir $?)) $?
	$(DOX_FOUNDATION) < $? > $(HTML_PATH)$(patsubst %.js,%.html,$(notdir $?))

clean:
	-rm $(MD_PATH)*
	-rm $(HTML_PATH)*

.PHONY: test clean doc
