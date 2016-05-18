angular.module('futclub').directive('matchMap', function ($compile) {
    
    return {
        restrict: 'A',
        scope: { titulo: '@' },
        
        link: function ($scope, $element) {
            
            
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
                        map = new google.maps.Map(document.getElementById("mymap"), options);
                        
                        map.setCenter(pontoPadrao);
                        var geocoder = new google.maps.Geocoder();
                        
                        
                        //Marca no mapa a localização Atual!
                        geocoder.geocode({
                            "location": new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
                        },
                            function (results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {
                                
                                //load soccer fields
                                loadSoccerFieldPoints();
                                
                                //load my location
                                myLocation(pontoPadrao);
                                
                                
                                $("#txtSearchAdress").val(results[0].formatted_address);
                            }
                        }
                        );
                    });
                }
            }
            
            initialize();
            
            var idInfoBoxAberto;
            var infoBox = [];
            
            //Função para abrir um box personalizado
            function abrirInfoBox(id, marker) {
                if (typeof (idInfoBoxAberto) == 'number' && typeof (infoBox[idInfoBoxAberto]) == 'object') {
                    infoBox[idInfoBoxAberto].close();
                }
                
                infoBox[id].open(map, marker);
                idInfoBoxAberto = id;
            }
            
            //Função para pegar a localização atual
            function myLocation(ponto) {
                myMarker = new google.maps.Marker({
                    position: ponto,
                    title: "Minha localização",
                    map: map,
                    icon: '/branding/img/find-me.png'
                });
                var latitude = ponto.toString().split(',')[0].split('(')[1];
                var logitude = ponto.toString().split(',')[0].split(')')[1];
                
                infoBox[0] = new InfoBox(null);
                infoBox[0].marker = myMarker;
                
                infoBox[0].listener = google.maps.event.addListener(myMarker, 'click', function (e) {
                    $scope.openPopupWithoutRent(latitude, logitude);
                });
                    
            }
            
            function myLocationFromTextBox(address) {
                
                var geocoder = new google.maps.Geocoder();
                
                geocoder.geocode({ 'address': address }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[0]) {
                            var latitude = results[0].geometry.location.lat();
                            var longitude = results[0].geometry.location.lng();
                            
                            var location = new google.maps.LatLng(latitude, longitude);
                            var ponto = new google.maps.LatLng(latitude, longitude);
                            
                            clearMyLocation();
                            
                            myMarker = new google.maps.Marker({
                                position: ponto,
                                title: "Minha localização",
                                map: map,
                                icon: '/branding/img/find-me.png'
                            });
                            
                            myMarker.setPosition(location);
                            map.setCenter(location);
                            map.setZoom(15);
                        }
                    }
                });
            }
            
            //Função para carregar os pontos das quadras
            function loadSoccerFieldPoints() {
                var testePontos = [
                    {
                        "Id": 1,
                        "name": 'Golden Ball',
                        "latitude": -23.4999644,
                        "longitude": -46.697673899999984,
                        "phone": "(11) 3921-7878",
                        "field": {
                            "name": "Quadra 01",
                            "type": "futsal",
                            "features": "Churrasqueira - Estacionamento (R$5)",
                            "price": "R$140",
                            "duration": "1h"
                        },
                        "images": "/images/1/01.jpg;/images/1/02.jpg"
                    },
                    {
                        "Id": 2,
                        "name": 'Escolinha Petroneo Portela',
                        "latitude": -23.4579272,
                        "longitude": -46.694990700000005,
                        "phone": "(11) 3978-6548",
                        "field": {
                            "name": "Quadra 01",
                            "type": "Society",
                            "features": "Estacionamento (R$10)",
                            "price": "R$220",
                            "duration": "1h"
                        },
                        "images": "/images/2/01.jpg;/images/2/02.jpg"
                    }
                ]
                
                var latlngbounds = new google.maps.LatLngBounds();
                
                $.each(testePontos, function (index, field) {
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(field.latitude, field.longitude),
                        title: "Ponto das quadras",
                        map: map,
                        icon: '/branding/img/soccer-field.png'
                    });
                    
                    infoBox[field.Id] = new InfoBox(null);
                    infoBox[field.Id].marker = marker;
                    
                    infoBox[field.Id].listener = google.maps.event.addListener(marker, 'click', function (e) {
                        $scope.openPopupWithRent(field);
                    });
                    
                    //Caso tenha muitos pontos próximos uns dos outros, cria um agrupador.
                    markers.push(marker);
                    var markerCluster = new MarkerClusterer(map, markers);
                    latlngbounds.extend(marker.position);
                    map.fitBounds(latlngbounds);


                });

            }
            // Sets the map on all markers in the array.
            
            // Removes the markers from the map, but keeps them in the array.
            function clearMyLocation() {
                myMarker.setMap(null);
            }

        },
        controller: 'MainController'

    }




});