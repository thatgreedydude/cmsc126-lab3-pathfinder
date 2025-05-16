# Pathfinding Visualizer

An interactive web application that visualizes various pathfinding algorithms with support for weighted nodes and dynamic grid resizing.

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
   - Drag start/end nodes to reposition them
   - Click cells to toggle walls

2. **Using Weighted Nodes**
   - Toggle "Weighted Nodes" switch to enable weight mode
   - Click cells to increment their weight
   - Click and hold to increment with acceleration
   - Weights affect pathfinding when enabled
   - At weight 20, cell becomes a wall

3. **Resizing the Grid**
   - Use + buttons on any side to add rows/columns
   - Grid maintains existing nodes and walls
   - Resizing is disabled during pathfinding

4. **Finding Paths**
   - Click "Find Path" to start pathfinding
   - Blue cells show visited nodes
   - Yellow cells show the optimal path
   - Use "Return Default" to:
     - Cancel during pathfinding
     - Clear path after finding
     - Reset grid to default

5. **Adjusting Speed**
   - Use the speed dropdown to change visualization speed
   - Options: Slow, Medium, Fast

## Technical Details

- Built with vanilla JavaScript
- Uses CSS Grid for layout
- Implements Dijkstra's algorithm for pathfinding
- Supports dynamic grid resizing
- Features smooth weight incrementing with acceleration
- Maintains state during grid modifications

## Browser Support

Works best in modern browsers that support:
- CSS Grid
- ES6+ JavaScript features
- CSS Animations

## Additional Features

- Save/load grid configurations (in progress)
- More pathfinding algorithms
    - A*
    - Breadth-First Search
