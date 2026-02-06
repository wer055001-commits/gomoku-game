import React from 'react';
import './Board.css';

const Board = ({ board, onCellClick, lastMove, disabled }) => {
  const BOARD_SIZE = 15;

  return (
    <div className="board-container">
      <div className="board">
        {Array(BOARD_SIZE).fill(null).map((_, row) => (
          <div key={row} className="board-row">
            {Array(BOARD_SIZE).fill(null).map((_, col) => {
              const isLastMove = lastMove && lastMove.row === row && lastMove.col === col;
              const cellValue = board[row][col];

              return (
                <div
                  key={`${row}-${col}`}
                  className={`cell ${disabled ? 'disabled' : ''}`}
                  onClick={() => !disabled && onCellClick(row, col)}
                >
                  <div className="cell-bg">
                    {/* 星位標記 */}
                    {((row === 3 || row === 7 || row === 11) &&
                      (col === 3 || col === 7 || col === 11)) && (
                      <div className="star-point" />
                    )}
                  </div>

                  {cellValue && (
                    <div className={`piece ${cellValue} ${isLastMove ? 'last-move' : ''}`}>
                      {isLastMove && <div className="last-move-marker" />}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
