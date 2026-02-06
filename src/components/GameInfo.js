import React from 'react';
import './GameInfo.css';

const GameInfo = ({
  currentPlayer,
  winner,
  gameMode,
  difficulty,
  blackTime,
  whiteTime,
  moveHistory,
  onUndo,
  onReset,
  canUndo
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-info">
      <div className="status-section">
        <h2 className="game-title">五子棋</h2>

        {!winner ? (
          <div className="current-player">
            <div className={`player-indicator ${currentPlayer}`}>
              <div className="indicator-piece" />
            </div>
            <span className="player-text">
              {currentPlayer === 'black' ? '黑子' : '白子'}回合
            </span>
          </div>
        ) : (
          <div className="winner-announcement">
            <div className="trophy">🏆</div>
            <div className={`winner-text ${winner}`}>
              {winner === 'black' ? '黑子獲勝！' : '白子獲勝！'}
            </div>
          </div>
        )}
      </div>

      <div className="game-mode-info">
        <div className="info-item">
          <span className="info-label">模式：</span>
          <span className="info-value">
            {gameMode === 'pvp' ? '雙人對戰' : 'AI 對戰'}
          </span>
        </div>
        {gameMode === 'pvc' && (
          <div className="info-item">
            <span className="info-label">難度：</span>
            <span className="info-value difficulty">
              {difficulty === 'easy' ? '簡單' : difficulty === 'medium' ? '中等' : '困難'}
            </span>
          </div>
        )}
      </div>

      <div className="timer-section">
        <div className="timer black-timer">
          <div className="timer-label">
            <div className="timer-piece black" />
            黑子
          </div>
          <div className="timer-value">{formatTime(blackTime)}</div>
        </div>
        <div className="timer white-timer">
          <div className="timer-label">
            <div className="timer-piece white" />
            白子
          </div>
          <div className="timer-value">{formatTime(whiteTime)}</div>
        </div>
      </div>

      <div className="move-history">
        <h3>步數記錄</h3>
        <div className="history-list">
          {moveHistory.length === 0 ? (
            <div className="no-moves">尚無棋步</div>
          ) : (
            moveHistory.map((move, index) => (
              <div key={index} className={`history-item ${move.player}`}>
                <span className="move-number">{index + 1}.</span>
                <div className={`history-piece ${move.player}`} />
                <span className="move-position">
                  ({String.fromCharCode(65 + move.col)}, {move.row + 1})
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="controls">
        <button
          className="btn btn-undo"
          onClick={onUndo}
          disabled={!canUndo || winner}
        >
          ↩️ 悔棋
        </button>
        <button
          className="btn btn-reset"
          onClick={onReset}
        >
          🔄 重新開始
        </button>
      </div>
    </div>
  );
};

export default GameInfo;
