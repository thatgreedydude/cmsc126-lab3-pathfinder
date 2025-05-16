export class Node {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.isStart = false;
        this.isEnd = false;
        this.isWall = false;
        this.isVisited = false;
        this.isPath = false;
        this.distance = Infinity;
        this.previousNode = null;
        this.element = null;
        this.weight = 1;
    }

    reset() {
        this.isStart = false;
        this.isEnd = false;
        this.isWall = false;
        this.isVisited = false;
        this.isPath = false;
        this.distance = Infinity;
        this.previousNode = null;
        this.weight = 1;
        this.updateElement();
    }

    setStart() {
        this.isStart = true;
        this.isEnd = false;
        this.isWall = false;
        this.isVisited = false;
        this.isPath = false;
        this.updateElement();
    }

    setEnd() {
        this.isEnd = true;
        this.isStart = false;
        this.isWall = false;
        this.isVisited = false;
        this.isPath = false;
        this.updateElement();
    }

    setWall() {
        if (!this.isStart && !this.isEnd) {
            this.isWall = !this.isWall;
            this.isVisited = false;
            this.isPath = false;
            this.weight = 1;
            this.updateElement();
        }
    }

    setVisited() {
        if (!this.isStart && !this.isEnd && !this.isWall) {
            this.isVisited = true;
            this.isPath = false;
            this.updateElement();
        }
    }

    setPath() {
        if (!this.isStart && !this.isEnd && !this.isWall) {
            this.isPath = true;
            this.isVisited = false;
            this.updateElement();
        }
    }

    setWeight(weight) {
        if (!this.isStart && !this.isEnd && !this.isWall) {
            this.weight = Math.max(1, Math.min(20, weight));
            this.updateElement();
        }
    }

    updateElement() {
        if (!this.element) return;

        this.element.className = 'cell';
        this.element.textContent = '';
        this.element.innerHTML = '';

        if (this.isStart) {
            this.element.classList.add('start', 'draggable');
            this.element.textContent = 'S';
        } else if (this.isEnd) {
            this.element.classList.add('end', 'draggable');
            this.element.textContent = 'E';
        } else if (this.isWall) {
            this.element.classList.add('wall');
            this.element.textContent = '×';
        } else if (this.isPath) {
            this.element.classList.add('path');
        } else if (this.isVisited) {
            this.element.classList.add('visited');
        }

        if (window.isWeightMode && !this.isStart && !this.isEnd && !this.isWall) {
            const weightValue = document.createElement('span');
            weightValue.className = 'weight-value';
            weightValue.textContent = this.weight;
            this.element.appendChild(weightValue);
        }
    }

    getNeighbors(grid) {
        const neighbors = [];
        const { row, col } = this;
        
        if (row > 0) neighbors.push(grid[row - 1][col]);
        if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
        if (col > 0) neighbors.push(grid[row][col - 1]);
        if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

        return neighbors.filter(neighbor => !neighbor.isWall);
    }
} 