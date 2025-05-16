# Pathfinding Visualizer

An interactive web application for visualizing pathfinding algorithms (Dijkstra's Algorithm, A* Search) on a dynamic grid. Users can set obstacles, define start/end points, adjust node weights, resize the grid, and save/load grid configurations.

## Features

### Grid Controls
- **Start Node (S)**: Green cell, draggable
- **End Node (E)**: Red cell, draggable
- **Walls**: Black cells, click to toggle
- **Visited Cells**: Blue cells, shown during pathfinding
- **Path**: Yellow cells, shows the optimal path
- **Weighted Nodes**: Numbers 1-20, affects pathfinding when enabled

### Grid Resizing
- Add rows/columns using the + buttons on each side
- Grid maintains start, end, and wall positions when resizing
- Resizing is disabled during pathfinding

### Weighted Nodes
- Toggle weighted nodes mode using the switch
- In weight mode:
  - All cells (except start/end) show their weight values
  - Click to increment weight by 1
  - Click and hold to increment with acceleration
  - Weight increases from 1 to 20
  - At weight 20, cell becomes a wall
  - Weights affect pathfinding (algorithm finds lowest total weight path)
- When weight mode is off:
  - All cells have weight 1
  - Weights are preserved but hidden
  - Pathfinding uses shortest path by number of cells

### Pathfinding
- Uses Dijkstra's algorithm
- Finds the optimal path considering:
  - Walls as obstacles
  - Node weights when weight mode is enabled
  - Shortest path by number of cells when weight mode is disabled
- Visualizes the search process
- Shows the final path in yellow

### Controls
- **Find Path**: Start pathfinding
- **Return Default**: 
  - During pathfinding: Cancel search
  - After path found: Clear path
  - Otherwise: Reset grid
- **Speed**: Adjust visualization speed (Slow/Medium/Fast)
- **Weighted Nodes**: Toggle weight mode

## How to Use

1. **Basic Setup**
   - Start and end nodes are placed at (0,0) and (9,9) by default
   - Drag the start (green cell with S) and end (red cell with E) nodes to reposition them
   - Click on empty cells to toggle walls (black cell with X).

3. **Weighted Nodes**:
   - Toggle the "Weighted Nodes" switch to enable/disable weight mode.
   - In weight mode, click or hold on a cell to increase its weight (orange, 1-20). At 20, the cell becomes a wall.
   - Start, end, and wall cells never display a weight value.

4. **Resize Grid**: Use the + buttons around the grid to add rows/columns.

5. **Find Path**: Click "Find Path" to visualize the shortest path.

6. **Reset**: Click "Return Default" to reset to a 10x10 empty grid with start at (0,0) and end at (9,9).

### Save/Load Grids
- **Save Grid**: Click "Save Grid" to download the current grid as a JSON file.
- **Load Grid**: Click "Load Grid" and select a previously saved JSON file to restore the grid.
- The application robustly handles any grid size and restores all node states (start, end, walls, weights).
- When loading a grid with weighted cells, the weight toggle is automatically enabled and weights are shown. If no weighted cells are present, the toggle is off and weights are hidden.

### Weight Toggle & Display Behavior
- When weight mode is **on**, all non-wall, non-start, non-end cells display their weight value.
- When weight mode is **off**, all weight values are hidden.
- Loading a grid with weighted cells turns the toggle on and shows weights; loading a grid without weighted cells turns the toggle off and hides weights.
- Resetting the grid always returns to a 10x10 grid with no weights or walls.

### Error Handling & Robustness
- The application prevents grid corruption when loading grids of any size.
- Start and end nodes are always restored to their correct positions after loading.
- Adding rows/columns in weight mode immediately displays weights for new cells.
- All controls are disabled during pathfinding to prevent accidental edits.

## Technical Details
- **Tech stack**: Vanilla JavaScript, CSS Grid, HTML5
- **Algorithm**: Dijkstra's Algorithm (with support for weighted nodes)
- **Grid state**: Saved as JSON, including size, start/end, walls, and weights
- **Browser support**: Modern browsers (Chrome, Firefox, Edge, Safari)

## License
MIT
