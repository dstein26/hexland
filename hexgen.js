const nRows = 7;
const nCols = 20;

document.addEventListener("DOMContentLoaded", async function() {
    const hexGridDiv = document.getElementById("grid-container");

    hexGridDiv.addEventListener('click', (e) => hexClickEvent(e));

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

function hexClickEvent(event){
    const target = event.target;

    const hex = target.closest('.hex-cell');
    // getNeighborHexes(hex).forEach((h) => cycleState(h));
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