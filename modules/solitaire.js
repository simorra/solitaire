import { Vec2d } from "./Vec2d.js"

export const CELL_SIZE = 70;

export class GameBoard {
  constructor() {
    //The value of a cell is 1 if it contains a marble and 0 if it doesn't
    //null cells don't actually belong to the game board
    this.cells = [
      [null, null, 1, 1, 1, null, null],
      [null, null, 1, 1, 1, null, null],
      [   1,    1, 1, 1, 1,    1,    1],
      [   1,    1, 1, 0, 1,    1,    1],
      [   1,    1, 1, 1, 1,    1,    1],
      [null, null, 1, 1, 1, null, null],
      [null, null, 1, 1, 1, null, null],
    ];

    this.movesHistory = [];
  }

  availableMovesFrom(source) {
    let moves = [];
    if(this.cells[source.y][source.x]) {
      for(let dir of Object.values(Move.DIRECTIONS)) {
        let target = Vec2d.add(source, Vec2d.multiply(dir, 2));
        if(target.x < 0 || target.x >= 7 || target.y < 0 || target.y >= 7)
          continue;
        let m = new Move(dir, target);
        if(this.cells[m.middle.y][m.middle.x] && this.cells[m.target.y][m.target.x] === 0)
          moves.push(m);
      }
    }

    return moves;
  }

  availableMovesTo(target) {
    let moves = [];
    if(this.cells[target.y][target.x] === 0) {
      for(let dir of Object.values(Move.DIRECTIONS)) {
        let m = new Move(dir, target);
        if(m.source.x < 0 || m.source.x >= 7 || m.source.y < 0 || m.source.y >= 7)
          continue;
        if(this.cells[m.source.y][m.source.x] && this.cells[m.middle.y][m.middle.x])
          moves.push(m);
      }
    }

    return moves;
  }

  allAvailableMoves() {
    let moves = [];
    for(let i = 0; i < 7; i++)
      for(let j = 0; j < 7; j++)
        if(this.cells[i][j] === 0)
          moves = moves.concat(this.availableMovesTo(new Vec2d(j, i)));
    
    return moves;
  }

  applyMove(m) {
    this.cells[m.source.y][m.source.x] = 0;
    this.cells[m.middle.y][m.middle.x] = 0;
    this.cells[m.target.y][m.target.x] = 1;
    
    this.movesHistory.push(m);
  }

  revertLastMove() {
    if(this.movesHistory.length > 0) {
      let m = this.movesHistory.pop();
      this.cells[m.source.y][m.source.x] = 1;
      this.cells[m.middle.y][m.middle.x] = 1;
      this.cells[m.target.y][m.target.x] = 0;
    }
  }

  reset() {
    while(this.movesHistory.length > 0)
      this.revertLastMove();
  }

  checkVictory() {
    let sum = 0;
    for(let i = 0; i < 7; i++)
      for(let j = 0; j < 7; j++)
        sum += this.cells[i][j]; //null is automatically converted to 0

    //There's only one marble and it's in the center cell
    if(sum === 1 && this.cells[3][3])
      return true;
    return false;
  }

  draw(canvas, selectedCell = null) {
    let ctx = canvas.getContext("2d");

    //Background
    ctx.fillStyle = "rgb(202,164,115)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //Draw marbles
    for(let i = 0; i < 7; i++) {
      for(let j = 0; j < 7; j++) {
        if(this.cells[i][j] === null)
          continue;
        ctx.fillStyle = this.cells[i][j] ? "rgb(119,85,0)": "rgb(185,150,105)";
        let x = j * CELL_SIZE + Math.floor(CELL_SIZE/2);
        let y = i * CELL_SIZE + Math.floor(CELL_SIZE/2);
        ctx.beginPath();
        ctx.arc(x, y, Math.floor(CELL_SIZE/3), 0, 2*Math.PI);
        ctx.fill();
      }
    }

    //Highlight selected cell
    if(selectedCell) {
      ctx.fillStyle = "rgba(255,215,0,1)";
      let x = selectedCell.x * CELL_SIZE + Math.floor(CELL_SIZE/2);
      let y = selectedCell.y * CELL_SIZE + Math.floor(CELL_SIZE/2);
      ctx.beginPath();
      ctx.arc(x, y, Math.floor(CELL_SIZE/3), 0, 2*Math.PI);
      ctx.fill();
    }
  }
}

export class Move {
  static DIRECTIONS = {
    right: new Vec2d(1, 0),
    left: new Vec2d(-1, 0),
    down: new Vec2d(0, 1),
    up: new Vec2d(0, -1)
  } 

  //A move is represented by it's direction
  //and it's target cell (both Vec2d objects)
  constructor(direction, target) {
    this.dir = direction;
    this.target = target; 
    this.middle = Vec2d.subtract(this.target, this.dir);
    this.source = Vec2d.subtract(this.middle, this.dir);
  }
}