class XiangqiAI {
    static values = {'車':900, '炮':450, '馬':400, '象':200, '相':200, '士':200, '仕':200, '兵':100, '卒':100, '將':10000, '帥':10000};
    // Tables use red's orientation; black reads the mirrored row.
    static tables = Object.fromEntries(Object.keys(XiangqiAI.values).map(piece => [piece,
        Array.from({length:10}, (_, row) => Array.from({length:9}, (_, col) => {
            const center = 4 - Math.abs(4-col), advance = 9-row;
            if ('兵卒'.includes(piece)) return advance*8 + center*5;
            if (piece === '馬') return center*12 + Math.min(row,9-row)*8;
            if (piece === '車') return center*5 + advance*3;
            if (piece === '炮') return center*8 + Math.min(row,9-row)*4;
            if ('相象'.includes(piece)) return center*4 + (row >= 5 ? 8 : 0);
            if ('仕士'.includes(piece)) return col === 4 ? 12 : 4;
            return row >= 7 ? (col === 4 ? 8 : 0) : -30;
        }))]));
    evaluate(game) {
        let score = 0;
        for (let r=0;r<10;r++) for (let c=0;c<9;c++) {
            const piece=game.board[r][c]; if (!piece) continue;
            const red=game.pieceColors[r][c]==='red';
            let value=XiangqiAI.values[piece]+XiangqiAI.tables[piece][red?r:9-r][c];
            if ('兵卒'.includes(piece) && (red?r<=4:r>=5)) value+=100;
            score += red?value:-value;
        }
        return score;
    }
    async getBestMove(gameState, difficulty='medium', onProgress, options={}) {
        const settings={easy:{depth:2,time:500},medium:{depth:4,time:1000},hard:{depth:6,time:1500}};
        const setting=settings[difficulty] || settings.medium;
        const game=gameState.clone();
        const now=()=>performance.now();
        const deadline=now()+(options.timeLimit ?? setting.time);
        let lastYield=now(), nodes=0;
        const timeout={};
        const checkpoint=async(force=false)=>{
            if (options.signal?.aborted || now()>=deadline) throw timeout;
            if (force || now()-lastYield>=8) {
                await new Promise(resolve=>setTimeout(resolve,0)); lastYield=now();
                if (options.signal?.aborted || now()>=deadline) throw timeout;
            }
        };
        const order=(moves, preferred)=>moves.sort((a,b)=>{
            const rank=m=>{
                const victim=game.board[m.to.row][m.to.col];
                const attacker=game.board[m.from.row][m.from.col];
                const pv=preferred && m.from.row===preferred.from.row && m.from.col===preferred.from.col && m.to.row===preferred.to.row && m.to.col===preferred.to.col;
                return (pv?1000000:0)+(victim?100000+10*XiangqiAI.values[victim]-XiangqiAI.values[attacker]:0);
            }; return rank(b)-rank(a);
        });
        const path=new Set();
        const key=()=>game.currentPlayer+game.board.map((row,r)=>row.map((p,c)=>p?(game.pieceColors[r][c]==='red'?'r':'b')+p:'.').join('')).join('/');
        const search=async(depth,alpha,beta,ply)=>{
            nodes++; await checkpoint();
            if (!game.findKing(game.currentPlayer)) return -100000+ply;
            if (!game.findKing(game.currentPlayer==='red'?'black':'red')) return 100000-ply;
            const position=key(); if (path.has(position)) return 0;
            const moves=order(game.getAllLegalMoves());
            if (!moves.length) return -100000+ply;
            if (depth===0) return this.evaluate(game)*(game.currentPlayer==='red'?1:-1);
            path.add(position);
            let best=-Infinity;
            try { for (const move of moves) {
                game.applyMove(move.from,move.to);
                let score;
                try { score=-await search(depth-1,-beta,-alpha,ply+1); }
                finally { game.undoMove(); }
                best=Math.max(best,score);alpha=Math.max(alpha,score);
                if(alpha>=beta) break;
            }} finally {path.delete(position);}
            return best;
        };
        const initial=game.evaluateGameState();
        if(initial.status!=='playing') return null;
        const rootMoves=order(game.getAllLegalMoves());
        let bestMove=rootMoves[0];
        for(let depth=1;depth<=setting.depth;depth++) {
            try {
                await checkpoint(true);
                const candidates=[]; let alpha=-Infinity;
                for(const move of order(rootMoves.slice(),bestMove)) {
                    game.applyMove(move.from,move.to);
                    let score;
                    try { score=-await search(depth-1,-Infinity,difficulty==='easy'?Infinity:-alpha,1); }
                    finally {game.undoMove();}
                    candidates.push({move,score}); alpha=Math.max(alpha,score);
                }
                candidates.sort((a,b)=>b.score-a.score);
                bestMove=candidates[0].move;
                if(difficulty==='easy') {
                    const close=candidates.filter(c=>c.score>=candidates[0].score-25);
                    bestMove=close[Math.floor(Math.random()*close.length)].move;
                }
                onProgress?.({depth,nodes,score:candidates[0].score});
                if(Math.abs(candidates[0].score)>99000) break;
            } catch(error) {if(error!==timeout) throw error;break;}
        }
        if(options.signal?.aborted) return null;
        return {from:{...bestMove.from},to:{...bestMove.to}};
    }
}
if(typeof module!=='undefined' && module.exports) module.exports={XiangqiAI};
