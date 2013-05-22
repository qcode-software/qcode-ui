#!/bin/bash
# Rebuild GitHub Pages and push out to GitHub
set -e

# Args
if [ "$#" -ne 3 ]; then
    echo "Error: Usage rebuild-gh-pages.sh html_src_directory output_gh_pages_directory github_repository"
fi

DOC_HTML_DIR=$1
DOC_GH_PAGES_DIR=$2
DOC_GH_REPOS=$3

# Checkout fresh copy of gh-pages branch. Error if unsuccessful
rm -rf ${DOC_GH_PAGES_DIR}
git clone -b gh-pages ${DOC_GH_REPOS} ${DOC_GH_PAGES_DIR}

# Rebuild gh-pages from html directory
rsync -a --delete --exclude .git ${DOC_HTML_DIR}/ ${DOC_GH_PAGES_DIR}	
	
# Commit changes and push to github. Check that we are definitely on gh-pages branch
BRANCHES=$(git --git-dir=${DOC_GH_PAGES_DIR}/.git --work-tree=${DOC_GH_PAGES_DIR} branch)
if ! [[ "$BRANCHES" =~ \*[[:space:]]gh-pages ]]; then
    rm -rf ${DOC_GH_PAGES_DIR}
    echo -e "Error: Unable to checkout gh-pages branch"
    exit 
fi
git --git-dir=${DOC_GH_PAGES_DIR}/.git --work-tree=${DOC_GH_PAGES_DIR} add -A
git --git-dir=${DOC_GH_PAGES_DIR}/.git --work-tree=${DOC_GH_PAGES_DIR} commit -m "Rebuilt Docs"
git --git-dir=${DOC_GH_PAGES_DIR}/.git --work-tree=${DOC_GH_PAGES_DIR} push origin gh-pages