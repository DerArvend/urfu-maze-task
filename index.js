'use strict';

const mazeStates = {
    cells: []
};

const initWalls = [
    [1, 2],
    [1, 3],
    [1, 4]
];

let settingStart = false;
let settingFinish = false;
let pathIsDrawn = false;
let pathCellsList;

let startCell;
let finishCell;

const startButton = '<button onclick="settingStart = true; settingFinish = false; clearPath()">Set start</button>';
const finishButton = '<button onclick="settingStart = false; settingFinish = true; clearPath()">Set finish</button>';
const startSearchButton = '<button onclick="clearPath(); startSearch()">GO!!!</button>';


const init = () => {
    createMaze(10);
};

const createMaze = size => {
    let root = document.getElementById("root");
    let mazeHtml = "";
    mazeHtml += '<div class = "mazeStates">';
    for (let i = 0; i < size; i++) {
        mazeStates.cells.push([]);
        mazeHtml += '<div class = "row">';
        for (let j = 0; j < size; j++) {
            mazeStates.cells[i].push("empty");
            mazeHtml += `<div class="cell" state="empty" id="${i}-${j}" onclick="handleClick(${i}, ${j})"></div>`;
        }
        mazeHtml += '</div>';
    }
    mazeHtml += '</div>';
    mazeHtml += startButton;
    mazeHtml += finishButton;
    mazeHtml += startSearchButton;

    root.innerHTML = mazeHtml;

    for (let w of initWalls) {
        toggleWall(w[0], w[1]);
    }
};


const handleClick = (i, j) => {
    if (pathIsDrawn) clearPath();
    let cell = document.getElementById(`${i}-${j}`);

    if (settingStart) {
        if (startCell !== undefined) {
            let oldStart = document.getElementById(`${startCell.x}-${startCell.y}`);
            oldStart.setAttribute("state", "empty");
        }

        cell.setAttribute("state", "start");
        startCell = {x: i, y: j};
        settingStart = false;
    }
    else if (settingFinish) {
        if (finishCell !== undefined) {
            let oldFinish = document.getElementById(`${finishCell.x}-${finishCell.y}`);
            oldFinish.setAttribute("state", "empty");
        }

        cell.setAttribute("state", "finish");
        finishCell = {x: i, y: j};
        settingFinish = false;
    }
    else toggleWall(i, j);
};

const toggleWall = (i, j) => {
    const newState = mazeStates.cells[i][j] === "empty" ? "wall" : "empty";
    mazeStates.cells[i][j] = newState;
    let cell = document.getElementById(`${i}-${j}`);
    cell.setAttribute("state", newState);
};


const startSearch = () => {
    if (!checkStartFinish()) return;
    let queue = [];
    let path = [];
    path.push({x: startCell.x, y: startCell.y, prev: "end"});
    queue.push(startCell);
    let visited = [];

    while (queue.length > 0) {
        let cell = queue.shift(); //dequeue
        if (cellsAreEqual(cell, finishCell)) {
            break;
        }

        visited.push(cell);
        let neighbours = getNeighbourCells(cell, visited);
        for (let n of neighbours) {
            path.push({x: n.x, y: n.y, prev: cell});
            queue.push(n);
            // path.push([[n[0], n[1]], [cell[0], cell[1]]]);
            // queue.push([n[0], n[1]]);
        }
    }
    let pathToFinish = getPath(path);
    drawPath(pathToFinish);
};

const cellsAreEqual = (c1, c2) => c1.x === c2.x && c1.y === c2.y;

const getPath = path => {
    let current = finishCell;
    let next = path.find(c => cellsAreEqual(c, current)).prev;
    let result = [];
    while (next !== "end") {
        result.push(next);
        current = next;
        next = path.find(c => cellsAreEqual(current, c)).prev;
    }
    return result;
};

const drawPath = path => {
    pathCellsList = [];
    for (let i = 0; i < path.length - 1; i++) {
        let cell = document.getElementById(`${path[i].x}-${path[i].y}`);
        pathCellsList.push(cell);
        cell.setAttribute("path", "");
    }
    pathIsDrawn = true;
};

const clearPath = () => {
    if (!pathIsDrawn) return;
    pathCellsList.forEach(c => c.removeAttribute("path"));
    pathIsDrawn = false;
};

const checkStartFinish = () => {
    if (startCell === undefined) {
        alert("WHERE IS START?!?!?!?!?!?!?");
        return false;
    }
    if (finishCell === undefined) {
        alert("WHERE IS FINISH?!?!?!?!?!?!?");
        return false;
    }
    return true;
};

const getNeighbourCells = (cell, visited) => {
    let neighbours = [];
    let cx = cell.x;
    let cy = cell.y;
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (Math.abs(dx) !== Math.abs(dy) && cx + dx >= 0 && cy + dy >= 0 &&
                cx + dx < mazeStates.cells.length && cy + dy < mazeStates.cells.length &&
                mazeStates.cells[cx + dx][cy + dy] !== "wall"
                && !containsCell(visited, {x: cx + dx, y: cy + dy})) {
                neighbours.push({x: cx + dx, y: cy + dy});
            }
        }
    }
    return neighbours;
};

const containsCell = (array, cell) => {
    return array.some(c => c.x === cell.x && c.y === cell.y);
};