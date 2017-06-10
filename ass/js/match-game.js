var MatchGame = {};

/*
  Sets up a new game after HTML document has loaded.
  Renders a 4x4 board of cards.
*/

$(document).ready(function() {
  var $game=$('#game');
  var render=MatchGame.generateCardValues(4);
  MatchGame.renderCards(render, $game );
  console.log(render);
  $('.reset').on('click', function(){
    var renderNew=MatchGame.generateCardValues(6);
    MatchGame.renderCards(renderNew, $game);
    $('.win').css('display','none');
    console.log(renderNew);
  });
});

/*
  Generates and returns an array of matching card values.
 */

 MatchGame.generateCardValues = function (pairs) {
   var numberPairs = [];

   for (var c = 1 ; c <=pairs ; c++ ) {
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

MatchGame.renderCards = function(numbers, $game)
{
  $game.empty(); //this resets the html of cards
  $('.tries').empty().text("0 moves"); //this resets the moves count display
  $('.solved').empty().text("0/"+numbers.length/2+" solved"); //this resets the solved count display
  var colors; //array variable to be filled with colors to be used based on number of pairs
  var colorValues; //array variable with 8 color set
  var gif_images; //array with 8 images
  var gifs; //array variable to be filled with images based on number of pairs
  var win; //variable for choosing the congratulations "win" image
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

  win = Math.floor(Math.random() * gif_images.length);
  $('.gif').css('background-image',gif_images[win]);//chooses winning image

  for(var c = 0 ; c< numbers.length/2;c++)
  {
    colors.push(colorValues[c%colorValues.length]);
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
    $game.append($newCard);
  }
  console.log(gifs);
  console.log(colors);

  $game.data('currentlyFlipped',[]); //create data value to store open cards
  $game.data('solved',[]);  //create data value to count matches
  $game.data('tries',[]); //create data value to count moves

  $('.card').on('click', function()
  {
    MatchGame.flipCard($(this),$game,numbers);
  });

};

/*
  Flips over a given card and checks to see if two cards are flipped over.
  Updates styles on flipped cards depending whether they are a match or not.
 */

MatchGame.flipCard = function($card, $game,numbers)
{
  console.log( $card.data('flipped'));

  if($card.data('flipped'))
  {
      return;
  }
  $card.css({'background-image':$card.data('gif'),
        'background-size': 'cover', 'background-position':'center'})
  //.text($card.data('value'))
  .data('flipped',true);
  var solved;
  var opencards;
  var match;
  var matchBack;
  var closed;
  var tries;

  tries=$game.data('tries');//this data counts moves to keep score
  solved=$game.data('solved'); //this data counts matches to determine when game is finished
  match={background:'rgb(153,153,153)'}; //this is the css to turn the background grey
  matchBack={opacity:'0.23'};
  closed={background:'#BF5A53'};
  opencards = $game.data('currentlyFlipped'); //sets var to array that holds open cards
  opencards.push($card);

  if(opencards.length===2) {
    if(opencards[0].data('gif')===opencards[1].data('gif')){
  //    opencards[0].css(match);
  //    opencards[1].css(match);
      opencards[0].css(matchBack);
      opencards[1].css(matchBack);
      solved.push('match');
      $('.solved').text(solved.length+"/"+numbers.length/2+" solved");
    } else{
      setTimeout(function(){
      opencards[0].css(closed).text('').data('flipped',false);
      opencards[1].css(closed).text('').data('flipped',false);
      },750);
    }
    $game.data('currentlyFlipped',[]);
    tries.push('count');
    console.log(solved);
    console.log(tries.length);
    $('.tries').text(tries.length+" moves");
  }
  if(solved.length===(numbers.length/2)){
    $('.win').css('display','flex');
    $('.score').text(solved.length + ' solved in ' + tries.length + ' moves');
  }

};
