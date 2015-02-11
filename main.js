$(function() {

  // Set up some configuration variables. These are variables we'll need globally later, so it's a good practice to go ahead and get them defined up here. We've created one to keep track of the number of cards needed for a match (2), and the current score (0); 

  var numMatches = 2;
  var score = 0;

  //TODO: make number of cards/pages recieved dynamic

  //Set up Ajax Call

  // We need 15 total items from the Star Wars API (since we have 30 cards, and need two per matched set). Since the API is paginated at 10, it means we'll need to make multiple calls. To make this easy, we'll simply put this in a loop that loops twice, and makes a call in each loop. Since the loop keeps track of what number of loop it's on (called the "index"), we can use that number to pass in as our page number to the API. The first time the loop goes around, it'll ask the API for page 1, the second time, for page 2. 

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

  // The buildDeck function is used to create the array of cards we'll use to show to our player. There are two components to this. Our goal is to have two of each item in the deck, so we need to use a nested loop in order to easily do this. We'll loop through the first 15 items in the array that was given to us by the API, and for each of those items, we'll push it into the array twice (using the nested loop). Once this is done, we'll pass this newly created array (now with 30 total items - 2 each of the 15) to our buildCards function, which will actually put the cards on the page in HTML. It's also important to see that we need to shuffle the cards, since they'd otherwise all be next to each other (if you remember, we simply pushed two at a time into the array, so they're all in pairs right now). We'll use the knuthShuffle library, which will simply take our array and shuffle it up. That newly shuffled array is what's passed to the buildCards function.

  function buildDeck(people) {
    var fullDeck = [];
    for (i = 0; i < 15; i++) {
      for (x = 0; x < numMatches; x++) {
        fullDeck.push(people[i]);
      }
    }

    buildCards(window.knuthShuffle(fullDeck));

  }

  // The buildCards function takes our shuffled array, and builds our HTML using it. There's a bit of counting here that's done to create our rows. We need to keep track of how many cards we've created in a row, so we'll know when to start the next row (that value is stored in the cardCounter variable). Additionally, we'll want to count our rows, so we can create an ID for each row. That way, we'll know which row we need to target to add our cards.

  // This function looks complicated, but it's pretty simple. We just loop through our shuffed array, and create our HTML elements based on where we are on the row. If our cardCounter is 0, we know we're at the beginning of a row, so we'll add the appropriate div to create a row. Once our cardCounter gets to 6, we know we've added 6 cards to the row and we need to end the row and reset our cardCounter back to 0 for the next row. 

  // We've also broken out the actual HTML creation into its own function called buildSingleCard, which helps us keep the code a bit neater and more nicely separated. 

  // Finally, once we're finished laying out the cards on the page, we'll start the game using the startGame function.

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


  // This simple function just returns a string of HTML with our card's details inserted into it. It's used by the buildCards function to insert the HTML into the page. 

  function buildSingleCard(character) {
    return '<div class="col-lg-2"><div class="card-container game-card" data-name="' + character.name + '""><div class="card clicked"><div class="back"><div class="cover"><img src="luke.jpg" /></div><div class="user"><img class="img-circle" src="luke.jpg" /></div><div class="content"><div class="main"><h3 class="name">' + character.name + '</h3><p class="hairColor">' + character.hair_color + '</p></div></div></div><!-- end front panel --><div class="front"><div class="header"><h5 class="motto">"To be or not to be, this is my awesome motto!"</h5></div><div class="content"><div class="main"><h4 class="text-center">Experience</h4><p>Luke took over the universe.</p></div></div></div><!-- end back panel --></div><!-- end card --></div><!-- end card-container --></div>';
  }

  // Because we need to have all the cards on the page before we can attach event listeners to them, this function is called once the game board is set up. It's a good idea to separate this, as we might want to do other setup work at the beginning before the user starts playing. By making this its own function, we're able to better control when the user can start playing the game. 

  function startGame() {

    // Attach event listeners to all our game pieces, listening for them to be clicked.
    $(".game-card").click(function() {
      /* TODO: @mike - this is where the card should flip over. Probably just need to add a class to it here. Stubbed that out below: */
      $(this).addClass("clicked");
      // Store the currently clicked card into a variable, and then add the class "active" to it, so we can keep track of which ones have been clicked, and add styles to it.
      var selectedCard = $(this);
          selectedCard.addClass("active");
      // Grab all the cards on the board that are marked as "active", so we know how many have been clicked.
      var activeCards = $(".active");
      // If we have two cards selected, we can now test to see if they match, using the data-name attribute to check for a match.
      if (activeCards.length == 2) {
        if ($(activeCards[0]).attr("data-name") == $(activeCards[1]).attr("data-name")) {
          // Woohoo! They match, let's make a match.
          createMatch(activeCards);
        } else {
          //No match, do whatever we need to do when it's incorrect.
          showIncorrect();
        }
      }
    });
  }

  // This function is used to do whatever we need to when a match occurs. We pass it an array of the two matching cards, so we can loop over them and do whatever we need to do. In this case, we're simply adding a "match" class to them, so we can style them differently and keep them flipped over. Lastly, we call our incrementScore function and our cleanUp function to complete the job.
 
  function createMatch(cards) {
    $(cards).each(function() {
      $(this).addClass("match");
    });
    incrementScore();
    cleanUp();
  }

  // incrementScore is used to keep track of our score and update the HTML with it

  function incrementScore() {
    score = score + 1;
    $("#score").html(score);
  }

  // If we have an incorrect match, do something here. 

  function showIncorrect(cards) {
    //make the cards blink or something
    alert("incorrect match");
    cleanUp();
  }

  // After two cards have been selected, whether matched or not, we need to wipe out any "active" cards, so we have an accurate count of which ones have been clicked on. This will also let us flip the clicked cards back over if we need to.

  function cleanUp(){
    $(".game-card").each(function(){
      $(this).removeClass("active");
      // TODO: @mike - remove the class for flipping the card (or however we flip them back over) here:
      $(this).removeClass("clicked");
    });
  }


});
