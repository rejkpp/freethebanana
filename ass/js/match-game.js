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

   for (var c = 1 ; c <=8 ; c++ ) {
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
  var gif_images;
  var gifs;
  var win;
  gifs=[];
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
  gif_images=[
    'url("./ass/img/congrats_1.gif")',
    'url("./ass/img/congrats_2.gif")',
    'url("./ass/img/congrats_3.gif")',
    'url("./ass/img/congrats_4.gif")',
    'url("./ass/img/congrats_5.gif")',
    'url("./ass/img/congrats_6.gif")',
    'url("./ass/img/congrats_7.gif")',
    'url("./ass/img/congrats_8.gif")'];
  for(var c = 0 ; c< numbers.length/2;c++)
      {
        colors.push(colorValues[c%colorValues.length]);
      }
  for(var c = 0 ; c< numbers.length/2;c++)
      {
        gifs.push(gif_images[c%gif_images.length]);
      }

  for ( var n = 0 ; n < numbers.length ; n++ )
  {

    var $newCard;
    $newCard=$('<div class="col-xs-3 card"></div>');
    $newCard.data('value',numbers[n]);
    $newCard.data('flipped',false);
    $newCard.data('color',colors[numbers[n]-1]);
    $newCard.data('gif',gifs[numbers[n]-1]);
    $id.append($newCard);
  }
//  console.log(colors);
win = Math.floor(Math.random() * gif_images.length);
$('.gif').css('background-image',gif_images[win]);

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
  $some.css({'background-image':$some.data('gif'),
        'background-size': 'cover', 'background-position':'center'})
  //.text($some.data('value'))
  .data('flipped',true);
  var solved;
  var opencards;
  var match;
  var matchBack;
  var closed;
  solved=$id2.data('solved'); //this data counts matches to determine when game is finished
  match={background:'rgb(153,153,153)'};
  matchBack={opacity:'0.23'};
  closed={background:'rgb(32,64,86)'};
  opencards = $id2.data('currentlyFlipped'); //sets var to array that holds open cards
  opencards.push($some);

  if(opencards.length===2) {
    if(opencards[0].data('gif')===opencards[1].data('gif')){
  //    opencards[0].css(match);
  //    opencards[1].css(match);
      opencards[0].css(matchBack);
      opencards[1].css(matchBack);
      solved.push('match');
    }
    else{
      setTimeout(function(){
      opencards[0].css(closed).text('').data('flipped',false);
      opencards[1].css(closed).text('').data('flipped',false);
    },750);
    }
    $id2.data('currentlyFlipped',[]);
  }
  if(solved.length===(numbers.length/2)){
    $('.win').css('display','flex');
  }
  console.log(solved);

};
