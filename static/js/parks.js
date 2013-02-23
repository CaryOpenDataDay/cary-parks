
function lookupAddress(address) { 
    var origin = address;
    var destination = "400 South West Street Cary, NC 27511";

    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
        avoidHighways: false,
        avoidTolls: false
      }, callback);

    function callback(response, status) {
        console.log(response);
    }
}

$(document).ready(function() {
    $('#find-button').click(function(e) {
        e.preventDefault();
        map.locate({setView: true, maxZoom: 16});
    });

    var map = L.map('map');
    var url = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    L.tileLayer(url, {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
        maxZoom: 18
    }).addTo(map);

    function onLocationFound(e) {
        var radius = e.accuracy / 2;
        L.marker(e.latlng).addTo(map)
            .bindPopup("You are within " + radius + " meters from this point").openPopup();
        L.circle(e.latlng, radius).addTo(map);
        var where = [];
        var sqlselect = "select * from swdata"; 
        $(".options:checked").each(function(i, input) {
            where.push($(input).attr('name') + " = " + $(input).val());
        });
        if ($(where).length > 0) {
            sqlselect = sqlselect + " WHERE " + where.join(' AND ');
        }
        console.log(sqlselect);
        var apiurl = "https://api.scraperwiki.com/api/1.0/datastore/sqlite";            
        var srcname = "cary_nc_parks"; 

        var bounds = new L.LatLngBounds();
        
        $.ajax({
            url: apiurl, 
            dataType: "json", 
            data:{
                name: srcname, 
                query: sqlselect, 
                format: "jsondict"
            }, 
            success: function(data){
              $.each(data, function(index, row) {
                var markerLocation = new L.LatLng(row['Lat'], row['Lon']);
                bounds.extend(markerLocation);
                var marker = L.marker(markerLocation).addTo(map).bindPopup(row["NAME"]);
              });
              map.fitBounds(bounds);
            }
        });
    }

    function onLocationError(e) {
        alert(e.message);
    }

    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);

    map.locate({setView: true, maxZoom: 16});
});
