let priceStr,
  selectedFoodTypes,
  searchLocation,
  searchRadius,
  restaurantList,
  selectedRestaurant,
  map,
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
  <button id="js-getStarted">Get Started</button>`

const priceForm =
  `<fieldset>
  <legend><h2>How expensive would you like your restaurant options to be?</h2></legend>
  <ul>
    <li><input type="checkbox" name="priceRange" id="inexpensive" value="1"><label for="inexpensive">Inexpensive</label></li>
    <li><input type="checkbox" name="priceRange" id="moderate" value="2"><label for="moderate">Moderate</label></li>
    <li><input type="checkbox" name="priceRange" id="expensive" value="3"><label for="expensive">Expensive</label></li>
    <li><input type="checkbox" name="priceRange" id="very_expensive" value="4"><label for="very_expensive">Very Expensive</label></li>
  </ul>
  <button type="submit" id="js-setPrices">Set Price Options</button>
  </fieldset>`;

const foodForm =
  `<fieldset>
  <legend><h2>What types of food are you interested in right now?</h2></legend>
  <p>Hold ctrl/command key to select multiple options.</p>
  <select id="foodChoice" multiple required>
    <option selected value="restaurants">Surprise Me</option>
    <option value="hotdogs">Fast Food</option>
    <option value="delis">Deli</option>
    <option value="bbq">Barbecue</option>
    <option value="breakfast_brunch">Breakfast & Brunch</option>
    <option value="pizza">Pizza</option>
    <option value="buffets">Buffet</option>
    <option value="sandwiches">Sandwiches</option>
    <option value="diners">Diner</option>
    <option value="ethiopian">Ethiopian</option>
    <option value="steak">Steakhouse</option>
    <option value="french">French</option>
    <option value="burgers">Burgers</option>
    <option value="noodles">Noodles</option>
    <option value="chinese">Chinese</option>
    <option value="cafes">Cafe</option>
    <option value="mexican">Mexican</option>
    <option value="italian">Italian</option>
    <option value="mideastern">Middle Eastern</option>
    <option value="soulfood">Soul Food</option>
    <option value="eastern_european">Eastern European</option>
    <option value="sushi">Sushi</option>
    <option value="thai">Thai</option>
    <option value="cajun">Cajun/Creole</option>
    <option value="indpak">Indian</option>
    <option value="seafood">Seafood</option>
    <option value="kebab">Kebabs</option>
    <option value="vegan">Vegan</option>
    <option value="vegetarian">Vegetarian</option>
    <option value="caribbean">Caribbean</option>
    <option value="tradamerican">American (Traditional)</option>
    <option value="soup">Soup</option>
    <option value="comfort_food">Comfort Food</option>
    <option value="pubfood">Pub Food</option>
    <option value="vietnamese">Vietnamese</option>
    <option value="soup">Soup</option>
    <option value="salad">Salad</option>
    <option value="korean">Korean</option>
    <option value="tapasmallplates">Tapas/Small Plates</option>
    <option value="wraps">Wraps</option>
  </select>
  <button type="submit" id="js-foodChoices">Submit Food Options</button>
</fieldset>`;

const searchAreaForm =
  `<fieldset>
    <legend><h2>How far are you willing to travel?</h2></legend>
    <label for="distance">Enter distance in mi:</label>
    <input type="number" name="distance" id="distance" value="3" min="0.5" max="20" step="0.5" required>   
    <button type="submit" id="js-submitDistance">Submit Distance</button>
  </fieldset>`

const searchLocationForm =
  `<fieldset>
    <legend><h2>Please enter your starting location</h2></legend>
    <p>For best results, omit apartment/suite numbers</p>
    <label for="streetAddress">Street Address:</label>
    <input type="text" name="streetAddress" id="streetAddress">
    <label for="city">City:</label>
    <input type="text" name="city" id="city" required>
    <label for="state">State:</label>
    <input type="text" name="state" id="state" required>
    <button type="submit" id="js-submitLocation">Submit Location</button>
  </fieldset>`;

function removeResults() {
  $('h1').text('Restaurant Roulette');
  $('#js-results').addClass('hidden');
  $('#errorMessage').empty();
  $('#restaurantDetails').empty();
}

function resetAll() {
  removeResults();
  $("form").off();
  priceStr = "";
  selectedFoodTypes = "";
  searchLocation = "";
  searchRadius = "";
  restaurantList = [];
  selectedRestaurant = {};
  myLat = "";
  myLng = "";
  resultsOffset = 51;
  totalResults = 0;
}

function resetRestaurantParams() {
  removeResults();
  $("form").off();
  priceStr = "";
  selectedFoodTypes = "";
  restaurantList = [];
  selectedRestaurant = {};
  resultsOffset = 51;
  totalResults = 0;
}

function displayResults() {
  selectedRestaurant = restaurantList[Math.floor(Math.random() * restaurantList.length)];
  displayAddress = selectedRestaurant.location.display_address.join("<br>");
  $("#errorMessage").empty();
  $('form').addClass('hidden');
  $('#restaurantDetails').html(
    `<h2>${selectedRestaurant.name}</h2>
    <address>${displayAddress}</address>
    <p>Phone: ${selectedRestaurant.display_phone}</p>
    <p>Price Level: ${selectedRestaurant.price}</p>
    <p>Rated ${selectedRestaurant.rating} stars by ${selectedRestaurant.review_count} Yelp users</p>
    <a target="_blank" href="${selectedRestaurant.url}">Check out the Yelp page for hours, directions, and more info</a>`
  );
  $('h1').text("How about eating at");
  $('#js-results').removeClass('hidden');
}

function displayNoResults() {
  $("#errorMessage").empty();
  $('form').addClass('hidden');
  $('#js-reroll').addClass('hidden');
  $('#restaurantDetails').append("<h2>Sorry, we found no restaurants that fit your search criteria.<br>Would you like to restart?</h2>");
  $('#js-results').removeClass('hidden');
}

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
        findMoreRestaurants();
      }
    })
    .catch(error => $('#errorMessage').text(`Something went wrong: ${error.message}`));
}

function findRestaurants() {
  let options = {
    headers: new Headers({
      Authorization: `Bearer ${yelpKey}`
    })
  }
  let url = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?price=${priceStr}&limit=50&latitude=${myLat}&longitude=${myLng}&open_now=true&radius=${searchRadius}&categories=${selectedFoodTypes}`;
  console.log(`finding ${selectedFoodTypes} with price options (${priceStr}) within ${searchRadius} m of ${myLat}, ${myLng}`);
  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    })
    .then(responseJson => {
      console.log(`Found ${responseJson.total} restaurants with these search parameters`);
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

function getFoodTypes() {
  selectedFoodTypes = "";
  $("form").on("click", "#js-foodChoices", event => {
    event.stopPropagation();
    event.preventDefault();
    selectedFoodTypes = $('#foodChoice').val();
    if (selectedFoodTypes.length > 10) {
      $("#errorMessage").text("Please limit your options to 10 or fewer types of food");
    } else {
      $("#errorMessage").empty();
      findRestaurants();
    }
  });
}

function getPriceRange() {
  howExpensive = [];
  $("form").on("click", "#js-setPrices", event => {
    event.stopPropagation();
    event.preventDefault();
    $('input[name=priceRange]:checked').map(function () {
      howExpensive.push($(this).val());
    });
    if (howExpensive.length === 0) {
      $("#errorMessage").text('Please select one or more price options');
    } else {
      priceStr = howExpensive.join(",");
      $("#errorMessage").empty();
      $("form").html(foodForm);
      getFoodTypes();
    }
  })
}

function getSearchRadius() {
  searchRadius = "";
  $('form').on('click', '#js-submitDistance', event => {
    event.stopPropagation();
    event.preventDefault();
    if ($('#distance').val() < 0.5 || $('#distance').val() > 20) {
      $("#errorMessage").text("Please keep your search radius between 0.5 mi and 20 mi");
    } else {
      searchRadius = Math.floor($('#distance').val() * 1609.344);
      $("form").html(priceForm);
      $("#errorMessage").empty();
      getPriceRange();
    }
  })
}

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
      getSearchRadius();
    })
    .catch(error => $("#errorMessage").text(`Something went wrong: ${error.message}`));
}

function getSearchParams() {
  $('form').on('click', '#js-submitLocation', function (event) {
    event.stopPropagation();
    event.preventDefault();
    if ($('#city').val() === "" || $('#state').val() === "") {
      $("#errorMessage").text("Please enter a valid address to start your search from, or at least a city and state");
    } else {
      let locationArr = [];
      if ($('#streetAddress').val() !== "") {
        locationArr.push($('#streetAddress').val());
      }
      locationArr.push($('#city').val());
      locationArr.push($('#state').val());
      searchLocation = encodeURI(locationArr.join(", "));
      $("#errorMessage").empty();
      getGeoLocation();
    }
  });
}

function watchForm() {
  $('form').on('click', '#js-getStarted', event => {
    event.stopPropagation();
    event.preventDefault();
    $('form').html(searchLocationForm);
    getSearchParams();
  });
}

function startApp() {
  resetAll();
  $('#js-results').addClass('hidden');
  $('#js-reroll').removeClass('hidden');
  $('form').html(startupForm);
  $('form').removeClass('hidden');
  $('#restaurantDetails').empty();
  watchForm();
}

function initialize() {
  $('#home').click(event => {
    event.preventDefault();
    event.stopPropagation();
    startApp();
  });
  $('#js-reroll').click(event => {
    event.preventDefault();
    event.stopPropagation();
    displayResults();
  });
  $('#js-newFoodParams').click(event => {
    event.preventDefault();
    event.stopPropagation();
    resetRestaurantParams();
    $('form').html(priceForm);
    $('form').removeClass('hidden');
    getPriceRange();
  });
  $('#js-startOver').click(event => {
    event.preventDefault();
    event.stopPropagation();
    startApp();
  });
  startApp();
}

$(initialize);