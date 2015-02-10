(function(){

  //Set up some configuration variables

  //TODO: make number of cards/pages recieved dynamic

  //Set up Ajax Call

  /* We need to do multiple API calls in a loop to get multiple pages. We'll calculate that based on the number of items we need against the number of items returned. */

  var people = [];
  var count = 0;

  for(i=0;i<2;i++){
    var req = new XMLHttpRequest();
    req.onload = function(){
      people = people.concat(JSON.parse(this.responseText).results);
      count++;
      if(count == 2){
        buildDeck();
      }
    }
    req.open("GET", "http://swapi.co/api/people/");
    req.send();
  }

  function buildDeck(){
    console.log(people);
  }

})();