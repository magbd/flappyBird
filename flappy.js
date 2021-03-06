// Mon élémént HTML qui contient mon sprite
var flappybird = document.getElementById('flappybird');
// L'image de sprite que je vais faire défiler pour donner l'impression d'une animation.
var sprite = document.getElementById('sprite');

var spriteStepWidth = 92; // La largeur d'une vignette d'animation
var totalSpriteStep = 2; // Le nombre de vignette - 1
var compteurSpriteStep = 0; // La vignette sur laquelle je commencewindow.
var up = false; //l'oiseau commence par tomber

var pipes = document.getElementById('pipes');
var pipe = pipes.children; // tableau de toutes les div class="pipe" dans id="pipes"
var pipeWidth = pipe[0].offsetWidth; //largeur d'un pipe (=> tous identiques)

var affCompteurScore = document.getElementById('score');
var compteurScore = 0;
affCompteurScore.innerHTML = compteurScore;
var difficulte = 10;

var audioPlayer = document.getElementById('audioPlayer');
var audioPlayerFly = document.getElementById('audioPlayerFly');


//---------------------------------------
// Animation Bird
//---------------------------------------

// Fonction appelée par animateScene()
// Anime le sprite
function animateSprite() {
  // position = sprite.style.left;
  // alert(position);

  // Modifie le style css left => permet le changement de position de sprite (l'image)
  // Je met le left de mon élément à : (-0 * 92) + 'px' -> 0px puis 92px, puis 184px
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

  setEvents(); // récupère les events clavier

  // Si je suis en train d'appuyer sur espace, up == true et donc birdy monte. (-20 => je me rapproche du top)
  if (up == true) {
    flappybird.style.top = (fall - 20) + 'px';
    audioPlayerFly.src = "audio/sfx_swooshing.wav";
  }
  // Sinon, up == false et donc birdy tombe. (+12 => je m'éloigne du top)
  else {
    flappybird.style.top = (fall + 12) + 'px';
  }
}

//---------------------------------------
//Pipes
//---------------------------------------

// fonction qui définit la hauteur de upObstacle et downObstacle qui seront attribué à UP et DOWN dans la fonction createPipe()
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

  return [upObstacle, downObstacle];
}


// fonction qui définit les propriété style à chaque enfant du tableau pipe => up et down
function createPipe(){
  for (var i = 0; i < pipe.length; i++) {
    var taille = heightPipe(); // j'applique la fonction qui définit height à chaque pipe (enfants de id = pipes) => valeurs stockées dans un tableau
    pipe[i].children[0].style.height = taille[0] + '%'; // => up
    pipe[i].children[0].style.backgroundImage = 'url("img/pipe.png")'; // => up

    pipe[i].children[1].style.height = taille[1] + '%'; // => down
    pipe[i].children[1].style.backgroundImage = 'url("img/pipe.png")'; // => down
  }
}


// check si bird touche pipe et passe pipe.style.backgroundColor de vert à rouge
function touchPipe(){

  for (var i = 0; i < pipe.length; i++) {

    // récupère ttes les positions de pipe
    var left = pipe[i].offsetLeft;
    var right = pipe[i].offsetLeft + pipeWidth;
    var positionPipeUp = pipe[i].children[0].offsetHeight;
    var positionPipeDown = pipe[i].children[1].offsetTop;

    //récupère ttes les positions de bird
    var positionBirdUp = flappybird.offsetTop;
    var positionBirdDown = flappybird.offsetHeight + flappybird.offsetTop;
    var positionBirdRight = flappybird.offsetLeft + flappybird.offsetWidth;
    var positionBirdLeft = flappybird.offsetLeft;


    //si sur l'axe horizontal,
    //la droite de bird dépasse la gauche de pipe => arrive à la rencontre de pipe
    //ET
    //que la gauche de bird est plus petit que la droite de pipe => n'a pas encore dépassé
    if (positionBirdRight > left && positionBirdLeft < right) {

      //je vérifie si je touche en haut ou en bas
      // si le pipe est déjà rouge donc touché, on ne décrémente pas de points de vie
      if (positionBirdDown > positionPipeDown && pipe[i].children[1].style.backgroundImage != 'url("img/pipeTouch.png")') {
        pipe[i].children[1].style.backgroundImage = 'url("img/pipeTouch.png")';

        audioPlayer.src = "audio/sfx_hit.wav";
        lifes --; // décrémente de 1 les points de vie
        perdu(); // affiche le compteur de points de vie à jour
      }

      else if (positionBirdUp < positionPipeUp && pipe[i].children[0].style.backgroundImage != 'url("img/pipeTouch.png")' ){
        pipe[i].children[0].style.backgroundImage = 'url("img/pipeTouch.png")';

        audioPlayer.src = "audio/sfx_hit.wav";
        lifes --; // décrémente de 1 les points de vie
        perdu(); // affiche le compteur de points de vie à jour
      }
    }
  }
}


//---------------------------------------
//Animation Pipes
//---------------------------------------

var start = document.getElementById('start');

function animatePipe(){

  for (var i = 0; i < pipe.length; i++) {
    // Je récupère le left de mon pipe
    var left = pipe[i].offsetLeft;

    // Au début les pipes sont hors champs
    if (compteurScore == 0){
      pipe[i].style.left = (left + window.screen.width) +'px';
    }

    // Exécution de l'animation des pipes
    else {
      if (compteurScore > 20) {
        // start.style.display = "none";
        start.classList.add('fadeIn');
      }
      // Et je l'incrémente de 10 vers la gauche
      pipe[i].style.left = (left - difficulte) + 'px';

      // je vérifie si bird entre en collision
      touchPipe();

      // Si left est inférieur à la largeur du pipe -> le pipe a disparu.
      if (left < -pipeWidth) {

        // je remet pipe au début de l'écran
        pipe[i].style.left = 100 + '%';

        // je donne une nouvelle valeur à up et down du nouveau pipe
        var taille = heightPipe();
        pipe[i].children[0].style.height = taille[0] + '%'; // => up
        pipe[i].children[1].style.height = taille[1] + '%'; // => down

        // je reset la couleur des enfants up et down en vert
        pipe[i].children[0].style.backgroundImage = 'url("img/pipe.png")';
        pipe[i].children[1].style.backgroundImage = 'url("img/pipe.png")';
      }
    }
  }
  // le score augmente et fait monter la difficulte
  compteurScore+=1;
  affCompteurScore.innerHTML = compteurScore;
  difficulte = 10 + compteurScore/10;
}

//---------------------------------------
//Lifes
//---------------------------------------

var affCompteurLifes = document.getElementById('lifes');
var compteur = 0;

var tableau = ['heart_full.svg', 'heart_full.svg', 'heart_full.svg'];
var heart_empty = 'heart_empty.svg';
var heart ="";

// lancement et modification des valeurs dans function touchPipe()
function affLifes(){
  var heart ="";

  for (var i = 0; i < tableau.length; i++) {
    heart +=  '<img src=img/' + tableau[i] + '>';
    affCompteurLifes.innerHTML = heart;
  }
}

function compteurVies(){
  tableau.splice(compteur, 1, heart_empty);
  affLifes();
  compteur ++;
}

function perdu(){
  if (compteur < 2) {
    compteurVies();
  }
  else {
    compteurVies();
    audioPlayer.src = "audio/sfx_die.wav";
    modal.style.display = "block";
    window.clearInterval(interval); //stop l'animation
  }
}

//---------------------------------------
//MODAL Game Over => restart
//---------------------------------------

var modal = document.getElementById('myModal');
// Element qui ferme la modal (déclenche fonction restart et ferme la modal)
var replay = document.getElementById("replay");

replay.onclick = function() {
  modal.style.display = "none";
  restart();
}

function restart(){
  //RESET VIES
  compteur = 0;
  tableau = ['heart_full.svg', 'heart_full.svg', 'heart_full.svg'];
  affLifes();

  //RESET SCORE ET DIFFICULTE
  compteurScore = 0;
  difficulte = 10;

  //RESET JEU (pipes vert)
  for (var i = 0; i < pipe.length; i++) {
    pipe[i].children[0].style.backgroundImage = 'url("img/pipe.png")';
    pipe[i].children[1].style.backgroundImage = 'url("img/pipe.png")';
  }

  // Relance l'ensemble des animations => déclenche fonction animateScene
  interval = window.setInterval(animateScene, 100);
}

//---------------------------------------
// Lancement animations
//---------------------------------------

function animateScene () {
  animateSprite();
  animateFly();
  animatePipe();
}
createPipe();
affLifes();
var interval = window.setInterval(animateScene, 100);
