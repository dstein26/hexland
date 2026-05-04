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
        if (Math.pow(-1, cc) < 0) {
            colClone.classList.add("offset");
        }

        hexGridDiv.append(colClone);
    }

});

function hexClickEvent(event){
    const target = event.target;

    const hex = target.closest('.hex-cell');
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