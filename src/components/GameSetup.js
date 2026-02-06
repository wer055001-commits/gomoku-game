import React, { useState } from 'react';
import './GameSetup.css';

const GameSetup = ({ onStartGame }) => {
  const [gameMode, setGameMode] = useState('pvp');
  const [difficulty, setDifficulty] = useState('medium');

  const handleStart = () => {
    onStartGame({ gameMode, difficulty });
  };

  return (
    <div className="game-setup">
      <div className="setup-card">
        <h1 className="setup-title">🎮 五子棋遊戲</h1>

        <div className="setup-section">
          <h2 className="section-title">遊戲模式</h2>
          <div className="mode-options">
            <div
              className={`mode-option ${gameMode === 'pvp' ? 'active' : ''}`}
              onClick={() => setGameMode('pvp')}
            >
              <div className="mode-icon">👥</div>
              <div className="mode-name">雙人對戰</div>
              <div className="mode-desc">與朋友面對面對戰</div>
            </div>
            <div
              className={`mode-option ${gameMode === 'pvc' ? 'active' : ''}`}
              onClick={() => setGameMode('pvc')}
            >
              <div className="mode-icon">🤖</div>
              <div className="mode-name">AI 對戰</div>
              <div className="mode-desc">挑戰電腦對手</div>
            </div>
          </div>
        </div>

        {gameMode === 'pvc' && (
          <div className="setup-section">
            <h2 className="section-title">難度選擇</h2>
            <div className="difficulty-options">
              <div
                className={`difficulty-option easy ${difficulty === 'easy' ? 'active' : ''}`}
                onClick={() => setDifficulty('easy')}
              >
                <div className="difficulty-icon">😊</div>
                <div className="difficulty-name">簡單</div>
                <div className="difficulty-desc">適合新手</div>
              </div>
              <div
                className={`difficulty-option medium ${difficulty === 'medium' ? 'active' : ''}`}
                onClick={() => setDifficulty('medium')}
              >
                <div className="difficulty-icon">😐</div>
                <div className="difficulty-name">中等</div>
                <div className="difficulty-desc">有一定挑戰</div>
              </div>
              <div
                className={`difficulty-option hard ${difficulty === 'hard' ? 'active' : ''}`}
                onClick={() => setDifficulty('hard')}
              >
                <div className="difficulty-icon">😤</div>
                <div className="difficulty-name">困難</div>
                <div className="difficulty-desc">高手對決</div>
              </div>
            </div>
          </div>
        )}

        <button className="start-button" onClick={handleStart}>
          開始遊戲 🚀
        </button>

        <div className="game-rules">
          <h3>遊戲規則</h3>
          <ul>
            <li>15x15 棋盤，黑子先行</li>
            <li>橫、豎、斜任一方向連成五子即獲勝</li>
            <li>支援悔棋、計時等功能</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GameSetup;
