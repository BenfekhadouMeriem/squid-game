function startHoneycombChallenge() {
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = `
        <h3>Honeycomb Challenge</h3>
        <p>Découpez la forme sans la casser. Choisissez une forme :</p>
        <button onclick="chooseShape('Étoile')">Étoile</button>
        <button onclick="chooseShape('Cercle')">Cercle</button>
        <button onclick="chooseShape('Parapluie')">Parapluie</button>
        <div id="shape-display"></div>
    `;

    window.chooseShape = function(shape) {
        const shapeDisplay = document.getElementById('shape-display');
        shapeDisplay.innerHTML = `Vous avez choisi : ${shape}. Découpez-la sans la casser !`;

        const success = Math.random() > 0.5; // 50% chance de succès
        if (success) {
            alert("Bravo, vous avez découpé la forme avec succès!");
        } else {
            alert("Dommage, vous avez cassé la forme. Vous avez perdu.");
        }
    };
}

function startGame(game) {
    document.getElementById('game-selection').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    document.getElementById('game-title').innerText = "Vous avez choisi : " + game;

    if (game === 'Honeycomb Challenge') {
        startHoneycombChallenge();
    }
}
