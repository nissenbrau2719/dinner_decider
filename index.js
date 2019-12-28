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

  const startupForm =
  `<h2 class="opener">Trouble deciding where to eat?<br>Indecisive friends and family?<br>Restaurant Roulette will figure it out for you!</h2>
  <p>Let's take a gamble on your next meal...</p> 
  <button id="js-getStarted">Get Started</button>
  <p class="instructions">Search and results powered by<br>
  <a href="https://www.yelp.com/" target="_blank"><img id="yelpLogo" src="https://s3-media3.fl.yelpcdn.com/assets/srv0/yelp_design_web/b085a608c15f/assets/img/logos_desktop/default@2x.png" alt="Yelp Logo"></a></p>`;
  
  const priceForm =
  `<fieldset>
  <legend><h2>How expensive would you like your restaurant options to be?</h2></legend>
  <ul>
    <li><input type="checkbox" name="priceRange" id="inexpensive" value="1"><label for="inexpensive">Inexpensive</label></li>
    <li><input type="checkbox" name="priceRange" id="moderate" value="2"><label for="moderate">Moderate</label></li>
    <li><input type="checkbox" name="priceRange" id="expensive" value="3"><label for="expensive">Expensive</label></li>
    <li><input type="checkbox" name="priceRange" id="very_expensive" value="4"><label for="very_expensive">Very Expensive</label></li>
  </ul>
  <button id="js-setPrices">Set Price Options</button>
  </fieldset>`;

  const foodForm =
  `<fieldset>
  <legend><h2>What types of food are you interested in right now?</h2></legend>
  <p class="instructions">Hold ctrl/command key to select multiple options.</p>
  <select id="foodChoice" multiple required>
    <option selected value="restaurants">Surprise Me</option>
    <option value="tradamerican">American (Traditional)</option>
    <option value="bbq">Barbecue</option>
    <option value="breakfast_brunch">Breakfast & Brunch</option>
    <option value="buffets">Buffet</option>
    <option value="burgers">Burgers</option>
    <option value="cafes">Cafe</option>
    <option value="cajun">Cajun/Creole</option>
    <option value="caribbean">Caribbean</option>
    <option value="chinese">Chinese</option>
    <option value="comfort_food">Comfort Food</option>
    <option value="delis">Deli</option>
    <option value="diners">Diner</option>
    <option value="eastern_european">Eastern European</option>
    <option value="ethiopian">Ethiopian</option>
    <option value="french">French</option>
    <option value="hotdogs">Fast Food</option>
    <option value="indpak">Indian</option>
    <option value="italian">Italian</option>
    <option value="kebab">Kebabs</option>
    <option value="korean">Korean</option>
    <option value="mexican">Mexican</option>
    <option value="mideastern">Middle Eastern</option>
    <option value="noodles">Noodles</option>
    <option value="pizza">Pizza</option>
    <option value="pubfood">Pub Food</option>
    <option value="salad">Salad</option>
    <option value="sandwiches">Sandwiches</option>
    <option value="seafood">Seafood</option>
    <option value="soulfood">Soul Food</option>
    <option value="soup">Soup</option>
    <option value="steak">Steakhouse</option>
    <option value="sushi">Sushi</option>
    <option value="tapasmallplates">Tapas/Small Plates</option>
    <option value="thai">Thai</option>
    <option value="vegan">Vegan</option>
    <option value="vegetarian">Vegetarian</option>
    <option value="vietnamese">Vietnamese</option>
    <option value="wraps">Wraps</option>
  </select>
  <button id="js-foodChoices">Submit Food Options</button>
</fieldset>`;

  const searchAreaForm =
  `<fieldset>
    <legend><h2>How far are you willing to travel?</h2></legend>
    <label for="distance">Enter distance in mi:</label>
    <input type="number" name="distance" id="distance" value="3" min="0.5" max="20" step="0.5" required>   
    <button id="js-submitDistance">Submit Distance</button>
  </fieldset>`;

  const startLocationForm =
  `<fieldset>
    <legend><h2>Please enter your starting location</h2></legend>
    <p class="instructions">For best results, omit apartment/suite numbers</p>
    <label for="streetAddress">Street Address:</label>
    <input type="text" name="streetAddress" id="streetAddress">
    <label for="city">City:</label>
    <input type="text" name="city" id="city" required>
    <label for="state">State:</label>
    <input type="text" name="state" id="state" required>
    <button id="js-submitLocation">Submit Location</button>
  </fieldset>`;

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
  $("#errorMessage").empty();
  $('form').addClass('hidden');
  $('#js-reroll').removeClass('hidden');
  $('#restaurantDetails').html(
    `<div id="restaurantNameContainer"><h2>${selectedRestaurant.name}</h2></div>
    <address>${displayAddress}</address>
    <p>Phone: ${selectedRestaurant.display_phone}</p>
    <p>Price Level: ${selectedRestaurant.price}</p>
    <p>Rated ${selectedRestaurant.rating} stars by ${selectedRestaurant.review_count} Yelp users</p>
    <a target="_blank" href="${selectedRestaurant.url}">Get reviews, directions, hours, and more at Yelp</a>`
  );
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
      $("form").html(foodForm);
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
      $("form").html(priceForm);
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
      $("form").html(searchAreaForm);
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
    $('form').html(startLocationForm);
  });
}

//reset variables and restart app, return to original display settings
function startApp() {
  resetAll();
  $('#js-results').addClass('hidden');
  $('#js-reroll').removeClass('hidden');
  $('form').html(startupForm);
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
    $('form').html(priceForm);
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