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
    const aboutSectionOneTitleElement = document.getElementById('about-section-one-title');
    const aboutSectionOneInfoElement = document.getElementById('about-section-one-info');
    const aboutSectionTwoTitleElement = document.getElementById('about-section-two-title');
    const aboutSectionTwoInfoElement = document.getElementById('about-section-two-info');
    const aboutSectionThreeTitleElement = document.getElementById('about-section-three-title');
    const aboutSectionThreeInfoElement = document.getElementById('about-section-three-info');
  
    breweryNameElement.textContent = result.name;
    breweryLogoElement.src = result.image_url;
    aboutSectionOneTitleElement.textContent = result.section_one_title;
    aboutSectionOneInfoElement.textContent = result.section_one_info;
    aboutSectionTwoTitleElement.textContent = result.section_two_title;
    aboutSectionTwoInfoElement.textContent = result.section_two_info;
    aboutSectionThreeTitleElement.textContent = result.section_three_title;
    aboutSectionThreeInfoElement.textContent = result.section_three_info;
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
  