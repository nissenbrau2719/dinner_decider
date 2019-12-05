let howExpensive = [];


const priceForm = 
`<fieldset>
  <legend><h2>How expensive would you like your restaurant options to be?</h2></legend>
  <ul>
    <li><input type="checkbox" name="priceRange" id="most_affordable" value="0"><label for="most_affordable">Most Affordable</label></li>
    <li><input type="checkbox" name="priceRange" id="affordable" value="1"><label for="affordable">Affordable</label></li>
    <li><input type="checkbox" name="priceRange" id="average" value="2"><label for="average">Average</label></li>
    <li><input type="checkbox" name="priceRange" id="expensive" value="3"><label for="expensive">Slightly Expensive</label></li>
    <li><input type="checkbox" name="priceRange" id="most_expensive" value="4"><label for="most_expensive">Most Expensive</label></li>
  </ul>
  <button type="submit" id="js-setPrices">Set Price Options</button>
</fieldset>`;

const foodForm = 
`<fieldset>
  <legend><h2>What types of restaurants are you interested in tonight?</h2></legend>
  <ul>
    <li><input type="checkbox" name="foodChoice" id="barbecue" value="barbecue"><label for="barbecue">Barbecue</label></li> 
    <li><input type="checkbox" name="foodChoice" id="pizza" value="pizza"><label for="pizza">Pizza</label></li> 
    <li><input type="checkbox" name="foodChoice" id="sandwiches" value="sandwiches"><label for="sandwiches">Sandwiches</label></li> 
    <li><input type="checkbox" name="foodChoice" id="burgers" value="burgers"><label for="burgers">Burgers</label></li> 
    <li><input type="checkbox" name="foodChoice" id="chinese" value="chinese"><label for="chinese">Chinese</label></li> 
    <li><input type="checkbox" name="foodChoice" id="mexican" value="mexican"><label for="mexican">Mexican</label></li> 
    <li><input type="checkbox" name="foodChoice" id="diner" value="diner"><label for="diner">Diner</label></li> 
    <li><input type="checkbox" name="foodChoice" id="italian" value="italian"><label for="italian">Italian</label></li> 
    <li><input type="checkbox" name="foodChoice" id="sushi" value="sushi"><label for="sushi">Sushi</label></li> 
    <li><input type="checkbox" name="foodChoice" id="thai" value="thai"><label for="thai">Thai</label></li> 
    <li><input type="checkbox" name="foodChoice" id="indian" value="indian"><label for="indian">Indian</label></li> 
    <li><input type="checkbox" name="foodChoice" id="vegan" value="vegan"><label for="vegan">Vegan</label></li> 
  </ul>
  <button type="submit" id="js-foodChoices">Find Restaurants</button>
</fieldset>`;













function getFoodTypes() {
 console.log('ran getFoodTypes');
}

function getPriceRange() {
  console.log('ran getPriceRange');
  $("form").on("click", "#js-setPrices", event => {
    event.stopPropagation();
    event.preventDefault();
    $('input[name=priceRange]:checked').map(function() {
      howExpensive.push($(this).val());
    });
    console.log(howExpensive);
    $("form").empty();
    $("form").html(foodForm);
    getFoodTypes();
  })
}



function watchForm() {
  $('#js-getStarted').click(event => {
    event.stopPropagation();
    event.preventDefault();
    $('form').empty();
    $('form').html(priceForm);
    getPriceRange();
  });
}

$(watchForm);