const maze = {
    cells: []
};

const initWalls = [
    [1, 2],
    [1, 3],
    [1, 4]
];

let settingStart = false;
let settingFinish = false;

let startCell;
let finishCell;

const setStartButton = '<button onclick="settingStart = true; settingFinish = false;">Set start</button>';
const setFinishButton = '<button onclick="settingStart = false; settingFinish = true">Set finish</button>';
const startSearchButton = '<button onclick="startSearch()">GO!!!</button>';


const createMaze = size => {
    let root = document.getElementById("root");
    let mazeHtml = "";
    mazeHtml += '<div class = "maze">';
    for (let i = 0; i < size; i++) {
        maze.cells.push([]);
        mazeHtml += '<div class = "row">';
        for (let j = 0; j < size; j++) {
            maze.cells[i].push("empty");
            mazeHtml += `<div class="cell" state="empty" id="${i}-${j}" onclick="handleClick(${i}, ${j})"></div>`;
        }
        mazeHtml += '</div>';
    }
    mazeHtml += '</div>';
    mazeHtml += setStartButton;
    mazeHtml += setFinishButton;
    mazeHtml += startSearchButton;

    root.innerHTML = mazeHtml;

    for (let w of initWalls) {
        toggleWall(w[0], w[1]);
    }
}

function handleClick(i, j) {
    let cell = document.getElementById(`${i}-${j}`);
    if (settingStart) {
        cell.setAttribute("state", "start");
        startCell = [i, j];
        settingStart = false;
    }
    else if (settingFinish) {
        cell.setAttribute("state", "finish");
        finishCell = [i, j];
        settingFinish = false;
    }
    else toggleWall(i, j);
}

function toggleWall(i, j) {
    const newState = maze.cells[i][j] === "empty" ? "wall" : "empty";
    maze.cells[i][j] = newState;
    let cell = document.getElementById(`${i}-${j}`);
    cell.setAttribute("state", newState);
}

const init = () => {
    createMaze(8);
};

const startSearch = () => {
    if (!checkStartFinish()) return;
    let queue = [];
    let path = [];
    path.push([[startCell[0], startCell[1]], "end"]);
    queue.push([startCell[0], startCell[1]]);
    let visited = [];
    while (queue.length > 0) {
        let cell = queue.shift();
        if(cell[0] === finishCell[0] && cell[1] === finishCell[1]){
            break;
        }

        visited.push(cell);
        let neighbours = getNeighbourCells(cell, visited);
        for(let n of neighbours){
            path.push([[n[0], n[1]], [cell[0], cell[1]]]);
            queue.push([n[0], n[1]]);
        };
    }
    let pathToFinish = getPath(path);
    drawPath(pathToFinish);
};

const getPath = path => {
    let current = [finishCell[0], finishCell[1]];
    let next = path.find(x => x[0][0] == current[0] && x[0][1] == current[1])[1];
    let result = [];
    while (next !== "end"){
        result.push([next[0], next[1]]);
        current = next;
        next = path.find(x => x[0][0] == current[0] && x[0][1] == current[1])[1];
    }
    return result;
};

const drawPath = path => {
    for (let i = 0; i < path.length - 1; i++){
        let cell = document.getElementById(`${path[i][0]}-${path[i][1]}`);
        cell.setAttribute("path", "");
    };
}

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
    let cx = cell[0];
    let cy = cell[1];
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (Math.abs(dx) !== Math.abs(dy) && cx + dx >= 0 && cy + dy >= 0 &&
                cx + dx < maze.cells.length && cy + dy < maze.cells.length &&
                maze.cells[cx + dx][cy + dy] !== "wall"
            && !contsinsCell(visited, [cx + dx, cy + dy])) {
                neighbours.push([cx + dx, cy + dy]);
            }
        }
    }
    return neighbours;
};

const contsinsCell = (array, cell) => {
    return array.some(x => x[0] === cell[0] && x[1] === cell[1]);
};