var MatchGame = {};

/*
  Sets up a new game after HTML document has loaded.
  Renders a 4x4 board of cards.
*/

$(document).ready(function() {
  var $game=$('#game');
  var level;
  var banana=false;
  var renderOnClick= function(){
    var render=MatchGame.generateCardValues(level);
    MatchGame.renderCards( render, $game, banana );
    $('.levels').css('display','none');
    $('.levels_header h5').css('display','inline-block');
    $('.reset').css('display','block');
    $('.win').css('display','none');
    console.log(render);
  };
  $('.one').on('click',function(){
    level=4;
    renderOnClick();
  });
  $('.two').on('click',function(){
    level=6;
    renderOnClick();
  });
  $('.three').on('click',function(){
    level=8;
    renderOnClick();
  });
  $('.reset').on('click', function(){
    renderOnClick();
  });
  $('.banana').on('click', function(){
    $('.card').toggleClass("banana_style");
    banana=!banana;
    console.log(banana);
    if(level){
      renderOnClick();
    }
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

MatchGame.renderCards = function(numbers, $game, banana)
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
  if(!banana){
    gifs=[];
  }

  for ( var n = 0 ; n < numbers.length ; n++ )
  {
    var $newCard;
    if(banana){
        $newCard=$('<div class="col-xs-3 card banana_style"></div>');
    } else {
      $newCard=$('<div class="col-xs-3 card "></div>');
    }
    $newCard.data('value',numbers[n]);
    $newCard.data('flipped',false);
    $newCard.data('color',colors[numbers[n]-1]);
    $newCard.data('gif',gifs[numbers[n]-1]);
    $game.append($newCard);
  }
  console.log(gifs);
  console.log(colors);

  $game.data('totalFlipped',[]); //create data value to store open cards
  $game.data('solved',[]);  //create data value to count matches
  $game.data('tries',[]); //create data value to count moves

  $('.card').on('click', function()
  {
    if ($game.data('totalFlipped').length==2){
      return;
    } else {
      MatchGame.flipCard($(this),$game,numbers,banana);
    }
  });

};

/*
  Flips over a given card and checks to see if two cards are flipped over.
  Updates styles on flipped cards depending whether they are a match or not.
 */

MatchGame.flipCard = function($card, $game, numbers, banana)
{
  console.log( $card.data('flipped'));

  if($card.data('flipped'))
  {
      return;
  }
  if(!banana){
    $card.css({'background-color':$card.data('color'),})
      .text($card.data('value'))
      .data('flipped',true);
    closed={background:'#BF5A53'};
  }
  else {
    $card.css({'background-image':$card.data('gif'),
        'background-size': 'cover',
        'background-position':'center'})
        .data('flipped',true);
    closed={'background': '#FFD73D',
      'border': '4px solid #4A3E12',
      'background-repeat': 'no-repeat',
      'background-position': 'center',
      'background-size': '23%'};
  }
  if (screen.width >= 640) {
    if(!banana){
      closed={background:'#BF5A53'};
    }
    else {
      closed={'background': '#FFD73D',
      'border': '4px solid #4A3E12',
      'background-repeat': 'no-repeat',
      'background-position': 'center',
      'background-size': '12%'};
    }
  }

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
  opencards = $game.data('totalFlipped'); //sets var to array that holds open cards
  opencards.push($card);

  function isEven(value) {
	if (value%2 == 0)
		return true;
	else
		return false;
  }
  var n=opencards.length;

  if (isEven(n)){//this selects uneven numbers 1,3,5,7, etc...
      if(opencards[(n-2)].data('value')===opencards[(n-1)].data('value')){
        opencards[(n-2)].css(matchBack);
        opencards[(n-1)].css(matchBack);
        solved.push('match');
        $game.data('totalFlipped',[]);//empty opencards array after match;
        $('.solved').text(solved.length+"/"+numbers.length/2+" solved");
        console.log(solved);
      } else{
        setTimeout(function(){
          opencards[(n-2)].css(closed).text('').data('flipped',false);
          opencards[(n-1)].css(closed).text('').data('flipped',false);
          $game.data('totalFlipped',[]);//empty opencards array after flip;
        },750);
      }
      tries.push('count');
      console.log(tries.length+" moves");
      $('.tries').text(tries.length+" moves");
    }

  if(solved.length===(numbers.length/2)){
    $('.win').css('display','flex');
    $('.score').text(solved.length + ' solved in ' + tries.length + ' moves');
  }

};
