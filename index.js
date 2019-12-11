let priceStr = "";
let foodTypeQueryStr = "";
let searchLocation = "";
let restaurantList = [];
let selectedRestaurant = {};
let map;
let myLat;
let myLng;
let selectedLat;
let selectedLng;

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
  <legend><h2>What type of food sounds the best?</h2></legend>
  <p>(Hold ctrl/control key to select multiple)</p>
  <select id="foodChoice" multiple required>
    <option value="restaurants">Surprise Me</option>
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
    <option value="tradamerican">American</option>
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
    <legend><h2>Let's roll the dice on some restaurants in your area!</h2></legend>
    <label for="location">Enter an address or location to search nearby:</label>
    <input type="text" name="location" id="location" required>
    <button type="submit" id="js-findRestaurants">Find Restaurants</button>
  </fieldset>`;

const restaurantDetails = 
  `<h2>How about eating at:</h2>
  <h3>${selectedRestaurant.name}</h3>
  <p>${selectedRestaurant.formatted_address}</p>
  <p>Rated ${selectedRestaurant.rating} stars by ${selectedRestaurant.user_ratings_total} Google users</p>`;

function reset() {
  priceStr = "";
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

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: selectedLat, lng: selectedLng},
    zoom: 8
  });
}

function displayResults() {
  // console.log(restaurantList)
  selectedRestaurant = restaurantList[Math.floor(Math.random() * restaurantList.length)];
  // console.log(selectedRestaurant);
  selectedLat = parseFloat(selectedRestaurant.geometry.location.lat);
  selectedLng = parseFloat(selectedRestaurant.geometry.location.lng);
  console.log(selectedLat + ", " + selectedLng);
  $('form').addClass('hidden');
  $('#restaurantDetails').html(
    `<h2>${selectedRestaurant.name}</h2>
    <p>${selectedRestaurant.formatted_address}</p>
    <p>Rated ${selectedRestaurant.rating} stars by ${selectedRestaurant.user_ratings_total} Google users</p>`
  );
  // initMap();
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



function findRestaurants() {
  let options = {
    headers: new Headers ({
      Authorization: "Bearer fp5JUQ_Jg-Ll55NX9SzinZpoxO4xOh4xBLAG48ABeNpwM9Qw843vgx4jNHnviA0z3beWMWOMFfTAdKBeN40-i1H4NUvM2540Vn8r_j7yg8qrC9Ln7nvYAISzbxTsXXYx"
    })
  }
  let url = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?price=${priceStr}&limit=50&latitude=${myLat}&longitude=${myLng}&open_now=true&radius=5000&categories=${foodTypeQueryStr}`
  console.log(`finding ${foodTypeQueryStr} restaurants with price options (${priceStr}) near ${myLat}, ${myLng}`);
  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json()
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => console.log(responseJson))
    // .then(responseJson => makeRestaurantList(responseJson))
    .catch(error => alert(`Something went wrong: ${error.message}`));

}


function getFoodTypes() {
  let foodTypesArray = [];
  $("form").on("click", "#js-foodChoices", event => {
    event.stopPropagation();
    event.preventDefault();
    // $('#foodChoice option:selected').map(function () {
    //   foodTypesArray.push($(this).val());
    // });
    // foodTypeQueryStr = foodTypesArray.join(",");
    foodTypeQueryStr = $('#foodChoice').val();
    console.log(foodTypeQueryStr);
    // $("form").empty();
    // $("form").html(searchAreaForm);
    findRestaurants();
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
      $("#errorMessage").text('Please select one or more options to establish a price range');
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
  fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${searchLocation}&key=AIzaSyBaN2hqtLbLkXCLBsIJByMMEHoH9I_86lI`)
    .then(response => {
      if (response.ok) {
        return response.json()
      }
      throw new Error(response.statusText)
    })
    .then(responseJson => {
      console.log(responseJson)
      myLat = responseJson.results[0].geometry.location.lat;
      myLng = responseJson.results[0].geometry.location.lng;
      console.log(myLat);
      console.log(myLng);
      $("form").empty();
      $("form").html(priceForm);
      getPriceRange();
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

function watchForm() {
  $('#js-getStarted').click(event => {
    event.stopPropagation();
    event.preventDefault();
    reset();
    $('form').empty();
    $('form').html(searchAreaForm);
    getSearchParams();
  });
}

$(watchForm);