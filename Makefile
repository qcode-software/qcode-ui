NAME=qcode-ui
REMOTEHOST=js.qcode.co.uk
REMOTEDIR=/var/www/js.qcode.co.uk
REMOTEUSER=nsd

all: check-version concat upload clean
concat: check-version
	# Checkout files from github to a pristine temporary directory
	rm -rf $(NAME)-$(VERSION)-tmp
	mkdir $(NAME)-$(VERSION)-tmp
	curl --fail -K ~/.curlrc_github -L -o $(NAME)-$(VERSION).tar.gz https://api.github.com/repos/qcode-software/$(NAME)/tarball/v$(VERSION)
	tar --strip-components=1 -xzvf $(NAME)-$(VERSION).tar.gz -C $(NAME)-$(VERSION)-tmp
	# Create a directory to hold the concatenated files and required resources
	rm -rf $(NAME)-$(VERSION)
	mkdir $(NAME)-$(VERSION)
	mkdir $(NAME)-$(VERSION)/js
	mkdir $(NAME)-$(VERSION)/css
	# Concat CSS and JS files, copy image files
	$(NAME)-$(VERSION)-tmp/js-concat.tcl > $(NAME)-$(VERSION)/js/qcode-ui.js
	$(NAME)-$(VERSION)-tmp/css-concat.tcl > $(NAME)-$(VERSION)/css/qcode-ui.css
	cp -r $(NAME)-$(VERSION)-tmp/images $(NAME)-$(VERSION)/images 
	# Clean up
	rm -rf $(NAME)-$(VERSION)-tmp
	rm $(NAME)-$(VERSION).tar.gz
upload: check-version
	# Upload concatenated CSS and JS files to js.qcode.co.uk
	scp -r $(NAME)-$(VERSION) $(REMOTEUSER)@$(REMOTEHOST):$(REMOTEDIR)/$(NAME)-$(VERSION)
	# Change permissions to read only to prevent files being overwritten
	ssh $(REMOTEUSER)@$(REMOTEHOST) 'find $(REMOTEDIR)/$(NAME)-$(VERSION) -type f -exec chmod 444 {} +'
clean: 
	rm -rf $(NAME)-$(VERSION)
check-version:
ifndef VERSION
    $(error VERSION is undefined. Usage make VERSION=x.x.x)
endif
