import logo from './logo.svg';
import styles from './App.module.css';
import { createSignal, createEffect, For, onCleanup, Show } from "solid-js";
import { boardWidth, boardHeight, winChecker, turnToColor, fillBoard, dropPiece } from "./game.mjs";

const squareSize = '50px';
const boardColor = 'blue'


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

function App() {
  const [gameBoard, setGameBoard] = createSignal(Array(boardHeight).fill(Array(boardWidth).fill(null)));
  const [turn, setTurn] = createSignal(true);
  const [gameState, setGameState] = createSignal(false)

  // createEffect(() => {
  //   const result = winChecker.check(gameBoard());
  //   console.log(result)
  // });

  const handleInsert = (index, event) => {
    const curGameBoard = dropPiece(gameBoard(), index, turnToColor(turn()));
    if (curGameBoard) {
      setGameBoard(curGameBoard);
      const result = winChecker.check(gameBoard());
      if (result) {
        setGameState(true)
      } else {
        setTurn(!turn());
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
