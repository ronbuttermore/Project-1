
let city;
let postalCode;

// // directions page variables 

   const navUserLocation = $('#userlocation');
   const navBreweryName = $('#breweryname');
   const navBreweryAddress = $('#breweryaddress');
   const navDirectionsSection = $('#directionssection');


// coding for directions page

var breweryName = localStorage.getItem("breweryName");
var breweryAddress = JSON.parse(localStorage.getItem("breweryAddress"));
var breweryStreet = breweryAddress[0];
var nameNoSpaces = breweryStreet.replace(/ /g, '+');
navBreweryName.text(breweryName);
navBreweryAddress.text(breweryAddress[0] + ", " + breweryAddress[1] + ", " + breweryAddress[2] + ", " + breweryAddress[3]);

//listener for entry of user address
navUserLocation.keypress(function (e) {
    var key = e.which;
    if (key==13){
        findNavigation();
    }
});

//function to get user coordinates and call function to find directions
function findNavigation(){
    var userLocation = navUserLocation.val();
    var userLocationNoSpaces = userLocation.replace(/ /g, '+');
    var userGeocode = "https://geocode.maps.co/search?q=" + userLocationNoSpaces;
    fetch(userGeocode)
        .then(function(response) {
            return response.json();
        })
        .then(function(data){
            var userLon = data[0].lon;
            var userLat = data[0].lat;
            fetch(geocodingURL)
                .then(function(response) {
                    return response.json();
                })
                .then(function(data){
                    var breweryLon = data[0].lon;
                    var breweryLat = data[0].lat;
                    getDirections(breweryLon, breweryLat, userLon,userLat);
                })
        })
}

//function to get and print driving directions from user location to brewery
function getDirections(breweryLon, breweryLat, userLon,userLat) {
    var directionsAPICall = "https://api.tomtom.com/routing/1/calculateRoute/" + userLat + "," + userLon + ":" + breweryLat + "," + breweryLon + "/json?instructionsType=text&language=en-US&vehicleHeading=90&sectionType=traffic&report=effectiveSettings&routeType=eco&traffic=true&avoid=unpavedRoads&travelMode=car&vehicleMaxSpeed=120&vehicleCommercial=false&vehicleEngineType=combustion&key=9GgFvkDZz2WjiY63GGreVAvcuKo7Ztvl";
    (async () => {
        const response = await fetch(directionsAPICall);
        const body = await response.json();
        console.log(body);

        //add travel time
        //add total distance
        var totalTravelTime = body.routes[0].legs[0].summary.travelTimeInSeconds;
        var totalDistance = body.routes[0].legs[0].summary.lengthInMeters;
        var timeBox = $('<p>');
        var distanceBox = $('<p>');
        var totalTimeMinutes = Math.floor(totalTravelTime/60);
        var totalTimeLeftover= totalTravelTime%60;
        timeBox.text("Total Travel Time: " + totalTimeMinutes + " minutes and " + totalTimeLeftover + " seconds");
        $("#directionslist").append(timeBox);
        var distanceInMiles = (totalDistance*0.0006213712).toFixed(2);
        distanceBox.text("Total Distance: " + distanceInMiles + " miles");
        $('#directionslist').append(distanceBox);

        for (i=0; i< body.routes[0].guidance.instructions.length; i++) {
            var message = body.routes[0].guidance.instructions[i].message;
            var maneuver = body.routes[0].guidance.instructions[i].maneuver;
            var travelTime = body.routes[0].guidance.instructions[i].travelTimeInSeconds;

            var travelTimeMinutes = Math.floor(travelTime/60);
            var travelTimeSeconds = travelTime%60;

            var directionsBox = $('<p>');
            if (i>0) {
            var formattedMessage = message.substring(0,1).toLowerCase() + message.substring(1);
            directionsBox.text("-Drive " + travelTimeMinutes + " minutes and " + travelTimeSeconds + " seconds, then " + formattedMessage);
            $("#directionslist").append(directionsBox);
            } else {
                directionsBox.text("-" + message);
                $("#directionslist").append(directionsBox);  
            }
        }
    })()
}

var geocodingURL = "https://geocode.maps.co/search?q=" + nameNoSpaces + "+" + breweryAddress[1] + "+" + breweryAddress[2] + "+" + breweryAddress[3];

//find coordinates of brewery
fetch(geocodingURL)
    .then(function(response) {
        return response.json();
    })
    .then(function(data){
        var breweryLon = data[0].lon;
        var breweryLat = data[0].lat;
        displayMap(breweryLon,breweryLat);
    })

//function to display brewery on display map
function displayMap(lon,lat) {
    var brewerycoordinates = [lon,lat];

    var map = tt.map({
        key: "9GgFvkDZz2WjiY63GGreVAvcuKo7Ztvl",
        container: "map",
        center: brewerycoordinates,
        zoom: 15
    })

    var marker = new tt.Marker().setLngLat(brewerycoordinates).addTo(map);

    var popupOffsets = {
        top: [0,0],
        bottom: [0,-70],
        "bottom-right": [0, -70],
        "bottom-left": [0, -70],
        left: [25, -35],
        right: [-25, -35],
    }

    var popup = new tt.Popup({ offset: popupOffsets }).setHTML("<b>" + breweryName + "</b>" + "<br/>" + breweryAddress[0] + "<br/>" + breweryAddress[1] + ", " + breweryAddress[2] + " " + breweryAddress[3]);
    marker.setPopup(popup).togglePopup();
}

  // Function to redirect back to the search result page
function redirectToSearchResultPage() {
    const searchInputValue = sessionStorage.getItem('brewerySearchInput');
    if (searchInputValue) {
      sessionStorage.setItem('brewerySearchInput', searchInputValue);
    }
    window.location.href = 'searchresult.html';
  }
  
  const backButton = document.querySelector('.back-btn');
  if (backButton) {
    backButton.addEventListener('click', redirectToSearchResultPage);
  }
  