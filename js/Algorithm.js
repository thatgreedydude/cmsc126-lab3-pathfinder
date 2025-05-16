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

    cancelSearch() {
        this.isCancelled = true;
    }

    async dijkstra() {
        this.isCancelled = false;
        const startNode = this.grid.getStartNode();
        const endNode = this.grid.getEndNode();

        if (!startNode || !endNode) {
            console.log('Start or end node not set');
            return null;
        }

        // Initialize distances
        const distances = new Map();
        const unvisited = new Set();
        this.grid.grid.forEach(row => {
            row.forEach(node => {
                distances.set(node, Infinity);
                unvisited.add(node);
            });
        });
        distances.set(startNode, 0);

        while (unvisited.size > 0 && !this.isCancelled) {
            // Find unvisited node with smallest distance
            let currentNode = null;
            let smallestDistance = Infinity;
            for (const node of unvisited) {
                if (distances.get(node) < smallestDistance) {
                    smallestDistance = distances.get(node);
                    currentNode = node;
                }
            }

            if (currentNode === null || smallestDistance === Infinity) {
                console.log('No path exists');
                return null;
            }

            if (currentNode === endNode) {
                console.log('Found end node');
                return this.reconstructPath(endNode);
            }

            unvisited.delete(currentNode);
            currentNode.setVisited();
            await new Promise(resolve => setTimeout(resolve, this.speedMap[this.speed]));

            // Update distances to neighbors
            const neighbors = currentNode.getNeighbors(this.grid.grid);
            for (const neighbor of neighbors) {
                if (unvisited.has(neighbor)) {
                    // Use the node's weight in distance calculation
                    const weight = window.isWeightMode ? neighbor.weight : 1;
                    const distance = distances.get(currentNode) + weight;
                    
                    if (distance < distances.get(neighbor)) {
                        distances.set(neighbor, distance);
                        neighbor.previousNode = currentNode;
                    }
                }
            }
        }

        if (this.isCancelled) {
            console.log('Search cancelled');
            return null;
        }

        console.log('No path found');
        return null;
    }

    reconstructPath(endNode) {
        const path = [];
        let currentNode = endNode;

        while (currentNode !== null) {
            path.unshift(currentNode);
            currentNode = currentNode.previousNode;
        }

        return path;
    }

    delay() {
        return new Promise(resolve => setTimeout(resolve, this.speedMap[this.speed]));
    }
} 