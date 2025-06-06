// Dijkstra's Algorithm

export async function dijkstra(grid, speed, speedMap, cancelCheck) {
    // grid: Grid instance
    // speed: string ("slow", "medium", "fast")
    // speedMap: object mapping speed to ms
    // cancelCheck: function -> returns true if search should be cancelled

    const startNode = grid.getStartNode();
    const endNode = grid.getEndNode();
    if (!startNode || !endNode) {
        console.log('Start or end node not set');
        return null;
    }

    const distances = new Map();
    const unvisited = new Set();
    for (let row = 0; row < grid.rows; row++) {
        for (let col = 0; col < grid.cols; col++) {
            const node = grid.getNode(row, col);
            distances.set(node, Infinity);
            unvisited.add(node);
            node.isVisited = false;
            node.isPath = false;
            node.previousNode = null;
        }
    }
    distances.set(startNode, 0);

    while (unvisited.size > 0) {
        if (cancelCheck && cancelCheck()) return null;
        let currentNode = null;
        let minDistance = Infinity;
        for (const node of unvisited) {
            if (distances.get(node) < minDistance) {
                minDistance = distances.get(node);
                currentNode = node;
            }
        }
        if (!currentNode || minDistance === Infinity) {
            return null;
        }
        unvisited.delete(currentNode);
        currentNode.isVisited = true;
        currentNode.updateElement();
        if (currentNode === endNode) {
            const path = [];
            let node = endNode;
            while (node) {
                path.unshift(node);
                node = node.previousNode;
            }
            return path;
        }
        const neighbors = currentNode.getNeighbors(grid.grid);
        for (const neighbor of neighbors) {
            if (unvisited.has(neighbor)) {
                const weight = window.isWeightMode ? neighbor.weight : 1;
                const distance = distances.get(currentNode) + weight;
                if (distance < distances.get(neighbor)) {
                    distances.set(neighbor, distance);
                    neighbor.previousNode = currentNode;
                }
            }
        }
        await new Promise(resolve => setTimeout(resolve, speedMap[speed]));
    }
    return null;
} 