NAME=qcode-ui
PROFILE=sso_qcode_makefile
BUCKET=js-qcode-co-uk

all: check-version concat upload clean
concat: check-version
	# Checkout files from github to a pristine temporary directory
	rm -rf $(NAME)-$(VERSION)-tmp
	mkdir $(NAME)-$(VERSION)-tmp
	curl --fail -K ~/.curlrc_github -L -o $(NAME)-$(VERSION).tar.gz https://api.github.com/repos/qcode-software/$(NAME)/tarball/v$(VERSION)
	tar --strip-components=1 -xzvf $(NAME)-$(VERSION).tar.gz -C $(NAME)-$(VERSION)-tmp
	# Create a directory to hold the source and concatenated files and required resources
	rm -rf $(NAME)-$(VERSION)
	mkdir $(NAME)-$(VERSION)
	mkdir $(NAME)-$(VERSION)/js
	mkdir $(NAME)-$(VERSION)/css
	# Concat CSS and JS files, copy image files and source files
	$(NAME)-$(VERSION)-tmp/js-concat.tcl > $(NAME)-$(VERSION)/js/qcode-ui.js
	$(NAME)-$(VERSION)-tmp/css-concat.tcl > $(NAME)-$(VERSION)/css/qcode-ui.css
	cp -r $(NAME)-$(VERSION)-tmp/images $(NAME)-$(VERSION)/images
	cp $(NAME)-$(VERSION)-tmp/js/*.* $(NAME)-$(VERSION)/js/.
	cp $(NAME)-$(VERSION)-tmp/css/*.* $(NAME)-$(VERSION)/css/.
	# Clean up
	rm -rf $(NAME)-$(VERSION)-tmp
	rm $(NAME)-$(VERSION).tar.gz
upload: check-version
	# Upload concatenated and source CSS and JS files to s3://js-qcode-co-uk
	aws --profile $(PROFILE) s3 cp $(NAME)-$(VERSION) s3://$(BUCKET)/$(NAME)-$(VERSION) --recursive
clean: 
	rm -rf $(NAME)-$(VERSION)
check-version:
ifndef VERSION
    $(error VERSION is undefined. Usage make VERSION=x.x.x)
endif
