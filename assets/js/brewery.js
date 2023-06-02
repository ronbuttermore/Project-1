document.addEventListener('DOMContentLoaded', () => {
    const breweryData = sessionStorage.getItem('breweryData');
    if (breweryData) {
      const result = JSON.parse(breweryData);
      displayBreweryData(result);
      sessionStorage.removeItem('breweryData');
    }
  });
  
  function displayBreweryData(result) {
    const breweryNameElement = document.getElementById('brewery-name');
    const breweryLogoElement = document.getElementById('brewery-logo');
    const websitePreviewElement = document.getElementById('website-preview');
  
    breweryNameElement.textContent = result.name;
    breweryLogoElement.src = result.image_url;
    websitePreviewElement.innerHTML = `<iframe src="${result.website_url}" class="website-iframe"></iframe>`;
  }
  
// coding for brewery about page
$("#about-directions-btn").click(function(event){
    event.preventDefault();
    // pull information from url to put into directions?
    window.location.assign("directions.html"); 
  });
  
  const map = tt.map({
    key: "9GgFvkDZz2WjiY63GGreVAvcuKo7Ztvl",
    container: "map",
    center: [-104.990250,39.739235],
    zoom: 10
  });
  