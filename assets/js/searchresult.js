document.addEventListener('DOMContentLoaded', () => {
  // Function to fetch breweries by postal code
  function fetchBreweriesByPostalCode(zipCodeOrCity) {
    let apiEndpoint;
    if (isNaN(zipCodeOrCity)) {
      apiEndpoint = `https://api.openbrewerydb.org/breweries?by_city=${encodeURIComponent(zipCodeOrCity)}`;
    } else {
      apiEndpoint = `https://api.openbrewerydb.org/breweries?by_postal=${zipCodeOrCity}`;
    }

    fetch(apiEndpoint)
      .then((response) => response.json())
      .then((data) => {
        // Process the brewery data here
        displaySearchResults(data);
        saveLocationToLocalStorage(zipCodeOrCity); // Save the location to local storage
        displaySavedLocations(); // Display the search history

        // Set the searched area
        const searchedArea = document.getElementById('searchedArea');
        searchedArea.textContent = zipCodeOrCity;
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  }

  // Function to generate search result items
  function generateSearchResult(result) {
    const resultItem = document.createElement('div');
    resultItem.className = 'search-result';
    resultItem.innerHTML = `
      <h4 class="result-name">${result.name} - ${result.city}, ${result.state}</h4>
      <div class="brewery-address">Address: ${result.address_1}, ${result.city}, ${result.state}, ${result.postal_code}, ${result.country}</div>
      <div class="brewery-type">Type: ${result.brewery_type}</div>
      <br>
      <h5 class="contact-header">Contact</h5>
      <div class="brewery-contact">
        <div class="phone-number">Phone: ${result.phone}</div>
        <div class="website">Website: <a href="${result.website_url}" target="_blank">${result.website_url}</a></div>
      </div>
      <button class="btn about-btn" type="about">About Brewery</button>
      <button class="btn direction-btn" type="get-directions">Get Directions</button>`;

    const directionButton = resultItem.querySelector('.direction-btn');
    directionButton.addEventListener('click', () => redirectToDirectionsPage());

    return resultItem;
  }

  // Function to redirect to the directions page
  function redirectToDirectionsPage() {
    window.location.href = 'directions.html';
  }

  // Function to display the search results
  function displaySearchResults(results) {
    const searchResultsContainer = document.getElementById('searchResults');
    const searchResultsCount = document.getElementById('searchResultsCount');

    searchResultsContainer.innerHTML = '';
    searchResultsCount.textContent = results.length;

    results.forEach((result) => {
      const resultItem = generateSearchResult(result);
      searchResultsContainer.appendChild(resultItem);
    });
  }

  // Function to save the zip code to local storage
  function saveLocationToLocalStorage(zipCodeOrCity) {
    // Get the saved zip codes/cities from local storage
    let savedLocations = localStorage.getItem('savedLocations');
    savedLocations = savedLocations ? JSON.parse(savedLocations) : [];

    // Check if the zip code is already saved
    if (!savedLocations.includes(zipCodeOrCity)) {
      savedLocations.push(zipCodeOrCity);
      savedLocations = savedLocations.slice(-3);
      localStorage.setItem('savedLocations', JSON.stringify(savedLocations));
    }
  }

  // Function to retrieve the saved zip codes from local storage
  function getSavedLocations() {
    const savedLocations = localStorage.getItem('savedLocations');
    return savedLocations ? JSON.parse(savedLocations) : [];
  }

  // Function to display the search history as a dropdown
  function displaySavedLocations() {
    const savedLocationsContainer = document.getElementById('savedLocations');
    savedLocationsContainer.innerHTML = '';

    const savedLocations = getSavedLocations();

    savedLocations.forEach((location) => {
      const locationItem = document.createElement('li');
      locationItem.className = 'dropdown-item';
      locationItem.textContent = location;
      savedLocationsContainer.appendChild(locationItem);

      locationItem.addEventListener('click', () => {
        const searchInput = document.querySelector('input[type="search"]');
        searchInput.value = location;
        fetchBreweriesByPostalCode(location);
      });
    });
  }

  // Add event listener to the search bar to display search history
  const searchInput = document.querySelector('input[type="search"]');
  searchInput.addEventListener('click', () => {
    const savedLocationsContainer = document.getElementById('savedLocations');
    savedLocationsContainer.style.display = 'block';
    displaySavedLocations(); // Display the search history
  });

  // Form submit event handler
  const form = document.querySelector('form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const postalCodeInput = document.querySelector('input[type="search"]');
    const postalCode = postalCodeInput.value.trim();
    if (postalCode !== '') {
      fetchBreweriesByPostalCode(postalCode);
    }
  });


  // Display the search history and searched area on page load
  displaySavedLocations();
});
