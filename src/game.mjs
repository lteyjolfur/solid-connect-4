export const boardWidth = 7;
export const boardHeight = 6;

export const player1Color = 'red'
export const player2Color = 'yellow'

export const winChecker = {
  winner: null,
  checkMatch(arr) {
    const win1 = arr.every(square => square === player1Color)
    if (win1) {
      this.winner = player1Color
      return true
    }
    const win2 = arr.every(square => square === player2Color)
    if (win2) {
      this.winner = player2Color
      return true
    }
    return false

  },
  checkMatchBasic(arr) {
    return arr.every(square => square === player1Color) || arr.every(square => square === player2Color)
  },
  checkDown(gameBoard, row, col) {
    const limit = 3
    const height = boardHeight - limit
    const width = boardWidth
    for (let i = 0; i < height; i++) {
      const xRows = gameBoard.filter((_, index) => (index >= i && index <= i + limit))
      for (let j = 0; j < width; j++) {
        const col = xRows.map((row) => (row.filter((_, index) => index === j))).flatMap((x) => x)
        const isWin = this.checkMatch(col)
        if (isWin) {
          return true
        }
      }
    }
  },
  checkRight(gameBoard, row, col) { },
  checkDiagonal(gameBoard, row, col) { },
  check(gameBoard) {
    this.winner = null;
    this.checkDown(gameBoard);
    this.checkRight();
    this.checkDiagonal();
    return this.winner;
  }
}

export const turnToColor = (turn) => (turn ? player1Color : player2Color);

export const fillBoard = (color) => Array(boardHeight).fill(Array(boardWidth).fill(color));

// Returns a copy of gameBoard with color dropped into column index,
// or null if that column is full.
export const dropPiece = (gameBoard, index, color) => {
  const curGameBoard = JSON.parse(JSON.stringify(gameBoard));
  for (let h = boardHeight - 1; h >= 0; h--) {
    if (curGameBoard[h][index] === null) {
      curGameBoard[h][index] = color;
      return curGameBoard;
    }
  }
  return null;
};
