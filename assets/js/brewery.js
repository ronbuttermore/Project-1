$(".navbar-brand").click(function(event){
  event.preventDefault();
  window.location.assign("index.html"); 
});


document.addEventListener('DOMContentLoaded', () => {
    const breweryData = sessionStorage.getItem('breweryData');
    if (breweryData) {
      try {
      const result = JSON.parse(breweryData);
      displayBreweryData(result);
    } catch (error) {
      console.error('Error parsing breweryData:', error);
    } finally {
      sessionStorage.removeItem('breweryData');
    }
  }

  const backButton = document.querySelector('.back-btn');
  if (backButton) {
    backButton.addEventListener('click', redirectToSearchResultPage);
  }
});

  
function displayBreweryData(result) {
  try {
    const breweryNameElement = document.getElementById('brewery-name');
    const websitePreviewElement = document.getElementById('website-preview');

    if (breweryNameElement && websitePreviewElement) {
      breweryNameElement.textContent = result.name;
      websitePreviewElement.innerHTML = `<iframe src="${result.website_url}" class="website-iframe"></iframe>`;
    } else {
      throw new Error('Required DOM elements not found.');
    }

    const breweryType = result.brewery_type;
    if (breweryType) {
      const breweryIcons = {
        brewpub: '#brewpub-icon',
        contract: '#contract-icon',
        large: '#large-icon',
        micro: '#microwbrew-icon',
        planning: '#planning-icon',
        proprietor: '#proprietor-icon',
        regional: '#regional-icon'
      };
      const breweryIconSelector = breweryIcons[breweryType];
      if (breweryIconSelector) {
        $(breweryIconSelector).removeClass("hide");
      } else {
        throw new Error(`Invalid brewery type: ${breweryType}`);
      }
    } else {
      throw new Error('Brewery type not specified.');
    }
  } catch (error) {
    console.error('Error displaying brewery data:', error);
    // Handle the error appropriately, such as showing an error message to the user
  }
}

function redirectToSearchResultPage() {
  const searchInputValue = sessionStorage.getItem('brewerySearchInput');
  if (searchInputValue) {
    sessionStorage.setItem('brewerySearchInput', searchInputValue);
  }
  sessionStorage.setItem('previousPage', 'brewery.html'); // Save the previous page URL
  window.location.href = 'searchresult.html';
}




  
  
  
  