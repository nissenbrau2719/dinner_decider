let minPrice = "";
let maxPrice = "";
let foodTypeQueryStr = "";
let searchLocation = "";
let restaurantList = [];
let selectedRestaurant = "";
let map;

const priceForm =
  `<fieldset>
  <legend><h2>How expensive would you like your restaurant options to be?</h2></legend>
  <ul>
    <li><input type="checkbox" name="priceRange" id="inexpensive" value="1"><label for="inexpensive">Inexpensive</label></li>
    <li><input type="checkbox" name="priceRange" id="moderate" value="2"><label for="moderate">Moderate</label></li>
    <li><input type="checkbox" name="priceRange" id="expensive" value="3"><label for="expensive">Slightly Expensive</label></li>
    <li><input type="checkbox" name="priceRange" id="very_expensive" value="4"><label for="very_expensive">Very Expensive</label></li>
  </ul>
  <button type="submit" id="js-setPrices">Set Price Options</button>
</fieldset>`;

const foodForm =
  `<fieldset>
  <legend><h2>Select what types of food sound good to you, or don't select any options if you're up for anything...</h2></legend>
  <ul>
    <li><input type="checkbox" name="foodChoice" id="barbecue" value="barbecue"><label for="barbecue">Barbecue</label></li> 
    <li><input type="checkbox" name="foodChoice" id="pizza" value="pizza"><label for="pizza">Pizza</label></li> 
    <li><input type="checkbox" name="foodChoice" id="sandwiches" value="sandwiches"><label for="sandwiches">Sandwiches</label></li> 
    <li><input type="checkbox" name="foodChoice" id="burgers" value="burgers"><label for="burgers">Burgers</label></li> 
    <li><input type="checkbox" name="foodChoice" id="chinese" value="chinese"><label for="chinese">Chinese</label></li> 
    <li><input type="checkbox" name="foodChoice" id="mexican" value="mexican"><label for="mexican">Mexican</label></li> 
    <li><input type="checkbox" name="foodChoice" id="italian" value="italian"><label for="italian">Italian</label></li> 
    <li><input type="checkbox" name="foodChoice" id="sushi" value="sushi"><label for="sushi">Sushi</label></li> 
    <li><input type="checkbox" name="foodChoice" id="thai" value="thai"><label for="thai">Thai</label></li> 
    <li><input type="checkbox" name="foodChoice" id="indian" value="indian"><label for="indian">Indian</label></li> 
    <li><input type="checkbox" name="foodChoice" id="vegan" value="vegan"><label for="vegan">Vegan</label></li> 
  </ul>
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
  selectedRestaurant = "";
  $('h1').text("Dinner Decider");
  $('form').removeClass('hidden');
  $('#js-results').addClass('hidden');
  $('#restaurantDetails').empty();
}

function initMap() {
  map = new google.maps.Map($('#map'), {
    center: {lat: selectedRestaurant.geometry.location.lat, lng: selectedRestaurant.geometry.location.lng},
    zoom: 8
  });
}

function displayResults() {
  console.log(restaurantList)
  selectedRestaurant = restaurantList[Math.floor(Math.random() * restaurantList.length)];
  console.log(selectedRestaurant);
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
    initMap();
  });
}

function makeRestaurantList(responseJson) {
  console.log(responseJson);
  restaurantList = responseJson.results;
  displayResults();
}

function findRestaurants(latitude, longitude) {
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
  let foodTypesArray = [];
  $("form").on("click", "#js-foodChoices", event => {
    event.stopPropagation();
    event.preventDefault();
    $('input[name=foodChoice]:checked').map(function () {
      foodTypesArray.push($(this).val());
    });
    foodTypeQueryStr = foodTypesArray.join("+");
    console.log(foodTypeQueryStr);
    $("form").empty();
    $("form").html(searchAreaForm);
    getSearchParams();
  });
}

function getPriceRange() {
  let howExpensive = [];
  console.log('ran getPriceRange');
  $("form").on("click", "#js-setPrices", event => {
    event.stopPropagation();
    event.preventDefault();

    $('input[name=priceRange]:checked').map(function () {
      howExpensive.push($(this).val());
    });
    if (howExpensive.length === 0) {
      alert('Please select one or more options to establish a price range');
    } else {
      minPrice = Math.min(...howExpensive);
      maxPrice = Math.max(...howExpensive);
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