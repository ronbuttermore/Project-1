document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch breweries by postal code
    function fetchBreweriesByPostalCode(postalCode) {
      const apiEndpoint = `https://api.openbrewerydb.org/breweries?by_postal=${postalCode}`;
  
      fetch(apiEndpoint)
        .then((response) => response.json())
        .then((data) => {
          // Process the brewery data here
          displaySearchResults(data);
          saveZipCodeToLocalStorage(postalCode); // Save the zip code to local storage
          displaySavedZipCodes(); // Display the search history
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
  
    // Function to save the zip code to local storage
    function saveZipCodeToLocalStorage(zipCode) {
        // Get the saved zip codes from local storage
        let savedZipCodes = localStorage.getItem('savedZipCodes');
        savedZipCodes = savedZipCodes ? JSON.parse(savedZipCodes) : [];

        // Check if the zip code is already saved
        if (!savedZipCodes.includes(zipCode)) {
        savedZipCodes.push(zipCode);
        savedZipCodes = savedZipCodes.slice(-3);
        localStorage.setItem('savedZipCodes', JSON.stringify(savedZipCodes));
        }
    }

    // Function to retrieve the saved zip codes from local storage
    function getSavedZipCodes() {
    const savedZipCodes = localStorage.getItem('savedZipCodes');
    return savedZipCodes ? JSON.parse(savedZipCodes) : [];
  }
      

    // Function to display the search history as a dropdown
    function displaySavedZipCodes() {
      const savedZipCodesContainer = document.getElementById('savedCities');
      savedZipCodesContainer.innerHTML = '';

      const savedZipCodes = getSavedZipCodes();

      savedZipCodes.forEach((zipCode) => {
        const zipCodeItem = document.createElement('li');
        zipCodeItem.className = 'dropdown-item';
        zipCodeItem.textContent = zipCode;
        savedZipCodesContainer.appendChild(zipCodeItem);

        zipCodeItem.addEventListener('click', () => {
          const searchInput = document.querySelector('input[type="search"]');
          searchInput.value = zipCode;
          fetchBreweriesByPostalCode(zipCode);
        });
      });
    }

    // Add event listener to the search bar to display search history
  const searchInput = document.querySelector('input[type="search"]');
  searchInput.addEventListener('click', () => {
    const savedCitiesContainer = document.getElementById('savedCities');
    savedCitiesContainer.style.display = 'block';
    displaySavedZipCodes(); // Display the search history
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

    // Display the search history on page load
    displaySavedZipCodes();

    });
  });


    
  