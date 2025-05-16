class Algorithm {
    constructor(grid) {
        this.grid = grid;
        this.speed = 'medium';
        this.speedMap = {
            'slow': 100,
            'medium': 50,
            'fast': 20
        };
        this.isCancelled = false;
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    async dijkstra() {
        this.isCancelled = false;
        const startNode = this.grid.getStartNode();
        const endNode = this.grid.getEndNode();

        if (!startNode || !endNode) {
            return null;
        }

        // Initialize distances
        const distances = {};
        const unvisitedNodes = [];
        
        // Set all nodes to infinity distance except start node
        for (let row = 0; row < this.grid.rows; row++) {
            for (let col = 0; col < this.grid.cols; col++) {
                const node = this.grid.getNode(row, col);
                distances[`${row}-${col}`] = Infinity;
                unvisitedNodes.push(node);
            }
        }
        
        // Set start node distance to 0
        distances[`${startNode.row}-${startNode.col}`] = 0;
        startNode.distance = 0;

        while (unvisitedNodes.length > 0 && !this.isCancelled) {
            // Sort unvisited nodes by distance
            unvisitedNodes.sort((a, b) => distances[`${a.row}-${a.col}`] - distances[`${b.row}-${b.col}`]);
            
            // Get closest node
            const currentNode = unvisitedNodes.shift();
            
            // If we can't reach the current node, we're done
            if (distances[`${currentNode.row}-${currentNode.col}`] === Infinity) {
                return null;
            }
            
            // If we found the end node, we're done
            if (currentNode === endNode) {
                return this.reconstructPath(endNode);
            }
            
            // Mark current node as visited
            if (currentNode !== startNode && currentNode !== endNode) {
                currentNode.setVisited();
                await new Promise(resolve => setTimeout(resolve, this.speedMap[this.speed]));
            }
            
            // Check all neighbors
            const neighbors = currentNode.getNeighbors(this.grid.grid);
            for (const neighbor of neighbors) {
                const distance = distances[`${currentNode.row}-${currentNode.col}`] + 1;
                
                if (distance < distances[`${neighbor.row}-${neighbor.col}`]) {
                    distances[`${neighbor.row}-${neighbor.col}`] = distance;
                    neighbor.distance = distance;
                    neighbor.previousNode = currentNode;
                }
            }
        }

        return this.isCancelled ? null : this.reconstructPath(endNode);
    }

    cancelSearch() {
        this.isCancelled = true;
    }

    reconstructPath(endNode) {
        if (this.isCancelled) return null;
        
        const path = [];
        let currentNode = endNode;
        
        while (currentNode) {
            path.unshift(currentNode);
            currentNode = currentNode.previousNode;
        }
        
        return path;
    }

    delay() {
        return new Promise(resolve => setTimeout(resolve, this.speedMap[this.speed]));
    }
} 