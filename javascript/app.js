if ('serviceWorker' in navigator) {
    if(location.protocol == 'https:') {
        navigator.serviceWorker.register('service_worker.js?v=22').then(function(reg) {
            if (reg.installing) {
                console.log('Service worker installing');
            } else if (reg.waiting) {
                console.log('Service worker installed');
            } else if (reg.active) {
                console.log('Service worker active2');
            }
        }).catch(function(error) {
            // registration failed
            alert('Registration failed with ' + error);
            console.dir(arguments);
        });
    }
};

