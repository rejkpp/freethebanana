var MatchGame = {};

/*
  Sets up a new game after HTML document has loaded.
*/

$(document).ready(function() {
  var $game=$('#game');
  var level;
  var banana=false;
  var $banana=$('.banana');
  var renderOnClick= function(){
    var render=MatchGame.generateCardValues(level);
    MatchGame.renderCards( render, $game, banana );
    $('.levels').css('display','none');//removes initial levels display
    $('.levels_header h5').css('display','inline-block');//display levels in instructions section
    $('.reset').css('display','block');//display reset button
    $('.win').css('display','none');//clear congrats/win page
    console.log(render);//cheat for the console
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
  $banana.on('click', function(){ //toggle banana style on click banana button
    $('.card').toggleClass("banana_style_button"); //style cards on welcome screen
    $('body, p, .win').toggleClass("banana_style"); //style body text and win backgroud and color
    $(this).toggleClass("banana_button"); //style banana button
    banana=!banana; //change banana boolean state
    if(level){ //only runs if level has been set
      renderOnClick();
    }
  });
  $banana.addClass('banana_animate');//animation for banana button on load
  setTimeout( function() {
    $banana.removeClass('banana_animate');
  }, 3450 );
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
  $('.moves').empty().text("0 moves"); //this resets the moves count display
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
    if(!banana){
      colors.push(colorValues[c%colorValues.length]);
    } else {
      gifs.push(gif_images[c%gif_images.length]);
    }
  }

  for ( var n = 0 ; n < numbers.length ; n++ )
  {
    var $newCard;
    if(!banana){
      $newCard=$('<div class="col-xs-3 card "></div>');
    } else {
      $newCard=$('<div class="col-xs-3 card banana_style_button"></div>');
    }
    $newCard.data('value',numbers[n]);//this data stores the number value
    $newCard.data('flipped',false); //this data sets the state of open or closed card
    $newCard.data('color',colors[numbers[n]-1]); //this stores one color for one pair
    $newCard.data('gif',gifs[numbers[n]-1]); //this stores one gif for one pair
    $game.append($newCard);
  }
  $game.data('solved',[]);  //create data value to count matches
  $game.data('moves',[]); //create data value to count moves
  $game.data('totalFlipped',[]); //create data value to store open cards

  $('.card').on('click', function()
  {
    if ($game.data('totalFlipped').length==2){//check the length to stop execution until the cards are closed back
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
  if($card.data('flipped')){//this checks if the card clicked on is already open
    return;
  }
  var opencards;//create var to store open cards
  var matchBack;//create var to store css for solves cards
  var closed;//create var to store css for closing the cards
  var moves;//create var to store number of moves
  var solved;//create var to count matches
  var n;//create var to store length of array that holds open cards

  if(!banana){//check banana toggle
      $card.css({'background-color':$card.data('color'),})
        .text($card.data('value'))
        .data('flipped',true);
      closed={background:'#BF5A53'};
  } else {
      $card.css({'background-image':$card.data('gif'),
        'background-size': 'cover',
        'background-position':'center'})
        .data('flipped',true);
      closed={'background': '#FFF6D2'};
  }

  moves=$game.data('moves');//this data counts moves to keep score
  solved=$game.data('solved'); //this data counts matches to determine when game is finished
  matchBack={opacity:'0.23'};//this variable sets the css rules for matched cards
  opencards = $game.data('totalFlipped');//sets var to array that holds open cards
  opencards.push($card); //this stores the clicked on card in the array that holds open cards
  n=opencards.length; //this is for ease of use in the later loop

  function isEven(value) {
	if (value%2 == 0)
		return true;
	else
		return false;
  }

  //I changed the loop in order to attempt immediate close of open cards open new click
  if (isEven(n)){//this selects uneven numbers 1,3,5,7, etc...
      if(opencards[(n-2)].data('value')===opencards[(n-1)].data('value')){
        opencards[(n-2)].css(matchBack);
        opencards[(n-1)].css(matchBack);
        solved.push('match');//store match for count
        $game.data('totalFlipped',[]);//empty opencards array after match;
        $('.solved').text(solved.length+"/"+numbers.length/2+" solved"); //update score on UI
      } else{
        setTimeout(function(){
          opencards[(n-2)].css(closed).text('').data('flipped',false);
          opencards[(n-1)].css(closed).text('').data('flipped',false);
          $game.data('totalFlipped',[]);//empty opencards array after flip;
        },890);
      }
      moves.push('count');//store move for count
      $('.moves').text(moves.length+" moves");//update moves on UI
    }

  if(solved.length===(numbers.length/2)){
    $('.win').css('display','flex'); //display win on last match
    $('.score').text(solved.length + ' solved in ' + moves.length + ' moves');
  }

};
