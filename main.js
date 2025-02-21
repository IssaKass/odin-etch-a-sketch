// ==========================
// DOM Elements
// ==========================
const changeThemeButton = document.querySelector("#change-theme");

const grid = document.querySelector("#grid");
const gridColorInput = document.querySelector("#grid-color-input");
const gridSizeMessage = document.querySelector("#grid-size-message");
const gridSizeInput = document.querySelector("#grid-size-input");
const clearButton = document.querySelector("#clear-button");
const toggleBordersButton = document.querySelector("#toggle-borders-button");
const toolbar = document.querySelector(".toolbar");
const exportButton = document.querySelector("#export-button");
const importButton = document.querySelector("#import-button");

// ==========================
// States
// ==========================
const DEFAULT_GRID_SIZE = 16;
const MAX_GRID_SIZE = 100;

let gridSize = DEFAULT_GRID_SIZE;
let gridColor = "black";
let currentMode = "brush";
let isMouseDown = false;
let showBorders = true;

// ==========================
// Initialization
// ==========================

// Initialize grid on page load
document.addEventListener("DOMContentLoaded", initializeGrid);

// ==========================
// Event Listeners
// ==========================

// Toggle theme between light and dark
changeThemeButton.addEventListener("click", changeTheme);

// Update grid size when slider value changes
gridSizeInput.addEventListener("input", (event) =>
	updateGrid(event.target.value)
);

// Export the grid as an image on button click
exportButton.addEventListener("click", exportGridAsImage);

// Import the image as grid on file input change
importButton.addEventListener("change", importImageAsGrid);

// Clear the grid when clear button is clicked
clearButton.addEventListener("click", clearGrid);

// Toggle grid borders on button click
toggleBordersButton.addEventListener("click", () =>
	updateBorders(!showBorders)
);

// Handle drawing events
grid.addEventListener("mousedown", (event) => {
	isMouseDown = true;
	handleDrawing(event);
});
grid.addEventListener("mouseup", () => (isMouseDown = false));
grid.addEventListener("mouseleave", () => (isMouseDown = false));
grid.addEventListener("mouseover", handleDrawing);

// Change drawing mode when a mode-button is clicked
toolbar.addEventListener("click", function (event) {
	const button = event.target.closest("button");

	if (!button || !button.classList.contains("mode-button")) return;

	updateMode(button.dataset.mode);
});

// ==========================
// Functions
// ==========================

/**
 * Initializes the grid and sets default state.
 */
function initializeGrid() {
	updateGrid(DEFAULT_GRID_SIZE);
	updateBorders(true);
}

/**
 * Toggles between light and dark themes.
 */
function changeTheme() {
	const currentTheme = document.body.dataset.theme;
	const icon = changeThemeButton.querySelector("i");

	// Toggle theme and update icon
	if (currentTheme === "light") {
		icon.classList.replace("fa-sun", "fa-moon");
		document.body.dataset.theme = "dark";
	} else {
		icon.classList.replace("fa-moon", "fa-sun");
		document.body.dataset.theme = "light";
	}
}

/**
 * Updates the grid size and regenerates grid cells.
 */
function updateGrid(size) {
	// Update grid size state
	gridSize = size;
	gridSizeMessage.textContent = `${gridSize} x ${gridSize}`;

	// Clear existing grid
	grid.innerHTML = "";
	grid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
	grid.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

	// Create grid cells
	for (let i = 0; i < gridSize ** 2; i++) {
		const gridCell = document.createElement("div");
		gridCell.classList.add("grid-cell");
		gridCell.dataset.opacity = 0; // For grayscale mode
		grid.append(gridCell);
	}

	// Reset to default drawing mode
	updateMode("brush");
}

/**
 * Clears the grid by regenerating grid cells.
 */
function clearGrid() {
	importButton.value = ""; // Remove the uploaded file
	updateGrid(gridSize);
}

/**
 * Toggles grid borders on or off.
 * @param {boolean} state - New state for border visibility
 */
function updateBorders(state) {
	showBorders = state;
	toggleBordersButton.classList.toggle("active", showBorders);
	grid.classList.toggle("show-borders", showBorders);
}

/**
 * Updates the current drawing mode.
 * @param {string} mode - New drawing mode ("brush", "rainbow", "grayscale", "eraser")
 */
function updateMode(mode) {
	currentMode = mode;
	toolbar
		.querySelectorAll(".mode-button")
		.forEach((button) =>
			button.classList.toggle("active", currentMode === button.dataset.mode)
		);
}

/**
 * Handles drawing logic for different modes.
 * @param {Event} event - Mouse event
 */
function handleDrawing(event) {
	// Exit if not on a grid cell or mouse is not down
	if (!event.target.classList.contains("grid-cell") || !isMouseDown) return;

	const cell = event.target;

	// Determine drawing behavior based on mode
	switch (currentMode) {
		case "brush":
			// Use selected color for brush mode
			gridColor = gridColorInput.value;
			cell.style.backgroundColor = gridColor;
			break;
		case "rainbow":
			// Generate random color for rainbow mode
			gridColor = generateRandomHexColor();
			gridColorInput.value = gridColor;
			cell.style.backgroundColor = gridColor;
			break;
		case "grayscale":
			// Apply grayscale effect by increasing opacity
			gridColor = gridColorInput.value;
			const { r, g, b } = hexToRgb(gridColor);

			let currentOpacity = parseFloat(cell.dataset.opacity) || 0;
			currentOpacity = Math.min(currentOpacity + 0.1, 1);

			cell.dataset.opacity = currentOpacity;
			cell.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${currentOpacity})`;
			break;
		case "eraser":
			// Make cell transparent for eraser mode
			gridColor = "transparent";
			cell.dataset.opacity = 0; // Reset the opacity
			cell.style.backgroundColor = gridColor;
			break;
	}
}

/**
 * Generates a random hex color.
 * @returns {string} Random hex color
 */
function generateRandomHexColor() {
	const letters = "0123456789ABCDEF";

	let color = "#";
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}

	return color;
}

/**
 * Converts RGB values to hex color.
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {string} Hex color string
 */
function rgbToHex(r, g, b) {
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * Converts a hex color string to RGB values.
 * @param {string} hex - Hex color string
 * @returns {object} Object containing RGB values
 */
function hexToRgb(hex) {
	var bigint = parseInt(hex.slice(1), 16);
	var r = (bigint >> 16) & 255;
	var g = (bigint >> 8) & 255;
	var b = bigint & 255;

	return { r, g, b };
}

/**
 * Converts the grid's colors into a 2D array.
 * @returns {string[][]} A 2D array representing the grid's colors in RGB format.
 */
function getGridColors() {
	const colors = [];

	for (let row = 0; row < gridSize; row++) {
		colors[row] = [];

		for (let col = 0; col < gridSize; col++) {
			const cell = grid.children[row * gridSize + col];
			const color = getComputedStyle(cell).backgroundColor;
			colors[row][col] = color;
		}
	}

	return colors;
}

/**
 * Exports the grid as an image using Canvas.
 */
function exportGridAsImage() {
	const canvas = document.createElement("canvas");
	const context = canvas.getContext("2d");

	// Set canvas dimensions
	canvas.width = gridSize;
	canvas.height = gridSize;

	context.fillStyle = "#FFFFFF";
	context.fillRect(0, 0, canvas.width, canvas.height);

	const gridColors = getGridColors();

	// Draw each grid cell onto the canvas
	for (let i = 0; i < gridColors.length; i++) {
		for (let j = 0; j < gridColors[i].length; j++) {
			let color = gridColors[i][j];

			if (color === "rgba(0, 0, 0, 0)" || color === "transparent") {
				color = "#FFFFFF";
			}

			context.fillStyle = color;
			context.fillRect(i, j, 1, 1);
		}
	}

	// Convert canvas to image and trigger download
	const imageUrl = canvas.toDataURL("image/png");
	const downloadLink = document.createElement("a");
	downloadLink.href = imageUrl;
	downloadLink.download = `grid_${gridSize}x${gridSize}.png`;
	downloadLink.click();
}

/**
 * Main function to handle image import and convert it to a grid.
 * Triggers the import and processes the image once it's loaded.
 */
function importImageAsGrid() {
	const file = importButton.files[0];
	if (!file) return;

	// Create an Image object and trigger the image load process
	const image = createImageFromFile(file);
	image.onload = () => drawImageToGrid(image);
}

/**
 * Creates an Image object from the provided file.
 * @param {File} file - The uploaded file.
 * @returns {HTMLImageElement} The created Image object.
 */
function createImageFromFile(file) {
	const image = new Image();
	image.src = URL.createObjectURL(file);
	return image;
}

/**
 * Draws the uploaded image onto a hidden canvas and processes it to extract pixel data.
 * @param {HTMLImageElement} image - The image to be drawn on the canvas.
 */
function drawImageToGrid(image) {
	const canvas = document.createElement("canvas");
	const context = canvas.getContext("2d", { willReadFrequently: true });

	// Set canvas dimensions to match image size
	canvas.width = image.naturalWidth;
	canvas.height = image.naturalHeight;

	gridSize = Math.max(canvas.width, canvas.height);
	if (gridSize >= MAX_GRID_SIZE) {
		gridSize = MAX_GRID_SIZE;
	}

	gridSizeInput.value = gridSize;

	// Draw the image on the canvas
	context.drawImage(image, 0, 0);

	// Creates a new grid
	updateGrid(gridSize);

	// Extract pixel data from the canvas and apply it to the grid
	const colors = extractColorsFromCanvas(context);
	applyColorsToGrid(colors);

	// Release the image object URL
	URL.revokeObjectURL(image.src);
}

/**
 * Extracts the color data from the canvas, row by row and column by column.
 * @param {CanvasRenderingContext2D} context - The 2D context of the canvas containing the image.
 * @returns {string[][]} A 2D array of RGBA color values in string format.
 */
function extractColorsFromCanvas(context) {
	const colors = [];

	for (let row = 0; row < gridSize; row++) {
		colors[row] = [];

		for (let col = 0; col < gridSize; col++) {
			const [r, g, b, a] = context.getImageData(row, col, 1, 1).data;
			const rgbaColor = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
			colors[row][col] = rgbaColor;
		}
	}

	return colors;
}

/**
 * Applies the extracted pixel colors to the grid cells.
 * @param {string[][]} colors - A 2D array of RGBA colors to be applied to the grid.
 */
function applyColorsToGrid(colors) {
	for (let row = 0; row < gridSize; row++) {
		for (let col = 0; col < gridSize; col++) {
			const cell = grid.children[row * gridSize + col];
			cell.style.backgroundColor = colors[row][col];
		}
	}
}
