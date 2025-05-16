# Welcome to Pathfinder

A modern, web-based interactive pathfinding visualizer with a beautiful parchment-inspired UI. Explore Dijkstra's algorithm on a dynamic, resizable grid with draggable start/end nodes, weighted nodes, and full save/load support. Designed for both educational and demonstration purposes.

## Features

### 🟩 Interactive Grid
- **Resizable Grid:** Start with a 10x10 grid. Add rows/columns on any side using intuitive + buttons.
- **Draggable Start/End Nodes:** Move the start (S) and end (E) nodes anywhere on the grid. They are always visible, never overlap, and cannot be placed on walls.
- **Walls:** Click any cell to toggle a wall. Walls block pathfinding.
- **Weighted Nodes:** Toggle weight mode to assign weights (1–20) to cells. Click/hold to increment weight; at 20, the cell becomes a wall. Weights are displayed and centered on each cell (except start/end/wall).

### 🧭 Pathfinding
- **Search Algorithms:** Visualizes the shortest path from start to end, considering weights if enabled.
- **Animated Search:** Watch the algorithm explore the grid and highlight the shortest path.
- **Speed Control:** Adjust the animation speed for the pathfinding process.

### 🛠️ UI Controls
- **Find Path:** Start the pathfinding animation.
- **Return Default:** Multi-state button to reset, cancel search, or clear output.
- **Weighted Nodes Toggle:** Instantly enable/disable weight mode.
- **Save/Load Grid:** Export/import the entire grid state as a compact JSON file.

### 💾 Save/Load
- **Export:** Save your grid (walls, weights, start/end, size, and weight mode) as a JSON file.
- **Import:** Load a previously saved grid, restoring all states and UI elements.

### 🖌️ Beautiful UI
- **Parchment Theme:** Elegant, readable, and responsive design.
- **Sidebar:** Collapsible sidebar for controls and instructions.
- **Mobile Friendly:** Responsive layout for all screen sizes.

## How to Use

1. **Basic Setup**
   - Start and end nodes are placed at (0,0) and (9,9) by default
   - Drag the start (green cell with S) and end (red cell with E) nodes to reposition them
   - Click on empty cells to toggle walls (black cell with X)

2. **Weighted Nodes**
   - Toggle the "Weighted Nodes" switch to enable/disable weight mode
   - In weight mode, click or hold on a cell to increase its weight (orange, 1-20)
   - At weight 20, the cell becomes a wall
   - Start, end, and wall cells never display a weight value

3. **Resize Grid**
   - Use the + buttons around the grid to add rows/columns
   - Grid maintains start, end, and wall positions when resizing
   - Resizing is disabled during pathfinding

4. **Find Path**
   - Click "Find Path" to visualize the shortest path
   - Watch the algorithm explore the grid
   - The final path will be highlighted in yellow

5. **Reset/Clear**
   - Click "Return Default" to:
     - During pathfinding: Cancel search
     - After path found: Clear path
     - Otherwise: Reset grid

### Save/Load Grids
- **Save Grid:** Click "Save Grid" to download the current grid as a JSON file
- **Load Grid:** Click "Load Grid" and select a previously saved JSON file
- The application handles any grid size and restores all node states
- Weight mode is automatically enabled/disabled based on the loaded grid

## Technical Details
- **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3
- **Styling:** Custom CSS, Google Fonts (Merriweather, Cinzel), Transparent Textures
- **Algorithm:** Dijkstra's Algorithm (with support for weighted nodes)
- **Grid State:** Saved as compact JSON, including size, start/end, walls, and weights
- **Browser Support:** Modern browsers (Chrome, Firefox, Edge, Safari)

## Possible Future Improvements
- **Additional Algorithms:** Add BFS, DFS, or other pathfinding algorithms
- **Diagonal Movement:** Allow diagonal steps with adjustable cost
- **Step-by-Step Mode:** Let users step through the algorithm manually
- **Undo/Redo:** Support undo/redo for grid edits
- **Preset Mazes:** Add maze generation and preset patterns
- **Accessibility:** Improve keyboard navigation and ARIA support
- **Performance:** Optimize for very large grids
- **Customizable Themes:** Allow users to switch between different visual themes
- **Shareable Links:** Generate URLs to share specific grid setups

## License
MIT License. See [LICENSE](LICENSE) for details.
