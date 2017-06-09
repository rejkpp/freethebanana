var MatchGame = {};

/*
  Sets up a new game after HTML document has loaded.
  Renders a 4x4 board of cards.
*/

$(document).ready(function() {
  var $game=$('#game');
  var render=MatchGame.generateCardValues();
  MatchGame.renderCards(render, $game );
  console.log(render);
  $('.reset').on('click', function(){
    var renderNew=MatchGame.generateCardValues();
    MatchGame.renderCards(renderNew, $game);
    $('.win').css('display','none');
    console.log(renderNew);
  });
});

/*
  Generates and returns an array of matching card values.
 */

 MatchGame.generateCardValues = function () {
   var numberPairs = [];

   for (var c = 1 ; c <=6 ; c++ ) {
     numberPairs.push(c,c);
   }

   var cardValues =[];

   while(numberPairs.length > 0) {
     var randomIndex = Math.floor(Math.random() * numberPairs.length);
     var randomNumber= numberPairs.splice(randomIndex,1)[0];
     cardValues.push(randomNumber);
   }
   return cardValues;
 };

/*
  Converts card values to jQuery card objects and adds them to the supplied game
  object.
*/

MatchGame.renderCards = function(numbers, $id)
{
  $id.empty();
  var colors;
  var colorValues;
  colors=[];
  colorValues=[
    'hsl(25,85%,65%)',
    'hsl(55,85%,65%)',
    'hsl(90,85%,65%)',
    'hsl(160,85%,65%)',
    'hsl(220,85%,65%)',
    'hsl(265,85%,65%)',
    'hsl(310,85%,65%)',
    'hsl(360,85%,65%)'];
  for(var c = 0 ; c< numbers.length/2;c++)
      {
        colors.push(colorValues[c%colorValues.length]);
      }

  for ( var n = 0 ; n < numbers.length ; n++ )
  {

    var $newCard;
    $newCard=$('<div class="col-xs-4 card"></div>');
    $newCard.data('value',numbers[n]);
    $newCard.data('flipped',false);
    $newCard.data('color',colors[numbers[n]-1]);
    $id.append($newCard);
  }
//  console.log(colors);

//  console.log((numbers.length/2));
  $id.data('currentlyFlipped',[]);
  $id.data('solved',[]);
  $('.card').on('click', function()
  {
    MatchGame.flipCard($(this),$id,numbers);
  });
};

/*
  Flips over a given card and checks to see if two cards are flipped over.
  Updates styles on flipped cards depending whether they are a match or not.
 */

MatchGame.flipCard = function($some, $id2,numbers)
{
  if($some.data('flipped'))
  {
      return;
  }
  $some.css('background',$some.data('color')).text($some.data('value')).data('flipped',true);
  var solved;
  var opencards;
  var match;
  var closed;
  solved=$id2.data('solved');
  match={background:'rgb(153,153,153)'};
  closed={background:'rgb(32,64,86)'};
  opencards = $id2.data('currentlyFlipped'); //sets var to array that holds open cards
  opencards.push($some);

  if(opencards.length===2) {
    if(opencards[0].data('value')===opencards[1].data('value')){
      opencards[0].css(match);
      opencards[1].css(match);
      solved.push('match');
    }
    else{
      setTimeout(function(){
      opencards[0].css(closed).text('').data('flipped',false);
      opencards[1].css(closed).text('').data('flipped',false);
    },500);
    }
    $id2.data('currentlyFlipped',[]);
  }
  if(solved.length===(numbers.length/2)){
    $('.win').css('display','flex');
  }
  console.log(solved);

};
