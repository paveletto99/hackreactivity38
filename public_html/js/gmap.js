/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function initMap() {
    var myLatLng = new google.maps.LatLng(43.352782,12.911502);
    var myOptions = {
        zoom: 8,
        center: myLatLng,
        mapTypeId: 'terrain'
    }
    var map = new google.maps.Map(document.getElementById("gmaps-canvas"), myOptions);

    var marker = new google.maps.Marker({
        position: myLatLng, 
        map: map
    });
    
    //
    var citymap = {
        chicago: {
          center: {lat: 43.35, lng: 12.91},
          population: 2714856
        }
      };
    
        // Construct the circle for each value in citymap.
        // Note: We scale the area of the circle based on the population.
        for (var city in citymap) {
          // Add the circle for this city to the map.
          var cityCircle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: citymap[city].center,
            radius: 10000
          });
        }
    
    
    
    /*
    // Define the LatLng coordinates for the polygon's path.
        var heartquakeCoords = [
          {lat: 43.35, lng: 12.91},
          {lat: 43.29, lng: 12.86},
          {lat: 43.26, lng: 12.92},
          {lat: 43.33, lng: 12.97}
        ];

        // Construct the polygon.
        var heartquakeZone = new google.maps.Polygon({
          paths: heartquakeCoords,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35
        });
        heartquakeZone.setMap(map);
    */
}


