// A* Search Algorithm

export async function astar(grid, speed, speedMap, cancelCheck) {
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

    function heuristic(a, b) {
        return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
    }

    const openSet = new Set();
    const gScore = new Map();
    const fScore = new Map();
    const cameFrom = new Map();

    for (let row = 0; row < grid.rows; row++) {
        for (let col = 0; col < grid.cols; col++) {
            const node = grid.getNode(row, col);
            gScore.set(node, Infinity);
            fScore.set(node, Infinity);
            node.isVisited = false;
            node.isPath = false;
            node.previousNode = null;
        }
    }

    gScore.set(startNode, 0);
    fScore.set(startNode, heuristic(startNode, endNode));
    openSet.add(startNode);

    while (openSet.size > 0) {
        if (cancelCheck && cancelCheck()) return null;
        let currentNode = null;
        let minF = Infinity;
        for (const node of openSet) {
            if (fScore.get(node) < minF) {
                minF = fScore.get(node);
                currentNode = node;
            }
        }
        if (!currentNode) return null;
        if (currentNode === endNode) {
            const path = [];
            let node = endNode;
            while (node) {
                path.unshift(node);
                node = node.previousNode;
            }
            return path;
        }
        openSet.delete(currentNode);
        currentNode.isVisited = true;
        currentNode.updateElement();
        const neighbors = currentNode.getNeighbors(grid.grid);
        for (const neighbor of neighbors) {
            const tentativeG = gScore.get(currentNode) + (window.isWeightMode ? neighbor.weight : 1);
            if (tentativeG < gScore.get(neighbor)) {
                cameFrom.set(neighbor, currentNode);
                gScore.set(neighbor, tentativeG);
                fScore.set(neighbor, tentativeG + heuristic(neighbor, endNode));
                neighbor.previousNode = currentNode;
                if (!openSet.has(neighbor)) {
                    openSet.add(neighbor);
                }
            }
        }
        await new Promise(resolve => setTimeout(resolve, speedMap[speed]));
    }
    return null;
} 