import { Node } from './Node.js';

export class Grid {
    constructor(rows = 10, cols = 10) {
        this.rows = rows;
        this.cols = cols;
        this.grid = [];
        this.startNode = null;
        this.endNode = null;
        this.initializeGrid();
    }

    initializeGrid() {
        const gridElement = document.getElementById('grid');
        if (!gridElement) {
            console.error('Grid element not found');
            return;
        }

        gridElement.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
        gridElement.innerHTML = '';
        this.grid = [];

        for (let row = 0; row < this.rows; row++) {
            const currentRow = [];
            for (let col = 0; col < this.cols; col++) {
                const node = new Node(row, col);
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                node.element = cell;
                gridElement.appendChild(cell);
                currentRow.push(node);
            }
            this.grid.push(currentRow);
        }
    }

    addRow(position) {
        const newRow = [];
        const rowIndex = position === 'top' ? 0 : this.rows;
        
        for (let col = 0; col < this.cols; col++) {
            const node = new Node(rowIndex, col);
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = rowIndex;
            cell.dataset.col = col;
            node.element = cell;
            newRow.push(node);
        }

        if (position === 'top') {
            this.grid.unshift(newRow);
            for (let row = 1; row < this.rows + 1; row++) {
                for (let col = 0; col < this.cols; col++) {
                    this.grid[row][col].row = row;
                    this.grid[row][col].element.dataset.row = row;
                }
            }
        } else {
            this.grid.push(newRow);
        }

        const gridElement = document.getElementById('grid');
        if (position === 'top') {
            for (let col = 0; col < this.cols; col++) {
                const insertPosition = col;
                const referenceNode = gridElement.children[insertPosition];
                if (referenceNode) {
                    gridElement.insertBefore(newRow[col].element, referenceNode);
                } else {
                    gridElement.appendChild(newRow[col].element);
                }
            }
        } else {
            newRow.forEach(node => gridElement.appendChild(node.element));
        }

        this.rows++;

        if (window.isWeightMode) {
            newRow.forEach(node => node.updateElement());
        }
    }

    addColumn(position) {
        const colIndex = position === 'left' ? 0 : this.cols;
        const newNodes = [];
        for (let row = 0; row < this.rows; row++) {
            const node = new Node(row, colIndex);
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = colIndex;
            node.element = cell;
            newNodes.push(node);
            if (position === 'left') {
                this.grid[row].unshift(node);
                for (let col = 1; col < this.cols + 1; col++) {
                    this.grid[row][col].col = col;
                    this.grid[row][col].element.dataset.col = col;
                }
            } else {
                this.grid[row].push(node);
            }
        }

        const gridElement = document.getElementById('grid');
        gridElement.style.gridTemplateColumns = `repeat(${this.cols + 1}, 1fr)`;
        
        if (position === 'left') {
            for (let row = 0; row < this.rows; row++) {
                const rowStart = row * (this.cols + 1);
                gridElement.insertBefore(this.grid[row][0].element, gridElement.children[rowStart]);
            }
        } else {
            for (let row = 0; row < this.rows; row++) {
                const insertPosition = (row + 1) * (this.cols + 1) - 1;
                const referenceNode = gridElement.children[insertPosition];
                if (referenceNode) {
                    gridElement.insertBefore(this.grid[row][this.cols].element, referenceNode);
                } else {
                    gridElement.appendChild(this.grid[row][this.cols].element);
                }
            }
        }

        this.cols++;

        if (window.isWeightMode) {
            newNodes.forEach(node => node.updateElement());
        }
    }

    reset() {
        this.rows = 10;
        this.cols = 10;
        this.grid = [];
        this.startNode = null;
        this.endNode = null;
        const gridElement = document.getElementById('grid');
        if (gridElement) {
            gridElement.innerHTML = '';
        }
        this.initializeGrid();
    }

    setStartNode(row, col) {
        if (this.startNode) {
            this.startNode.reset();
        }
        this.startNode = this.grid[row][col];
        this.startNode.setStart();
    }

    setEndNode(row, col) {
        if (this.endNode) {
            this.endNode.reset();
        }
        this.endNode = this.grid[row][col];
        this.endNode.setEnd();
    }

    toggleWall(row, col) {
        const node = this.grid[row][col];
        if (!node.isStart && !node.isEnd) {
            node.setWall();
        }
    }

    getNode(row, col) {
        return this.grid[row][col];
    }

    isValidPosition(row, col) {
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }

    clearPath() {
        this.grid.forEach(row => {
            row.forEach(node => {
                if (node.isVisited || node.isPath) {
                    node.isVisited = false;
                    node.isPath = false;
                    node.updateElement();
                }
            });
        });
    }

    getStartNode() {
        return this.startNode;
    }

    getEndNode() {
        return this.endNode;
    }

    saveToJSON() {
        const gridState = {
            rows: this.rows,
            cols: this.cols,
            nodes: []
        };

        this.grid.forEach((row, rowIndex) => {
            row.forEach((node, colIndex) => {
                if (node.isStart || node.isEnd || node.isWall || node.weight > 1) {
                    gridState.nodes.push({
                        row: rowIndex,
                        col: colIndex,
                        isStart: node.isStart,
                        isEnd: node.isEnd,
                        isWall: node.isWall,
                        weight: node.weight
                    });
                }
            });
        });

        return JSON.stringify(gridState, null, 2);
    }

    loadFromJSON(jsonString) {
        try {
            const gridState = JSON.parse(jsonString);
            
            this.reset();
            
            this.rows = gridState.rows;
            this.cols = gridState.cols;
            this.initializeGrid();

            this.startNode = null;
            this.endNode = null;

            let startPos = null;
            let endPos = null;

            gridState.nodes.forEach(nodeState => {
                const node = this.getNode(nodeState.row, nodeState.col);
                if (node) {
                    if (nodeState.isWall) node.setWall();
                    if (nodeState.weight > 1) node.setWeight(nodeState.weight);
                }
                if (nodeState.isStart) startPos = { row: nodeState.row, col: nodeState.col };
                if (nodeState.isEnd) endPos = { row: nodeState.row, col: nodeState.col };
            });

            if (startPos && this.isValidPosition(startPos.row, startPos.col)) {
                this.setStartNode(startPos.row, startPos.col);
                if (typeof debug === 'function') debug('Set start node at ' + startPos.row + ',' + startPos.col);
            } else if (startPos) {
                if (typeof debug === 'function') debug('Invalid start node position: ' + JSON.stringify(startPos));
            }
            if (endPos && this.isValidPosition(endPos.row, endPos.col)) {
                this.setEndNode(endPos.row, endPos.col);
                if (typeof debug === 'function') debug('Set end node at ' + endPos.row + ',' + endPos.col);
            } else if (endPos) {
                if (typeof debug === 'function') debug('Invalid end node position: ' + JSON.stringify(endPos));
            }
            
            this.grid.forEach(row => {
                row.forEach(node => node.updateElement());
            });

            const hasWeights = this.grid.some(row => row.some(node => node.weight > 1));
            if (hasWeights) {
                if (typeof window !== 'undefined') {
                    const weightToggle = document.getElementById('weightToggle');
                    if (weightToggle) weightToggle.checked = true;
                    window.isWeightMode = true;
                }
                this.grid.forEach(row => {
                    row.forEach(node => node.updateElement());
                });
            } else {
                if (typeof window !== 'undefined') {
                    const weightToggle = document.getElementById('weightToggle');
                    if (weightToggle) weightToggle.checked = false;
                    window.isWeightMode = false;
                }
                this.grid.forEach(row => {
                    row.forEach(node => node.updateElement());
                });
            }

            return true;
        } catch (error) {
            console.error('Error loading grid:', error);
            if (typeof debug === 'function') debug('Error loading grid: ' + error);
            return false;
        }
    }

    saveToLocalStorage(name) {
        try {
            const gridState = this.saveToJSON();
            localStorage.setItem(`grid_${name}`, gridState);
            return true;
        } catch (error) {
            console.error('Error saving to local storage:', error);
            return false;
        }
    }

    loadFromLocalStorage(name) {
        try {
            const gridState = localStorage.getItem(`grid_${name}`);
            if (gridState) {
                return this.loadFromJSON(gridState);
            }
            return false;
        } catch (error) {
            console.error('Error loading from local storage:', error);
            return false;
        }
    }

    getSavedGrids() {
        const savedGrids = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('grid_')) {
                savedGrids.push(key.replace('grid_', ''));
            }
        }
        return savedGrids;
    }
}

function getEventListeners(element) {
    const listeners = [];
    const events = ['click', 'mousedown', 'mouseup', 'mousemove'];
    events.forEach(eventType => {
        const listeners = element[`on${eventType}`];
        if (listeners) {
            listeners.push({ type: eventType, listener: listeners });
        }
    });
    return listeners;
} 