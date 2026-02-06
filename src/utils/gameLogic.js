// 遊戲核心邏輯工具函數

const BOARD_SIZE = 15;

// 初始化空棋盤
export const createEmptyBoard = () => {
  return Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
};

// 檢查是否有玩家獲勝
export const checkWinner = (board, row, col, player) => {
  const directions = [
    { dx: 1, dy: 0 },   // 橫向
    { dx: 0, dy: 1 },   // 豎向
    { dx: 1, dy: 1 },   // 右下斜
    { dx: 1, dy: -1 },  // 右上斜
  ];

  for (const { dx, dy } of directions) {
    let count = 1; // 當前棋子

    // 正方向計數
    let i = 1;
    while (
      row + i * dy >= 0 &&
      row + i * dy < BOARD_SIZE &&
      col + i * dx >= 0 &&
      col + i * dx < BOARD_SIZE &&
      board[row + i * dy][col + i * dx] === player
    ) {
      count++;
      i++;
    }

    // 反方向計數
    i = 1;
    while (
      row - i * dy >= 0 &&
      row - i * dy < BOARD_SIZE &&
      col - i * dx >= 0 &&
      col - i * dx < BOARD_SIZE &&
      board[row - i * dy][col - i * dx] === player
    ) {
      count++;
      i++;
    }

    if (count >= 5) {
      return true;
    }
  }

  return false;
};

// 評估某個位置的分數（用於 AI）
export const evaluatePosition = (board, row, col, player) => {
  const opponent = player === 'black' ? 'white' : 'black';
  let score = 0;

  const directions = [
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 1, dy: 1 },
    { dx: 1, dy: -1 },
  ];

  for (const { dx, dy } of directions) {
    // 評估該方向的威脅
    const lineScore = evaluateLine(board, row, col, dx, dy, player, opponent);
    score += lineScore;
  }

  // 中心位置加分
  const centerBonus = 15 - Math.abs(row - 7) - Math.abs(col - 7);
  score += centerBonus * 2;

  return score;
};

// 評估某一條線的分數
const evaluateLine = (board, row, col, dx, dy, player, opponent) => {
  let playerCount = 1;
  let opponentCount = 0;
  let emptyCount = 0;
  let blocked = 0;

  // 正方向
  for (let i = 1; i < 5; i++) {
    const newRow = row + i * dy;
    const newCol = col + i * dx;

    if (newRow < 0 || newRow >= BOARD_SIZE || newCol < 0 || newCol >= BOARD_SIZE) {
      blocked++;
      break;
    }

    if (board[newRow][newCol] === player) {
      playerCount++;
    } else if (board[newRow][newCol] === opponent) {
      opponentCount++;
      blocked++;
      break;
    } else {
      emptyCount++;
      break;
    }
  }

  // 反方向
  for (let i = 1; i < 5; i++) {
    const newRow = row - i * dy;
    const newCol = col - i * dx;

    if (newRow < 0 || newRow >= BOARD_SIZE || newCol < 0 || newCol >= BOARD_SIZE) {
      blocked++;
      break;
    }

    if (board[newRow][newCol] === player) {
      playerCount++;
    } else if (board[newRow][newCol] === opponent) {
      opponentCount++;
      blocked++;
      break;
    } else {
      emptyCount++;
      break;
    }
  }

  // 根據棋型評分
  if (playerCount >= 5) return 100000; // 五連
  if (playerCount === 4 && blocked === 0) return 10000; // 活四
  if (playerCount === 4 && blocked === 1) return 1000; // 衝四
  if (playerCount === 3 && blocked === 0) return 1000; // 活三
  if (playerCount === 3 && blocked === 1) return 100; // 眠三
  if (playerCount === 2 && blocked === 0) return 100; // 活二
  if (playerCount === 2 && blocked === 1) return 10; // 眠二

  return 0;
};

// 獲取所有候選位置（用於 AI）
export const getCandidatePositions = (board) => {
  const candidates = [];
  const occupied = new Set();

  // 收集所有已佔據的位置
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col]) {
        occupied.add(`${row},${col}`);
      }
    }
  }

  // 如果是空棋盤，返回中心位置
  if (occupied.size === 0) {
    return [{ row: 7, col: 7, score: 100 }];
  }

  // 找出所有已佔據位置周圍的空位
  const range = 2; // 搜索範圍
  for (const pos of occupied) {
    const [row, col] = pos.split(',').map(Number);

    for (let dr = -range; dr <= range; dr++) {
      for (let dc = -range; dc <= range; dc++) {
        const newRow = row + dr;
        const newCol = col + dc;

        if (
          newRow >= 0 &&
          newRow < BOARD_SIZE &&
          newCol >= 0 &&
          newCol < BOARD_SIZE &&
          !board[newRow][newCol] &&
          !occupied.has(`${newRow},${newCol}`)
        ) {
          candidates.push({ row: newRow, col: newCol });
          occupied.add(`${newRow},${newCol}`);
        }
      }
    }
  }

  return candidates;
};

// 檢查是否為有效落子位置
export const isValidMove = (board, row, col) => {
  return (
    row >= 0 &&
    row < BOARD_SIZE &&
    col >= 0 &&
    col < BOARD_SIZE &&
    !board[row][col]
  );
};

// 複製棋盤
export const cloneBoard = (board) => {
  return board.map(row => [...row]);
};
