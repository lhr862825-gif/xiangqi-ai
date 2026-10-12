class XiangqiGame {
    constructor() { this.initializeBoard(); }
    initializeBoard() {
        this.currentPlayer = 'red';
        this.moveHistory = [];
        this.board = [
            ['車', '馬', '象', '士', '將', '士', '象', '馬', '車'],
            [null, null, null, null, null, null, null, null, null],
            [null, '炮', null, null, null, null, null, '炮', null],
            ['卒', null, '卒', null, '卒', null, '卒', null, '卒'],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            ['兵', null, '兵', null, '兵', null, '兵', null, '兵'],
            [null, '炮', null, null, null, null, null, '炮', null],
            [null, null, null, null, null, null, null, null, null],
            ['車', '馬', '相', '仕', '帥', '仕', '相', '馬', '車']
        ];

        this.pieceColors = [];
        for (let row = 0; row < 10; row++) {
            this.pieceColors[row] = [];
            for (let col = 0; col < 9; col++) {
                this.pieceColors[row][col] = row <= 4 ? 'black' : 'red';
            }
        }
    }

    findKing(color) {
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 9; col++) {
                const piece = this.board[row][col];
                if ((piece === '將' || piece === '帥') && this.pieceColors[row][col] === color) {
                    return { row, col };
                }
            }
        }
        return null;
    }

    isValidMove(fromRow, fromCol, toRow, toCol) {
        if (toRow < 0 || toRow > 9 || toCol < 0 || toCol > 8) return false;

        const piece = this.board[fromRow][fromCol];
        const targetPiece = this.board[toRow][toCol];
        const pieceColor = this.pieceColors[fromRow][fromCol];

        if (targetPiece && this.pieceColors[toRow][toCol] === pieceColor) return false;

        const rowDiff = toRow - fromRow;
        const colDiff = toCol - fromCol;

        switch (piece) {
            case '兵':
            case '卒':
                if (pieceColor === 'red') {
                    if (fromRow > 4) {
                        return rowDiff === -1 && colDiff === 0;
                    } else {
                        return (rowDiff === -1 && colDiff === 0) || (rowDiff === 0 && Math.abs(colDiff) === 1);
                    }
                } else {
                    if (fromRow < 5) {
                        return rowDiff === 1 && colDiff === 0;
                    } else {
                        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && Math.abs(colDiff) === 1);
                    }
                }

            case '炮':
                if (rowDiff === 0 || colDiff === 0) {
                    let pieceCount = 0;
                    if (rowDiff === 0) {
                        const start = Math.min(fromCol, toCol) + 1;
                        const end = Math.max(fromCol, toCol);
                        for (let c = start; c < end; c++) {
                            if (this.board[fromRow][c]) pieceCount++;
                        }
                    } else {
                        const start = Math.min(fromRow, toRow) + 1;
                        const end = Math.max(fromRow, toRow);
                        for (let r = start; r < end; r++) {
                            if (this.board[r][fromCol]) pieceCount++;
                        }
                    }
                    return targetPiece ? pieceCount === 1 : pieceCount === 0;
                }
                return false;

            case '車':
                if (rowDiff === 0 || colDiff === 0) {
                    if (rowDiff === 0) {
                        const start = Math.min(fromCol, toCol) + 1;
                        const end = Math.max(fromCol, toCol);
                        for (let c = start; c < end; c++) {
                            if (this.board[fromRow][c]) return false;
                        }
                    } else {
                        const start = Math.min(fromRow, toRow) + 1;
                        const end = Math.max(fromRow, toRow);
                        for (let r = start; r < end; r++) {
                            if (this.board[r][fromCol]) return false;
                        }
                    }
                    return true;
                }
                return false;

            case '馬':
                if ((Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 1) ||
                    (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 2)) {
                    let blockRow, blockCol;
                    if (Math.abs(rowDiff) === 2) {
                        blockRow = fromRow + (rowDiff > 0 ? 1 : -1);
                        blockCol = fromCol;
                    } else {
                        blockRow = fromRow;
                        blockCol = fromCol + (colDiff > 0 ? 1 : -1);
                    }
                    return !this.board[blockRow][blockCol];
                }
                return false;

            case '象':
            case '相':
                if (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 2) {
                    const blockRow = fromRow + rowDiff / 2;
                    const blockCol = fromCol + colDiff / 2;
                    if (this.board[blockRow][blockCol]) return false;

                    if (pieceColor === 'red') {
                        return toRow >= 5;
                    } else {
                        return toRow <= 4;
                    }
                }
                return false;

            case '士':
            case '仕':
                if (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 1) {
                    if (pieceColor === 'red') {
                        return toRow >= 7 && toCol >= 3 && toCol <= 5;
                    } else {
                        return toRow <= 2 && toCol >= 3 && toCol <= 5;
                    }
                }
                return false;

            case '將':
            case '帥':
                if (Math.abs(rowDiff) + Math.abs(colDiff) === 1) {
                    if (pieceColor === 'red') {
                        return toRow >= 7 && toCol >= 3 && toCol <= 5;
                    } else {
                        return toRow <= 2 && toCol >= 3 && toCol <= 5;
                    }
                }
                return false;
            default:
                return false;
        }
    }

    // 执行落子：记录最近一手、更新棋盘与行棋方、刷新界面与将军状态

    canPieceAttack(piece, color, fromRow, fromCol, toRow, toCol) {
        const targetPiece = this.board[toRow][toCol];
        const rowDiff = toRow - fromRow;
        const colDiff = toCol - fromCol;
        if (targetPiece && this.pieceColors[toRow][toCol] === color) return false;

        switch (piece) {
            case '車': {
                if (rowDiff === 0 || colDiff === 0) {
                    if (rowDiff === 0) {
                        const start = Math.min(fromCol, toCol) + 1;
                        const end = Math.max(fromCol, toCol);
                        for (let c = start; c < end; c++) if (this.board[fromRow][c]) return false;
                    } else {
                        const start = Math.min(fromRow, toRow) + 1;
                        const end = Math.max(fromRow, toRow);
                        for (let r = start; r < end; r++) if (this.board[r][fromCol]) return false;
                    }
                    return true;
                }
                return false;
            }
            case '炮':{
                if (rowDiff === 0 || colDiff === 0) {
                    let cnt = 0;
                    if (rowDiff === 0) {
                        const start = Math.min(fromCol, toCol) + 1;
                        const end = Math.max(fromCol, toCol);
                        for (let c = start; c < end; c++) if (this.board[fromRow][c]) cnt++;
                    } else {
                        const start = Math.min(fromRow, toRow) + 1;
                        const end = Math.max(fromRow, toRow);
                        for (let r = start; r < end; r++) if (this.board[r][fromCol]) cnt++;
                    }
                    return cnt === 1;
                }
                return false;
            }
            case '馬': {
                if ((Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 1) ||
                    (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 2)) {
                    let blockRow, blockCol;
                    if (Math.abs(rowDiff) === 2) { blockRow = fromRow + (rowDiff > 0 ? 1 : -1); blockCol = fromCol; }
                    else { blockRow = fromRow; blockCol = fromCol + (colDiff > 0 ? 1 : -1); }
                    return !this.board[blockRow][blockCol];
                }
                return false;
            }
            case '象':
            case '相': {
                if (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 2) {
                    const midR = fromRow + rowDiff / 2;
                    const midC = fromCol + colDiff / 2;
                    if (this.board[midR][midC]) return false;
                    if (color === 'red') return toRow >= 5; else return toRow <= 4;
                }
                return false;
            }
            case '士':
            case '仕': {
                if (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 1) {
                    if (color === 'red') return toRow >= 7 && toCol >= 3 && toCol <= 5;
                    else return toRow <= 2 && toCol >= 3 && toCol <= 5;
                }
                return false;
            }
            case '將':
            case '帥': {
                if (Math.abs(rowDiff) + Math.abs(colDiff) === 1) {
                    if (color === 'red') return toRow >= 7 && toCol >= 3 && toCol <= 5;
                    else return toRow <= 2 && toCol >= 3 && toCol <= 5;
                }
                // 飞将：将帅同列且中间无子时，视为将帅互相攻击
                if (colDiff === 0 && rowDiff !== 0 && targetPiece && (targetPiece === '將' || targetPiece === '帥')) {
                    const start = Math.min(fromRow, toRow) + 1;
                    const end = Math.max(fromRow, toRow);
                    for (let r = start; r < end; r++) {
                        if (this.board[r][fromCol]) return false;
                    }
                    return true;
                }
                return false;
            }
            case '兵':
            case '卒': {
                if (color === 'red') {
                    if (fromRow > 4) return rowDiff === -1 && colDiff === 0;
                    else return (rowDiff === -1 && colDiff === 0) || (rowDiff === 0 && Math.abs(colDiff) === 1);
                } else {
                    if (fromRow < 5) return rowDiff === 1 && colDiff === 0;
                    else return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && Math.abs(colDiff) === 1);
                }
            }
        }
        return false;
    }

    isKingInCheck(color) {
        const king = this.findKing(color);
        if (!king) return false;
        const targetRow = king.row;
        const targetCol = king.col;
        const opponent = color === 'red' ? 'black' : 'red';

        for (let r = 0; r < 10; r++) {
            for (let c = 0; c < 9; c++) {
                const p = this.board[r][c];
                if (!p) continue;
                const pc = this.pieceColors[r][c];
                if (pc !== opponent) continue;
                if (this.canPieceAttack(p, pc, r, c, targetRow, targetCol)) {
                    return true;
                }
            }
        }
        return false;
    }

    // 纯攻击判定：用于将军检测的到达能力判断（包含路径阻挡规则）

    isMoveLeavingKingInCheck(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        const color = this.pieceColors[fromRow][fromCol];
        if (!piece || !color) return false;

        const capturedPiece = this.board[toRow][toCol];
        const capturedColor = this.pieceColors[toRow][toCol];

        // 临时落子
        this.board[toRow][toCol] = piece;
        this.pieceColors[toRow][toCol] = color;
        this.board[fromRow][fromCol] = null;
        this.pieceColors[fromRow][fromCol] = null;

        const inCheck = this.isKingInCheck(color);

        // 还原
        this.board[fromRow][fromCol] = piece;
        this.pieceColors[fromRow][fromCol] = color;
        this.board[toRow][toCol] = capturedPiece;
        this.pieceColors[toRow][toCol] = capturedColor;

        return inCheck;
    }

    // 某方是否至少存在一步合法走法

    isLegalMove(fromRow, fromCol, toRow, toCol) {
        if (!this.isValidMove(fromRow, fromCol, toRow, toCol)) return false;
        return !this.isMoveLeavingKingInCheck(fromRow, fromCol, toRow, toCol);
    }

    // 模拟落子后判断本方将帅是否处于被将军状态（临时改动棋盘后还原）

    getValidMoves(fromRow, fromCol) {
        if (typeof fromRow === 'object') { fromCol = fromRow.col; fromRow = fromRow.row; }
        const moves = [];
        for (let toRow = 0; toRow < 10; toRow++) {
            for (let toCol = 0; toCol < 9; toCol++) {
                if (this.isLegalMove(fromRow, fromCol, toRow, toCol)) {
                    moves.push({ row: toRow, col: toCol });
                }
            }
        }

        return moves;
    }

    // 判断某步是否真正合法：走法合法且走后本方将帅不被将军（禁止送将/自将）

    hasAnyLegalMove(color) {
        for (let r = 0; r < 10; r++) {
            for (let c = 0; c < 9; c++) {
                if (this.board[r][c] && this.pieceColors[r][c] === color) {
                    if (this.getValidMoves(r, c).length > 0) return true;
                }
            }
        }
        return false;
    }

    // 点击交互：坐标换算、选子与落子、合法性校验与重绘

    getAllLegalMoves(color = this.currentPlayer) {
        const moves = [];
        for (let row = 0; row < 10; row++) for (let col = 0; col < 9; col++) {
            if (this.board[row][col] && this.pieceColors[row][col] === color)
                for (const to of this.getValidMoves({row, col})) moves.push({from: {row, col}, to});
        }
        return moves;
    }
    applyMove(from, to) {
        const piece = this.board[from.row]?.[from.col];
        if (!piece || this.pieceColors[from.row][from.col] !== this.currentPlayer ||
            !this.isLegalMove(from.row, from.col, to.row, to.col)) throw new Error('Illegal move');
        this.moveHistory.push({from: {...from}, to: {...to}, piece,
            player: this.currentPlayer, fromColor: this.pieceColors[from.row][from.col],
            capturedPiece: this.board[to.row][to.col], capturedColor: this.pieceColors[to.row][to.col]});
        this.board[to.row][to.col] = piece;
        this.pieceColors[to.row][to.col] = this.pieceColors[from.row][from.col];
        this.board[from.row][from.col] = null;
        this.pieceColors[from.row][from.col] = null;
        this.currentPlayer = this.currentPlayer === 'red' ? 'black' : 'red';
    }
    undoMove() {
        const move = this.moveHistory.pop();
        if (!move) return false;
        this.board[move.from.row][move.from.col] = move.piece;
        this.pieceColors[move.from.row][move.from.col] = move.fromColor;
        this.board[move.to.row][move.to.col] = move.capturedPiece;
        this.pieceColors[move.to.row][move.to.col] = move.capturedColor;
        this.currentPlayer = move.player;
        return true;
    }
    evaluateGameState() {
        if (!this.findKing('red')) return {status: 'black_wins', reason: 'captured', inCheck: false};
        if (!this.findKing('black')) return {status: 'red_wins', reason: 'captured', inCheck: false};
        const inCheck = this.isKingInCheck(this.currentPlayer);
        if (!this.hasAnyLegalMove(this.currentPlayer)) return {
            status: this.currentPlayer === 'red' ? 'black_wins' : 'red_wins',
            reason: inCheck ? 'checkmate' : 'stalemate', inCheck};
        return {status: 'playing', reason: null, inCheck};
    }
    clone() {
        const copy = new XiangqiGame();
        copy.board = this.board.map(row => row.slice());
        copy.pieceColors = this.pieceColors.map(row => row.slice());
        copy.currentPlayer = this.currentPlayer;
        copy.moveHistory = this.moveHistory.map(move => ({...move, from: {...move.from}, to: {...move.to}}));
        return copy;
    }
}
if (typeof module !== 'undefined' && module.exports) module.exports = {XiangqiGame};
