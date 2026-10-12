class PieceSpriteCache {
    constructor(dpr) { this.dpr=dpr; this.cache=new Map(); }
    get(piece,color,cellSize) {
        const key=piece+':'+color+':'+cellSize;
        if(this.cache.has(key)) return this.cache.get(key);
        const size=cellSize+24, canvas=document.createElement('canvas');
        canvas.width=Math.round(size*this.dpr); canvas.height=Math.round(size*this.dpr);
        this.ctx=canvas.getContext('2d'); this.ctx.setTransform(this.dpr,0,0,this.dpr,0,0);
        const x=size/2,y=size/2,radius=Math.max(20,Math.floor(cellSize*.38)),innerRadius=Math.floor(radius*.86);
        const ringColor = '#8b6e3b';
        const ringDark = '#6f5632';
        const ivoryLight = '#fffaf0';
        const ivoryMid = '#f3e6c9';
        const ivoryDark = '#e0d5b8';
        const textColor = color === 'red' ? '#c62828' : '#2c3e50';

        // 基础圆盘：径向渐变填充
        this.ctx.save();
        const baseGrad = this.ctx.createRadialGradient(
            x - radius * 0.25, y - radius * 0.25, radius * 0.2,
            x, y, radius
        );

            baseGrad.addColorStop(0, ivoryLight);
            baseGrad.addColorStop(0.6, ivoryMid);
            baseGrad.addColorStop(1, ivoryDark);

        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = baseGrad;
        this.ctx.fill();

        // 外圈描边：双层木纹色对比
        this.ctx.lineWidth = Math.max(2, Math.floor(radius * 0.12));
        this.ctx.strokeStyle = ringDark;
        this.ctx.stroke();
        this.ctx.lineWidth = Math.max(1, Math.floor(radius * 0.06));
        this.ctx.strokeStyle = ringColor;
        this.ctx.stroke();

        // 内嵌圆盘：形成倒角层次
        const insetGrad = this.ctx.createRadialGradient(
            x, y - innerRadius * 0.35, innerRadius * 0.1,
            x, y, innerRadius
        );
        insetGrad.addColorStop(0, '#ffffff');
        insetGrad.addColorStop(0.5, ivoryLight);
        insetGrad.addColorStop(1, ivoryMid);
        this.ctx.beginPath();
        this.ctx.arc(x, y, innerRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = insetGrad;
        this.ctx.fill();

        // 高光亮斑
        this.ctx.beginPath();
        this.ctx.arc(x - radius * 0.25, y - radius * 0.25, radius * 0.55, Math.PI * 0.1, Math.PI * 0.7);
        this.ctx.strokeStyle = 'rgba(255,255,255,0.35)';
        this.ctx.lineWidth = Math.max(1, Math.floor(radius * 0.05));
        this.ctx.stroke();

        this.ctx.restore();

        // 棋子文字：轻微浮雕（填充+描边）
        this.ctx.save();
        this.ctx.fillStyle = textColor;
        this.ctx.font = `bold ${Math.floor(radius * 0.85)}px KaiTi, 楷体, Microsoft YaHei`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        // 细微阴影增强层次
        this.ctx.shadowColor = 'rgba(0,0,0,0.15)';
        this.ctx.shadowBlur = 1;
        this.ctx.shadowOffsetX = 1;
        this.ctx.shadowOffsetY = 1;
        this.ctx.fillText(piece, x, y);
        // 文字细描边增强清晰度
        this.ctx.lineWidth = Math.max(1, Math.floor(radius * 0.08));
        this.ctx.strokeStyle = 'rgba(0,0,0,0.25)';
        this.ctx.strokeText(piece, x, y);
        this.ctx.restore();
        const sprite={canvas,size}; this.cache.set(key,sprite); return sprite;
    }
}

class ChineseChess {
    constructor() {
        this.canvas = document.getElementById('chess-board');
        this.ctx = this.canvas.getContext('2d');
        this.cellSize = 60;
        this.boardOffset = 60;
        this.i18n = new XiangqiI18n();
        this.aiDepth = null;
        this.aiError = false;
        this.game = new XiangqiGame();
        this.mode = document.getElementById('game-mode').value;
        this.humanSide = 'red';
        this.ai = new XiangqiAI();
        this.aiThinking = false;
        this.busy = false;
        this.generation = 0;
        this.dpr = window.devicePixelRatio || 1;
        this.logicalWidth = 600; this.logicalHeight = 680;
        this.canvas.width = Math.round(600*this.dpr);
        this.canvas.height = Math.round(680*this.dpr);
        this.ctx.setTransform(this.dpr,0,0,this.dpr,0,0);
        this.spriteCache = new PieceSpriteCache(this.dpr);
        this.selectedPiece = null;
        this.gameStatus = 'playing';
        this.hoveredPiece = null;
        // 动画配置
        this.animationsEnabled = true;
        this.animationDuration = 150; // 毫秒
        this.animatingFrom = null;

        // 离屏静态棋盘层：背景、棋盘格、楚河汉界等只渲染一次，避免每帧重复绘制造成卡顿
        this.bgImage = null;
        this.staticLayer = document.createElement('canvas');
        this.staticLayer.width = this.canvas.width;
        this.staticLayer.height = this.canvas.height;
        this.staticLayerCtx = this.staticLayer.getContext('2d');
        this.staticLayerCtx.setTransform(this.dpr,0,0,this.dpr,0,0);

        this.setupEventListeners();
        this.loadBackground();
        this.updateGameInfo();
        this.triggerAi();
    }

    setupEventListeners() {
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        document.getElementById('new-game').addEventListener('click', () => this.newGame());
        document.getElementById('undo-move').addEventListener('click', () => this.undoMove());
        document.getElementById('game-mode').addEventListener('change', () => this.newGame());
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        document.getElementById('language').addEventListener('change', (e) => this.changeLanguage(e.target.value));
        const rulesDialog = document.getElementById('rules-dialog');
        document.getElementById('show-rules').addEventListener('click', () => rulesDialog.showModal());
        document.getElementById('difficulty').addEventListener('change', () => {
            if (this.aiThinking) { this.cancelPending(); this.triggerAi(); }
        });
    }

    loadBackground() {
        const bg = new Image();
        bg.onload = () => {
            this.bgImage = bg;
            this.renderStaticLayer();
            this.redraw();
        };
        bg.onerror = () => {
            this.bgImage = null;
            this.renderStaticLayer();
            this.redraw();
        };
        bg.src = 'images/wood-texture-chessboard.jpg';
        // 图片未加载完成前先用纯色兜底，保证棋盘立即显示
        this.renderStaticLayer();
        this.redraw();
    }

    // 一次性渲染静态棋盘层：背景图、棋盘底色、格线、宫、楚河汉界、兵炮位标记

    renderStaticLayer() {
        const ctx = this.staticLayerCtx;
        ctx.clearRect(0, 0, this.logicalWidth, this.logicalHeight);

        if (this.bgImage) {
            ctx.drawImage(this.bgImage, 0, 0, this.logicalWidth, this.logicalHeight);
        } else {
            ctx.fillStyle = '#deb887';
            ctx.fillRect(0, 0, this.logicalWidth, this.logicalHeight);
        }

        ctx.fillStyle = '#fef9e7';
        ctx.fillRect(this.boardOffset - 15, this.boardOffset - 15,
                     8 * this.cellSize + 30, 9 * this.cellSize + 30);

        ctx.strokeStyle = '#8b4513';
        ctx.lineWidth = 2;
        for (let i = 0; i < 10; i++) {
            ctx.beginPath();
            ctx.moveTo(this.boardOffset, this.boardOffset + i * this.cellSize);
            ctx.lineTo(this.boardOffset + 8 * this.cellSize, this.boardOffset + i * this.cellSize);
            ctx.stroke();
        }

        for (let i = 0; i < 9; i++) {
            if (i === 0 || i === 8) {
                ctx.beginPath();
                ctx.moveTo(this.boardOffset + i * this.cellSize, this.boardOffset);
                ctx.lineTo(this.boardOffset + i * this.cellSize, this.boardOffset + 9 * this.cellSize);
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(this.boardOffset + i * this.cellSize, this.boardOffset);
                ctx.lineTo(this.boardOffset + i * this.cellSize, this.boardOffset + 4 * this.cellSize);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(this.boardOffset + i * this.cellSize, this.boardOffset + 5 * this.cellSize);
                ctx.lineTo(this.boardOffset + i * this.cellSize, this.boardOffset + 9 * this.cellSize);
                ctx.stroke();
            }
        }

        // 复用宫、楚河汉界、兵炮位标记的绘制逻辑，临时把目标上下文切到静态层
        const prev = this.ctx;
        this.ctx = ctx;
        this.drawPositionMarks();
        this.drawPalace();
        this.drawRiver();
        this.ctx = prev;
    }

    // 把静态层贴到主画布，再叠加动态内容（棋子、可走位置、光标）

    drawBoardRest() {
        this.ctx.drawImage(this.staticLayer, 0, 0, this.logicalWidth, this.logicalHeight);
        this.drawPieces();
        if (this.selectedPiece) this.drawValidMoves();
        this.drawCursorHighlight();
    }

    // 统一重绘入口：清屏 + 静态层 + 动态层

    redraw() {
        this.clearCanvas();
        this.drawBoardRest();
    }

    drawPalace() {
        this.ctx.strokeStyle = '#8b4513';
        this.ctx.lineWidth = 2;

        this.ctx.beginPath();
        this.ctx.moveTo(this.boardOffset + 3 * this.cellSize, this.boardOffset);
        this.ctx.lineTo(this.boardOffset + 5 * this.cellSize, this.boardOffset + 2 * this.cellSize);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(this.boardOffset + 5 * this.cellSize, this.boardOffset);
        this.ctx.lineTo(this.boardOffset + 3 * this.cellSize, this.boardOffset + 2 * this.cellSize);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(this.boardOffset + 3 * this.cellSize, this.boardOffset + 7 * this.cellSize);
        this.ctx.lineTo(this.boardOffset + 5 * this.cellSize, this.boardOffset + 9 * this.cellSize);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(this.boardOffset + 5 * this.cellSize, this.boardOffset + 7 * this.cellSize);
        this.ctx.lineTo(this.boardOffset + 3 * this.cellSize, this.boardOffset + 9 * this.cellSize);
        this.ctx.stroke();
    }

    drawPositionMarks() {
        this.ctx.strokeStyle = '#8b4513';
        this.ctx.lineWidth = 1;

        const blackPawnPositions = [[0, 0], [2, 0], [4, 0], [6, 0], [8, 0]];
        const redPawnPositions = [[0, 9], [2, 9], [4, 9], [6, 9], [8, 9]];

        [...blackPawnPositions, ...redPawnPositions].forEach(([col, row]) => {
            const x = this.boardOffset + col * this.cellSize;
            const y = this.boardOffset + row * this.cellSize;
            const markSize = 6;

            if (col > 0 && row > 0) {
                this.ctx.beginPath();
                this.ctx.moveTo(x - markSize, y);
                this.ctx.lineTo(x, y);
                this.ctx.lineTo(x, y - markSize);
                this.ctx.stroke();
            }
            if (col < 8 && row > 0) {
                this.ctx.beginPath();
                this.ctx.moveTo(x + markSize, y);
                this.ctx.lineTo(x, y);
                this.ctx.lineTo(x, y - markSize);
                this.ctx.stroke();
            }
            if (col > 0 && row < 9) {
                this.ctx.beginPath();
                this.ctx.moveTo(x - markSize, y);
                this.ctx.lineTo(x, y);
                this.ctx.lineTo(x, y + markSize);
                this.ctx.stroke();
            }
            if (col < 8 && row < 9) {
                this.ctx.beginPath();
                this.ctx.moveTo(x + markSize, y);
                this.ctx.lineTo(x, y);
                this.ctx.lineTo(x, y + markSize);
                this.ctx.stroke();
            }
        });

        const cannonPositions = [[1, 2], [7, 2], [1, 7], [7, 7]];
        cannonPositions.forEach(([col, row]) => {
            const x = this.boardOffset + col * this.cellSize;
            const y = this.boardOffset + row * this.cellSize;
            const markSize = 6;

            this.ctx.beginPath();
            this.ctx.moveTo(x - markSize, y);
            this.ctx.lineTo(x, y);
            this.ctx.lineTo(x, y - markSize);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(x + markSize, y);
            this.ctx.lineTo(x, y);
            this.ctx.lineTo(x, y - markSize);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(x - markSize, y);
            this.ctx.lineTo(x, y);
            this.ctx.lineTo(x, y + markSize);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(x + markSize, y);
            this.ctx.lineTo(x, y);
            this.ctx.lineTo(x, y + markSize);
            this.ctx.stroke();
        });
    }

    drawRiver() {
        const gradient = this.ctx.createLinearGradient(0, this.boardOffset + 4 * this.cellSize,
                                                       0, this.boardOffset + 5 * this.cellSize);
        gradient.addColorStop(0, '#e8f8f5');
        gradient.addColorStop(0.5, '#d5f4e6');
        gradient.addColorStop(1, '#e8f8f5');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(this.boardOffset, this.boardOffset + 4 * this.cellSize,
                          8 * this.cellSize, this.cellSize);

        this.ctx.fillStyle = '#2c3e50';
        this.ctx.font = this.i18n.language==='en'?'bold 22px Arial, sans-serif':'bold 28px KaiTi, 楷体, Microsoft YaHei';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        this.ctx.save();
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        this.ctx.shadowBlur = 2;
        this.ctx.shadowOffsetX = 1;
        this.ctx.shadowOffsetY = 1;

        this.ctx.fillText(this.i18n.language==='en'?'Chu River':'楚河', this.boardOffset + 2 * this.cellSize, this.boardOffset + 4.5 * this.cellSize);
        this.ctx.fillText(this.i18n.language==='en'?'Han Border':'汉界', this.boardOffset + 6 * this.cellSize, this.boardOffset + 4.5 * this.cellSize);

        this.ctx.restore();
    }

    // 绘制全盘棋子：遍历棋盘并按当前状态调用 drawPiece

    drawPieces() {
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.game.board[row][col]) {
                    if (this.animatingFrom && this.animatingFrom.row === row && this.animatingFrom.col === col) continue;
                    this.drawPiece(row, col, this.game.board[row][col], this.game.pieceColors[row][col]);
                }
            }
        }
    }

    // 绘制单个棋子：位置计算、圆盘渐变、双层描边、文字与选中/悬停高亮

    drawPiece(row,col,piece,color,opts={}) {
        const x=opts.x ?? this.boardOffset+col*this.cellSize;
        const y=opts.y ?? this.boardOffset+row*this.cellSize;
        const sprite=this.spriteCache.get(piece,color,this.cellSize);
        this.ctx.drawImage(sprite.canvas,x-sprite.size/2,y-sprite.size/2,sprite.size,sprite.size);
        const selected=!opts.skipGlow && this.selectedPiece?.row===row && this.selectedPiece?.col===col;
        if(selected && color === this.game.currentPlayer && (this.mode === 'pvp' || color === this.humanSide)) {
            this.ctx.save(); this.ctx.beginPath();
            this.ctx.arc(x,y,Math.max(20,Math.floor(this.cellSize*.38))+2,0,2*Math.PI);
            this.ctx.lineWidth=2; this.ctx.strokeStyle='rgba(255,215,0,.9)';
            this.ctx.shadowColor='rgba(255,215,0,.6)';
            this.ctx.shadowBlur=8; this.ctx.stroke();this.ctx.restore();
        }
    }

    drawValidMoves() {
        if (!this.selectedPiece || this.gameStatus !== 'playing') return;
        const { row: fromRow, col: fromCol } = this.selectedPiece;
        const moves = this.game.getValidMoves(fromRow, fromCol);

        // 以更柔和的中性色高亮：空位为淡圆点、可吃为细环
        moves.forEach(({ row: toRow, col: toCol }) => {
            const x = this.boardOffset + toCol * this.cellSize;
            const y = this.boardOffset + toRow * this.cellSize;
            const targetPiece = this.game.board[toRow][toCol];
            this.ctx.save();
            if (!targetPiece) {
                this.ctx.beginPath();
                this.ctx.arc(x, y, Math.max(8, Math.floor(this.cellSize * 0.18)), 0, 2 * Math.PI);
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
                this.ctx.fill();
            } else {
                this.ctx.beginPath();
                this.ctx.arc(x, y, Math.max(16, Math.floor(this.cellSize * 0.28)), 0, 2 * Math.PI);
                this.ctx.strokeStyle = 'rgba(198, 40, 40, 0.35)';
                this.ctx.lineWidth = 3;
                this.ctx.stroke();
            }
            this.ctx.restore();
        });
    }

    // 键盘光标高亮：以虚线环标示当前键盘位置

    drawCursorHighlight() {
        if (!this.keyboardCursor) return;
        const { row, col } = this.keyboardCursor;
        if (row < 0 || row > 9 || col < 0 || col > 8) return;
        const x = this.boardOffset + col * this.cellSize;
        const y = this.boardOffset + row * this.cellSize;
        const r = Math.max(22, Math.floor(this.cellSize * 0.36));
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(0,0,0,0.25)';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 4]);
        this.ctx.stroke();
        this.ctx.restore();
    }

    // 键盘操作：方向键移动光标、回车/空格选子或落子；H 切换高对比；+- 调整字体

    handleKeydown(e) {
        if (document.getElementById('rules-dialog').open || !this.canHumanInput() || /SELECT|BUTTON|INPUT/.test(e.target?.tagName || '')) return;
        const key = e.key;
        const ensureCursor = () => {
            if (!this.keyboardCursor) {
                for (let r = 0; r < 10; r++) {
                    for (let c = 0; c < 9; c++) {
                        if (this.game.board[r][c] && this.game.pieceColors[r][c] === this.game.currentPlayer) {
                            this.keyboardCursor = { row: r, col: c };
                            return;
                        }
                    }
                }
                this.keyboardCursor = { row: 9, col: 4 };
            }
        };

        if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight') {
            ensureCursor();
            const { row, col } = this.keyboardCursor;
            if (key === 'ArrowUp') this.keyboardCursor.row = Math.max(0, row - 1);
            if (key === 'ArrowDown') this.keyboardCursor.row = Math.min(9, row + 1);
            if (key === 'ArrowLeft') this.keyboardCursor.col = Math.max(0, col - 1);
            if (key === 'ArrowRight') this.keyboardCursor.col = Math.min(8, col + 1);
            this.clearCanvas();
            this.drawBoardRest();
            if (this.selectedPiece) this.drawValidMoves();
            e.preventDefault();
            return;
        }

        if (key === 'Enter' || key === ' ') {
            ensureCursor();
            const { row, col } = this.keyboardCursor;
            if (!this.selectedPiece) {
                if (this.game.board[row][col] && this.game.pieceColors[row][col] === this.game.currentPlayer) {
                    this.selectedPiece = { row, col };
                    this.game.getValidMoves(row, col);
                    this.clearCanvas();
                    this.drawBoardRest();
                    this.drawValidMoves();
                }
            } else {
                const can = this.game.isLegalMove(this.selectedPiece.row,this.selectedPiece.col,row,col);
                if (can) {
                    this.makeMove(this.selectedPiece.row, this.selectedPiece.col, row, col);
                    this.selectedPiece = null;
                    this.cachedValidMoves = [];
                } else if (this.game.board[row][col] && this.game.pieceColors[row][col] === this.game.currentPlayer) {
                    this.selectedPiece = { row, col };
                    this.game.getValidMoves(row, col);
                    this.clearCanvas();
                    this.drawBoardRest();
                    this.drawValidMoves();
                }
            }
            e.preventDefault();
            return;
        }

        if (key.toLowerCase() === 'h') {
            document.body.classList.toggle('high-contrast');
            e.preventDefault();
            return;
        }
        if (key === '+' || key === '=') {
            const html = document.documentElement;
            const cur = parseFloat(getComputedStyle(html).fontSize) || 16;
            html.style.fontSize = Math.min(22, cur + 1) + 'px';
            e.preventDefault();
            return;
        }
        if (key === '-') {
            const html = document.documentElement;
            const cur = parseFloat(getComputedStyle(html).fontSize) || 16;
            html.style.fontSize = Math.max(12, cur - 1) + 'px';
            e.preventDefault();
            return;
        }
    }

    // 计算某一棋子的所有合法到达点

    handleClick(e) {
        if (!this.canHumanInput()) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * this.logicalWidth / rect.width;
        const y = (e.clientY - rect.top) * this.logicalHeight / rect.height;

        const col = Math.round((x - this.boardOffset) / this.cellSize);
        const row = Math.round((y - this.boardOffset) / this.cellSize);
        const isInColRange = Math.abs(x-(this.boardOffset+col*this.cellSize)) <= this.cellSize/2;
        const isInRowRange = Math.abs(y-(this.boardOffset+row*this.cellSize)) <= this.cellSize/2;

        if (!isInColRange || !isInRowRange || row < 0 || row > 9 || col < 0 || col > 8) return;

        if (this.selectedPiece) {
            if (this.game.isLegalMove(this.selectedPiece.row, this.selectedPiece.col, row, col)) {
                this.makeMove(this.selectedPiece.row, this.selectedPiece.col, row, col);
                this.selectedPiece = null;
            } else {
                if (this.game.board[row][col] && this.game.pieceColors[row][col] === this.game.currentPlayer) {
                    this.selectedPiece = { row, col };
                    this.game.getValidMoves(row, col);
                } else {
                    this.selectedPiece = null;
                    this.cachedValidMoves = [];
                }
                this.clearCanvas();
                this.drawBoardRest();
                if (this.selectedPiece) this.drawValidMoves();
            }
        } else {
            if (this.game.board[row][col] && this.game.pieceColors[row][col] === this.game.currentPlayer) {
                this.selectedPiece = { row, col };
                this.game.getValidMoves(row, col);
            }
            this.clearCanvas();
            this.drawBoardRest();
            if (this.selectedPiece) this.drawValidMoves();
        }
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.logicalWidth, this.logicalHeight);
    }

    // 走法合法性校验：按兵种规则判断

    async makeMove(fromRow,fromCol,toRow,toCol) {
        if(this.busy) return;
        const from={row:fromRow,col:fromCol},to={row:toRow,col:toCol};
        if(!this.game.isLegalMove(fromRow,fromCol,toRow,toCol)) return;
        const generation=this.generation;
        this.busy=true;this.selectedPiece=null;this.cachedValidMoves=[];
        if(this.animationsEnabled) {
            const completed=await new Promise(resolve=>{
                this.animationResolve=resolve;
                this.animateMove(fromRow,fromCol,toRow,toCol,this.game.board[fromRow][fromCol],this.game.pieceColors[fromRow][fromCol],()=>resolve(true));
            });
            if(!completed || generation!==this.generation) return;
            this.animationResolve=null;
        }
        this.game.applyMove(from,to);
        this.busy=false;this.redraw();this.checkGameStatus();this.updateGameInfo();
        if(!this.aiThinking) this.triggerAi();
    }

    animateMove(fromRow, fromCol, toRow, toCol, piece, color, onComplete) {
        const startX = this.boardOffset + fromCol * this.cellSize;
        const startY = this.boardOffset + fromRow * this.cellSize;
        const endX = this.boardOffset + toCol * this.cellSize;
        const endY = this.boardOffset + toRow * this.cellSize;
        const duration = this.animationDuration;
        const startTime = performance.now();
        this.animatingFrom = { row: fromRow, col: fromCol };

        const step = (now) => {
            const t = Math.min(1, (now - startTime) / duration);

            if (t < 1) {
                const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                const x = startX + (endX - startX) * ease;
                const y = startY + (endY - startY) * ease;

                this.clearCanvas();
                this.drawBoardRest();
                this.drawPiece(fromRow, fromCol, piece, color, { x, y, skipGlow: true });
                this.animationFrame=requestAnimationFrame(step);
            } else {
                // 结束帧：先落地更新棋盘再重绘，避免棋子“闪回”起点
                this.animatingFrom = null;
                onComplete();
            }
        };
        this.animationFrame=requestAnimationFrame(step);
    }

    updateGameInfo() {
        document.getElementById('current-turn').textContent =
            this.i18n.t(this.game.currentPlayer === 'red' ? 'redTurn' : 'blackTurn');
        document.getElementById('current-turn').style.color =
            this.game.currentPlayer === 'red' ? '#e74c3c' : '#2c3e50';
    }

    // 局面检测：判断胜负与“被将军”状态，更新状态文本与颜色

    checkGameStatus() {
        const state=this.game.evaluateGameState();this.gameStatus=state.status;
        const element=document.getElementById('game-status');
        if(state.status==='playing') {
            element.textContent=state.inCheck?this.i18n.t(this.game.currentPlayer==='red'?'redCheck':'blackCheck'):'';
            element.style.color=this.game.currentPlayer==='red'?'#e74c3c':'#2c3e50';
        } else {
            const winner=state.status==='red_wins'?'red':'black';
            const reason=this.i18n.t(state.reason);
            element.textContent=this.i18n.t(winner==='red'?'redWin':'blackWin')+' ('+reason+')';
            element.style.color=winner==='red'?'#e74c3c':'#2c3e50';
            this.playWinCeremony(winner);
        }
        return state;
    }

    playWinCeremony(side) {
        if (this.ceremonyPlaying) return;
        this.ceremonyPlaying = true;

        const generation=this.generation;
        const start = performance.now();
        const duration = 800;

        const animate = (now) => {
            if(generation!==this.generation) return;
            const t = Math.min(1, (now - start) / duration);
            const alpha = t; // 简单淡入
            // 在已有棋盘上叠加文本
            this.ctx.save();
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            const cx = this.logicalWidth / 2;
            const cy = this.boardOffset - 28; // 标志位于棋盘上方
            this.ctx.fillRect(cx - 120, cy - 28, 240, 48);
            this.ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            this.ctx.strokeRect(cx - 120, cy - 28, 240, 48);
            this.ctx.fillStyle = side === 'red' ? '#e74c3c' : '#2c3e50';
            this.ctx.font = 'bold 28px KaiTi, 楷体, Microsoft YaHei';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(this.i18n.t(side==='red'?'redBanner':'blackBanner'), cx, cy);
            this.ctx.restore();

            if (t < 1) {
                this.ceremonyFrame=requestAnimationFrame(animate);
            } else {
                this.ceremonyPlaying = false;
            }
        };
        this.ceremonyFrame=requestAnimationFrame(animate);
    }


    // 被将军检测：对方任一棋子能攻击到本方将帅位置（含飞将：将帅照面视为互相攻击）

    newGame() {
        this.cancelPending();
        this.mode=document.getElementById('game-mode').value;
        this.humanSide='red';
        this.game.initializeBoard();this.gameStatus='playing';
        this.selectedPiece=null;this.hoveredPiece=null;this.keyboardCursor=null;this.cachedValidMoves=[];
        this.redraw();this.checkGameStatus();this.updateGameInfo();this.triggerAi();
    }

    undoMove() {
        this.cancelPending();
        if(this.game.undoMove() && this.mode!=='pvp' && this.game.currentPlayer!==this.humanSide && this.game.moveHistory.length) this.game.undoMove();
        this.selectedPiece=null;this.hoveredPiece=null;this.cachedValidMoves=[];
        this.redraw();this.checkGameStatus();this.updateGameInfo();this.triggerAi();
    }
    updateAiStatus() {
        const key=this.aiError?'aiError':this.aiThinking?(this.aiDepth?'thinkingDepth':'thinking'):null;
        document.getElementById('ai-status').textContent=key?this.i18n.t(key,{depth:this.aiDepth}):'';
    }
    changeLanguage(language) {
        this.i18n.setLanguage(language);
        this.updateGameInfo();this.updateAiStatus();
        this.renderStaticLayer();
        if(!this.busy) this.redraw();
        cancelAnimationFrame(this.ceremonyFrame);this.ceremonyPlaying=false;
        this.checkGameStatus();
    }
    canHumanInput() { return this.gameStatus==='playing' && !this.busy && !this.aiThinking && (this.mode==='pvp' || this.game.currentPlayer===this.humanSide); }
    cancelPending() {
        this.generation++;this.searchController?.abort();
        cancelAnimationFrame(this.animationFrame);cancelAnimationFrame(this.ceremonyFrame);
        this.animationResolve?.(false);this.animationResolve=null;
        this.animatingFrom=null;this.busy=false;this.aiThinking=false;this.ceremonyPlaying=false;
        this.aiDepth=null;this.aiError=false;
        this.updateAiStatus();
    }
    async triggerAi() {
        if(this.mode==='pvp' || this.gameStatus!=='playing' || this.game.currentPlayer===this.humanSide || this.aiThinking || this.busy) return;
        const generation=this.generation;
        this.aiThinking=true;this.searchController=new AbortController();
        this.aiDepth=null;this.aiError=false;this.updateAiStatus();
        try {
            const move=await this.ai.getBestMove(this.game,document.getElementById('difficulty').value,
                progress=>{if(generation===this.generation) {this.aiDepth=progress.depth;this.updateAiStatus();}},
                {signal:this.searchController.signal});
            if(generation!==this.generation) return;
            if(move) await this.makeMove(move.from.row,move.from.col,move.to.row,move.to.col);
        } catch(error) {if(generation===this.generation) {this.aiError=true;this.updateAiStatus();console.error(error);}}
        finally {if(generation===this.generation) {this.aiThinking=false;this.updateAiStatus();}}
    }

}
window.addEventListener('load', () => { window.chess = new ChineseChess(); });
