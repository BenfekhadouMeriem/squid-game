function startTugOfWar() {
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = `
        <h3>Tug of War</h3>
        <p>Tirez sur la corde ! Cliquez pour tirer :</p>
        <button onclick="pull()">Tirer !</button>
        <p id="game-status">Tirez fort pour gagner !</p>
    `;
    
    let strength = 0;

    window.pull = function() {
        strength++;
        document.getElementById('game-status').innerHTML = `Force: ${strength}`;
        if (strength >= 10) {
            alert("Vous avez gagné le tir à la corde !");
        }
    };
}

function startGame(game) {
    document.getElementById('game-selection').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    document.getElementById('game-title').innerText = "Vous avez choisi : " + game;

    if (game === 'Tug of War') {
        startTugOfWar();
    }
}
