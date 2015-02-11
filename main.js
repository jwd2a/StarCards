$(function() {

  //Set up some configuration variables

  var numMatches = 2;
  var score = 0;

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
    req.open("GET", "http://swapi.co/api/people/?page=" + i);
    req.send();
  }

  function buildDeck(people) {
    var fullDeck = [];
    for (i = 0; i < 15; i++) {
      for (x = 0; x < numMatches; x++) {
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
      $("#row-" + rowCounter).append(buildSingleCard(person));
      cardCounter++;
      if (cardCounter == 6) {
        $("#row-" + rowCounter).append("</div>");
        cardCounter = 0;
        rowCounter++;
      }
    });
    startGame();
  }


  function buildSingleCard(character) {
    return '<div class="col-lg-2"><div class="card-container game-card" data-name="' + character.name + '""><div class="card"><div class="back"><div class="cover"><img src="luke.jpg" /></div><div class="user"><img class="img-circle" src="luke.jpg" /></div><div class="content"><div class="main"><h3 class="name">' + character.name + '</h3><p class="hairColor">' + character.hair_color + '</p></div></div></div><!-- end front panel --><div class="front"><div class="header"><h5 class="motto">"To be or not to be, this is my awesome motto!"</h5></div><div class="content"><div class="main"><h4 class="text-center">Experience</h4><p>Luke took over the universe.</p></div></div></div><!-- end back panel --></div><!-- end card --></div><!-- end card-container --></div>';
  }

  function startGame() {
    /* Do all the setup for starting the game */
    $(".game-card").click(function() {
      console.log("clicked");
      var selectedCard = $(this);
          selectedCard.addClass("active");
      var activeCards = $(".active");
      if (activeCards.length == 2) {

        console.log(activeCards);
        if ($(activeCards[0]).attr("data-name") == $(activeCards[1]).attr("data-name")) {
          createMatch(activeCards);
        } else {
          showIncorrect();
        }
      }



    });
  }

  /* Monitor the clicks on the cards */
 
  function createMatch(cards) {
    $(cards).each(function() {
      $(this).addClass("match");
    });
    incrementScore();
    cleanUp();
  }

  function incrementScore() {
    score = score + 1;
    $("#score").html(score);
  }

  function showIncorrect(cards) {
    //make the cards blink or something
    alert("incorrect match");
    cleanUp();
  }

  function cleanUp(){
    console.log("clean up that shit");
    console.log($(".game-card"));
    $(".game-card").each(function(){
      $(this).removeClass("active");
    });
  }


});
