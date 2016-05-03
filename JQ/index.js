
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        //var params={position:{coords:{latitude: 0, longitude:0 }}};
        //app.onSuccess(params);

        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        
        //maximumAge- Guarda la posicion por 5 minutos 
        //enableHighAccuracy: Se tratan de obtener los mejores resultados posible del GPS
        //timeout: el tiempo maximo que se espera para obtener la posicion en este caso 5 segundos
        var options = {maximumAge: 500000, enableHighAccuracy:true, timeout: 5000};
        navigator.geolocation.getCurrentPosition(app.onSuccess, app.onError,options);
    },
    onSuccess:function(position){
        // alert('22::Latitude: '          + position.coords.latitude          + '\n' +
        //           'Longitude: '         + position.coords.longitude         + '\n' +
        //           'Altitude: '          + position.coords.altitude          + '\n' +
        //           'Accuracy: '          + position.coords.accuracy          + '\n' +
        //           'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
        //           'Heading: '           + position.coords.heading           + '\n' +
        //           'Speed: '             + position.coords.speed             + '\n' +
        //           'Timestamp: '         + position.timestamp                + '\n');
    
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        //var latitude = -12.093840199999999;
        //var longitude= -77.0339961
        
        var latlng = new google.maps.LatLng(latitude, longitude);

        // var myOptions = {
        //     zoom: 16,
        //     center: latlng,
        //     disableDefaultUI: true,
        //     mapTypeId: google.maps.MapTypeId.ROADMAP
        // };
        var map;
        var markers = [];
        var myOptions = {
            zoom: 13,
            zoomControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.LARGE,
                position: google.maps.ControlPosition.RIGHT_BOTTOM
            },
            panControl: true,
            panControlOptions: {
                position: google.maps.ControlPosition.RIGHT_TOP
            },
            center: latlng

        };
       
        map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);


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

        var image = {
            url: 'http://cristalsmart.azurewebsites.net/assets/bares/images/pin-posicion.png',
        };
               
        $.ajax({
            url: "http://cristalsmart.azurewebsites.net/assets/bares/ajax/ajax_todos_estadios_json.aspx/GetRegistros",
            type: "POST",
            data: JSON.stringify({}),
            contentType: "application/json; charset=utf-8",
            crossDomain : true,
            dataType: "json",
           
            success: function (result) {

                var markers_json = result.d;
                
                $.each(markers_json, function(index, item_marker) {
                    var actual_url = 'detalleestadios.aspx?ID=' + item_marker.ID + '&latitud='  + item_marker.latitud + '&longitud='  + item_marker.longitud;
                    
                    markers[index + 1] = new google.maps.Marker({
                        position: new google.maps.LatLng(item_marker.latitud, item_marker.longitud),
                        //url: actual_url,
                        title: item_marker.extra,
                        map: map,
                        icon: image,
                        optimized: false
                    });

                });

                app.onMarkersDisplay(map,markers);
            }
        });
              
  

    },
    onMarkersDisplay: function(mapi,markers){

        var bounceTimer;
        var infowindow;
        for (i = 1; i < markers.length; i++) {
            var globo = markers[i];

            google.maps.event.addListener(globo, 'click', function () {

                infowindow = new google.maps.InfoWindow({
                                  position: this.position,
                                  content: '<p>' + this.title + '</p>'
                                  });
                //window.location.href = this.url;
                infowindow.open(mapi,this);
            });


            google.maps.event.addListener(globo, 'mouseover', function () {

                if (this.getAnimation() == null || typeof this.getAnimation() === 'undefined') {

                    clearTimeout(bounceTimer);
                    var that = this;
                    bounceTimer = setTimeout(function () {
                        that.setAnimation(google.maps.Animation.BOUNCE);
                    },
                    500);
                }
            });

            google.maps.event.addListener(globo, 'mouseout', function () {

                if (this.getAnimation() != null) {
                    this.setAnimation(null);
                }

                clearTimeout(bounceTimer);

            });

        } 
                 
    },
    onError:function(error) {
                alert('code: '    + error.code    + '\n' +
                      'message: ' + error.message + '\n');
    }
};

