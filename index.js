


const priceForm = 
`<fieldset>
  <legend><h2>How expensive would you like your restaurant options to be?</h2></legend>
  <input type="checkbox" name="priceRange" id="most_affordable" value="0"><label for="most_affordable">Most Affordable</label><br>
  <input type="checkbox" name="priceRange" id="affordable" value="1"><label for="affordable">Affordable</label><br>
  <input type="checkbox" name="priceRange" id="average" value="2"><label for="average">Average</label><br>
  <input type="checkbox" name="priceRange" id="expensive" value="3"><label for="expensive">Slightly Expensive</label><br>
  <input type="checkbox" name="priceRange" id="most_expensive" value="4"><label for="most_expensive">Most Expensive</label><br>
  <button type="submit" id="js-setPrices">Set Price Options</button>
</fieldset>`;

















function getPriceRange(){
  console.log('ran getPriceRange');
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