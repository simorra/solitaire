import { Vec2d } from "./Vec2d.js"

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

  availableMoves(target) {
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
          moves = moves.concat(this.availableMoves(new Vec2d(j, i)));
    
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