let priceStr = "";
let selectedFoodTypes = "";
let searchLocation = "";
let restaurantList = [];
let selectedRestaurant = {};
let map;
let myLat;
let myLng;
let selectedLat;
let selectedLng;
let displayAddress;

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
  <p>Choose 10 or fewer categories for best results</p>
  <select id="foodChoice" multiple required>
    <option value="restaurants">Surprise Me</option>
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
    <legend><h2>Please enter your starting location</h2></legend>
    <label for="streetAddress">Street Address:</label>
    <input type="text" name="streetAddress" id="streetAddress">
    <label for="city">City:</label>
    <input type="text" name="city" id="city" required>
    <label for="state">State:</label>
    <input type="text" name="state" id="state" required>
    <button type="submit" id="js-findRestaurants">Find Restaurants</button>
  </fieldset>`;



// function reset() {
//   priceStr = "";
//   foodTypesQueryStr = "";
//   searchLocation = "";
//   restaurantList = [];
//   selectedRestaurant = {};
//   myLat = "";
//   myLng = "";
//   selectedLat = "";
//   selectedLng = "";
//   $('h1').text("Dinner Decider");
//   $('form').removeClass('hidden');
//   $('#js-results').addClass('hidden');
//   $('#restaurantDetails').empty();
// }

function displayResults() {
  selectedRestaurant = restaurantList[Math.floor(Math.random() * restaurantList.length)];
  // console.log(selectedRestaurant);
  selectedLat = selectedRestaurant.coordinates.latitude;
  selectedLng = selectedRestaurant.coordinates.longitude;
  displayAddress = selectedRestaurant.location.display_address.join("<br>");
  $('form').addClass('hidden');
  $('#restaurantDetails').html(
    `<h2>${selectedRestaurant.name}</h2>
    <address>${displayAddress}</address>
    <p>Phone: ${selectedRestaurant.phone}</p>
    <p>Price Level: ${selectedRestaurant.price}</p>
    <p>Rated ${selectedRestaurant.rating} stars by ${selectedRestaurant.review_count} Yelp users</p>
    <a target="_blank" href="${selectedRestaurant.url}">Check out this restaurant's Yelp page</a>`
  ); 
  $('h1').text("How about eating at:")
  $('#js-results').removeClass('hidden');
  $('#js-reroll').click(function() {
    displayResults();
  });
}

function displayNoResults() {
  $('form').addClass('hidden');
  $('#js-reroll').addClass('hidden');
  $('h1').text("Sorry, we found no restaurants that fit your search criteria");
  $('#restaurantDetails').append("<h2>Would you like to restart?</h2>");
  $('#js-results').removeClass('hidden');
}

function makeRestaurantList(responseJson) {
  $("#errorMessage").empty();
  if(responseJson.businesses.length === 0) {
    displayNoResults();
  } else {
    restaurantList = responseJson.businesses;
    displayResults();
  }
}

function findRestaurants() {
  let options = {
    headers: new Headers ({
      Authorization: "Bearer fp5JUQ_Jg-Ll55NX9SzinZpoxO4xOh4xBLAG48ABeNpwM9Qw843vgx4jNHnviA0z3beWMWOMFfTAdKBeN40-i1H4NUvM2540Vn8r_j7yg8qrC9Ln7nvYAISzbxTsXXYx"
    })
  }
  let url = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?price=${priceStr}&limit=50&latitude=${myLat}&longitude=${myLng}&open_now=true&radius=5000&categories=${selectedFoodTypes}`;
  console.log(`finding ${selectedFoodTypes} restaurants with price options (${priceStr}) near ${myLat}, ${myLng}`);
  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json()
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => makeRestaurantList(responseJson))
    .catch(error => $('#errorMessage').text(`Something went wrong: ${error.message}`));
}

function getFoodTypes() {
  $("form").on("click", "#js-foodChoices", event => {
    event.stopPropagation();
    event.preventDefault();
    selectedFoodTypes = $('#foodChoice').val();
    if(selectedFoodTypes.length > 10) {
      $("#errorMessage").text("Please limit your options to 10 or fewer types of food");
    } else {
      $("#errorMessage").empty();
      findRestaurants();
    }
    
  });
}

function getPriceRange() {
  let howExpensive = [];
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
      $("form").empty();
      $("form").html(foodForm);
      getFoodTypes();
    }
  })    
}

function getGeoLocation() {
  fetch(`https://api.opencagedata.com/geocode/v1/json?q=${searchLocation}&key=d7fb58f7f8a04aee8361fab49438c000`)
    .then(response => {
      if (response.ok) {
        return response.json()
      }
      throw new Error(response.statusText)
    })
    .then(responseJson => {
      console.log(responseJson);
      myLat = responseJson.results[0].geometry.lat;
      myLng = responseJson.results[0].geometry.lng;
      $("form").empty();
      $("form").html(priceForm);
      getPriceRange();
      $("#errorMessage").empty();
    })
    .catch(error => $("#errorMessage").text(`Something went wrong: ${error.message}`));
}    

function getSearchParams() {
  $('form').on('click', '#js-findRestaurants', function (event) {
    event.stopPropagation();
    event.preventDefault();
    if ($('#city').val() === "" || $('#state').val() === "") {
      $("#errorMessage").text("Please enter a valid address to start your search from, or at least a city and state");
    } else {
      let locationArr = [];
      if($('#streetAddress').val() !== "") {
        locationArr.push($('#streetAddress').val());
      }
      locationArr.push($('#city').val());
      locationArr.push($('#state').val());
      searchLocation = encodeURI(locationArr.join(", "));
      console.log(searchLocation);
      $("#errorMessage").empty();
      getGeoLocation();
    }
  });
}

function watchForm() {
  $('#js-getStarted').click(event => {
    event.stopPropagation();
    event.preventDefault();
    // reset();
    $('form').empty();
    $('form').html(searchAreaForm);
    getSearchParams();
  });
}

$(watchForm);