import logo from './logo.svg';
import styles from './App.module.css';
import { createSignal, createEffect, For, onCleanup } from "solid-js";

const squareSize = '50px';
const boardWidth = 7;
const boardHeight = 6;

const boardColor = 'blue'
const player1Color = 'red'
const player2Color = 'yellow'

class WinChecker {
  static checkUp = (gameBoard, row, col) => { }
  static checkRight = (gameBoard, row, col) => { }
  static checkDiagonal = (gameBoard, row, col) => { }
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



const Insert = (props) => {
  return (
    <button class={`${styles.Insert} '${styles[turnToColor(props.turn)]} ${turnToColor(props.turn)}`} style={{ width: squareSize, height: squareSize / 2 }}
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

  const handleInsert = (index, event) => {
    const curGameBoard = JSON.parse(JSON.stringify(gameBoard()));
    for (let h = boardHeight - 1; h >= 0; h--) {
      if (curGameBoard[h][index] === null) {
        curGameBoard[h][index] = turnToColor(turn());
        setGameBoard(curGameBoard);
        setTurn(!turn());
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
        {(index) => <Insert clickHandler={handleInsert} index={index} turn={turn()} />}
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
    </div >
  );
}

export default App;
