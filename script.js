import { Ball } from './Ball';

const NB_BALLS = 15;
const PADDING = 50;
const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 800;
const BASE_TIMER = 60;
let timer;
let timerJeu;

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

function clic(){
  document.getElementById('wrap').style.display='none';
  document.getElementById('button2').style.display='none';
  document.getElementById('canvas').style.display='none';
  document.getElementById('droit').style.display='none';
  document.getElementById('competences').style.display='none';
  document.getElementById('experiences').style.display='none';
  document.getElementById('formation').style.display='none';
  document.getElementById('langues').style.display='none';
  document.getElementById('cv').style.display='none';
  document.getElementById('fondDuJeu').style.display='block';
  document.getElementById('sect').style.display='block';
  document.getElementById('presentation').style.display='block';
};

function clic2(){
  document.getElementById('wrap').style.display='none';
  document.getElementById('button2').style.display='none';
  document.getElementById('presentation').style.display='none';
  document.getElementById('canvas').style.display='block';
  document.getElementById('fondDuJeu').style.display='block';
  document.getElementById('sect').style.display='block';
  jeu();
}

function jeu(){
  // Nettoyage de la console
  console.clear()

  // Récupération du canvas et du contexte 2d
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const h = canvas.height;
  const w = canvas.width;
  document.getElementById('canvas').style.cursor='crosshair' // Modification de l'aspect de la souris ds le canvas (une croix)

  // Initialisation du score et du timer
  timer = BASE_TIMER;
  let score = 0;
  let level = 1;
  let newLevel = false;
  let difficulte = 10;
  //création du tableau qui stock les particules
  let explosions = [];
  //Initialisation de la fonction Constructeur des particules

  let Explosion = function (){
    this.conteurParticules = 20; //
    this.particules = [];

    this.init =  function (x, y, color) {
      for (let i = 0; i < this.conteurParticules; i++) {
        let particule = {};
        particule.x = x;
        particule.y = y;
        particule.r = parseInt(Math.random() * 1 + 1.5, 10); // Renvoie un rayon entre 1 et 2
        particule.color = color ;// color; // Couleur des particules
        particule.angle = Math.random() * (Math.PI * 2); // Angle aléatoire en radians
        particule.speed = Math.random() * 1.5 + 5; // Vitesse aléatoire entre 5 et 6.5
        particule.gravity = .1;

        this.particules.push(particule);
      }
      setTimeout(this.meurt, 700);
    }


    this.meurt = function () {
      explosions.shift();
    }
    this.draw = function () {
      for (let i = 0; i < this.conteurParticules; i++) {
         let particule = this.particules[i];

        particule.x += Math.cos(particule.angle) * particule.speed; // Calcul de la trajectoire de la particule en fonction de l'angle et de la vitesse
        particule.y += Math.sin(particule.angle) * particule.speed; // Pour la gestion du level, multiplier par level
        particule.y += particule.gravity

        if (particule.gravity <= 20) {
          particule.gravity += .25
        }

        ctx.fillStyle = particule.color;
        ctx.beginPath();
        ctx.arc(particule.x, particule.y, particule.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

console.log(score);

  // Constructeur objet Needle
  let Needle = function (balls) {
    this.balls = balls;

    // Initialisation de l'aiguille
    this.init = function () {
      this.x0 = 0;
      this.y0 = 0;
      this.cx = 0;
      this.cy = 0;
      this.angle = 0;
      this.x = w / 2;
      this.y = h / 2;
      this.r = 4;
      this.tail = [];
      this.color = '#98D2F2';
      this.moving = false;

      // Récupère les coordonnées du canvas dans le body de la page web pour calculer les coordonnées en fonction du canvas (haut gauche)
      let rect = canvas.getBoundingClientRect();

      this.x0 = rect.left;
      this.y0 = rect.top;

      setInterval(function () {
        this.tail.shift()
      }.bind(this), 10)
    }


    // Dessine l'aiguille
    this.draw = function () {

      // Si l'aiguille bouge mise à jour de ses coordonnées en fonction de la direction
      if (this.moving) {

        //  Calcul des collisions lorsque l'aiguille est en mouvement uniquement
        this.checkCollisions();
      }

      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();

      // initialisation de la taille de la queue
      let tailLength = this.tail.length

      // dessine la queue
      this.tail.forEach(function (p, i) {
        let opacity = 1 - ((tailLength - i) / tailLength)
        let radius = 5 - ((tailLength - i) / tailLength)
  // 0, 20, 255
        ctx.fillStyle = 'rgba(152,210,242, ' + opacity + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      })
    }

    // update needle coords
    this.moveNeedle = function (x, y) {
      setTimeout(function () {
        this.x = x;
        this.y = y;

        if (this.tail.length <= 30) {
          this.tail.push({ x: x, y: y });
        }

       }.bind(this), 150)
    }



    // Gestion du clic souris
    this.handleEvents = function (e) {

      // Coordonnées du clic
      this.cx = e.pageX - this.x0;
      this.cy = e.pageY - this.y0;

      this.moveNeedle(this.cx, this.cy);


    /*  // Direction du clic en fonction de l'aiguille
      this.wx = (this.cx > this.x) ? -1 : 1;
      this.wy = (this.cy > this.y) ? -1 : 1;*/


      // Calcul de l'angle entre l'aiguille et le point du clic
      /* this.angle = Math.atan2(this.cy - this.y, this.cx - this.x); */

      // Met l'aiguille en état de mouvement
      this.moving = true;
    }

    // Initialise l'évènement clic sur le canvas
    this.initEvents = function () {
      canvas.addEventListener('mousemove', this.handleEvents.bind(this));
    }

    // Vérifie les collisions pour chaque balle
    this.checkCollisions = function () {
      this.balls.forEach(this.checkCollision.bind(this))
    }

    // Vérifie la collision entre une balle et l'aiguille
    this.checkCollision = function (ball) {
      // Si la balle n'explose pas, on calcule les collisions
      if (ball.exploding === false) {

        // Formule d'intersection entre 2 cercles
        if (Math.pow(ball.x - this.x, 2) + Math.pow(ball.y - this.y, 2) <= Math.pow(ball.r + this.r, 2)) {
          ball.explode();
        }
      }
    }

    this.initEvents();
  }

  // Stock des balles dans un tableau
  let balls = [];

  for (let i = 0; i < NB_BALLS; i++) {
    let ball = new Ball();
    ball.init();
    balls.push(ball);
  }

  // Initialise notre aiguille
  let needle = new Needle(balls);
  needle.init();


  // Notre boucle principale pour redessiner le canvas
  function loop () {
    // Nettoie le canvas
    ctx.clearRect(0, 0, w, h);

    // Dessine toutes les balles du tableau
    for (let i = 0; i < NB_BALLS; i++) {
      balls[i].draw();
    }

    explosions.forEach(function (p) { p.draw() })

    // Dessine l'aiguille
    needle.draw();

    for (let i = 0; i < score.length; i++) {
      score[i]
    }
    // Dessine le timer
    ctx.fillStyle = '#98D2F2';
    ctx.textAlign = 'left';
    ctx.font = '16px Arial';
    ctx.fillText('Temps: ' + timer, 10, 30);

    // Dessine le score
    ctx.font = '16px Arial';
    ctx.fillText('Score: ' + score, 10, 60);

    //dessine le level
    ctx.font = '16px Arial';
    ctx.fillText('Level: ' + level, 10, 90);

    if (newLevel) {
      ctx.fillStyle = '#f00';
      ctx.strokeStyle = '#000';
      ctx.font = '160px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(level, w/2, h/2+80);
      ctx.strokeText(level, w/2, h/2+80);
    }

    // Tant que le timer est supérieur à 0, on continue
    if (timer > 0) {
      window.requestAnimationFrame(loop)
    } else { // Sinon, fin de la partie avec affichage de GAME OVER
      ctx.fillStyle = '#f00';
      ctx.strokeStyle = '#000';
      ctx.textAlign = 'center';
      ctx.font = '30px Arial';
      ctx.fillText('GAME OVER', w/2, h/2);
      ctx.strokeText('GAME OVER', w/2, h/2);
    }
  }

  // Lance la boucle principale
  loop()

  // Décrémente le timer toute les secondes
  let timerInterval = setInterval(function () {
    timer--;
    if (timer < 0) {
      timer = 0;
      document.getElementById('canvas').style.display='none';
      document.getElementById('fondDuJeu').style.display='none';
      document.getElementById('sect').style.display='none';
      document.getElementById('wrap').style.display='block';
      document.getElementById('button2').style.display='block';
      // Quand le timer arrive à 0, on stop le décompte
      clearInterval(timerInterval);
    }
  }, 1000)
}

$(document).ready(function() {
  $('.toggle').hide();
  $('.clic').click(function() {
    $(this).next('.toggle').slideToggle('easing').siblings('.toggle:visible').slideUp('fast');
  });
});

$(document).on('click',function() {
  $('.progress .progress-bar').css("width",
    function() {
      return $(this).attr("aria-valuenow") + "%";
    });
});
