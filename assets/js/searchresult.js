document.addEventListener('DOMContentLoaded', () => {
  // Function to fetch breweries by postal code or city
  function fetchBreweriesByPostalCodeOrCity(zipCodeOrCity) {
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
        saveLocationToLocalStorage(zipCodeOrCity); // Save the zip code or city to local storage
        displaySavedLocations(); // Display the search history
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
      <h6 class="contact-header">Contact</h6>
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
    searchResultsContainer.innerHTML = '';

    results.forEach((result) => {
      const resultItem = generateSearchResult(result);
      searchResultsContainer.appendChild(resultItem);
    });
  }

  // Function to save the zip code or city to local storage
  function saveLocationToLocalStorage(zipCodeOrCity) {
    let savedLocations = localStorage.getItem('savedLocations');
    savedLocations = savedLocations ? JSON.parse(savedLocations) : [];

    if (!savedLocations.includes(zipCodeOrCity)) {
      savedLocations.push(zipCodeOrCity);
      savedLocations = savedLocations.slice(-3);
      localStorage.setItem('savedLocations', JSON.stringify(savedLocations));
    }
  }

  // Function to retrieve the saved zip codes and cities from local storage
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
        fetchBreweriesByPostalCodeOrCity(location);
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
    const locationInput = document.querySelector('input[type="search"]');
    const location = locationInput.value.trim();
    if (location !== '') {
      fetchBreweriesByPostalCodeOrCity(location);
    }

    // Display the search history on page load
    displaySavedLocations();
  });
});
