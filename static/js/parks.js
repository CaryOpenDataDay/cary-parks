
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
    var map = L.map('map');
    var url = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    L.tileLayer(url, {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
        maxZoom: 18
    }).addTo(map);
    var group = new L.FeatureGroup();
    group.addTo(map);

    var gps = new L.Marker();

    function onLocationFound(e) {
        var radius = e.accuracy / 2;
        gps = L.marker(e.latlng).bindPopup("You are within " + radius + " meters from this point").openPopup();
        group.addLayer(gps);
    }

    function onLocationError(e) {
        alert(e.message);
    }

    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);

    map.locate({setView: true, maxZoom: 16});

    $('#find-button').click(function(e) {
        e.preventDefault();
        
        var where = [];
        var sqlselect = "select * from swdata"; 
        $(".options:checked").each(function(i, input) {
            where.push($(input).attr('name') + " = " + $(input).val());
        });
        if ($(where).length > 0) {
            sqlselect = sqlselect + " WHERE " + where.join(' AND ');
        }
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
              console.log(data);
              group.clearLayers();
              group.addLayer(gps);
              $.each(data, function(index, row) {
                var markerLocation = new L.LatLng(row['Lat'], row['Lon']);
                bounds.extend(markerLocation);
                var marker = L.marker(markerLocation).bindPopup(row["NAME"]);
                group.addLayer(marker);
                console.log(marker);
              });
              map.fitBounds(bounds);
              gps.openPopup();
            }
        });
        
    });
});
