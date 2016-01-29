this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v2').then(function(cache) {
      return cache.addAll([
        '/ClickMRT/',
        '/ClickMRT/index.html',
        '/ClickMRT/stylesheets/screen.css',
        '/ClickMRT/fonts/style.css',
        '/ClickMRT/javascript/jquery.history.js',
        '/ClickMRT/javascript/controller.js',
        '/ClickMRT/javascript/app.js',
        '/ClickMRT/images/arrow1.png',
        '/ClickMRT/images/arrow2.png',
        '/ClickMRT/images/maintips.png',
        '/ClickMRT/images/routemap201411.jpg',
        '/ClickMRT/images/favicon.jpg',
        '/ClickMRT/fonts/fonts/icomoon.ttf?1w02bs',
        '/ClickMRT/fonts/fonts/icomoon.woff?1w02bs',
        '/ClickMRT/fonts/fonts/icomoon.svg?1w02bs#icomoon'
      ]);
    })
  );
});

this.addEventListener('fetch', function(event) {
  var response;
  event.respondWith(caches.match(event.request).catch(function() {
    return fetch(event.request);
  }).then(function(r) {
    response = r;
    caches.open('v2').then(function(cache) {
      cache.put(event.request, response);
    });
    return response.clone();
  }).catch(function(error){
    alert(error);
  }));
});

