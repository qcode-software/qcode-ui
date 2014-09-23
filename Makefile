NAME=qcode-ui
REMOTEHOST=js.qcode.co.uk
REMOTEDIR=/var/www/js.qcode.co.uk

all: check-version upload clean
upload: check-version
	# concat css and js and upload to js.qcode.co.uk
	./js-concat.tcl > $(NAME)-$(VERSION).js
	scp $(NAME)-$(VERSION).js $(REMOTEHOST):$(REMOTEDIR)/$(NAME)-$(VERSION).js
	./css-concat.tcl > $(NAME)-$(VERSION).css
	scp $(NAME)-$(VERSION).css $(REMOTEHOST):$(REMOTEDIR)/$(NAME)-$(VERSION).css
	# change permissions to read only to prevent files being overwritten
	ssh $(REMOTEHOST) 'chmod 0444 $(REMOTEDIR)/$(NAME)-$(VERSION).js $(REMOTEDIR)/$(NAME)-$(VERSION).css'
clean: check-version
	rm $(NAME)-$(VERSION).js
	rm $(NAME)-$(VERSION).css
check-version:
ifndef VERSION
    $(error VERSION is undefined. Usage make VERSION=x.x.x)
endif