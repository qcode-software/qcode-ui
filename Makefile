DOC_SRC_DIR=docs/src
DOC_TEMPLATE_DIR=docs/templates
DOC_HTML_DIR=docs/html
DOC_SERVER_ROOT=/qcode-ui
DOC_GH_PAGES_DIR=docs/gh-pages
DOC_REPOS=git@github.com:qcode-software/qcode-ui.git

docs:
	docs/rebuild-docs.tcl ${DOC_SRC_DIR} ${DOC_TEMPLATE_DIR} ${DOC_HTML_DIR} ${DOC_SERVER_ROOT}
local-docs:
	docs/rebuild-docs.tcl -local -- ${DOC_SRC_DIR} ${DOC_TEMPLATE_DIR} ${DOC_HTML_DIR} ${DOC_SERVER_ROOT}
gh-pages:
	docs
	docs/rebuild-gh-pages.sh ${DOC_HTML_DIR} ${DOC_GH_PAGES_DIR} ${DOC_GH_REPOS}