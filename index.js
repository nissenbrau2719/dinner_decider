let minPrice = "";
let maxPrice = "";
let foodTypeQueryStr = "";
let searchLocation = "";
let restaurantList = [];
let selectedRestaurant = {};
let map;
let myLat = "";
let myLng = "";
let selectedLat = "";
let selectedLng = "";

const priceForm =
  `<fieldset>
  <legend><h2>How expensive would you like your restaurant options to be?</h2></legend>
    <label for="min">Minimum price option</label>
    <select id="min" name="min">
      <option value="1">Inexpensive</option>
      <option value="2">Moderate</option>
      <option value="3">Slightly Expensive</option>
      <option value="4">Very Expensive</option>
    </select>
    <label for="max">Maximum price option</label>
    <select id="max" name="max">
      <option value="1">Inexpensive</option>
      <option value="2">Moderate</option>
      <option value="3">Slightly Expensive</option>
      <option value="4">Very Expensive</option>
    </select> 
  <button type="submit" id="js-setPrices">Set Price Options</button>
</fieldset>`;

const foodForm =
  `<fieldset>
  <legend><h2>What type of food sounds the best?</h2></legend>
  <select id="foodChoice" required>
    <option value="">Surprise Me</option>
    <option value="barbecue">Barbecue</option>
    <option value="pizza">Pizza</option>
    <option value="sandwiches">Sandwiches</option>
    <option value="burgers">Burgers</option>
    <option value="chinese">Chinese</option>
    <option value="mexican">Mexican</option>
    <option value="italian">Italian</option>
    <option value="sushi">Sushi</option>
    <option value="thai">Thai</option>
    <option value="indian">Indian</option>
    <option value="vegan">Vegan</option>
    <option value="american">American</option>
    <option value="soup">Soup</option>
    <option value="fried+chicken">Fried Chicken</option>
    <option value="pub">Pub</option>
    <option value="salad">Salad</option>
    <option value="korean">Korean</option>
    <option value="tapas">Tapas</option>
  </select>
  <button type="submit" id="js-foodChoices">Submit Food Options</button>
</fieldset>`;


const searchAreaForm =
  `<fieldset>
    <legend><h2>Let's roll the dice on some restaurants in your area!</h2></legend>
    <label for="location">Enter an address or location to search nearby:</label>
    <input type="text" name="location" id="location" required>
    <button type="submit" id="js-findRestaurants">Find Restaurants</button>
  </fieldset>`;

const restaurantDetails = 
  `<h2>How about eating at:</h2>
  <h3>${selectedRestaurant.name}</h3>
  <p>${selectedRestaurant.formatted_address}</p>
  <p>Rated ${selectedRestaurant.rating} stars by ${selectedRestaurant.user_ratings_total} Google users</p>`

function reset() {
  minPrice = "";
  maxPrice = "";
  foodTypesQueryStr = "";
  searchLocation = "";
  restaurantList = [];
  selectedRestaurant = {};
  myLat = "";
  myLng = "";
  selectedLat = "";
  selectedLng = "";
  $('h1').text("Dinner Decider");
  $('form').removeClass('hidden');
  $('#js-results').addClass('hidden');
  $('#restaurantDetails').empty();
}


function displayResults() {
  // console.log(restaurantList)
  selectedRestaurant = restaurantList[Math.floor(Math.random() * restaurantList.length)];
  // console.log(selectedRestaurant);
  selectedLat = selectedRestaurant.geometry.location.lat;
  selectedLng = selectedRestaurant.geometry.location.lng;
  console.log(selectedLat + ", " + selectedLng);
  $('form').addClass('hidden');
  $('#restaurantDetails').html(
    `<h2>${selectedRestaurant.name}</h2>
    <p>${selectedRestaurant.formatted_address}</p>
    <p>Rated ${selectedRestaurant.rating} stars by ${selectedRestaurant.user_ratings_total} Google users</p>`
  );
  $('h1').text("How about eating at:")
  $('#js-results').removeClass('hidden');
  $('#js-tryAgain').click(function() {
    displayResults();
    // initMap();
  });
}

function makeRestaurantList(responseJson) {
  // console.log(responseJson);
  restaurantList = responseJson.results;
  displayResults();
}

function findRestaurants(latitude, longitude) {
  myLat = latitude;
  myLng = longitude;
  console.log(`finding restaurants with minPrice = ${minPrice} and maxPrice = ${maxPrice} near ${latitude}, ${longitude}`);
  fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${foodTypeQueryStr}&type=restaurant&location=${latitude},${longitude}&radius=5000&strictBounds&opennow=true&minprice=${minPrice}&maxprice=${maxPrice}&key=${gKey}`)
    .then(response => {
      if (response.ok) {
        return response.json()
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => makeRestaurantList(responseJson))
    .catch(error => alert(`Something went wrong: ${error.message}`));

}

function getGeoLocation() {
  fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${searchLocation}&key=${gKey}`)
    .then(response => {
      if (response.ok) {
        return response.json()
      }
      throw new Error(response.statusText)
    })
    .then(responseJson => {
      findRestaurants(responseJson.results[0].geometry.location.lat, responseJson.results[0].geometry.location.lng)
    })
    .catch(error => alert(`Something went wrong: ${error.message}`));
}


function getSearchParams() {
  $('form').on('click', '#js-findRestaurants', function (event) {
    event.stopPropagation();
    event.preventDefault();
    if ($('#location').val() === "") {
      alert("Please enter an address or location");
    } else {
      let locationArr = $('#location').val().split(" ");
      searchLocation = locationArr.join("+");
      getGeoLocation();
    }
  });
}

function getFoodTypes() {
  // let foodTypesArray = [];
  $("form").on("click", "#js-foodChoices", event => {
    event.stopPropagation();
    event.preventDefault();
    // $('#foodChoice option:selected').map(function () {
    //   foodTypesArray.push($(this).val());
    // });
    // foodTypeQueryStr = foodTypesArray.join("+");
    foodTypeQueryStr = $('#foodChoice').val();
    console.log(foodTypeQueryStr);
    $("form").empty();
    $("form").html(searchAreaForm);
    getSearchParams();
  });
}

function getPriceRange() {
  let howExpensive = [];
  // console.log('ran getPriceRange');
  $("form").on("click", "#js-setPrices", event => {
    event.stopPropagation();
    event.preventDefault();
    if($('#min').val() > $('#max').val()){
      $('#errorMessage').text('Please make sure your minimum price option is less than or equal to your maximum price option');
    } else {
      minPrice = $('#min').val();
      maxPrice = $('#max').val();
      $("#errorMessage").empty();
      $("form").empty();
      $("form").html(foodForm);
      getFoodTypes();
    }
  })    
}

function watchForm() {
  $('#js-getStarted').click(event => {
    event.stopPropagation();
    event.preventDefault();
    reset();
    $('form').empty();
    $('form').html(priceForm);
    getPriceRange();
  });
}

$(watchForm);