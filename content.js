const content = {
  startupForm: `<h2 class="opener">Trouble deciding where to eat?<br>Indecisive friends and family?<br>Restaurant Roulette will figure it out for you!</h2>
            <p>Let's take a gamble on your next meal...</p>
            <button id="js-getStarted">Get Started</button>
            <p class="instructions">Search and results powered by<br>
            <a href="https://www.yelp.com/" target="_blank"><img id="yelpLogo" src="https://s3-media3.fl.yelpcdn.com/assets/srv0/yelp_design_web/b085a608c15f/assets/img/logos_desktop/default@2x.png" alt="Yelp Logo"></a></p>`,

  priceForm: `<fieldset>
                <legend><h2>How expensive would you like your restaurant options to be?</h2></legend>
                <ul>
                  <li><input type="checkbox" name="priceRange" id="inexpensive" value="1"><label for="inexpensive">Inexpensive</label></li>
                  <li><input type="checkbox" name="priceRange" id="moderate" value="2"><label for="moderate">Moderate</label></li>
                  <li><input type="checkbox" name="priceRange" id="expensive" value="3"><label for="expensive">Expensive</label></li>
                  <li><input type="checkbox" name="priceRange" id="very_expensive" value="4"><label for="very_expensive">Very Expensive</label></li>
                </ul>
                <button id="js-setPrices">Set Price Options</button>
              </fieldset>`,

  foodForm: `<fieldset>
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
              </fieldset>`,

  searchAreaForm: `<fieldset>
                        <legend><h2>How far are you willing to travel?</h2></legend>
                        <label for="distance">Enter distance in mi:</label>
                        <input type="number" name="distance" id="distance" value="3" min="0.5" max="20" step="0.5" required>
                        <button id="js-submitDistance">Submit Distance</button>
                      </fieldset>`,

  startLocationForm: `<fieldset>
                          <legend><h2>Please enter your starting location</h2></legend>
                          <p class="instructions">For best results, omit apartment/suite numbers</p>
                          <label for="streetAddress">Street Address:</label>
                          <input type="text" name="streetAddress" id="streetAddress">
                          <label for="city">City:</label>
                          <input type="text" name="city" id="city" required>
                          <label for="state">State:</label>
                          <input type="text" name="state" id="state" required>
                          <button id="js-submitLocation">Submit Location</button>
                        </fieldset>`

}

