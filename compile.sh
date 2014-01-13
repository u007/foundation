mkdir -p dist/css
mkdir -p dist/js
java -jar compiler.jar \
	js/foundation/foundation.js\
	js/foundation/foundation.abide.js\
	js/foundation/foundation.accordion.js\
	js/foundation/foundation.alert.js\
	js/foundation/foundation.clearing.js\
	js/foundation/foundation.dropdown.js\
	js/foundation/foundation.interchange.js\
	js/foundation/foundation.joyride.js\
	js/foundation/foundation.magellan.js\
	js/foundation/foundation.offcanvas.js\
	js/foundation/foundation.orbit.js\
	js/foundation/foundation.reveal.js\
	js/foundation/foundation.tab.js\
	js/foundation/foundation.tooltip.js\
	js/foundation/foundation.topbar.js\
		> dist/js/foundation.min.js
	
sass scss/normalize.scss > dist/css/normalize.css
sass scss/foundation.scss > dist/css/foundation.css
	
