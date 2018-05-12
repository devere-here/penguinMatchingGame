//Variable and object definitions
var attempts = 0
var busy = false
var secondCard = false
var currentCard = { id: '', penguinType: '' }
var lastCard = { id: '', penguinType: '' }
var flip = new Audio('https://drive.google.com/uc?export=download&id=0Bw2029NKQAh_WUs5Z1BGWUtXaXc')
var match = new Audio('https://drive.google.com/uc?export=download&id=0Bw2029NKQAh_WElELVpPSmdEbFk')
var congrats = new Audio('https://drive.google.com/uc?export=download&id=0Bw2029NKQAh_eWowbXlEcXQyUlk')
var matchedArray = []
var indexArray = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7]
var idArray = ['a1', 'a2', 'a3', 'a4', 'b1', 'b2', 'b3', 'b4', 'c1', 'c2', 'c3', 'c4', 'd1', 'd2', 'd3', 'd4']

//Produces a randomized version of index array
function shuffleCards(indexArray){
  var shuffledArray = []
  for (var j = 0; j < 16; j++){
    var randomNumber = Math.floor(Math.random() * indexArray.length)
    shuffledArray.push(indexArray.splice(randomNumber, 1))
  }
  return shuffledArray
}

//Loads penguin data to cards
function loadCardInfo(idArray, shuffledArray){
  var penguinNames = ['Emperor', 'Adelie', 'Chinstrap', 'African', 'Little', 'Galapagos', 'Southern Rockhopper', 'Magallanic']
  var penguinPictures = ['https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Emperor_Penguin_Manchot_empereur.jpg/220px-Emperor_Penguin_Manchot_empereur.jpg', 'http://www.oceanlight.com/stock-photo/adelie-penguin-iceberg-antarctic-peninsula-photograph-25035-100614.jpg', 'https://media1.britannica.com/eb-media/08/152708-004-5B3C83E2.jpg', 'http://www.photovolcanica.com/PenguinSpecies/African/SA08_3208.jpg', 'http://www.cutestpaw.com/wp-content/uploads/2015/02/Little-penguin-via-Andrea-Martinez.jpg', 'http://cdn.c.photoshelter.com/img-get/I0000EqYUx06Fvsg/s/750/750/galapagos-penguin-bartolome-012280.jpg', 'https://www.stlzoo.org/files/5013/0798/4222/penguin_rockhopper.jpg', 'http://www.theanimalfiles.com/images/magellanic_penguin_3.jpg']
  
  for (var i = 0; i < 16; i++){
    $('img[class="' + idArray[i] + '"]').attr('src', penguinPictures[shuffledArray[i]])
    $('h3[class="' + idArray[i] + '"]').text(penguinNames[shuffledArray[i]])
  }

}

//Check if user can perform action
function isMoveAllowed(id, previousId, matchedArray, busy){

  var bool = false
  if (busy == false && id != previousId && matchedArray.indexOf(id) == -1){
    bool = true
  }

  return bool
}

//Performs flip animation
function flipAnimation(id){

  busy = true
  $('div[id ="' + id + '"] > .front').css('transform', 'perspective(600px) rotateY(-180deg)')
  $('div[id ="' + id + '"] > .back').css('transform', 'perspective(600px) rotateY(0deg)')
  flip.play()
  setTimeout(function(){ busy = false}, 500) 
}

//Adds card ids to matched array if they have the same penguin
function matchedCards(id, lastId){

  matchedArray.push(id)
  matchedArray.push(lastId)
  setTimeout(function(){ match.play()}, 1000)
}

//Flips cards if they do not contain matching penguins
function mismatchedCards(id, lastId){

  setTimeout(function(){
    busy = false  
    $('div[id ="' + id + '"] > .front').css('transform', 'perspective(600px) rotateY(0deg)')
    $('div[id ="' + id + '"] > .back').css('transform', 'perspective(600px) rotateY(180deg)')
    $('div[id ="' + lastId + '"] > .front').css('transform', 'perspective(600px) rotateY(0deg)')
    $('div[id ="' + lastId + '"] > .back').css('transform', 'perspective(600px) rotateY(180deg)')      
  }, 1000)
}

//Checks to see if two cards have matching penguins
function checkForMatch(){

  if (parseInt(currentCard.penguinType) == parseInt(lastCard.penguinType)){
    matchedCards(currentCard.id, lastCard.id)
    isGameOver(matchedArray.length)
  }else {
    mismatchedCards(currentCard.id, lastCard.id)
  }
  //Updated variables after a check
  attempts++
  secondCard = false
  lastId = '';
  lastPenguinType = '';
}

//Checks whether all matches were found
function isGameOver(length){

  if (length == 16){
     setTimeout(function(){congrats.play()}, 1500)
     alert('Congratulations!!! You are a pro-penguin identifier! \n You identified our 8 penguin matches in ' + attempts + ' attempts!')
  }
}

//Produces randomized cards and loads penguin data
var shuffledArray = shuffleCards(indexArray)
loadCardInfo(idArray, shuffledArray)

$('.card').on('click', function(){
  //Stores card id and penguin data
  currentCard.id = this.id
  currentCard.penguinType = shuffledArray[idArray.indexOf(this.id)]
  //Check if move is allowed
  var bool = isMoveAllowed(currentCard.id, lastCard.id, matchedArray, busy)
  
  if (bool == true){

    flipAnimation(currentCard.id)
    
    if (secondCard == false){
      //perform if chosen card was first card of a pair
      lastCard.id = currentCard.id
      lastCard.penguinType = currentCard.penguinType
      secondCard = true
    }else {
      //perform if chosen card was second of a pair
      checkForMatch()
    }
  }
})
