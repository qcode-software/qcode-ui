NAME=qcode-ui
REMOTEHOST=js.qcode.co.uk
REMOTEDIR=/var/www/js.qcode.co.uk

all: check-version concat upload clean
concat: check-version
	# Checkout files from github to a pristine temporary directory
	rm -rf $(NAME)-$(VERSION)
	mkdir $(NAME)-$(VERSION)
	curl --fail -K ~/.curlrc_github -L -o $(NAME)-$(VERSION).tar.gz https://api.github.com/repos/qcode-software/$(NAME)/tarball/v$(VERSION)
	tar --strip-components=1 -xzvf $(NAME)-$(VERSION).tar.gz -C $(NAME)-$(VERSION)
	# Concat CSS and JS files
	$(NAME)-$(VERSION)/js-concat.tcl > $(NAME)-$(VERSION).js
	$(NAME)-$(VERSION)/css-concat.tcl > $(NAME)-$(VERSION).css
	# Clean up
	rm -rf $(NAME)-$(VERSION)
	rm $(NAME)-$(VERSION).tar.gz		
upload: check-version
	# Upload concatenated CSS and JS files to js.qcode.co.uk
	scp $(NAME)-$(VERSION).js $(REMOTEHOST):$(REMOTEDIR)/$(NAME)-$(VERSION).js
	scp $(NAME)-$(VERSION).css $(REMOTEHOST):$(REMOTEDIR)/$(NAME)-$(VERSION).css
	# Change permissions to read only to prevent files being overwritten
	ssh $(REMOTEHOST) 'chmod 0444 $(REMOTEDIR)/$(NAME)-$(VERSION).js $(REMOTEDIR)/$(NAME)-$(VERSION).css'
clean: 
	rm $(NAME)-$(VERSION).js
	rm $(NAME)-$(VERSION).css
check-version:
ifndef VERSION
    $(error VERSION is undefined. Usage make VERSION=x.x.x)
endif