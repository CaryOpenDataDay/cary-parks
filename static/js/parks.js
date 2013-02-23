
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
    $('#address-button').click(function(e) {
        e.preventDefault();
        var address = $('#address').val();
        lookupAddress(address);
        console.log(address);
    });

});
