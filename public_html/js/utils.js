/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(
        // SISMA APUANE - ETÀ DI COSTRUZIONE E RISTRUTTURAZIONE DEGLI EDIFICI PER COMUNE
        $.getJSON("http://localhost:8383/hackreativity/ingv_maps.json", function (data) {
            var myLatLng = new google.maps.LatLng(43.27, 12.19);
            var myOptions = {
                zoom: 7,
                center: myLatLng,
                mapTypeId: 'terrain'
            }
            var map = new google.maps.Map(document.getElementById("gmaps-canvas"), myOptions);
            var marker;

            $.getJSON("http://localhost:8383/hackreativity/opendata.json", function (res) {
                for (var i = 0; i < data.results.length; i++) {
                    for (var c = 0; c < res.d.results.length; c++) {

                        if (data.results[i].city == res.d.results[c].Cccomune_608711150) {

                            marker = new google.maps.Marker({
                                position: new google.maps.LatLng(data.results[i].lat, data.results[i].long),
                                map: map
                            });

                            if (data.results[i].magnitudo < 1) {
                                tmpColor = '#2acc2a';
                            } else if (data.results[i].magnitudo > 2 && data.results[i].magnitudo < 4) {
                                tmpColor = '#fff606';
                            } else if (data.results[i].magnitudo > 5 && data.results[i].magnitudo < 7) {
                                tmpColor = '#ff842a';
                            } else {
                                tmpColor = '#ff0000';
                            }

                            var cityCircle = new google.maps.Circle({
                                strokeColor: tmpColor,
                                strokeOpacity: 0.3,
                                strokeWeight: 2,
                                fillColor: tmpColor,
                                fillOpacity: 0.35,
                                map: map,
                                center: {lat: data.results[i].lat, lng: data.results[i].long},
                                radius: data.results[i].radius
                            });
                        }
                    }
                }
            });
        })
        );

