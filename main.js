// DOM Elements
const changeThemeButton = document.querySelector("#change-theme");

const grid = document.querySelector("#grid");
const gridColorInput = document.querySelector("#grid-color-input");
const gridSizeMessage = document.querySelector("#grid-size-message");
const gridSizeInput = document.querySelector("#grid-size-input");
const clearButton = document.querySelector("#clear-button");
const toggleBordersButton = document.querySelector("#toggle-borders-button");
const toolbar = document.querySelector(".toolbar");

// States
let gridSize = 16;
let gridColor = "black";
let currentMode = "brush";
let isMouseDown = false;
let showBorders = true;

// Initialize Grid
document.addEventListener("DOMContentLoaded", initializeGrid);

// Event Listeners
changeThemeButton.addEventListener("click", changeTheme);
gridSizeInput.addEventListener("input", updateGrid);
clearButton.addEventListener("click", clearGrid);
toggleBordersButton.addEventListener("click", () =>
	updateBorders(!showBorders)
);

grid.addEventListener("mousedown", (event) => {
	isMouseDown = true;
	handleDrawing(event);
});
grid.addEventListener("mouseup", () => (isMouseDown = false));
grid.addEventListener("mouseover", handleDrawing);

toolbar.addEventListener("click", function (event) {
	const button = event.target.closest("button");

	if (!button.classList.contains("mode-button")) return;

	updateMode(button.dataset.mode);
});

// Functions
function initializeGrid() {
	updateGrid();
	updateBorders(true);
}

function changeTheme() {
	const currentTheme = document.body.dataset.theme;

	if (currentTheme === "light") {
		changeThemeButton.querySelector("i").classList.replace("fa-sun", "fa-moon");
		document.body.dataset.theme = "dark";
	} else {
		changeThemeButton.querySelector("i").classList.replace("fa-moon", "fa-sun");
		document.body.dataset.theme = "light";
	}
}

function updateGrid() {
	gridSize = gridSizeInput.value;
	gridSizeMessage.textContent = `Grid size: ${gridSize} x ${gridSize}`;

	grid.innerHTML = "";
	grid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
	grid.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

	for (let i = 0; i < gridSize ** 2; i++) {
		const gridCell = document.createElement("div");
		gridCell.classList.add("grid-cell");
		gridCell.dataset.opacity = 0;
		grid.append(gridCell);
	}

	updateMode("brush");
}

function clearGrid() {
	updateGrid();
}

function updateBorders(state) {
	showBorders = state;
	toggleBordersButton.classList.toggle("active", showBorders);
	grid.classList.toggle("show-borders", showBorders);
}

function updateMode(mode) {
	currentMode = mode;
	toolbar
		.querySelectorAll(".mode-button")
		.forEach((button) =>
			button.classList.toggle("active", currentMode === button.dataset.mode)
		);
}

function handleDrawing(event) {
	if (!event.target.classList.contains("grid-cell") || !isMouseDown) return;

	const cell = event.target;

	switch (currentMode) {
		case "brush":
			gridColor = gridColorInput.value;
			break;
		case "rainbow":
			gridColor = generateRandomColor();
			gridColorInput.value = gridColor;
			break;
		case "grayscale":
			gridColor = gridColorInput.value;
			let currentOpacity = parseFloat(cell.dataset.opacity) || 0;
			currentOpacity = Math.min(currentOpacity + 0.1, 1);
			return setCellStyle(cell, gridColor, currentOpacity);
		case "eraser":
			gridColor = "transparent";
			break;
	}

	setCellStyle(cell, gridColor);
}

function setCellStyle(cell, color, opacity = 1) {
	cell.dataset.opacity = opacity === 1 ? "" : opacity;
	cell.style.opacity = opacity;
	cell.style.backgroundColor = color;
}

function generateRandomColor() {
	const letters = "0123456789ABCDEF";

	let color = "#";
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}

	return color;
}
