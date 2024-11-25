import { useState, useEffect, useCallback } from 'react';
import styles from './index.module.css';

const directions = [
  [-1, 1],
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
];

const Home = () => {
  const [turnColor, setTurnColor] = useState(1);
  const [board, setBoard] = useState<number[][]>([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const [candidateMoves, setCandidateMoves] = useState<{ x: number; y: number }[]>([]);

  const calculateCandidateMoves = useCallback(() => {
    const candidates: { x: number; y: number }[] = [];
    for (let y = 0; y <= 7; y++) {
      for (let x = 0; x <= 7; x++) {
        if (board[y][x] === 0 && isValidMove(x, y, board, turnColor)) {
          candidates.push({ x, y });
        }
      }
    }
    setCandidateMoves(candidates);
  }, [board, turnColor]);

  useEffect(() => {
    calculateCandidateMoves();
  }, [board, turnColor, calculateCandidateMoves]);

  const isValidMove = (x: number, y: number, board: number[][], color: number) => {
    for (const [dx, dy] of directions) {
      let hasOpponentStone = false;
      for (let i = 1; i < 8; i++) {
        const nx = x + i * dx;
        const ny = y + i * dy;
        if (nx < 0 || nx >= 8 || ny < 0 || ny >= 8) break;
        const checkingColor = board[ny][nx];
        if (checkingColor === 0) break;
        if (checkingColor === 3 - color) {
          hasOpponentStone = true;
        } else if (checkingColor === color) {
          if (hasOpponentStone) return true;
          break;
        } else {
          break;
        }
      }
    }
    return false;
  };

  const clickHandler = (x: number, y: number) => {
    if (!isValidMove(x, y, board, turnColor)) return;

    const newBoard = structuredClone(board);

    for (const [dx, dy] of directions) {
      const maybeTurnables: { x: number; y: number }[] = [];
      for (let i = 1; i < 8; i++) {
        const nx = x + i * dx;
        const ny = y + i * dy;
        if (nx < 0 || nx >= 8 || ny < 0 || ny >= 8) break;
        const checkingColor = board[ny][nx];
        if (checkingColor === 3 - turnColor) {
          maybeTurnables.push({ x: nx, y: ny });
        } else if (checkingColor === turnColor) {
          if (maybeTurnables.length > 0) {
            for (const item of maybeTurnables) {
              newBoard[item.y][item.x] = turnColor;
            }
            newBoard[y][x] = turnColor;
          }
          break;
        } else {
          break;
        }
      }
    }

    setBoard(newBoard);
    setTurnColor(3 - turnColor);
  };

  let blackPoint = 0;
  let whitePoint = 0;
  for (let y = 0; y <= 7; y++) {
    for (let x = 0; x <= 7; x++) {
      const color = board[y][x];
      if (color === 1) {
        blackPoint++;
      } else if (color === 2) {
        whitePoint++;
      }
    }
  }

  console.table(board);

  return (
    <div className={styles.container}>
      <div className={styles.point}>
        黒 - 白
        <br />
        {blackPoint} - {whitePoint}
      </div>
      <div className={styles.boardStyle}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div
              className={`${styles.cellStyle} ${candidateMoves.some((move) => move.x === x && move.y === y) ? styles.candidate : ''}`}
              key={`${x}-${y}`}
              onClick={() => clickHandler(x, y)}
            >
              {color !== 0 && (
                <div
                  className={styles.stoneStyle}
                  style={{ background: color === 1 ? '#000' : '#fff' }}
                />
              )}
            </div>
          )),
        )}
      </div>
      <div className={styles.player}>{turnColor === 1 ? '黒' : '白'}のターンです</div>
    </div>
  );
};

export default Home;
