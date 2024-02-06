/** @type {HTMLCanvasElement} */
const canvas = document.querySelector('canvas');

const xCols = document.querySelector('#cols');
const yRows = document.querySelector('#rows');
const selectedCells = document.querySelector('#selectedCells');

/** @type {HTMLInputElement} */
const cellSizeInput = document.querySelector('#cellSize');
/** @type {HTMLInputElement} */
const canvasWidthInput = document.querySelector('#canvasWidth');
/** @type {HTMLInputElement} */
const canvasHeightInput = document.querySelector('#canvasHeight');


//#region Global VARS

/** @type {HTMLButtonElement} */
const clearBtn = document.querySelector('#clearBtn');

const context = canvas.getContext("2d");

/** @type {any[][]]} */
let cells;
/** @type {{x: Number, y: Number}} */
let centerCell = { x: 0, y: 0 };

function start() {
	canvas.width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
	canvas.height = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
	canvasWidthInput.value = canvas.width;
	canvasHeightInput.value = canvas.height;
	setColsAndRows();

	resizeAndDraw();
}
start();


//#region GetSetFuncs

function getCols() {
	return Number(xCols.innerHTML);
}
function getRows() {
	return Number(yRows.innerHTML);
}
function getSelectedCells() {
	return Number(selectedCells.innerHTML);
}

function getCellSize() {
	return Number(cellSizeInput.value);
}
function getBoardWidth() {
	return Number(canvasWidthInput.value);
}
function getBoardHeight() {
	return Number(canvasHeightInput.value);
}

function resetSelected() {
	selectedCells.innerHTML = 0;
}
function setColsAndRows() {
	let cellSize = getCellSize();
	xCols.innerHTML = Math.ceil(canvas.width / cellSize);
	yRows.innerHTML = Math.ceil(canvas.height / cellSize);
}

//#endregion

//#region EVENTS

let mx = 0, my = 0;
let mousedownID = -1;
canvas.onmousemove = (ev) => {
	const rect = canvas.getBoundingClientRect();
	mx = ev.clientX - rect.left;
	my = ev.clientY - rect.top;
}
canvas.onmouseup = (ev) => {
	if (mousedownID != -1) {
		clearInterval(mousedownID);
		mousedownID = -1;
	}
}
let cellChangeState;
canvas.onmousedown = (ev) => {
	if (ev.buttons === 1) {
		if (mousedownID === -1)
			mousedownID = setInterval(whileDown, 10);
		const startMouseIndex = mousePosToIndex(mx, my, getCellSize())
		cellChangeState = !cells[startMouseIndex.x][startMouseIndex.y];
	}
	else if(ev.buttons === 4){
		centerCell = mousePosToIndex(mx, my, getCellSize());
		redraw();
		console.log(centerCell);
	}

	function whileDown() {
		const index = mousePosToIndex(mx, my, getCellSize());
		if (ev.buttons == 1 && cells[index.x][index.y] !== cellChangeState) {
			cells[index.x][index.y] = cellChangeState;
			selectedCells.innerHTML = getSelectedCells() + (cellChangeState ? 1 : -1);
			redraw();
		}
	}
}

clearBtn.onclick = () => {
	setCells(() => false);
	selectedCells.innerHTML = 0;
	redraw();
}

cellSizeInput.onchange = () => {
	setColsAndRows();
	resizeAndDraw();
}

canvasWidthInput.onchange = () => {
	canvas.width = getBoardWidth();
	setColsAndRows();
	resizeAndDraw();
}

canvasHeightInput.onchange = () => {
	canvas.height = getBoardHeight();
	setColsAndRows();
	resizeAndDraw();
}

//#endregion

//#region FUNCS

function setCells(callback) {
	let cols = getCols();
	let rows = getRows();
	for (let x = 0; x < cols; x++)
		for (let y = 0; y < rows; y++)
			cells[x][y] = callback(x, y, cells[x][y]);
}

function iterateCells(callback) {
	let cols = getCols();
	let rows = getRows();
	for (let x = 0; x < cols; x++)
		for (let y = 0; y < rows; y++)
			callback(x, y, cells[x][y]);
}

function mousePosToIndex(mouseX, mouseY, cellSize) {
	return {
		x: Math.floor(mouseX / cellSize),
		y: Math.floor(mouseY / cellSize),
	}
}

function redraw() {
	cleanCanvas();
	drawBoard();
}

function resizeAndDraw() {
	cells = create2DArray(getCols(), getRows());
	setCells(() => false);
	resetSelected();
	cleanCanvas();
	drawBoard();
}

function cleanCanvas() {
	context.clearRect(0, 0, canvas.width, canvas.height);
}


function drawText(str, font, color, x, y, maxWidth = undefined) {
	context.fillStyle = color || "black";
	context.textAlign = "center";
	context.font = font;
	context.fillText(str, x, y, maxWidth);
}

function drawRect(x, y, w, h, rectColor, strokeColor) {
	context.beginPath();
	context.strokeStyle = strokeColor || "black";
	context.strokeRect(x, y, w, h);
	context.fillStyle = rectColor || "white";
	context.fillRect(x, y, w, h);
	context.closePath();
	context.fill();
}

function drawBoard() {
	context.strokeStyle = "black";
	let cols = getCols();
	let rows = getRows();
	let cellSize = getCellSize();
	let halfCS = cellSize / 2;
		
	for (let x = cols-1; x >= 0; x--)
	for (let y = rows-1; y >= 0; y--) 
	{
		const isSelected = cells[x][y];
		const isCenter = centerCell.x === x && centerCell.y === y;

		const posX = x * cellSize;
		const posY = y * cellSize;
		drawRect(posX, posY, cellSize, cellSize, isSelected ? "#4B4A87" : "#b7b7a4", isCenter ? "green" : "black");

		if(isSelected)
			drawText(`${x - centerCell.x} ${y - centerCell.y}`, `${halfCS}px Arial`, "white", posX + halfCS, posY + halfCS * 1.35, cellSize - 4);
	}
}
//#endregion

//#region UTIL FUNCS

function create2DArray(x, y) {
	const arr = new Array(x);
	for (var i = 0; i < arr.length; i++)
		arr[i] = new Array(y);
	return arr;
}

//#endregion