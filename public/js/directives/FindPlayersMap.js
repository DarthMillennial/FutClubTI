angular.module('futclub').directive('playersMap', function ($compile) {

    return {
        restrict: 'A',
        scope: false,

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
                        map = new google.maps.Map(document.getElementById("find-players-map"), options);

                        map.setCenter(pontoPadrao);
                        var geocoder = new google.maps.Geocoder();
            
            
                        //Marca no mapa a localização Atual!
                        geocoder.geocode({
                            "location": new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
                        },
                            function (results, status) {
                                if (status == google.maps.GeocoderStatus.OK) {
                                    $(".find-players-search").val(results[0].formatted_address);
                                    loadPlayers();
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
            function abrirInfoBox(data) {
                $scope.find_players_id = data.id;
                $scope.find_players_name = data.name;
                $scope.find_players_image = data.image;
                $scope.find_players_positions = data.positions;
                $scope.find_players_city = data.city;
                $scope.$apply();

                $('.find-players-invoke').fadeIn();
                $('.find-players-add').fadeIn();
            }
            
            //Função para carregar os jogadores próximos
            function loadPlayers() {
                var testePontos = [
                    {
                        "id": 1,
                        "name": 'Sergio',
                        "image": 'http://graph.facebook.com/988406464568936/picture?type=normal',
                        "city": "São Paulo",
                        "positions": "Atacante, Centro-Avante",
                        "Latitude": -23.4574222,
                        "Longitude": -46.6955059
                    }
                ]

                var latlngbounds = new google.maps.LatLngBounds();

                $.each(testePontos, function (index, ponto) {
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(ponto.Latitude, ponto.Longitude),
                        title: "Ponto das quadras",
                        map: map,
                        icon: '/branding/img/soccer-field.png'
                    });

                    //Caixa de dialogo personalizada
                    var myOptions = {
                        pixelOffset: new google.maps.Size(320, -170),

                    };

                    infoBox[ponto.Id] = new InfoBox(myOptions);
                    infoBox[ponto.Id].marker = marker;

                    infoBox[ponto.Id].listener = google.maps.event.addListener(marker, 'click', function (e) {
                        abrirInfoBox(ponto);
                    });
                    
                    //Caso tenha muitos pontos próximos uns dos outros, cria um agrupador.
                    markers.push(marker);
                    var markerCluster = new MarkerClusterer(map, markers);
                    latlngbounds.extend(marker.position);
                    map.fitBounds(latlngbounds);

                });

            }
        },
        controller: 'MainController'
    }
});

