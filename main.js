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
        console.log("GO FORTH AND APPEND!");
        $("#cards").append("<div class='row' id='row-" + rowCounter + "'>");
      }
      $("#row-" + rowCounter).append(buildSingleCard(person));
      cardCounter++;
      if (cardCounter == 6) {
        $("#row-" + rowCounter).append("</div>");
        cardCounter = 0;
        rowCounter++;
      }
    });
  }


  function buildSingleCard(character){
    return '<div class="col-lg-2"><div class="card-container"><div class="card"><div class="back"><div class="cover"><img src="luke.jpg" /></div><div class="user"><img class="img-circle" src="luke.jpg" /></div><div class="content"><div class="main"><h3 class="name">'+character.name+'</h3><p class="hairColor">'+character.hair_color+'</p></div></div></div><!-- end front panel --><div class="front"><div class="header"><h5 class="motto">"To be or not to be, this is my awesome motto!"</h5></div><div class="content"><div class="main"><h4 class="text-center">Experience</h4><p>Luke took over the universe.</p></div></div></div><!-- end back panel --></div><!-- end card --></div><!-- end card-container --></div>';
  }

})();
