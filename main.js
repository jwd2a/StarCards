(function() {

  //Set up some configuration variables

  var numMatches = 2;

  //TODO: make number of cards/pages recieved dynamic

  //Set up Ajax Call

  /* We need to do multiple API calls in a loop to get multiple pages. We'll calculate that based on the number of items we need against the number of items returned. */

  var count = 0;
  var people = [];

  for (i = 1; i < 3; i++) {
    var req = new XMLHttpRequest();
    req.onload = function() {
      people = people.concat(JSON.parse(this.responseText).results);
      count++;
      if (count == 2) {
        buildDeck(people);
      }
    }
    req.open("GET", "http://swapi.co/api/people/?page="+i);
    req.send();
  }

  function buildDeck(people) {
    var fullDeck = [];
    for (i = 0; i < 15; i++){
      for (x = 0; x < numMatches; x++){
        console.log("Pushing "+people[i].name+" to the set");
        fullDeck.push(people[i]);
      }
    }

   buildCards(window.knuthShuffle(fullDeck)); 

  }

  function buildCards(shuffledArray) {
    var cardCounter = 0;
    var rowCounter = 0;
    shuffledArray.forEach(function(person) {
      if (cardCounter == 0) {
        $("#cards").append("<div class='row' id='row-" + rowCounter + "'>");
      }
      $("#row-" + rowCounter).append("<div class='col-md-2 col-lg-2 card' data-itemId='" + person.name + "'>Back of card</div>");
      cardCounter++;
      if (cardCounter == 6) {
        $("#row-" + rowCounter).append("</div>");
        cardCounter = 0;
        rowCounter++;
      }
    });
  }

})();
