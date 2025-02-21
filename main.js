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
grid.addEventListener("mousemove", handleDrawing);

toolbar.addEventListener("click", function (event) {
	const button = event.target.closest("button");

	if (!button || !button.classList.contains("mode-button")) return;

	updateMode(button.dataset.mode);
});

// Functions
function initializeGrid() {
	updateGrid();
	updateBorders(true);
}

function changeTheme() {
	const currentTheme = document.body.dataset.theme;
	const isLightTheme = currentTheme === "light";
	const icon = changeThemeButton.querySelector("i");

	if (isLightTheme) {
		icon.classList.replace("fa-sun", "fa-moon");
		document.body.dataset.theme = "dark";
	} else {
		icon.classList.replace("fa-moon", "fa-sun");
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
			cell.style.backgroundColor = gridColor;
			break;
		case "rainbow":
			gridColor = generateRandomHexColor();
			gridColorInput.value = gridColor;
			cell.style.backgroundColor = gridColor;
			break;
		case "grayscale":
			gridColor = gridColorInput.value;
			const { r, g, b } = hexToRgb(gridColor);

			let currentOpacity = parseFloat(cell.dataset.opacity) || 0;
			currentOpacity = Math.min(currentOpacity + 0.1, 1);

			cell.dataset.opacity = currentOpacity;
			cell.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${currentOpacity})`;
			break;
		case "eraser":
			gridColor = "transparent";
			cell.style.backgroundColor = gridColor;
			break;
	}
}

function generateRandomHexColor() {
	const letters = "0123456789ABCDEF";

	let color = "#";
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}

	return color;
}

function rgbToHex(r, g, b) {
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function hexToRgb(hex) {
	var bigint = parseInt(hex.slice(1), 16);
	var r = (bigint >> 16) & 255;
	var g = (bigint >> 8) & 255;
	var b = bigint & 255;

	return { r, g, b };
}
