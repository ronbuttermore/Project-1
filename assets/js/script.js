// // main page variables
const mainContainer = $('.main-container');
const mainCityZipInput = $('#city-zip-input');
const mainSearchBtn = $('#main-search-btn');

let locationInput;
let city;
let postalCode;

// // search results page variables
const searchedArea = $('#searchedArea');
const searchResultsContainer = $('#searchResults');

// brewery info page variables
const breweryContainer = $('#brewery-container');
const breweryName = $('#brewery-name');
const breweryLogo = $('#brewery-logo');
const breweryAboutContainer = $('#about-container');

// directions page variables 
const navSidebar = $('#sidebar');
const navUserLocation = $('#userlocation');
const navBreweryAddress = $('#breweryaddress');
const navDirectionsSection = $('#directionssection');
const navDirectionsListContainer = $('#directions-list-container');
const navMapContainer = $('#maparea');

// coding for main page functionality
$(document).ready(function() {
    $("#main-search-btn").click(function(event) {
      event.preventDefault();
      var cityZipInput = $("#city-zip-input").val().trim();
      if (cityZipInput !== "") {
        sessionStorage.setItem("brewerySearchInput", cityZipInput); // Use a consistent key !
        window.location.href = "searchresult.html";
      } else {
        $("#error-alert").removeClass("hide");
      }
    });
  });
  

// save input to local storage for searchresult page to resource
var searchQuery = mainCityZipInput.val().trim();
if (searchQuery) {
  localStorage.setItem("brewerySearchedLocation", searchQuery);
}


// search results page code
$(document).ready(function() {
  $("#search-result-btn").click(function(event) {
    event.preventDefault();
    // remove error alert if it wasn't dismissed
    $("#whoops-alert").addClass("hide");
    $("#sorry-alert").addClass("hide");
    // grab input information
    // double check if it is a postal code or a city
    if (city || postalCode) {
      // store the input value in sessionStorage
      sessionStorage.setItem('searchInput', mainCityZipInput.val());
      window.location.assign("searchresult.html");
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
});

// coding for directions page
