const nRows = 7;
const nCols = 20;

const markovTable = [
    [4, 4, 2, 2, 1, 1, 1, 5, 5, 3, 3], // 1: Field transitions
    [1, 1, 2, 2, 2, 2, 2, 4, 4, 5, 5], // 2: Forest transitions
    [1, 1, 1, 2, 2, 1, 2, 2, 1, 1, 1], // 3: Village (Isolated)
    [4, 4, 4, 1, 1, 1, 1, 1, 2, 4, 4], // 4: Lake (Chaining tails)
    [1, 1, 1, 1, 5, 5, 5, 6, 6, 6, 6], // 5: Hills
    [6, 6, 4, 4, 5, 5, 5, 5, 4, 6, 6]  // 6: Mountain (Chaining tails)
]

document.addEventListener("DOMContentLoaded", async function() {
    const hexGridDiv = document.getElementById("grid-container");

    hexGridDiv.addEventListener('click', (e) => hexClickEvent(e));
    hexGridDiv.addEventListener('contextmenu', (e) => hexRightClickEvent(e));

    const hexCol = document.createElement("div");
    hexCol.classList.add("hex-col");

    const hex = document.createElement("div");
    hex.classList.add("hex-border");
    hex.innerHTML = '<div class="hex-cell c0">\n<div class="hex-cover"></div>\n</div>';

    for (let rr = 0; rr < nRows; rr++){
        hexCol.appendChild(hex.cloneNode(true));
    }

    for (let cc=0; cc < nCols; cc++){
        const colClone = hexCol.cloneNode(true)
        if (cc%2 !== 0) {
            colClone.classList.add("offset");
        }

        const hexesInCol = colClone.querySelectorAll('.hex-cell');

        hexesInCol.forEach((hex, rr) => {
            hex.dataset.row = rr;
            hex.dataset.col = cc;
        });

        hexGridDiv.append(colClone);
    }

});

function randomInt(max){
    return Math.floor(Math.random() * max);
}

function hexRightClickEvent(event){
    event.preventDefault();
    const target = event.target;

    const hex = target.closest('.hex-cell');
    setState(chooseRandomEmptyHex(hex), markovStateTransition(hex));

    return false;
}

function hexClickEvent(event){
    const target = event.target;

    const hex = target.closest('.hex-cell');
    // getNeighborHexes(hex).forEach((h) => cycleState(h)); // Testing getting neighbors
    // setState(chooseRandomEmptyHex(hex), randomInt(6)+1);    // Testing random neighbor and set state
    cycleState(hex);
}

function setState(hex, state){
    const currentClass = [...hex.classList].find(cls => /^c[0-6]$/.test(cls));

    if (currentClass) {
        const currentIndex = parseInt(currentClass.substring(1));
        const nextIndex = (state) % 7;

        hex.classList.remove(currentClass);
        hex.classList.add(`c${nextIndex}`);
    } else {
        hex.classList.add("c0");
    }
}

function cycleState(hex){
    const currentClass = [...hex.classList].find(cls => /^c[0-6]$/.test(cls));

    if (currentClass) {
        const currentIndex = parseInt(currentClass.substring(1));
        const nextIndex = (currentIndex + 1) % 7;

        hex.classList.remove(currentClass);
        hex.classList.add(`c${nextIndex}`);
    } else {
        hex.classList.add("c0");
    }
}

function markovStateTransition(hex){
    const currentClass = [...hex.classList].find(cls => /^c[0-6]$/.test(cls));

    if (currentClass) {
        const currentIndex = parseInt(currentClass.substring(1));
        const diceRoll = randomInt(6) + randomInt(6);
        const nextState = markovTable[currentIndex-1][diceRoll];
        printMsg(`Rolled ${diceRoll}. Next State: ${nextState}`);

        return nextState;
        
    } else {
        return 0;
    }
}

function getNeighborHexes(cHex) {
    const col = parseInt(cHex.dataset.col);
    const row = parseInt(cHex.dataset.row);

    const isOdd = col % 2 !== 0;

    const dir = isOdd ? 
        [[0, -1], [0, 1], [-1, 0], [-1, 1], [1, 0], [1, 1]] :
        [[0, -1], [0, 1], [-1, -1], [-1, 0], [1, -1], [1, 0]];

    return dir.map(([dc, dr]) => {
        return document.querySelector(`.hex-cell[data-col="${col+dc}"][data-row="${row+dr}"]`);
    }).filter(n => n !== null);
}

function chooseRandomEmptyHex(cHex) {
    const neighbors = getNeighborHexes(cHex);
    const emptyNeighbors = neighbors.filter(n => n.classList.contains('c0'));

    if (emptyNeighbors.length === 0) return null;
    const index = randomInt(emptyNeighbors.length);

    return emptyNeighbors[index];
}

function printMsg(string){
    document.getElementById('msg').innerHTML = string;
}