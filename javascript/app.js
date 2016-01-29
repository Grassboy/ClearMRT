if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/ClickMRT/javascript/service_worker.js').then(function(reg) {
		if (reg.installing) {
			alert('Service worker installing');
		} else if (reg.waiting) {
			alert('Service worker installed');
		} else if (reg.active) {
			alert('Service worker active');
		}
	}).catch(function(error) {
		// registration failed
		alert('Registration failed with ' + error);
        console.dir(arguments);
	});
};

