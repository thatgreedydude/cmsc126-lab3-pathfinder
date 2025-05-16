// Wait for the DOM to be fully loaded
window.addEventListener('load', () => {
    debug('Window loaded');
    
    // Initialize grid and algorithm first
    const grid = new Grid();
    const algorithm = new Algorithm(grid);
    let draggedNode = null;
    let isDragging = false;
    let originalPosition = null;
    let lastUpdateTime = 0;
    let isPathfinding = false;
    let isPathDisplayed = false;
    const UPDATE_THRESHOLD = 16; // ~60fps

    // Set default start and end positions
    debug('Setting default positions');
    grid.setStartNode(0, 0);
    grid.setEndNode(9, 9);

    // Now get references to DOM elements
    const findPathBtn = document.getElementById('findPathBtn');
    const returnDefaultBtn = document.getElementById('returnDefaultBtn');
    const speedSelect = document.getElementById('speed');
    const gridElement = document.getElementById('grid');
    const addTopRowBtn = document.getElementById('addTopRow');
    const addBottomRowBtn = document.getElementById('addBottomRow');
    const addLeftColBtn = document.getElementById('addLeftCol');
    const addRightColBtn = document.getElementById('addRightCol');

    // Verify elements exist
    if (!findPathBtn || !returnDefaultBtn || !speedSelect || !gridElement || 
        !addTopRowBtn || !addBottomRowBtn || !addLeftColBtn || !addRightColBtn) {
        console.error('Required elements not found');
        return;
    }

    debug('All elements found, setting up event listeners...');

    // Function to update button state
    function updateButtonState() {
        if (isPathfinding) {
            returnDefaultBtn.textContent = 'Cancel Search';
            returnDefaultBtn.disabled = false;
        } else if (isPathDisplayed) {
            returnDefaultBtn.textContent = 'Clear Output';
            returnDefaultBtn.disabled = false;
        } else {
            returnDefaultBtn.textContent = 'Reset';
            returnDefaultBtn.disabled = false;
        }

        // Update resize buttons state
        const isEditable = !isPathfinding && !isPathDisplayed;
        addTopRowBtn.disabled = !isEditable;
        addBottomRowBtn.disabled = !isEditable;
        addLeftColBtn.disabled = !isEditable;
        addRightColBtn.disabled = !isEditable;
    }

    // Find Path button
    findPathBtn.addEventListener('click', async () => {
        if (isPathfinding || isPathDisplayed) return;
        
        isPathfinding = true;
        findPathBtn.disabled = true;
        updateButtonState();
        
        grid.clearPath();
        const path = await algorithm.dijkstra();
        
        if (path && path.length > 0) {
            isPathDisplayed = true;
            // Display the path with animation
            for (let i = 0; i < path.length; i++) {
                const node = path[i];
                if (!node.isStart && !node.isEnd) {
                    node.setPath();
                    // Add a small delay between each node
                    await new Promise(resolve => setTimeout(resolve, algorithm.speedMap[algorithm.speed]));
                }
            }
            console.log('Path display complete');
        } else {
            console.log('No path to display');
        }
        
        isPathfinding = false;
        findPathBtn.disabled = false;
        updateButtonState();
    });

    // Return Default button
    returnDefaultBtn.addEventListener('click', () => {
        if (isPathfinding) {
            // Cancel search
            algorithm.cancelSearch();
            isPathfinding = false;
            findPathBtn.disabled = false;
            grid.clearPath();
        } else if (isPathDisplayed) {
            // Clear output
            grid.clearPath();
            isPathDisplayed = false;
        } else {
            // Reset everything
            grid.reset();
            grid.setStartNode(0, 0);
            grid.setEndNode(9, 9);
        }
        updateButtonState();
    });

    // Speed control
    speedSelect.addEventListener('change', (e) => {
        algorithm.setSpeed(e.target.value);
    });

    // Resize buttons
    addTopRowBtn.addEventListener('click', () => {
        if (!isPathfinding && !isPathDisplayed) {
            grid.addRow('top');
        }
    });

    addBottomRowBtn.addEventListener('click', () => {
        if (!isPathfinding && !isPathDisplayed) {
            grid.addRow('bottom');
        }
    });

    addLeftColBtn.addEventListener('click', () => {
        if (!isPathfinding && !isPathDisplayed) {
            grid.addColumn('left');
        }
    });

    addRightColBtn.addEventListener('click', () => {
        if (!isPathfinding && !isPathDisplayed) {
            grid.addColumn('right');
        }
    });

    // Click handler for walls
    gridElement.addEventListener('click', (e) => {
        if (isPathfinding || isPathDisplayed) return;
        
        const cell = e.target;
        if (!cell.classList.contains('cell')) return;

        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const node = grid.getNode(row, col);

        if (!node.isStart && !node.isEnd) {
            node.setWall();
        }
    });

    // Drag and drop functionality
    gridElement.addEventListener('mousedown', (e) => {
        if (isPathfinding || isPathDisplayed) return;
        
        const cell = e.target;
        if (!cell.classList.contains('cell') || !cell.classList.contains('draggable')) return;

        isDragging = true;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        
        draggedNode = {
            element: cell,
            row: row,
            col: col,
            isStart: cell.classList.contains('start')
        };
        
        originalPosition = { row, col };
        cell.style.opacity = '0.5';
    });

    // Mouse move handler for dragging
    document.addEventListener('mousemove', (e) => {
        if (!isDragging || !draggedNode || isPathfinding || isPathDisplayed) return;

        // Throttle updates to prevent lag
        const now = performance.now();
        if (now - lastUpdateTime < UPDATE_THRESHOLD) return;
        lastUpdateTime = now;

        const cell = document.elementFromPoint(e.clientX, e.clientY);
        if (!cell || !cell.classList.contains('cell')) return;

        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const targetNode = grid.getNode(row, col);

        // Check if target is valid (not a wall and not the other special node)
        const isValidTarget = !targetNode.isWall && 
            !(draggedNode.isStart && targetNode.isEnd) && 
            !(!draggedNode.isStart && targetNode.isStart);

        if (isValidTarget) {
            if (draggedNode.isStart) {
                grid.setStartNode(row, col);
            } else {
                grid.setEndNode(row, col);
            }
        }
    });

    // Mouse up handler for dragging
    document.addEventListener('mouseup', () => {
        if (draggedNode) {
            const cell = document.elementFromPoint(event.clientX, event.clientY);
            
            // If we're not over a valid cell, return to original position
            if (!cell || !cell.classList.contains('cell')) {
                if (draggedNode.isStart) {
                    grid.setStartNode(originalPosition.row, originalPosition.col);
                } else {
                    grid.setEndNode(originalPosition.row, originalPosition.col);
                }
            } else {
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                const targetNode = grid.getNode(row, col);
                
                // Check if final position is valid
                const isValidTarget = !targetNode.isWall && 
                    !(draggedNode.isStart && targetNode.isEnd) && 
                    !(!draggedNode.isStart && targetNode.isStart);
                
                if (!isValidTarget) {
                    if (draggedNode.isStart) {
                        grid.setStartNode(originalPosition.row, originalPosition.col);
                    } else {
                        grid.setEndNode(originalPosition.row, originalPosition.col);
                    }
                }
            }
            
            draggedNode.element.style.opacity = '1';
        }
        isDragging = false;
        draggedNode = null;
        originalPosition = null;
    });

    // Initialize button state
    updateButtonState();

    debug('All event listeners set up');
}); 