const nRows = 7;
const nCols = 20;

const markovTable = [
    // 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
      [1, 1, 1, 2, 2, 2, 5, 5, 5, 5], // 1: Field transitions
      [2, 2, 2, 2, 3, 3, 3, 1, 1, 1], // 2: Forest transitions
      [3, 3, 3, 3, 4, 4, 4, 2, 2, 2], // 3: Marsh
      [4, 4, 4, 4, 1, 1, 2, 2, 3, 3], // 4: Lake
      [5, 5, 5, 6, 6, 6, 6, 4, 4, 1], // 5: Hills
      [6, 6, 6, 6, 4, 4, 5, 5, 5, 1]  // 6: Mountain
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
    setState(getEmptyNeighborHexes(hex)[0], markovStateTransition(hex));

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
        const diceRoll = randomInt(10);
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
        [[0, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]] :
        [[0, -1], [1, -1], [1, 0], [0, 1], [-1, 0], [-1, -1]];

    return dir.map(([dc, dr]) => {
        return document.querySelector(`.hex-cell[data-col="${col+dc}"][data-row="${row+dr}"]`);
    }).filter(n => n !== null);
}

function getEmptyNeighborHexes(cHex) {
    const neighbors = getNeighborHexes(cHex);
    return neighbors.filter(n => n.classList.contains('c0'));
}

function chooseRandomEmptyHex(cHex) {
    const emptyNeighbors = getEmptyNeighborHexes(cHex);

    if (emptyNeighbors.length === 0) return null;
    const index = randomInt(emptyNeighbors.length);

    return emptyNeighbors[index];
}

function printMsg(string){
    document.getElementById('msg').innerHTML = string;
}