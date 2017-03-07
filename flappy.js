// Mon élémént HTML qui contient mon sprite
var flappybird = document.getElementById('flappybird');
// L'image de sprite que je vais faire défiler pour donner l'impression d'une animation.
var sprite = document.getElementById('sprite');

var spriteStepWidth = 92; // La largeur d'une vignette d'animation
var totalSpriteStep = 2; // Le nombre de vignette - 1
var compteurSpriteStep = 0; // La vignette sur laquelle je commencewindow.
var up = false; //l'oiseau commence par tomber


//---------------------------------------
// Animation Bird
//---------------------------------------

// Fonction appelée par animateScene()
// Anime le sprite
function animateSprite() {
  // position = sprite.style.left;
  // alert(position);

  // Modifie le style css left => permet le changement de position de sprite (l'image)
  // Je met le left de mon élément à : (-0 * 92) + 'px' -> 0px puis 92, puis 184
  // On voit donc la 1ere vignette puis la 2eme et enfin la 3eme.
  sprite.style.left= '-' + compteurSpriteStep * spriteStepWidth + 'px';

  // if ( 2 == 2 ) je remet le compteur à zéro
  if (compteurSpriteStep == totalSpriteStep) {
    compteurSpriteStep = 0;
  }

  else {
    compteurSpriteStep++;
  }
}

//---------------------------------------

// fonction qui récupère les évènements du clavier
// valeur KEY_SPACE => 32;
function setEvents(){

  //touche espace enfoncée
  document.onkeydown = function (e) {
    if ( e.keyCode == 32 ) {
      up = true;
    }
  }
  //touche espace relachée
  document.onkeyup = function (e) {
    if ( e.keyCode == 32 ) {
      up = false;
    }
  }
}

// fonction qui gère la montée et la descente en fonction des actions claviers récupérées par setEvents()
function animateFly () {

  // offsetTop -> récupère la valeur en pixel de la position top de mon element html
  var fall = flappybird.offsetTop;
  // console.log('fall = '+fall);

  setEvents();

  // Si je suis en train d'appuyer sur espace, up == true et donc birdy monte. (-20 => je me rapproche du top)
  if (up == true) {
    flappybird.style.top = (fall - 20) + 'px';
  }
  // Sinon, up == false et donc birdy tombe. (+12 => je m'éloigne du top)
  else {
    flappybird.style.top = (fall + 12) + 'px';
  }
}

//---------------------------------------
//Pipes
//---------------------------------------

var pipe = document.getElementById('pipe');
var pipeUp = document.getElementById('up');
var pipeDown = document.getElementById('down');
// var pipeWidth = pipe.offsetWidth;
// alert ('pipeWidth vaut : ' + pipeWidth);

function heightPipe(){
  //Pourcentage de mon élément qui fera obstacle
  var obstacle = 70;
  // Je divise obstacle en 3 pour répartir 1/3 d'obstacle en haut et 1/3 d'obstacle en bas.
  var blockObstacle = obstacle / 3;
  // Pour le troisième 1/3 -> je veux un random entre 0 et son total.
  var random = Math.floor( Math.random() * blockObstacle );
  // Ce random je l'ajoute au 1/3 du haut.
  var upObstacle = blockObstacle + random; // 1/3 + random
  // Ce qui reste du troisième 1/3 je l'ajoute au 1/3 du bas.
  var downObstacle = blockObstacle + (blockObstacle - random); // 1/3 + (1/3 - random)

  pipeUp.style.height = upObstacle + '%';
  pipeDown.style.height = downObstacle + '%';
  pipe.style.height = '100%'; // 100% de la fenêtre pour le container pipe
  // alert('up vaut : ' + up.style.height + ' et down vaut : ' + down.style.height);

  pipeDown.style.bottom = '0px'; // fixe down en bas
  // alert('top e ddown = ' + down.offsetTop);
}
heightPipe();

pipeUp.style.backgroundColor = 'green';
pipeDown.style.backgroundColor = 'green';

// check si bird touche pipe et passe pipe.style.backgroundColor de vert à rouge
function touchPipe(){

  // récupère ttes les positions de pipe
  var positionPipeUp = pipeUp.offsetHeight;
  var positionPipeDown = pipeDown.offsetTop;



  //récupère ttes les positions de bird
  var positionBirdUp = flappybird.offsetTop;
  var positionBirdDown = flappybird.offsetHeight + flappybird.offsetTop;

if (positionBirdDown > positionPipeDown) {
    pipeDown.style.backgroundColor = 'red';
  }


  if (positionBirdUp < positionPipeUp){
    pipeUp.style.backgroundColor = 'red';
  }

}


//---------------------------------------
// Lancement animations
//---------------------------------------

function animateScene () {
  animateSprite();
  animateFly();
  touchPipe();
}

setInterval(animateScene, 100);
