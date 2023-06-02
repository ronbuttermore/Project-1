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
// const navUserLocation = $('#userlocation');
// const navBreweryAddress = $('#breweryaddress');
// const navDirectionsSection = $('#directionssection');
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

const map = tt.map({
    key: "9GgFvkDZz2WjiY63GGreVAvcuKo7Ztvl",
    container: "map",
    center: [-104.990250,39.739235],
    zoom: 10
})