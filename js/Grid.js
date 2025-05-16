class Grid {
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
        
        // Create new row
        for (let col = 0; col < this.cols; col++) {
            const node = new Node(rowIndex, col);
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = rowIndex;
            cell.dataset.col = col;
            node.element = cell;
            newRow.push(node);
        }

        // Update grid array
        if (position === 'top') {
            this.grid.unshift(newRow);
            // Update row indices for all nodes
            for (let row = 1; row < this.rows + 1; row++) {
                for (let col = 0; col < this.cols; col++) {
                    this.grid[row][col].row = row;
                    this.grid[row][col].element.dataset.row = row;
                }
            }
        } else {
            this.grid.push(newRow);
        }

        // Update DOM
        const gridElement = document.getElementById('grid');
        if (position === 'top') {
            // Insert each cell of the new row at the correct position
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
    }

    addColumn(position) {
        const colIndex = position === 'left' ? 0 : this.cols;
        
        // Add new column to each row
        for (let row = 0; row < this.rows; row++) {
            const node = new Node(row, colIndex);
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = colIndex;
            node.element = cell;
            
            if (position === 'left') {
                this.grid[row].unshift(node);
                // Update column indices for all nodes
                for (let col = 1; col < this.cols + 1; col++) {
                    this.grid[row][col].col = col;
                    this.grid[row][col].element.dataset.col = col;
                }
            } else {
                this.grid[row].push(node);
            }
        }

        // Update DOM
        const gridElement = document.getElementById('grid');
        gridElement.style.gridTemplateColumns = `repeat(${this.cols + 1}, 1fr)`;
        
        if (position === 'left') {
            for (let row = 0; row < this.rows; row++) {
                const rowStart = row * (this.cols + 1);
                gridElement.insertBefore(this.grid[row][0].element, gridElement.children[rowStart]);
            }
        } else {
            // For right column, we need to insert each new cell at the correct position
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
    }

    reset() {
        // Reset to default size
        this.rows = 10;
        this.cols = 10;
        this.grid = [];
        this.startNode = null;
        this.endNode = null;
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
}

// Helper function to get event listeners
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