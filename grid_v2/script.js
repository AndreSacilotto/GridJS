//#region DOM Vars

/** @type {HTMLElement} */
const optionsContainer = document.getElementById("options");
/** @type {HTMLElement} */
const optionsHeader = document.getElementById("options-header");
/** @type {HTMLInputElement} */
const rowInput = document.getElementById("row-input");
/** @type {HTMLInputElement} */
const columnInput = document.getElementById("column-input");
/** @type {HTMLInputElement} */
const colorInput = document.getElementById("color-input");
/** @type {HTMLInputElement} */
const sizeInput = document.getElementById("size-input");
/** @type {HTMLSpanElement} */
const optionHide = document.getElementById("option-hide");

/** @type {HTMLTableElement} */
const gridTable = document.getElementById("grid-table")

//#region Global Vars

const mousePos = { x: 0, y: 0 }

//#region Get from Input

function getCellSize() {
    return parseInt(sizeInput.value);
}
function getRows() {
    return parseInt(rowInput.value);
}
function getColor() {
    return parseInt(columnInput.value);
}
function getColor() {
    return colorInput.value;
}

//#region MAIN

(function Main() {
    optionHide.onclick = () => {
        const cl = optionsContainer.classList;
        if (cl.contains("hidden"))
            cl.remove("hidden");
        else
            cl.add("hidden");
    }

    rowInput.onchange = generateTableBody;
    rowInput.onkeyup = generateTableBody;

    columnInput.onchange = generateTableBody;
    columnInput.onkeyup = generateTableBody;

    document.addEventListener("mousedown", (ev) => 
    {
        // document.addEventListener("mousemove", (mEv) => {
        //     [mousePos.x, mousePos.y] = [ev.clientX, ev.clientY];
        // });
        
        let cp = getCellByWorld(ev.clientX, ev.clientY);
        let el = getCellNode(cp.row, cp.column);
        setStyleColor(el, getColor());
    })

    draggableElement(optionsContainer);

    rowInput.value = Math.floor(window.innerHeight / getCellSize());
    columnInput.value = Math.floor(window.innerWidth / getCellSize());

    generateTableBody();
})()

/** @param {HTMLElement} element */
function draggableElement(element) {
    let posX_0 = 0, posY_0 = 0, posX_1 = 0, posY_1 = 0;

    element.firstElementChild.addEventListener("mousedown", dragStart);

    /** @param {MouseEvent} ev */
    function dragStart(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        posX_1 = ev.clientX;
        posY_1 = ev.clientY;

        document.addEventListener("mousemove", dragMove);
        document.addEventListener("mouseup", () => document.removeEventListener("mousemove", dragMove), { once: true });
    }

    /** @param {MouseEvent} ev */
    function dragMove(ev) {
        // calculate the new cursor position:
        posX_0 = posX_1 - ev.clientX;
        posY_0 = posY_1 - ev.clientY;
        posX_1 = ev.clientX;
        posY_1 = ev.clientY;
        // set the element's new position:
        element.style.top = (element.offsetTop - posY_0) + "px";
        element.style.left = (element.offsetLeft - posX_0) + "px";
    }
}

//#region Table Funcs

function generateTableBody() {
    const xLen = parseInt(columnInput.value);
    const yLen = parseInt(rowInput.value);

    let tableBody = gridTable.tBodies[0];
    if (tableBody){
        tableBody.remove()
    }

    let cellSize = getCellSize();
    tableBody = gridTable.createTBody();
    setStyleSize(gridTable, window.innerWidth, window.innerHeight);
    for (let y = 0; y < yLen; y++) {
        const tr = gridTable.insertRow()
        setStyleSize(tr, cellSize * xLen, cellSize);
        for (let x = 0; x < xLen; x++) {
            const td = tr.insertCell();
            setStyleSize(td, cellSize, cellSize);
            td.classList.add(`${x}-${y}`);
        }
        tableBody.appendChild(tr);
    }
    gridTable.appendChild(tableBody);
}

function getCellByWorld(x, y) {
    let cellSize = getCellSize();
    const row = Math.floor(y / cellSize);
    const column = Math.floor(x / cellSize);
    return { row, column }
    // console.log(row, column);
}

function getCellNode(row, column){
    return gridTable.rows[row].cells[column];
}

//#region CSS Funcs

/** @param {HTMLElement} element @param {number} size */
function setStyleSize(element, w, h, mod = "px"){
    element.style.width = w + mod;
    element.style.height = h + mod;
    // element.style.width = w + mod;
    // element.style.height = h + mod;
}
/** @param {HTMLElement} element @param {string} color */
function setStyleColor(element, color) {
    element.style.backgroundColor = color;
}