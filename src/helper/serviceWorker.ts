export function connectServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/public/firebase-messaging-sw.js')
      .then(function (registration) {
        console.log('Registration successful, scope is:', registration.scope);
      })
      .catch(function (err) {
        console.log('Service worker registration failed, error:', err);
      });
  }
}

export function removeServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      for (const registration of registrations) {
        registration.unregister().then();
      }
    });
  }
}
