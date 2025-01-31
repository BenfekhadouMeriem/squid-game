function showFireworks() {
    const fireworksContainer = document.getElementById('fireworks');
    for (let i = 0; i < 3; i++) {
        const firework = document.createElement('div');
        firework.classList.add('firework');
        firework.style.left = `${Math.random() * 100}%`;
        fireworksContainer.appendChild(firework);

        // Animation des feux d'artifice
        setTimeout(() => {
            firework.style.animation = 'explodeFirework 1s ease-out forwards';
        }, i * 1000);
    }

    // Ajout de l'animation des particules (feux d'artifice)
    startFireworkAnimation();
}

function startFireworkAnimation() {
    // Créer un élément de message à afficher
    const messageElement = document.createElement("div");
    //messageElement.textContent = "Félicitations ! Vous avez gagné !";
    messageElement.style.position = "fixed";
    messageElement.style.top = "50%";
    messageElement.style.left = "50%";
    messageElement.style.transform = "translate(-50%, -50%)";
    messageElement.style.fontSize = "30px";
    messageElement.style.color = "green";
    messageElement.style.fontWeight = "bold";
    messageElement.style.zIndex = "9999"; // S'assurer que le message est au-dessus des autres éléments
    //document.body.appendChild(messageElement);

    var c = document.createElement("canvas");
    document.body.appendChild(c);

    var ctx = c.getContext("2d");
    var cwidth, cheight;
    var shells = [];
    var pass = [];

    var colors = [
        '#B71C1C', // Rouge foncé
        '#880E4F', // Rose foncé
        '#4A148C', // Violet foncé
        '#311B92', // Bleu profond
        '#1A237E', // Bleu marine
        '#0D47A1', // Bleu foncé
        '#01579B', // Bleu canard
        '#006064', // Turquoise foncé
        '#004D40', // Vert émeraude foncé
        '#1B5E20', // Vert foncé
        '#33691E', // Vert forêt
        '#827717', // Vert olive foncé
        '#F57F17', // Jaune moutarde foncé
        '#FF6F00', // Orange brûlé
        '#E65100', // Orange foncé
        '#BF360C'  // Rouge brique
    ];
    
    window.onresize = function() { reset(); }
    reset();

    function reset() {
        cwidth = window.innerWidth;
        cheight = window.innerHeight;
        c.width = cwidth;
        c.height = cheight;
    }

    function newShell() {
        var left = (Math.random() > 0.5);
        var shell = {};
        shell.x = (1 * left);
        shell.y = 1;
        shell.xoff = (0.01 + Math.random() * 0.007) * (left ? 1 : -1);
        shell.yoff = 0.01 + Math.random() * 0.007;
        shell.size = Math.random() * 6 + 3;
        shell.color = colors[Math.floor(Math.random() * colors.length)];
        shells.push(shell);
    }

    function newPass(shell) {
        var pasCount = Math.ceil(Math.pow(shell.size, 2) * Math.PI);

        for (i = 0; i < pasCount; i++) {
            var pas = {};
            pas.x = shell.x * cwidth;
            pas.y = shell.y * cheight;

            var a = Math.random() * 4;
            var s = Math.random() * 10;

            pas.xoff = s * Math.sin((5 - a) * (Math.PI / 2));
            pas.yoff = s * Math.sin(a * (Math.PI / 2));

            pas.color = shell.color;
            pas.size = Math.sqrt(shell.size);

            if (pass.length < 1000) { pass.push(pas); }
        }
    }

    var lastRun = 0;
    Run();
    function Run() {
        if (!fireworkActive) return; // Arrêter si le jeu est reset
    
        var dt = 1;
        if (lastRun != 0) { dt = Math.min(50, (performance.now() - lastRun)); }
        lastRun = performance.now();
    
        ctx.clearRect(0, 0, cwidth, cheight);
    
        if ((shells.length < 10) && (Math.random() > 0.96)) { newShell(); }
    
        for (let ix in shells) {
            var shell = shells[ix];
    
            ctx.beginPath();
            ctx.arc(shell.x * cwidth, shell.y * cheight, shell.size, 0, 2 * Math.PI);
            ctx.fillStyle = shell.color;
            ctx.fill();
    
            shell.x -= shell.xoff;
            shell.y -= shell.yoff;
            shell.xoff -= (shell.xoff * dt * 0.001);
            shell.yoff -= ((shell.yoff + 0.2) * dt * 0.00005);
    
            if (shell.yoff < -0.005) {
                newPass(shell);
                shells.splice(ix, 1);
            }
        }
    
        for (let ix in pass) {
            var pas = pass[ix];
    
            ctx.beginPath();
            ctx.arc(pas.x, pas.y, pas.size, 0, 2 * Math.PI);
            ctx.fillStyle = pas.color;
            ctx.fill();
    
            pas.x -= pas.xoff;
            pas.y -= pas.yoff;
            pas.xoff -= (pas.xoff * dt * 0.001);
            pas.yoff -= ((pas.yoff + 5) * dt * 0.0005);
            pas.size -= (dt * 0.002 * Math.random());
    
            if ((pas.y > cheight) || (pas.y < -50) || (pas.size <= 0)) {
                pass.splice(ix, 1);
            }
        }
    
        requestAnimationFrame(Run);
    }
    
    
    // Supprimer le message après un certain délai
    /*setTimeout(() => {
        messageElement.style.display = 'none';
    }, 5000);*/ // Le message disparaît après 5 secondes
}


function triggerFireworks() {
    fireworkActive = true; // Réactiver les feux d'artifice
    setTimeout(startFireworkAnimation); // Attendre un peu avant de redémarrer
}




const restartButtonContainer = document.querySelector('.restart-button-container');
const player = document.querySelector('.player');
const finishLine = document.querySelector('.finish-line');
const status = document.querySelector('.status');
const result = document.querySelector('.result');
const progressBar = document.querySelector('.progress-bar'); // Récupère la barre de progression
const playerProgress = document.querySelector('.player-progress');
const gameContainer = document.querySelector('.game-container'); // Récupérer l'élément du container du jeu

let gameInterval;
let isGameActive = false; // Le jeu commence inactif
let isGreenLight = true;
let lastPosition = player.offsetLeft;
let finishPosition = window.innerWidth; // Ligne d'arrivée à 5 fois la largeur de l'écran
let playerPositionAtRedLight = null;
let checkMovementTimeout;
let backgroundMusic; // Déclaration de la variable pour l'audio

// Fonction pour démarrer la musique
function playBackgroundMusic() {
    backgroundMusic = new Audio('../audio/squid-game.mp3'); // Créer un nouvel objet audio à chaque démarrage
    backgroundMusic.loop = true; // Répéter la musique en boucle
    backgroundMusic.play().catch(error => {
        console.error('Erreur de lecture de l\'audio : ', error);
    });
}

// Écouteur d'événement pour démarrer l'audio lorsque le jeu commence
document.querySelector('.start-button').addEventListener('click', () => {
    // Démarrer la musique lorsque le jeu commence
    playBackgroundMusic(); // Appeler la fonction pour démarrer la musique
    isGameActive = true;
    gameLoop(); // Commence la boucle du jeu
});

function changeBackground(isGreen) {
    const body = document.body;
    if (isGreen) {
        body.style.backgroundImage = "url('../images/do.png')";
        body.style.backgroundRepeat = "no-repeat";
        body.style.backgroundPosition = "center";
        status.textContent = "🟢 Feu vert";
    } else {
        body.style.backgroundImage = "url('../images/dont.png')";
        body.style.backgroundRepeat = "no-repeat";
        body.style.backgroundPosition = "center";
        status.textContent = "🔴 Feu rouge";
    }
}

function showRestartButton() {
    restartButtonContainer.innerHTML = `
        <button onclick="restartGame()">Redémarrer le jeu</button>
    `;
}

function resetGame(message) {
    result.textContent = message;
    result.style.color = 'red';
    showRestartButton();
    isGameActive = false;
    clearInterval(gameInterval);
    backgroundMusic.pause(); // Stoppe la musique à la fin du jeu
}

function resetGamet(message) {
    result.textContent = message;
    result.style.color = "green";
    showRestartButton();
    isGameActive = false;
    clearInterval(gameInterval);
    backgroundMusic.pause(); // Stoppe la musique à la fin du jeu
}


function restartGame() {
    result.textContent = '';
    restartButtonContainer.innerHTML = '';
    player.style.left = '50px';
    lastPosition = player.offsetLeft;
    isGameActive = true;
    playerPositionAtRedLight = null;
    changeBackground(true); // Commencer par feu vert
    gameLoop();
    playBackgroundMusic(); // Rejouer la musique lorsqu'on redémarre

    // **Arrêter les feux d'artifice**
    fireworkActive = false; // Stopper la boucle d'animation
    let canvas = document.querySelector("canvas");
    if (canvas) {
        canvas.remove(); // Supprimer le canvas pour arrêter les feux d'artifice
    }

    // **Réinitialiser les feux d'artifice pour la prochaine victoire**
    shells = [];
    pass = [];
}


function checkPlayerMovement() {
    if (playerPositionAtRedLight !== null && player.offsetLeft !== playerPositionAtRedLight) {
        resetGame("Tu es tué ! Tu as bougé pendant le feu rouge.");
    } else {
        lastPosition = player.offsetLeft;
        changeBackground(true);
    }
}

function updateProgressBar() {
    const progress = (player.offsetLeft / ( window.innerWidth )) * 100;
    progressBar.style.width = `${progress}%`;
}

function gameLoop() {
    let greenLightDuration = 4000; // Feu vert pendant 5 secondes
    let redLightDuration = 4000; // Feu rouge pendant 3 secondes

    // Commencer le cycle feu vert -> feu rouge
    gameInterval = setInterval(() => {
        if (isGameActive) {
            if (player.offsetLeft >= finishPosition) {
                result.textContent = "Félicitations ! Vous avez gagné !";
                resetGamet("Félicitations ! Vous avez gagné !");
                triggerFireworks(); // Déclenche les feux d'artifice immédiatement
                return;
            }

            // Change de couleur de lumière et alterne le temps
            isGreenLight = !isGreenLight;
            changeBackground(isGreenLight); // Changer l'arrière-plan

            // Si c'est le feu rouge, on enregistre la position du joueur pour vérifier le mouvement
            if (!isGreenLight) {
                playerPositionAtRedLight = player.offsetLeft;
                clearTimeout(checkMovementTimeout);
                checkMovementTimeout = setTimeout(() => {
                    checkPlayerMovement();
                }, 4000);
            } else {
                if (player.offsetLeft < finishPosition) {
                    player.style.left = `${player.offsetLeft + 3}px`; // Déplacement constant du joueur
                }
            }
            updateProgressBar(); // Mise à jour de la barre de progression
        }
    }, isGreenLight ? greenLightDuration : redLightDuration); // Alterne entre feu vert et feu rouge selon les durées respectives
}

function updateGroundLine() {
    const playerX = player.offsetLeft;
    gameContainer.style.setProperty('--ground-line-position', `${playerX}px`); // Met à jour la position de la ligne de fond via une variable CSS
}

document.addEventListener('mousemove', (e) => {
    if (isGameActive && isGreenLight) {
        let movementSpeed = window.innerWidth / 500; // Ajuste la vitesse
        let playerX = player.offsetLeft + movementSpeed;

        if (playerX > finishPosition) {
            playerX = finishPosition;
        }

        player.style.left = `${playerX}px`;
        lastPosition = player.offsetLeft;
        updateProgressBar();

        // Faire défiler l'écran pour suivre le joueur
        window.scrollTo({
            left: playerX - window.innerWidth / 2, // Centrer le joueur
            behavior: "smooth"
        });

        // Afficher la distance parcourue et le pourcentage
        let progressPercentage = Math.round((playerX / finishPosition) * 100);
        playerProgress.textContent = `Distance: ${Math.round(playerX)} px | Progression: ${progressPercentage}%`;
    }
});

document.querySelector('.start-button').addEventListener('click', function() {
    // Cacher le bouton après le clic
    document.querySelector('.centered-button').classList.add('hidden');
});


