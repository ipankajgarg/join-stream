import { useState, useEffect, memo, useCallback, useRef } from "react";
import { MediaPlayer } from "dashjs";
import "./App.css";
import ShakaPlayer from "shaka-player-react";
import "shaka-player-react/dist/controls.css";

function App() {
  return <ShakaPlayer autoPlay src="http://localhost:5001/manifest" />;
}

let arr = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function Ap() {
  const [matrix, updateMatrix] = useState(arr);
  const [curPlayer, updatePlayer] = useState("X");
  const [result, setResult] = useState(false);
  const [index, setIndex] = useState(null);

  function checkResult() {
    if (!index) {
      return;
    }
    const { rowIndex, colIndex } = index;
    let isMatch = true;
    // check row
    for (var i = 0; i < matrix[0].length; i++) {
      if (matrix[rowIndex][i] !== matrix[rowIndex][colIndex]) {
        isMatch = false;
        break;
      }
    }
    if (isMatch) {
      // update the state and win
      setResult(true);
      return;
    }
    // check column
    isMatch = true;
    for (var i = 0; i < matrix.length; i++) {
      if (matrix[i][colIndex] !== matrix[rowIndex][colIndex]) {
        isMatch = false;
        break;
      }
    }
    if (isMatch) {
      // update the state and win
      setResult(true);
      return;
    }

    // check left to right diagonal
    isMatch = true;
    for (var i = 0; i < matrix.length; i++) {
      if (matrix[i][i] !== matrix[rowIndex][colIndex]) {
        isMatch = false;
        break;
      }
    }

    if (isMatch) {
      // update the state and win
      setResult(true);
      return;
    }

    // check right to left diagonal
    isMatch = true;
    for (var i = 0; i < matrix.length; i++) {
      console.log(
        matrix[0][matrix.length - i - 1],
        matrix[rowIndex][colIndex],
        i,
        matrix
      );
      if (matrix[i][matrix.length - i - 1] !== matrix[rowIndex][colIndex]) {
        isMatch = false;
        break;
      }
    }
    if (isMatch) {
      // update the state and win
      setResult(true);
      return;
    }
  }

  const handleClick = useCallback(function handleClick(rowIndex, colIndex) {
    // console.log("cur", curPlayer);
    updatePlayer((cur) => {
      matrix[rowIndex][colIndex] = cur;
      updateMatrix([...matrix]);
      // console.log("player", cur);
      return cur === "X" ? "O" : "X";
    });
    setIndex({ rowIndex, colIndex });
  }, []);

  useEffect(() => {
    checkResult();
  }, [curPlayer, matrix]);

  function renderMatrix() {
    return matrix.map((row, rowIndex) => {
      return (
        <div className="row">
          {row.map((item, colIndex) => (
            <Box onClick={handleClick} rowIndex={rowIndex} colIndex={colIndex}>
              {item}
            </Box>
          ))}
        </div>
      );
    });
  }

  return (
    <>
      <div id="matrix">{renderMatrix()}</div>
      <div>{curPlayer}</div>

      {result && <div>won</div>}
    </>
  );
}

function Col({ children, onClick, rowIndex, colIndex }) {
  // console.log("rendering");
  return <span onClick={() => onClick(rowIndex, colIndex)}>{children}</span>;
}
const Box = memo(Col);

export default App;
