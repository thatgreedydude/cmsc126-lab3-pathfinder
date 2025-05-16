# Pathfinding Visualizer

An interactive web-based pathfinding visualizer that demonstrates Dijkstra's algorithm for finding the shortest path between two points on a grid.

## Features

- 10x10 interactive grid
- Set start and end points
- Add/remove walls
- Visualize the pathfinding algorithm in action
- Adjustable visualization speed
- Clear grid functionality
- Modern and responsive UI

## How to Use

1. Open `index.html` in a web browser
2. Use the control buttons to:
   - Set Start Point: Click the "Set Start" button, then click a cell on the grid
   - Set End Point: Click the "Set End" button, then click a cell on the grid
   - Add Walls: Click the "Add Walls" button, then click cells to toggle walls
3. Click "Find Path" to visualize the algorithm
4. Use the speed dropdown to adjust visualization speed
5. Click "Clear Grid" to reset the grid

## Implementation Details

The application is built using vanilla JavaScript and implements:
- Object-Oriented Programming with separate classes for Node, Grid, and Algorithm
- Dijkstra's algorithm for pathfinding
- Asynchronous visualization using async/await
- Modern CSS Grid for layout
- Responsive design

## File Structure

- `index.html` - Main HTML file
- `css/style.css` - Styling
- `js/`
  - `Node.js` - Node class for grid cells
  - `Grid.js` - Grid management
  - `Algorithm.js` - Dijkstra's algorithm implementation
  - `main.js` - Application initialization and event handling

## Future Improvements

- Add more pathfinding algorithms (A*, Breadth-First Search)
- Implement weighted nodes
- Add grid resizing functionality (done)
- Save/load grid configurations
- Add touch support for mobile devices
