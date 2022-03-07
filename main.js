import { CELL_SIZE, GameBoard } from "./modules/solitaire.js"
import { Vec2d } from "./modules/Vec2d.js"

let canvas = document.querySelector("#gameWindow");
canvas.addEventListener("click", onCanvasClick);

let gb = new GameBoard();
window.requestAnimationFrame(() => gb.draw(canvas));

let selectedMoves = [];
function onCanvasClick(e) {
  let rect = canvas.getBoundingClientRect();
  //The cell in the game board that was clicked
  let c = new Vec2d(Math.floor((e.pageX - rect.left)/CELL_SIZE), 
                    Math.floor((e.pageY - rect.top)/CELL_SIZE));

  switch(gb.cells[c.y][c.x]) {
    case 1: //Display the moves available from c
      selectedMoves = gb.availableMovesFrom(c);
      window.requestAnimationFrame(() => gb.draw(canvas, c));
      break;
    case 0: //Apply a move if possible
      for(let m of selectedMoves) {
        if(c.equals(m.target)) {
          gb.applyMove(m);
          break;
        }
      } //no break, continue with the default case
    default:
      selectedMoves = [];
      window.requestAnimationFrame(() => gb.draw(canvas));
  }
}