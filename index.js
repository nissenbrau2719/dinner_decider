let priceStr,
    selectedFoodTypes,
    searchLocation,
    searchRadius,
    restaurantList,
    selectedRestaurant,
    myLat,
    myLng,
    displayAddress,
    resultsOffset = 51,
    totalResults,
    howExpensive;

const yelpKey = config.yfapi,
      openCageDataKey = config.ocdapi;


// hide results screen
function removeResults() {
  $('h1').text('Restaurant Roulette');
  $('#js-results').addClass('hidden');
  $('#errorMessage').empty();
  $('#restaurantDetails').empty();
}

function resetAll() {
  resetRestaurantParams();
  searchLocation = "";
  searchRadius = "";
  myLat = "";
  myLng = "";
}

function resetRestaurantParams() {
  removeResults();
  howExpensive = [];
  priceStr = "";
  selectedFoodTypes = "";
  restaurantList = [];
  selectedRestaurant = {};
  resultsOffset = 51;
  totalResults = 0;
}

//choose a random restaurant from user's search results, populate results screen with selected restaurant's info, hide form and display results screen
function displayResults() {
  getRandomRestaurantFromList();
  formatSelectedRestaurantAddress();
  const restaurantDetails = (
    `<div id="restaurantNameContainer"><h2>${selectedRestaurant.name}</h2></div>
    <address>${displayAddress}</address>
    <p>Phone: ${selectedRestaurant.display_phone}</p>
    <p>Price Level: ${selectedRestaurant.price}</p>
    <p>Rated ${selectedRestaurant.rating} stars by ${selectedRestaurant.review_count} Yelp users</p>
    <a target="_blank" href="${selectedRestaurant.url}">Get reviews, directions, hours, and more at Yelp</a>`
  )
  $("#errorMessage").empty();
  $('form').addClass('hidden');
  $('#js-reroll').removeClass('hidden');
  $('#restaurantDetails').html(restaurantDetails);
  $('h1').text("How about eating at");
  $('#js-results').removeClass('hidden');
}

function getRandomRestaurantFromList() {
  selectedRestaurant = restaurantList[Math.floor(Math.random() * restaurantList.length)];
}

function formatSelectedRestaurantAddress() {
  displayAddress = selectedRestaurant.location.display_address.join("<br>");
}

//display screen for zero search results with user's chosen parameters
function displayNoResults() {
  $("#errorMessage").empty();
  $('form').addClass('hidden');
  $('#js-reroll').addClass('hidden');
  $('#restaurantDetails').append("<h2>Sorry, we found no restaurants that fit your search criteria.<br>Would you like to restart?</h2>");
  $('#js-results').removeClass('hidden');
}

//repeat calls to Yelp Fusion API to complete results list if there are more than 50 resulting restaurants, display results when complete
function findMoreRestaurants() {
  let options = {
    headers: new Headers({
      Authorization: `Bearer ${yelpKey}`
    })
  }
  let url = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?price=${priceStr}&limit=50&latitude=${myLat}&longitude=${myLng}&open_now=true&radius=${searchRadius}&categories=${selectedFoodTypes}&offset=${resultsOffset}`;
  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      restaurantList = restaurantList.concat(responseJson.businesses);
      if (restaurantList.length === (totalResults - 1)) {
        displayResults();
      } else {
        resultsOffset += 50;
        if(resultsOffset > 950) {
          displayResults();
        } else {
          findMoreRestaurants();
        }
      }
    })
    .catch(error => $('#errorMessage').text(`Something went wrong: ${error.message}`));
}

//call Yelp Fusion API and get list of restaurants according to user's search area, price options, and food types preferences. Display results screen if results < 50 or make more calls to complete list of results
function findRestaurants() {
  let options = {
    headers: new Headers({
      Authorization: `Bearer ${yelpKey}`
    })
  }
  let url = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?price=${priceStr}&limit=50&latitude=${myLat}&longitude=${myLng}&open_now=true&radius=${searchRadius}&categories=${selectedFoodTypes}`;
  console.log(`Finding ${selectedFoodTypes} with price options (${priceStr}) within ${searchRadius} m of ${myLat}, ${myLng}`);
  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    })
    .then(responseJson => {
      console.log(`Found ${responseJson.total} restaurants with these search parameters that are open now`);
      totalResults = responseJson.total;
      restaurantList = responseJson.businesses;
      if (responseJson.total === 0) {
        displayNoResults();
      } else if (responseJson.total > 0 && responseJson.total <= 50) {
        displayResults();
      } else {
        findMoreRestaurants();
      }
    })
    .catch(error => $('#errorMessage').text(`Something went wrong: ${error.message}`));
}

//save the user's desired food options to a variable, call the next function to get restaurant options from Yelp Fusion API
function watchFoodChoicesBtn() {
  $(document).on("click", "#js-foodChoices", event => {
    event.stopPropagation();
    event.preventDefault();
    let foodChoicesArray = $('#foodChoice').val();
    if(foodChoicesArray.length === 0) {
      $("#errorMessage").text("Please select at least one food option");
    } else if(foodChoicesArray.length > 10) {
      $("#errorMessage").text("Please limit your options to 10 or fewer types");
    } else {
      $("#errorMessage").empty();
      selectedFoodTypes = foodChoicesArray.toString();
      findRestaurants();
    }
  });
}

//get user's acceptable price options on submit, display next screen if successful
function watchSetPricesBtn() {
  $(document).on("click", "#js-setPrices", event => {
    event.stopPropagation();
    event.preventDefault();
    $('input[name=priceRange]:checked').map(function () {
      howExpensive.push($(this).val());
    });
    if (howExpensive.length === 0) {
      $("#errorMessage").text('Please select one or more price options');
    } else {
      priceStr = howExpensive.toString();
      $("#errorMessage").empty();
      $("form").html(content.foodForm);
    }
  })
}

//get user input for a desired search radius within Yelp parameters and save to variable to reference later. Display next screen if successful
function watchSubmitDistanceButton() {
  $(document).on('click', '#js-submitDistance', event => {
    event.stopPropagation();
    event.preventDefault();
    if ($('#distance').val() < 0.5 || $('#distance').val() > 20) {
      $("#errorMessage").text("Please keep your search radius between 0.5 mi and 20 mi");
    } else {
      searchRadiusToMeters();
      $("form").html(content.priceForm);
      $("#errorMessage").empty();
    }
  })
}

// convert searchRadius to meters and round to integer to comply with Yelp Fusion radius parameters
function searchRadiusToMeters() {
  searchRadius = Math.round($('#distance').val() * 1609.344);
}

//call OpenCageData geocoding api with starting location and save resulting coordinates to variables to use later, display next screen if successful
function getGeoLocation() {
  fetch(`https://api.opencagedata.com/geocode/v1/json?q=${searchLocation}&key=${openCageDataKey}`)
    .then(response => {
      if (response.ok) {
        return response.json()
      }
      throw new Error(response.statusText)
    })
    .then(responseJson => {
      myLat = responseJson.results[0].geometry.lat;
      myLng = responseJson.results[0].geometry.lng;
      $("#errorMessage").empty();
      $("form").html(content.searchAreaForm);
    })
    .catch(error => $("#errorMessage").text(`Something went wrong: ${error.message}`));
}

// get the user's starting location and call getGeoLocation if entered properly
function watchSubmitLocationBtn() {
  $(document).on('click', '#js-submitLocation', function (event) {
    event.stopPropagation();
    event.preventDefault();
    if ($('#city').val() === "" || $('#state').val() === "") {
      $("#errorMessage").text("Must enter a valid address, enter city and state at minimum");
    } else {
      makeLocationQueryString();
      getGeoLocation();
    }
  });
}

// format user's starting location into proper syntax for OpenCageData parmeter
function makeLocationQueryString() {
  let locationArr = [];
      if ($('#streetAddress').val() !== "") {
        locationArr.push($('#streetAddress').val());
      }
      locationArr.push($('#city').val());
      locationArr.push($('#state').val());
      searchLocation = encodeURI(locationArr.join(", "));
}

// event handler for submission of landing page form, display next screen and call next function
function watchGetStartedBtn() {
  $(document).on('click', '#js-getStarted', event => {
    event.preventDefault();
    event.stopPropagation();
    $('form').html(content.startLocationForm);
  });
}

//reset variables and restart app, return to original display settings
function startApp() {
  resetAll();
  $('#js-results').addClass('hidden');
  $('#js-reroll').removeClass('hidden');
  $('form').html(content.startupForm);
  $('form').removeClass('hidden');
  $('#restaurantDetails').empty();
}

// event listener for restart/home button on nav bar
function watchHomeButton() {
   $('#home').click(event => {
    event.preventDefault();
    event.stopPropagation();
    startApp();
  });
}

// event listener for 'get another restaurant' button on results screen
function watchReRollButton() {
  $('#js-reroll').click(event => {
    event.preventDefault();
    event.stopPropagation();
    displayResults();
  });
}

// event listener for 'change restaurant preferences' button on results screen
function watchChangeRestaurantPrefsBtn() {
  $('#js-newFoodParams').click(event => {
    event.preventDefault();
    event.stopPropagation();
    resetRestaurantParams();
    $('form').html(content.priceForm);
    $('form').removeClass('hidden');
  });
}

// event handler for 'start new search' button on results screen
function watchStartNewSearchBtn() {
   $('#js-startOver').click(event => {
    event.preventDefault();
    event.stopPropagation();
    startApp();
  });
}

// call all event listeners and render landing screen
function initializeApp() {
  watchHomeButton();
  watchReRollButton();
  watchChangeRestaurantPrefsBtn();
  watchStartNewSearchBtn();
  watchGetStartedBtn();
  watchSubmitLocationBtn();
  watchSubmitDistanceButton();
  watchSetPricesBtn();
  watchFoodChoicesBtn();
  startApp();
}

$(initializeApp);