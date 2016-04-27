
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        navigator.geolocation.getCurrentPosition(app.onSuccess, app.onError);

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    onSuccess:function(position) {
            // alert('Latitude: '          + position.coords.latitude          + '\n' +
            //           'Longitude: '         + position.coords.longitude         + '\n' +
            //           'Altitude: '          + position.coords.altitude          + '\n' +
            //           'Accuracy: '          + position.coords.accuracy          + '\n' +
            //           'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
            //           'Heading: '           + position.coords.heading           + '\n' +
            //           'Speed: '             + position.coords.speed             + '\n' +
            //           'Timestamp: '         + position.timestamp                + '\n');
            // };
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        var latlng = new google.maps.LatLng(latitude,longitude);

        var myOptions = {
        zoom: 16,
        center: latlng,
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP};
        
        var map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);

        var infowindow = new google.maps.InfoWindow({
                  position: latlng,
                  content: '<p>Tu posición actual</p>'+latlng
                  });
        
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: "Mi posición",
            animation: google.maps.Animation.DROP
        });
        google.maps.event.addListener(marker, 'click', function() {infowindow.open(map,marker);});


    },
    onError:function(error) {
                alert('code: '    + error.code    + '\n' +
                      'message: ' + error.message + '\n');
    }
};

app.initialize();