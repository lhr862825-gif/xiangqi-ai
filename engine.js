// Piece glyphs remain Unicode strings to preserve the original rule representation.
class XiangqiGame {
    constructor() { this.initializeBoard(); }
    // Reset the original starting position, side to move and undo stack.
    initializeBoard() {
        this.currentPlayer = 'red';
        this.moveHistory = [];
        this.board = [
            ['\u8eca', '\u99ac', '\u8c61', '\u58eb', '\u5c07', '\u58eb', '\u8c61', '\u99ac', '\u8eca'],
            [null, null, null, null, null, null, null, null, null],
            [null, '\u70ae', null, null, null, null, null, '\u70ae', null],
            ['\u5352', null, '\u5352', null, '\u5352', null, '\u5352', null, '\u5352'],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            ['\u5175', null, '\u5175', null, '\u5175', null, '\u5175', null, '\u5175'],
            [null, '\u70ae', null, null, null, null, null, '\u70ae', null],
            [null, null, null, null, null, null, null, null, null],
            ['\u8eca', '\u99ac', '\u76f8', '\u4ed5', '\u5e25', '\u4ed5', '\u76f8', '\u99ac', '\u8eca']
        ];

        this.pieceColors = [];
        for (let row = 0; row < 10; row++) {
            this.pieceColors[row] = [];
            for (let col = 0; col < 9; col++) {
                this.pieceColors[row][col] = row <= 4 ? 'black' : 'red';
            }
        }
    }

    // Locate the general for the requested side.
    findKing(color) {
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 9; col++) {
                const piece = this.board[row][col];
                if ((piece === '\u5c07' || piece === '\u5e25') && this.pieceColors[row][col] === color) {
                    return { row, col };
                }
            }
        }
        return null;
    }

    // Check piece movement and blocking rules without testing self-check.
    isValidMove(fromRow, fromCol, toRow, toCol) {
        if (toRow < 0 || toRow > 9 || toCol < 0 || toCol > 8) return false;

        const piece = this.board[fromRow][fromCol];
        const targetPiece = this.board[toRow][toCol];
        const pieceColor = this.pieceColors[fromRow][fromCol];

        if (targetPiece && this.pieceColors[toRow][toCol] === pieceColor) return false;

        const rowDiff = toRow - fromRow;
        const colDiff = toCol - fromCol;

        switch (piece) {
            case '\u5175': // Red soldier

            case '\u5352': // Black soldier

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

            case '\u70ae': // Cannon

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

            case '\u8eca': // Chariot (rook)

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

            case '\u99ac': // Horse

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

            case '\u8c61': // Black elephant

            case '\u76f8': // Red elephant

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

            case '\u58eb': // Black advisor

            case '\u4ed5': // Red advisor

                if (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 1) {
                    if (pieceColor === 'red') {
                        return toRow >= 7 && toCol >= 3 && toCol <= 5;
                    } else {
                        return toRow <= 2 && toCol >= 3 && toCol <= 5;
                    }
                }
                return false;

            case '\u5c07': // Black general

            case '\u5e25': // Red general

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



    // Check attacks, including the flying-generals rule.
    canPieceAttack(piece, color, fromRow, fromCol, toRow, toCol) {
        const targetPiece = this.board[toRow][toCol];
        const rowDiff = toRow - fromRow;
        const colDiff = toCol - fromCol;
        if (targetPiece && this.pieceColors[toRow][toCol] === color) return false;

        switch (piece) {
            case '\u8eca': // Chariot (rook)
 {
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
            case '\u70ae': // Cannon
{
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
            case '\u99ac': // Horse
 {
                if ((Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 1) ||
                    (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 2)) {
                    let blockRow, blockCol;
                    if (Math.abs(rowDiff) === 2) { blockRow = fromRow + (rowDiff > 0 ? 1 : -1); blockCol = fromCol; }
                    else { blockRow = fromRow; blockCol = fromCol + (colDiff > 0 ? 1 : -1); }
                    return !this.board[blockRow][blockCol];
                }
                return false;
            }
            case '\u8c61': // Black elephant

            case '\u76f8': // Red elephant
 {
                if (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 2) {
                    const midR = fromRow + rowDiff / 2;
                    const midC = fromCol + colDiff / 2;
                    if (this.board[midR][midC]) return false;
                    if (color === 'red') return toRow >= 5; else return toRow <= 4;
                }
                return false;
            }
            case '\u58eb': // Black advisor

            case '\u4ed5': // Red advisor
 {
                if (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 1) {
                    if (color === 'red') return toRow >= 7 && toCol >= 3 && toCol <= 5;
                    else return toRow <= 2 && toCol >= 3 && toCol <= 5;
                }
                return false;
            }
            case '\u5c07': // Black general

            case '\u5e25': // Red general
 {
                if (Math.abs(rowDiff) + Math.abs(colDiff) === 1) {
                    if (color === 'red') return toRow >= 7 && toCol >= 3 && toCol <= 5;
                    else return toRow <= 2 && toCol >= 3 && toCol <= 5;
                }

                if (colDiff === 0 && rowDiff !== 0 && targetPiece && (targetPiece === '\u5c07' || targetPiece === '\u5e25')) {
                    const start = Math.min(fromRow, toRow) + 1;
                    const end = Math.max(fromRow, toRow);
                    for (let r = start; r < end; r++) {
                        if (this.board[r][fromCol]) return false;
                    }
                    return true;
                }
                return false;
            }
            case '\u5175': // Red soldier

            case '\u5352': // Black soldier
 {
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

    // Detect whether an opposing piece attacks this general.
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



    // Temporarily apply a move and restore the exact board after checking king safety.
    isMoveLeavingKingInCheck(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        const color = this.pieceColors[fromRow][fromCol];
        if (!piece || !color) return false;

        const capturedPiece = this.board[toRow][toCol];
        const capturedColor = this.pieceColors[toRow][toCol];


        this.board[toRow][toCol] = piece;
        this.pieceColors[toRow][toCol] = color;
        this.board[fromRow][fromCol] = null;
        this.pieceColors[fromRow][fromCol] = null;

        const inCheck = this.isKingInCheck(color);


        this.board[fromRow][fromCol] = piece;
        this.pieceColors[fromRow][fromCol] = color;
        this.board[toRow][toCol] = capturedPiece;
        this.pieceColors[toRow][toCol] = capturedColor;

        return inCheck;
    }



    // Reject moves that leave the moving side in check.
    isLegalMove(fromRow, fromCol, toRow, toCol) {
        if (!this.isValidMove(fromRow, fromCol, toRow, toCol)) return false;
        return !this.isMoveLeavingKingInCheck(fromRow, fromCol, toRow, toCol);
    }



    // List legal destinations without changing UI state.
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



    // Determine whether a side has any legal move.
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



    // Enumerate legal moves for AI search.
    getAllLegalMoves(color = this.currentPlayer) {
        const moves = [];
        for (let row = 0; row < 10; row++) for (let col = 0; col < 9; col++) {
            if (this.board[row][col] && this.pieceColors[row][col] === color)
                for (const to of this.getValidMoves({row, col})) moves.push({from: {row, col}, to});
        }
        return moves;
    }
    // Validate and commit one move, recording all state required to undo it.
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
    // Restore the latest move; repeated calls unwind the full history.
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
    // Return terminal status, reason and check state without touching the DOM.
    evaluateGameState() {
        if (!this.findKing('red')) return {status: 'black_wins', reason: 'captured', inCheck: false};
        if (!this.findKing('black')) return {status: 'red_wins', reason: 'captured', inCheck: false};
        const inCheck = this.isKingInCheck(this.currentPlayer);
        if (!this.hasAnyLegalMove(this.currentPlayer)) return {
            status: this.currentPlayer === 'red' ? 'black_wins' : 'red_wins',
            reason: inCheck ? 'checkmate' : 'stalemate', inCheck};
        return {status: 'playing', reason: null, inCheck};
    }
    // Copy mutable state so AI search cannot change the live game.
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
