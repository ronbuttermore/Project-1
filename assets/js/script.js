// // main page variables
// const mainContainer = $('.main-container');
// const mainCityZipInput = $('#city-zip-input');
// const mainSearchBtn = $('#main-search-btn');

// let locationInput;
let city;
let postalCode;

// // search results page variables
// const searchedArea = $('#searchedArea');
// const searchResultsContainer = $('#searchResults');

// // brewery info page variables
// const breweryContainer = $('#brewery-container');
// const breweryName = $('#brewery-name');
// const breweryLogo = $('#brewery-logo');
// const breweryAboutContainer = $('#about-container');

// // directions page variables 
// const navSidebar = $('#sidebar');
   const navUserLocation = $('#userlocation');
   const navBreweryName = $('#breweryname');
   const navBreweryAddress = $('#breweryaddress');
   const navDirectionsSection = $('#directionssection');
// const navDirectionsListContainer = $('#directions-list-container');
// const navMapContainer = $('#maparea');


// coding for main page functionality

$("#main-search-btn").click(function(event){
    event.preventDefault();
    // remove error alert if it wasn't dismissed
    // $("#whoops-alert").addClass("hide");
    // $("#sorry-alert").addClass("hide");
    // grab input information
    // double check if it is a postal code or a city
    if (city || postalCode) {
        // use stored information in the variable locationInput
        window.location.assign("searchresult.html");
    // } else if () { //if there are no results
    //     $("#sorry-alert").removeClass("hide");
    } else {
        $("#whoops-alert").removeClass("hide");
    }
});

$(".btn-close").click(function(event){
    event.preventDefault();
    // error alert close
    $("#whoops-alert").addClass("hide");
    $("#sorry-alert").addClass("hide");
    $("#city-zip-input").val('');
});


// search results page code


// coding for brewery about page

$("#about-directions-btn").click(function(event){
    event.preventDefault();
    // pull information from url to put into directions?
    window.location.assign("directions.html"); 
});

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