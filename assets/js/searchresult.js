// Function to save data to local storage
function saveToLocalStorage(key, value) {
  try {
    localStorage.setItem(key, value);
    console.log("Data saved to local storage: ", key, value);
  } catch (error) {
    console.error("Error saving data to local storage:", error);
    // Handle error and display appropriate message to the user
  }
}

// Function to save data to session storage
function saveToSessionStorage(key, value) {
  try {
    sessionStorage.setItem(key, value);
    console.log("Data saved to session storage: ", key, value);
  } catch (error) {
    console.error("Error saving data to session storage:", error);
    // Handle error and display appropriate message to the user
  }
}

// Function to retrieve data from local storage
function getFromLocalStorage(key) {
  try {
    const value = localStorage.getItem(key);
    if (value === null) {
      console.log("No data found in local storage for key: ", key);
      // Handle empty data and display appropriate message to the user
      return null;
    }
    console.log("Data retrieved from local storage: ", key, value);
    return value;
  } catch (error) {
    console.error("Error retrieving data from local storage:", error);
    // Handle error and display appropriate message to the user
    return null;
  }
}

// Function to retrieve data from session storage
function getFromSessionStorage(key) {
  try {
    const value = sessionStorage.getItem(key);
    if (value === null) {
      console.log("No data found in session storage for key: ", key);
      // Handle empty data and display appropriate message to the user
      return null;
    }
    console.log("Data retrieved from session storage: ", key, value);
    return value;
  } catch (error) {
    console.error("Error retrieving data from session storage:", error);
    // Handle error and display appropriate message to the user
    return null;
  }
}

$(".navbar-brand").click(function (event) {
  event.preventDefault();
  window.location.assign("index.html");
});

document.addEventListener("DOMContentLoaded", () => {
  let isSearchBarFocused = false; // Variable to track search bar focus

  // Function to fetch breweries by postal code or city
  function fetchBreweriesByPostalCode(zipCodeOrCity) {
    const apiEndpoint = isNaN(zipCodeOrCity)
      ? `https://api.openbrewerydb.org/breweries?by_city=${encodeURIComponent(
          zipCodeOrCity
        )}`
      : `https://api.openbrewerydb.org/breweries?by_postal=${zipCodeOrCity}`;

    fetch(apiEndpoint)
      .then((response) => response.json())
      .then((data) => {
        // Process the brewery data here
        displaySearchResults(data);
        saveLocationToLocalStorage(zipCodeOrCity); // Save the location to local storage
        displaySavedLocations(); // Display the search history

        // Set the searched area
        const searchedArea = document.getElementById("searchedArea");
        searchedArea.textContent = zipCodeOrCity;
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle the error appropriately, such as showing an error message to the user
      });
  }

  // Function to generate search result items
  function generateSearchResult(result) {
    const resultItem = document.createElement("div");
    resultItem.className = "search-result";
    resultItem.innerHTML = `
      <h4 class="result-name">${result.name} - ${result.city}, ${result.state}</h4>
      <div class="brewery-address">Address: ${result.address_1}, ${result.city}, ${result.state}, ${result.postal_code}, ${result.country}</div>
      <div class="brewery-type">Type: ${result.brewery_type}</div>
      <br>
      <h5 class="contact-header">Contact</h5>
      <div class="brewery-contact">
        <div class="phone-number">Phone: ${result.phone}</div>
      </div>
      <button class="btn about-btn" type="about">About Brewery</button>
      <button class="btn direction-btn" type="get-directions">Get Directions</button>`;

    const directionButton = resultItem.querySelector(".direction-btn");

    // Add info to local storage for the maps page
    directionButton.addEventListener("click", function () {
      saveToLocalStorage("breweryName", result.name);
      saveToLocalStorage(
        "breweryAddress",
        JSON.stringify([
          result.address_1,
          result.city,
          result.state,
          result.postal_code,
        ])
      );
      redirectToDirectionsPage();
    });

    const aboutButton = resultItem.querySelector(".about-btn");
    aboutButton.addEventListener("click", () => redirectToBreweryPage(result));

    return resultItem;
  }

  // Function to redirect to the directions page
  function redirectToDirectionsPage(result) {
    sessionStorage.setItem('breweryData', JSON.stringify(result));
    sessionStorage.setItem('brewerySearchInput', document.querySelector('input[type="search"]').value); // Save the searched location
    window.location.href = 'directions.html';
   }

  // Function to redirect to the brewery about page
function redirectToBreweryPage(result) {
  sessionStorage.setItem('breweryData', JSON.stringify(result));
  sessionStorage.setItem('brewerySearchInput', document.querySelector('input[type="search"]').value); // Save the searched location
  window.location.href = 'brewery.html';
 }
 
 
 
  // Function to display the search results
  function displaySearchResults(results) {
    const searchResultsContainer = document.getElementById("searchResults");
    const searchResultsCount = document.getElementById("searchResultsCount");

    searchResultsContainer.innerHTML = "";
    searchResultsCount.textContent = results.length;

    results.forEach((result) => {
      const resultItem = generateSearchResult(result);
      searchResultsContainer.appendChild(resultItem);
    });
  }

  // Function to save the location to local storage
  function saveLocationToLocalStorage(zipCodeOrCity) {
    const savedLocations = getFromLocalStorage("brewerySearchLocations");
    if (!savedLocations.includes(zipCodeOrCity)) {
      savedLocations.push(zipCodeOrCity);
      const trimmedLocations = savedLocations.slice(-3); // Limit the saved locations to the last 3
      saveToLocalStorage("brewerySearchLocations", JSON.stringify(trimmedLocations));
    }
  }

  // Function to retrieve the saved locations from local storage
  function getSavedLocations() {
    const savedLocations = getFromLocalStorage("brewerySearchLocations");
    return savedLocations ? JSON.parse(savedLocations) : [];
  }

  // Function to display the search history as a dropdown
  function displaySavedLocations() {
    const savedLocationsContainer = document.getElementById("savedLocations");

    if (isSearchBarFocused) {
      savedLocationsContainer.style.display = "block";
    } else {
      savedLocationsContainer.style.display = "none";
    }

    savedLocationsContainer.innerHTML = "";

    const savedLocations = getSavedLocations();

    savedLocations.forEach((location) => {
      const locationItem = document.createElement("li");
      locationItem.className = "dropdown-item";
      locationItem.textContent = location;
      savedLocationsContainer.appendChild(locationItem);

      locationItem.addEventListener("click", () => {
        const searchInput = document.querySelector("input[type='search']");
        searchInput.value = location;
        fetchBreweriesByPostalCode(location);
      });
    });
  }

  // Add event listener to the search bar to display search history
  const searchInput = document.querySelector("input[type='search']");
  searchInput.addEventListener("click", () => {
    const savedLocationsContainer = document.getElementById("savedLocations");
    savedLocationsContainer.style.display = "block";
    displaySavedLocations(); // Display the search history
    isSearchBarFocused = true; // Set search bar focus to true
  });

  searchInput.addEventListener("focus", () => {
    isSearchBarFocused = true; // Set search bar focus to true
  });

  searchInput.addEventListener("blur", () => {
    isSearchBarFocused = false; // Set search bar focus to false
  });

  // Retrieve the searched location from session storage
  const searchedLocation = getFromSessionStorage("brewerySearchInput");

  // Check if a location was searched in index.html
  if (searchedLocation) {
    // Fetch breweries based on the searched location
    fetchBreweriesByPostalCode(searchedLocation);

    // Clear the searched location from session storage
    sessionStorage.removeItem("brewerySearchInput");
  }

  // Form submit event handler
  const form = document.querySelector("form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const postalCodeInput = document.querySelector("input[type='search']");
    const postalCode = postalCodeInput.value.trim();
    if (postalCode !== "") {
      fetchBreweriesByPostalCode(postalCode);
    }
  });

  // Display the search history and searched area on page load
  displaySavedLocations();
});