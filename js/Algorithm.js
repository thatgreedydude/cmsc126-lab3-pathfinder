import { dijkstra } from './algorithms/dijkstra.js';
import { astar } from './algorithms/astar.js';

const ALGORITHMS = {
    dijkstra,
    astar
};

export class Algorithm {
    constructor(grid) {
        this.grid = grid;
        this.speed = 'medium';
        this.speedMap = { slow: 100, medium: 50, fast: 20 };
        this.cancelled = false;
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    cancelSearch() {
        this.cancelled = true;
    }

    async findPath(algorithmName = 'dijkstra') {
        this.cancelled = false;
        const algo = ALGORITHMS[algorithmName];
        if (!algo) throw new Error('Unknown algorithm: ' + algorithmName);
        return await algo(
            this.grid,
            this.speed,
            this.speedMap,
            () => this.cancelled
        );
    }
} 