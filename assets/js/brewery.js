$(".navbar-brand").click(function(event){
  event.preventDefault();
  window.location.assign("index.html"); 
});


document.addEventListener('DOMContentLoaded', () => {
    const breweryData = sessionStorage.getItem('breweryData');
    if (breweryData) {
      const result = JSON.parse(breweryData);
      displayBreweryData(result);
      sessionStorage.removeItem('breweryData');
    }

    const backButton = document.querySelector('.back-btn');
    backButton.addEventListener('click', redirectToSearchResultPage);

  });

  
  function displayBreweryData(result) {
    const breweryNameElement = document.getElementById('brewery-name');
    const websitePreviewElement = document.getElementById('website-preview');
  
    breweryNameElement.textContent = result.name;
    websitePreviewElement.innerHTML = `<iframe src="${result.website_url}" class="website-iframe"></iframe>`;

    if (result.brewery_type == "brewpub") {
      $("#brewpub-icon").removeClass("hide");
    }
    if (result.brewery_type == "contract") {
      $("#contract-icon").removeClass("hide");
    }
    if (result.brewery_type == "large") {
      $("#large-icon").removeClass("hide");
    }
    if (result.brewery_type == "micro") {
      $("#microwbrew-icon").removeClass("hide");
    }
    if (result.brewery_type == "planning") {
      $("#planning-icon").removeClass("hide");
    }
    if (result.brewery_type == "proprietor") {
      $("#proprietor-icon").removeClass("hide");
    }
    if (result.brewery_type == "regional") {
      $("#regional-icon").removeClass("hide");
    }
  }

  // Function to redirect back to the search result page
function redirectToSearchResultPage() {
    const searchInputValue = sessionStorage.getItem('brewerySearchInput');
    if (searchInputValue) {
      sessionStorage.setItem('brewerySearchInput', searchInputValue);
    }
    window.location.href = 'searchresult.html';
  }
  
  