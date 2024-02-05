self.addEventListener('push', function (event) {
    const options = {
      body: event.data.text(),
    //   icon: '/path/to/icon.png', 
    };
  
    event.waitUntil(
      self.registration.showNotification('Your Notification Title', options)
    );
  });
  