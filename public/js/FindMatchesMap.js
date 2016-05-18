var map;
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var markers = [];
var myMarker = [];
function initialize() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    
    //Obter a localização atual do usuário
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            
            pontoPadrao = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            
            //Parametros 
            var options = {
                zoom: 15,
                center: pontoPadrao,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true, //This is to hide all controls
                styles: [
                    {
                        featureType: "all",
                        stylers: [
                            { saturation: -80 }
                        ]
                    }, {
                        featureType: "road",
                        elementType: "geometry",
                        stylers: [
                            { hue: "#5f0985" },
                            { saturation: 50 }
                        ]
                    }, {
                        featureType: "poi.business",
                        elementType: "labels",
                        stylers: [
                            { visibility: "off" }
                        ]
                    }
                ],
            };
            
            //inicia o mapa e passa os parametros
            map = new google.maps.Map(document.getElementById("find-matches-map"), options);
            
            map.setCenter(pontoPadrao);
            var geocoder = new google.maps.Geocoder();
            
            
            //Marca no mapa a localização Atual!
            geocoder.geocode({
                "location": new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
            },
				function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
            
                }
            }
            );
        });
    }
}

initialize();

