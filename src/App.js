import React, { useState, useEffect, useCallback } from 'react';
import Board from './components/Board';
import GameInfo from './components/GameInfo';
import GameSetup from './components/GameSetup';
import { createEmptyBoard, checkWinner, isValidMove, cloneBoard } from './utils/gameLogic';
import { calculateAIMove } from './utils/aiPlayer';
import soundEffects from './utils/soundEffects';
import './App.css';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameMode, setGameMode] = useState('pvp'); // 'pvp' or 'pvc'
  const [difficulty, setDifficulty] = useState('medium');
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState('black');
  const [winner, setWinner] = useState(null);
  const [lastMove, setLastMove] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);
  const [blackTime, setBlackTime] = useState(600); // 10 分鐘
  const [whiteTime, setWhiteTime] = useState(600);
  const [isAIThinking, setIsAIThinking] = useState(false);

  // 開始遊戲
  const handleStartGame = ({ gameMode, difficulty }) => {
    setGameMode(gameMode);
    setDifficulty(difficulty);
    setGameStarted(true);
    soundEffects.init();
  };

  // 計時器
  useEffect(() => {
    if (!gameStarted || winner || isAIThinking) return;

    const timer = setInterval(() => {
      if (currentPlayer === 'black') {
        setBlackTime(prev => Math.max(0, prev - 1));
      } else {
        setWhiteTime(prev => Math.max(0, prev - 1));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, currentPlayer, winner, isAIThinking]);

  // 檢查時間用盡
  useEffect(() => {
    if (blackTime === 0 && !winner) {
      setWinner('white');
      soundEffects.playWinSound();
    } else if (whiteTime === 0 && !winner) {
      setWinner('black');
      soundEffects.playWinSound();
    }
  }, [blackTime, whiteTime, winner]);

  // AI 自動下棋
  useEffect(() => {
    if (
      gameStarted &&
      gameMode === 'pvc' &&
      currentPlayer === 'white' &&
      !winner &&
      !isAIThinking
    ) {
      setIsAIThinking(true);

      // 延遲一下讓 AI 看起來在"思考"
      const thinkingTime = difficulty === 'easy' ? 300 : difficulty === 'medium' ? 600 : 1000;

      setTimeout(() => {
        const aiMove = calculateAIMove(board, difficulty);

        if (aiMove) {
          handleCellClick(aiMove.row, aiMove.col);
        }

        setIsAIThinking(false);
      }, thinkingTime);
    }
  }, [gameStarted, gameMode, currentPlayer, winner, board, difficulty, isAIThinking]);

  // 處理落子
  const handleCellClick = useCallback((row, col) => {
    if (winner || !isValidMove(board, row, col) || isAIThinking) {
      return;
    }

    // 玩家對戰模式或輪到玩家時才能點擊
    if (gameMode === 'pvc' && currentPlayer === 'white' && !isAIThinking) {
      return;
    }

    const newBoard = cloneBoard(board);
    newBoard[row][col] = currentPlayer;

    setBoard(newBoard);
    setLastMove({ row, col });

    // 添加到歷史記錄
    setMoveHistory(prev => [...prev, { row, col, player: currentPlayer }]);

    // 播放落子音效
    soundEffects.playPlaceSound();

    // 檢查是否獲勝
    if (checkWinner(newBoard, row, col, currentPlayer)) {
      setWinner(currentPlayer);
      soundEffects.playWinSound();
      return;
    }

    // 切換玩家
    setCurrentPlayer(currentPlayer === 'black' ? 'white' : 'black');
  }, [board, currentPlayer, winner, gameMode, isAIThinking]);

  // 悔棋
  const handleUndo = () => {
    if (moveHistory.length === 0 || winner) return;

    // 在 AI 模式下，悔棋需要退兩步（玩家和 AI 的棋）
    const stepsToUndo = gameMode === 'pvc' ? Math.min(2, moveHistory.length) : 1;

    const newHistory = moveHistory.slice(0, -stepsToUndo);
    const newBoard = createEmptyBoard();

    // 重建棋盤
    newHistory.forEach(move => {
      newBoard[move.row][move.col] = move.player;
    });

    setBoard(newBoard);
    setMoveHistory(newHistory);
    setLastMove(newHistory.length > 0 ? newHistory[newHistory.length - 1] : null);
    setCurrentPlayer(newHistory.length % 2 === 0 ? 'black' : 'white');
    setWinner(null);
  };

  // 重新開始
  const handleReset = () => {
    setBoard(createEmptyBoard());
    setCurrentPlayer('black');
    setWinner(null);
    setLastMove(null);
    setMoveHistory([]);
    setBlackTime(600);
    setWhiteTime(600);
    setIsAIThinking(false);
  };

  // 返回設置頁面
  const handleBackToSetup = () => {
    setGameStarted(false);
    handleReset();
  };

  if (!gameStarted) {
    return <GameSetup onStartGame={handleStartGame} />;
  }

  return (
    <div className="app">
      <div className="game-container">
        <Board
          board={board}
          onCellClick={handleCellClick}
          lastMove={lastMove}
          disabled={winner !== null || isAIThinking}
        />

        <GameInfo
          currentPlayer={currentPlayer}
          winner={winner}
          gameMode={gameMode}
          difficulty={difficulty}
          blackTime={blackTime}
          whiteTime={whiteTime}
          moveHistory={moveHistory}
          onUndo={handleUndo}
          onReset={handleReset}
          canUndo={moveHistory.length > 0 && !isAIThinking}
        />
      </div>

      {isAIThinking && (
        <div className="ai-thinking-overlay">
          <div className="ai-thinking-message">
            <div className="thinking-spinner"></div>
            <span>AI 思考中...</span>
          </div>
        </div>
      )}

      <button className="back-button" onClick={handleBackToSetup}>
        ← 返回設置
      </button>
    </div>
  );
}

export default App;
