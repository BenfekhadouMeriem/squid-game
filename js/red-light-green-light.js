// Variables Globales
const fireworksContainer = document.getElementById('fireworks');
const restartButtonContainer = document.querySelector('.restart-button-container');
const player = document.querySelector('.player');
const finishLine = document.querySelector('.finish-line');
const status = document.querySelector('.status');
const result = document.querySelector('.result');
const progressBar = document.querySelector('.progress-bar');
const playerProgress = document.querySelector('.player-progress');
const gameContainer = document.querySelector('.game-container');
let gameInterval;
let isGameActive = false;
let isGreenLight = true;
let lastPosition = player.offsetLeft;
let finishPosition = window.innerWidth;
let playerPositionAtRedLight = null;
let checkMovementTimeout;
let backgroundMusic;
let fireworkActive = false;

// Fonction pour démarrer la musique
function playBackgroundMusic() {
    backgroundMusic = new Audio('../audio/squid-game.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.play().catch(error => {
        console.error('Erreur de lecture de l\'audio : ', error);
    });
}

// Fonction pour changer l'arrière-plan en fonction du feu
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

// Fonction pour afficher le bouton de redémarrage
function showRestartButton() {
    restartButtonContainer.innerHTML = `
        <button onclick="restartGame()">Redémarrer le jeu</button>
    `;
}

// Fonction pour réinitialiser le jeu avec un message
function resetGame(message) {
    result.textContent = message;
    result.style.color = 'red';
    showRestartButton();
    isGameActive = false;
    clearInterval(gameInterval);
    backgroundMusic.pause(); // Stoppe la musique à la fin du jeu
}

// Fonction pour réinitialiser le jeu après une victoire
function resetGamet(message) {
    result.textContent = message;
    result.style.color = "green";
    showRestartButton();
    isGameActive = false;
    clearInterval(gameInterval);
    backgroundMusic.pause(); // Stoppe la musique à la fin du jeu
}

// Fonction pour redémarrer le jeu
function restartGame() {
    result.textContent = '';
    restartButtonContainer.innerHTML = '';
    player.style.left = '50px';
    lastPosition = player.offsetLeft;
    isGameActive = true;
    playerPositionAtRedLight = null;
    changeBackground(true); // Commencer par feu vert
    gameLoop();
    playBackgroundMusic(); // Rejouer la musique

    // **Arrêter les feux d'artifice**
    fireworkActive = false; 
    let canvas = document.querySelector("canvas");
    if (canvas) {
        canvas.remove(); // Supprimer le canvas pour arrêter les feux d'artifice
    }
}

// Fonction pour déclencher les feux d'artifice
function triggerFireworks() {
    fireworkActive = true;
    setTimeout(startFireworkAnimation); 
}

// Fonction pour afficher et animer les feux d'artifice
function showFireworks() {
    for (let i = 0; i < 3; i++) {
        const firework = document.createElement('div');
        firework.classList.add('firework');
        firework.style.left = `${Math.random() * 100}%`;
        fireworksContainer.appendChild(firework);

        setTimeout(() => {
            firework.style.animation = 'explodeFirework 1s ease-out forwards';
        }, i * 1000);
    }

    startFireworkAnimation();
}

// Fonction pour démarrer l'animation des feux d'artifice
function startFireworkAnimation() {
    const c = document.createElement("canvas");
    document.body.appendChild(c);
    const ctx = c.getContext("2d");
    let cwidth, cheight;
    let shells = [];
    let pass = [];
    let colors = ['#B71C1C', '#880E4F', '#4A148C', '#311B92', '#1A237E', '#0D47A1', '#01579B', '#006064', '#004D40', '#1B5E20', '#33691E', '#827717', '#F57F17', '#FF6F00', '#E65100', '#BF360C'];

    // Réinitialiser la taille du canvas
    window.onresize = function() {
        reset();
    }

    function reset() {
        cwidth = window.innerWidth;
        cheight = window.innerHeight;
        c.width = cwidth;
        c.height = cheight;
    }

    function newShell() {
        let left = (Math.random() > 0.5);
        let shell = {
            x: (1 * left),
            y: 1,
            xoff: (0.01 + Math.random() * 0.007) * (left ? 1 : -1),
            yoff: 0.01 + Math.random() * 0.007,
            size: Math.random() * 6 + 3,
            color: colors[Math.floor(Math.random() * colors.length)]
        };
        shells.push(shell);
    }

    function newPass(shell) {
        let pasCount = Math.ceil(Math.pow(shell.size, 2) * Math.PI);
        for (let i = 0; i < pasCount; i++) {
            let pas = {
                x: shell.x * cwidth,
                y: shell.y * cheight,
                xoff: Math.random() * 10 * Math.sin((5 - Math.random() * 4) * (Math.PI / 2)),
                yoff: Math.random() * 10 * Math.sin(Math.random() * 4 * (Math.PI / 2)),
                color: shell.color,
                size: Math.sqrt(shell.size)
            };
            if (pass.length < 1000) pass.push(pas);
        }
    }

    let lastRun = 0;
    function Run() {
        if (!fireworkActive) return; // Arrêter si les feux d'artifice sont désactivés
        let dt = (lastRun === 0) ? 1 : Math.min(50, (performance.now() - lastRun));
        lastRun = performance.now();

        ctx.clearRect(0, 0, cwidth, cheight);

        if (shells.length < 10 && Math.random() > 0.96) newShell();

        shells.forEach((shell, ix) => {
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
        });

        pass.forEach((pas, ix) => {
            ctx.beginPath();
            ctx.arc(pas.x, pas.y, pas.size, 0, 2 * Math.PI);
            ctx.fillStyle = pas.color;
            ctx.fill();

            pas.x -= pas.xoff;
            pas.y -= pas.yoff;
            pas.xoff -= (pas.xoff * dt * 0.001);
            pas.yoff -= ((pas.yoff + 5) * dt * 0.0005);
            pas.size -= (dt * 0.002 * Math.random());

            if (pas.y > cheight || pas.y < -50 || pas.size <= 0) pass.splice(ix, 1);
        });

        requestAnimationFrame(Run);
    }

    Run();
}

// Fonction pour vérifier si le joueur a bougé pendant le feu rouge
function checkPlayerMovement() {
    if (playerPositionAtRedLight !== null && player.offsetLeft !== playerPositionAtRedLight) {
        resetGame("Tu es tué ! Tu as bougé pendant le feu rouge.");
    } else {
        lastPosition = player.offsetLeft;
        changeBackground(true);
    }
}

// Fonction pour mettre à jour la barre de progression
function updateProgressBar() {
    const progress = (player.offsetLeft / (window.innerWidth)) * 100;
    progressBar.style.width = `${progress}%`;
}

// Fonction principale du jeu
function gameLoop() {
    let greenLightDuration = 4000;
    let redLightDuration = 4000;

    gameInterval = setInterval(() => {
        if (isGameActive) {
            if (player.offsetLeft >= finishPosition) {
                result.textContent = "Félicitations ! Vous avez gagné !";
                resetGamet("Félicitations ! Vous avez gagné !");
                triggerFireworks();
                return;
            }

            isGreenLight = !isGreenLight;
            changeBackground(isGreenLight);

            if (!isGreenLight) {
                playerPositionAtRedLight = player.offsetLeft;
                clearTimeout(checkMovementTimeout);
                checkMovementTimeout = setTimeout(() => {
                    checkPlayerMovement();
                }, 4000);
            } else {
                if (player.offsetLeft < finishPosition) {
                    player.style.left = `${player.offsetLeft + 3}px`;
                }
            }
            updateProgressBar();
        }
    }, isGreenLight ? greenLightDuration : redLightDuration);
}

// Fonction pour gérer le déplacement du joueur avec la souris ou le toucher
document.addEventListener('mousemove', (e) => {
    if (isGameActive && isGreenLight) {
        let movementSpeed = window.innerWidth / 500;
        let playerX = player.offsetLeft + movementSpeed;

        if (playerX > finishPosition) {
            playerX = finishPosition;
        }

        player.style.left = `${playerX}px`;
        lastPosition = player.offsetLeft;
        updateProgressBar();
        window.scrollTo({ left: playerX - window.innerWidth / 2, behavior: "smooth" });
        let progressPercentage = Math.round((playerX / finishPosition) * 100);
        playerProgress.textContent = `Distance: ${Math.round(playerX)} px | Progression: ${progressPercentage}%`;
    }
});

// Gestion des événements tactiles pour mobile
document.addEventListener('touchmove', (e) => {
    if (isGameActive && isGreenLight) {
        let movementSpeed = window.innerWidth / 500;
        let playerX = player.offsetLeft + movementSpeed;

        if (playerX > finishPosition) {
            playerX = finishPosition;
        }

        player.style.left = `${playerX}px`;
        lastPosition = player.offsetLeft;
        updateProgressBar();
        window.scrollTo({ left: playerX - window.innerWidth / 2, behavior: "smooth" });
        let progressPercentage = Math.round((playerX / finishPosition) * 100);
        playerProgress.textContent = `Distance: ${Math.round(playerX)} px | Progression: ${progressPercentage}%`;
    }
});

// Gestion des touches du clavier
document.addEventListener('keydown', (e) => {
    if (isGameActive && isGreenLight) {
        let movementSpeed = window.innerWidth / 500;
        let playerX = player.offsetLeft;

        if (e.key === 'ArrowRight') {
            playerX += movementSpeed;
        } else if (e.key === 'ArrowLeft') {
            playerX -= movementSpeed;
        }

        if (playerX < 0) {
            playerX = 0;
        } else if (playerX > finishPosition) {
            playerX = finishPosition;
        }

        player.style.left = `${playerX}px`;
        lastPosition = player.offsetLeft;
        updateProgressBar();
        window.scrollTo({ left: playerX - window.innerWidth / 2, behavior: "smooth" });
        let progressPercentage = Math.round((playerX / finishPosition) * 100);
        playerProgress.textContent = `Distance: ${Math.round(playerX)} px | Progression: ${progressPercentage}%`;
    }
});

// Démarrer le jeu quand le bouton start est cliqué
document.querySelector('.start-button').addEventListener('click', function() {
    playBackgroundMusic();
    isGameActive = true;
    gameLoop();
    document.querySelector('.centered-button').classList.add('hidden');
});


