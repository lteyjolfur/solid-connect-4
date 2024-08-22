import logo from './logo.svg';
import styles from './App.module.css';
import { createSignal, createEffect, For, onCleanup, Show } from "solid-js";

const squareSize = '50px';
const boardWidth = 7;
const boardHeight = 6;

const boardColor = 'blue'
const player1Color = 'red'
const player2Color = 'yellow'

const winChecker = {
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


const Square = (props) => {
  return (
    <div style={{
      overflow: 'hidden',
      height: squareSize,
      width: squareSize,
      display: 'flex',
      "align-items": 'center',
      "justify-content": 'center',
      "background-color": boardColor,
    }}>
      <div
        style={{
          width: '70%',
          height: '70%',
          border: "1px solid black",
          "border-radius": '50%',
          "background-color": props.content || '#bab0b0',
          "box-shadow": "6px 6px 11px -3px rgba(0, 0, 0, 0.45) inset"
        }}
      >
      </div>
    </div >
  );
}


// disabled={props.disabled}
const Insert = (props) => {
  return (
    <button class={`${styles.Insert} '${styles[turnToColor(props.turn)]} ${turnToColor(props.turn)}`} disabled={props.disabled} style={{ width: squareSize, height: squareSize / 2 }}
      onClick={[props.clickHandler, props.index]}>
      ⬇
    </button>
  );
}

const turnToColor = (turn) => (turn ? player1Color : player2Color);

const fillBoard = (color) => Array(boardHeight).fill(Array(boardWidth).fill(color));

function App() {
  const [gameBoard, setGameBoard] = createSignal(Array(boardHeight).fill(Array(boardWidth).fill(null)));
  const [turn, setTurn] = createSignal(true);
  const [gameState, setGameState] = createSignal(false)

  // createEffect(() => {
  //   const result = winChecker.check(gameBoard());
  //   console.log(result)
  // });

  const handleInsert = (index, event) => {
    const curGameBoard = JSON.parse(JSON.stringify(gameBoard()));
    for (let h = boardHeight - 1; h >= 0; h--) {
      if (curGameBoard[h][index] === null) {
        curGameBoard[h][index] = turnToColor(turn());
        setGameBoard(curGameBoard);
        const result = winChecker.check(gameBoard());
        if (result) {
          setGameState(true)
        } else {
          setTurn(!turn());
        }

        break;
      }

    }
  };

  const restart = () => {
    setTurn(true);
    setGameBoard(fillBoard(null));
  };



  return (
    <div class={styles.App}>
      <h1 style={{ color: turnToColor(turn()) }}>Connect 4</h1>
      <For each={[...Array(boardWidth).keys()]}>
        {(index) => <Insert clickHandler={handleInsert} index={index} turn={turn()} disabled={gameState()} />}
      </For>
      <div>
        <div class={styles.GameBoard} style={{ display: 'inline-block', overflow: 'hidden', 'border-radius': '12px' }}>
          <For each={gameBoard()} >
            {
              (row) =>
                <div style={{ display: 'flex', 'justify-content': 'center', 'align-items': 'center', 'border-radius': '10px' }}>
                  <For each={row}>
                    {(cell) => <Square content={cell} />}
                  </For>
                </div>
            }
          </For>
        </div>
      </div>
      <button onClick={restart}>restart</button>
      <Show when={gameState() === true} >
        <h2 style={{ color: turnToColor(turn()) }}> {turn()} wins</h2>
      </Show>
    </div >
  );
}

export default App;
