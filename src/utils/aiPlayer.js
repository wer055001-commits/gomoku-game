// AI 玩家演算法

import {
  checkWinner,
  evaluatePosition,
  getCandidatePositions,
  cloneBoard,
  isValidMove
} from './gameLogic';

// AI 計算最佳落子位置
export const calculateAIMove = (board, difficulty) => {
  const candidates = getCandidatePositions(board);

  if (candidates.length === 0) {
    return null;
  }

  // 根據難度選擇不同的策略
  switch (difficulty) {
    case 'easy':
      return calculateEasyMove(board, candidates);
    case 'medium':
      return calculateMediumMove(board, candidates);
    case 'hard':
      return calculateHardMove(board, candidates);
    default:
      return calculateMediumMove(board, candidates);
  }
};

// 簡單難度：隨機選擇，略微考慮位置
const calculateEasyMove = (board, candidates) => {
  // 30% 機率隨機落子
  if (Math.random() < 0.3) {
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  // 70% 機率選擇分數較高的位置
  const scoredCandidates = candidates.map(pos => ({
    ...pos,
    score: evaluatePosition(board, pos.row, pos.col, 'white')
  }));

  scoredCandidates.sort((a, b) => b.score - a.score);

  // 從前 5 個高分位置中隨機選擇
  const topCandidates = scoredCandidates.slice(0, Math.min(5, scoredCandidates.length));
  return topCandidates[Math.floor(Math.random() * topCandidates.length)];
};

// 中等難度：考慮攻防
const calculateMediumMove = (board, candidates) => {
  const player = 'white';
  const opponent = 'black';

  // 檢查是否有必勝位置
  for (const pos of candidates) {
    const testBoard = cloneBoard(board);
    testBoard[pos.row][pos.col] = player;
    if (checkWinner(testBoard, pos.row, pos.col, player)) {
      return pos;
    }
  }

  // 檢查是否需要阻擋對手
  for (const pos of candidates) {
    const testBoard = cloneBoard(board);
    testBoard[pos.row][pos.col] = opponent;
    if (checkWinner(testBoard, pos.row, pos.col, opponent)) {
      return pos;
    }
  }

  // 評估所有候選位置
  const scoredCandidates = candidates.map(pos => {
    const attackScore = evaluatePosition(board, pos.row, pos.col, player);
    const defenseScore = evaluatePosition(board, pos.row, pos.col, opponent);

    return {
      ...pos,
      score: attackScore * 1.2 + defenseScore * 0.8 // 略微偏重進攻
    };
  });

  scoredCandidates.sort((a, b) => b.score - a.score);
  return scoredCandidates[0];
};

// 困難難度：使用 Minimax 演算法
const calculateHardMove = (board, candidates) => {
  const player = 'white';
  const opponent = 'black';

  // 首先檢查必勝和必防位置
  for (const pos of candidates) {
    const testBoard = cloneBoard(board);
    testBoard[pos.row][pos.col] = player;
    if (checkWinner(testBoard, pos.row, pos.col, player)) {
      return pos;
    }
  }

  for (const pos of candidates) {
    const testBoard = cloneBoard(board);
    testBoard[pos.row][pos.col] = opponent;
    if (checkWinner(testBoard, pos.row, pos.col, opponent)) {
      return pos;
    }
  }

  // 使用 Minimax 演算法（深度為 2）
  let bestScore = -Infinity;
  let bestMove = candidates[0];

  // 限制評估的候選位置數量（性能優化）
  const scoredCandidates = candidates.map(pos => ({
    ...pos,
    quickScore: evaluatePosition(board, pos.row, pos.col, player) +
                evaluatePosition(board, pos.row, pos.col, opponent)
  }));

  scoredCandidates.sort((a, b) => b.quickScore - a.quickScore);
  const topCandidates = scoredCandidates.slice(0, Math.min(10, candidates.length));

  for (const pos of topCandidates) {
    const testBoard = cloneBoard(board);
    testBoard[pos.row][pos.col] = player;

    const score = minimax(testBoard, 1, false, player, opponent, -Infinity, Infinity);

    if (score > bestScore) {
      bestScore = score;
      bestMove = pos;
    }
  }

  return bestMove;
};

// Minimax 演算法實現
const minimax = (board, depth, isMaximizing, player, opponent, alpha, beta) => {
  if (depth === 0) {
    return evaluateBoard(board, player, opponent);
  }

  const candidates = getCandidatePositions(board).slice(0, 8); // 限制寬度

  if (isMaximizing) {
    let maxScore = -Infinity;

    for (const pos of candidates) {
      if (!isValidMove(board, pos.row, pos.col)) continue;

      const testBoard = cloneBoard(board);
      testBoard[pos.row][pos.col] = player;

      if (checkWinner(testBoard, pos.row, pos.col, player)) {
        return 100000;
      }

      const score = minimax(testBoard, depth - 1, false, player, opponent, alpha, beta);
      maxScore = Math.max(maxScore, score);
      alpha = Math.max(alpha, score);

      if (beta <= alpha) break; // Alpha-Beta 剪枝
    }

    return maxScore;
  } else {
    let minScore = Infinity;

    for (const pos of candidates) {
      if (!isValidMove(board, pos.row, pos.col)) continue;

      const testBoard = cloneBoard(board);
      testBoard[pos.row][pos.col] = opponent;

      if (checkWinner(testBoard, pos.row, pos.col, opponent)) {
        return -100000;
      }

      const score = minimax(testBoard, depth - 1, true, player, opponent, alpha, beta);
      minScore = Math.min(minScore, score);
      beta = Math.min(beta, score);

      if (beta <= alpha) break; // Alpha-Beta 剪枝
    }

    return minScore;
  }
};

// 評估整個棋盤的局勢
const evaluateBoard = (board, player, opponent) => {
  let score = 0;

  for (let row = 0; row < 15; row++) {
    for (let col = 0; col < 15; col++) {
      if (board[row][col] === player) {
        score += evaluatePosition(board, row, col, player);
      } else if (board[row][col] === opponent) {
        score -= evaluatePosition(board, row, col, opponent);
      }
    }
  }

  return score;
};
