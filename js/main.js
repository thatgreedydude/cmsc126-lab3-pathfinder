import { Grid } from './Grid.js';
import { Algorithm } from './Algorithm.js';

window.addEventListener('load', () => {
    const grid = new Grid();
    const algorithm = new Algorithm(grid);
    let draggedNode = null;
    let isDragging = false;
    let originalPosition = null;
    let lastUpdateTime = 0;
    let isPathfinding = false;
    let isPathDisplayed = false;
    let isWeightMode = false;
    let isHolding = false;
    const UPDATE_THRESHOLD = 16;

    window.isWeightMode = false;

    grid.setStartNode(0, 0);
    grid.setEndNode(9, 9);

    const findPathBtn = document.getElementById('findPathBtn');
    const returnDefaultBtn = document.getElementById('returnDefaultBtn');
    const speedSelect = document.getElementById('speed');
    const gridElement = document.getElementById('grid');
    const addTopRowBtn = document.getElementById('addTopRow');
    const addBottomRowBtn = document.getElementById('addBottomRow');
    const addLeftColBtn = document.getElementById('addLeftCol');
    const addRightColBtn = document.getElementById('addRightCol');
    const weightToggle = document.getElementById('weightToggle');
    const saveGridBtn = document.getElementById('saveGridBtn');
    const loadGridBtn = document.getElementById('loadGridBtn');
    const gridFileInput = document.getElementById('gridFileInput');
    const algorithmSelect = document.getElementById('algorithmSelect');

    if (!findPathBtn || !returnDefaultBtn || !speedSelect || !gridElement || 
        !addTopRowBtn || !addBottomRowBtn || !addLeftColBtn || !addRightColBtn ||
        !weightToggle || !saveGridBtn || !loadGridBtn || !gridFileInput || !algorithmSelect) {
        console.error('Required elements not found');
        return;
    }

    function updateButtonState() {
        if (isPathfinding) {
            returnDefaultBtn.textContent = 'Cancel';
            returnDefaultBtn.disabled = false;
        } else if (isPathDisplayed) {
            returnDefaultBtn.textContent = 'Clear';
            returnDefaultBtn.disabled = false;
        } else {
            returnDefaultBtn.textContent = 'Reset';
            returnDefaultBtn.disabled = false;
        }

        const isEditable = !isPathfinding && !isPathDisplayed;
        addTopRowBtn.disabled = !isEditable;
        addBottomRowBtn.disabled = !isEditable;
        addLeftColBtn.disabled = !isEditable;
        addRightColBtn.disabled = !isEditable;
        weightToggle.disabled = !isEditable;
    }

    weightToggle.addEventListener('change', (e) => {
        isWeightMode = e.target.checked;
        window.isWeightMode = isWeightMode;
        grid.grid.forEach(row => {
            row.forEach(node => {
                node.updateElement();
            });
        });
    });

    findPathBtn.addEventListener('click', async () => {
        if (isPathfinding || isPathDisplayed) return;
        
        isPathfinding = true;
        findPathBtn.disabled = true;
        updateButtonState();
        
        grid.clearPath();
        const selectedAlgorithm = algorithmSelect ? algorithmSelect.value : 'dijkstra';
        const path = await algorithm.findPath(selectedAlgorithm);
        
        if (path && path.length > 0) {
            isPathDisplayed = true;
            for (let i = 0; i < path.length; i++) {
                const node = path[i];
                if (!node.isStart && !node.isEnd) {
                    node.setPath();
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

    returnDefaultBtn.addEventListener('click', () => {
        if (isPathfinding) {
            algorithm.cancelSearch();
            isPathfinding = false;
            findPathBtn.disabled = false;
            grid.clearPath();
        } else if (isPathDisplayed) {
            grid.clearPath();
            isPathDisplayed = false;
        } else {
            grid.reset();
            grid.setStartNode(0, 0);
            grid.setEndNode(9, 9);
            weightToggle.checked = false;
            isWeightMode = false;
        }
        updateButtonState();
    });
    
    speedSelect.addEventListener('change', (e) => {
        algorithm.setSpeed(e.target.value);
    });

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

    gridElement.addEventListener('mousedown', (e) => {
        if (isPathfinding || isPathDisplayed) return;
        
        const cell = e.target;
        if (!cell.classList.contains('cell')) return;

        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const node = grid.getNode(row, col);

        if (!node.isStart && !node.isEnd) {
            if (isWeightMode && !node.isWall) {
                isHolding = true;
                let holdTime = 0;
                let lastIncrement = 0;
                let interval = 200;
                const minInterval = 50;
                const acceleration = 0.95;
                let hasIncremented = false;

                let weightInterval = setInterval(() => {
                    const now = performance.now();
                    holdTime = now - lastIncrement;

                    if (holdTime >= interval) {
                        if (node.weight < 20) {
                            node.setWeight(node.weight + 1);
                            lastIncrement = now;
                            interval = Math.max(minInterval, interval * acceleration);
                            hasIncremented = true;
                        } else {
                            clearInterval(weightInterval);
                            node.setWall();
                            isHolding = false;
                        }
                    }
                }, 16);

                const clearWeightInterval = () => {
                    clearInterval(weightInterval);
                    isHolding = false;
                    if (!hasIncremented && node.weight < 20) {
                        node.setWeight(node.weight + 1);
                    } else if (!hasIncremented && node.weight >= 20) {
                        node.setWall();
                    }
                    document.removeEventListener('mouseup', clearWeightInterval);
                };
                document.addEventListener('mouseup', clearWeightInterval);
            } else {
                node.setWall();
            }
        }
    });

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

    document.addEventListener('mousemove', (e) => {
        if (!isDragging || !draggedNode || isPathfinding || isPathDisplayed) return;

        const now = performance.now();
        if (now - lastUpdateTime < UPDATE_THRESHOLD) return;
        lastUpdateTime = now;

        const cell = document.elementFromPoint(e.clientX, e.clientY);
        if (!cell || !cell.classList.contains('cell')) return;

        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const targetNode = grid.getNode(row, col);

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

    document.addEventListener('mouseup', () => {
        if (draggedNode) {
            const cell = document.elementFromPoint(event.clientX, event.clientY);
            
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

    saveGridBtn.addEventListener('click', () => {
        if (isPathfinding || isPathDisplayed) return;

        const gridState = grid.saveToJSON();
        const blob = new Blob([gridState], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `grid_${new Date().toISOString().slice(0, 19).replace(/[:]/g, '-')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    loadGridBtn.addEventListener('click', () => {
        if (isPathfinding || isPathDisplayed) return;
        gridFileInput.click();
    });

    gridFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const success = grid.loadFromJSON(event.target.result);
                if (success) {
                    const hasWeights = grid.grid.some(row => 
                        row.some(node => node.weight > 1)
                    );
                    if (hasWeights) {
                        weightToggle.checked = true;
                        isWeightMode = true;
                        window.isWeightMode = true;
                    }
                } else {
                    alert('Error loading grid file');
                }
            };
            reader.readAsText(file);
        }
    });

    const sidebar = document.getElementById('sidebar');
    const toggleSidebarBtn = document.getElementById('toggleSidebar');
    const mainContent = document.querySelector('.container.main-content');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    function openSidebar() {
        sidebar.classList.add('open');
        sidebar.classList.remove('closed');
        if (sidebarOverlay) sidebarOverlay.style.display = 'block';
    }
    function closeSidebar() {
        sidebar.classList.remove('open');
        sidebar.classList.add('closed');
        if (sidebarOverlay) sidebarOverlay.style.display = 'none';
    }
    if (toggleSidebarBtn && sidebar && mainContent) {
        toggleSidebarBtn.addEventListener('click', () => {
            if (sidebar.classList.contains('open')) {
                closeSidebar();
                mainContent.classList.add('sidebar-closed');
            } else {
                openSidebar();
                mainContent.classList.remove('sidebar-closed');
            }
        });
    }
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => {
            closeSidebar();
            mainContent.classList.add('sidebar-closed');
        });
    }
    function handleSidebarOnResize() {
        if (window.innerWidth <= 700) {
            closeSidebar();
            mainContent.classList.add('sidebar-closed');
        } else {
            openSidebar();
            mainContent.classList.remove('sidebar-closed');
        }
    }
    window.addEventListener('resize', handleSidebarOnResize);
    handleSidebarOnResize();

    updateButtonState();
}); 