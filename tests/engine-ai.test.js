const {test}=require('node:test');
const assert=require('node:assert/strict');
const {XiangqiGame}=require('../engine.js');
const {XiangqiAI}=require('../ai.js');
function empty(side='red') {const g=new XiangqiGame();g.board=Array.from({length:10},()=>Array(9).fill(null));g.pieceColors=g.board.map(r=>r.slice());g.currentPlayer=side;return g;}
function put(g,r,c,p,color){g.board[r][c]=p;g.pieceColors[r][c]=color;return g;}
function kings(){return put(put(empty(),9,4,'帥','red'),0,4,'將','black');}
function mate(side='black',stalemate=false){const g=empty(side);put(g,0,4,'將','black');put(g,9,3,'帥','red');put(g,2,3,'車','red');put(g,2,5,'車','red');put(g,stalemate?1:2,stalemate?0:4,'車','red');return g;}
test('01 initial position has 44 red legal moves',()=>assert.equal(new XiangqiGame().getAllLegalMoves('red').length,44));
test('02 flying generals attack each other',()=>{const g=kings();assert.ok(g.isKingInCheck('red'));assert.ok(g.isKingInCheck('black'));});
test('03 flying generals blocked',()=>{const g=put(kings(),5,4,'兵','red');assert.equal(g.isKingInCheck('red'),false);});
test('04 exposing flying generals is illegal',()=>{const g=put(kings(),5,4,'車','red');assert.equal(g.isLegalMove(5,4,5,3),false);});
test('05 pinned piece cannot expose king',()=>{const g=empty();put(g,9,4,'帥','red');put(g,0,3,'將','black');put(g,0,4,'車','black');put(g,7,4,'車','red');assert.equal(g.isLegalMove(7,4,7,5),false);});
test('06 check may be blocked',()=>{const g=empty();put(g,9,4,'帥','red');put(g,0,3,'將','black');put(g,0,4,'車','black');put(g,7,3,'車','red');assert.ok(g.isLegalMove(7,3,7,4));});
test('07 horse leg',()=>{const g=new XiangqiGame();assert.ok(g.isValidMove(9,1,7,2));put(g,8,1,'兵','red');assert.equal(g.isValidMove(9,1,7,2),false);});
test('08 elephant eye and river',()=>{const g=new XiangqiGame();assert.ok(g.isValidMove(9,2,7,4));put(g,8,3,'兵','red');assert.equal(g.isValidMove(9,2,7,4),false);const h=put(empty(),5,2,'相','red');assert.equal(h.isValidMove(5,2,3,4),false);});
test('09 cannon needs one screen for capture',()=>{const g=empty();put(g,5,0,'炮','red');put(g,5,4,'車','black');assert.equal(g.isValidMove(5,0,5,4),false);put(g,5,2,'兵','red');assert.ok(g.isValidMove(5,0,5,4));put(g,5,3,'卒','black');assert.equal(g.isValidMove(5,0,5,4),false);});
test('10 pawn crossing and no retreat',()=>{const g=put(empty(),6,0,'兵','red');assert.equal(g.isValidMove(6,0,6,1),false);put(g,4,0,'兵','red');assert.ok(g.isValidMove(4,0,4,1));assert.equal(g.isValidMove(4,0,5,0),false);});
test('11 checkmate',()=>assert.deepEqual(mate().evaluateGameState(),{status:'red_wins',reason:'checkmate',inCheck:true}));
test('12 stalemate loses',()=>assert.deepEqual(mate('black',true).evaluateGameState(),{status:'red_wins',reason:'stalemate',inCheck:false}));
test('13 missing king captured',()=>{const g=new XiangqiGame();g.board[0][4]=null;assert.equal(g.evaluateGameState().reason,'captured');assert.equal(g.evaluateGameState().status,'red_wins');});
test('14 black checkmate mirrors red',()=>{const original=mate();const g=empty('red');for(let r=0;r<10;r++)for(let c=0;c<9;c++)if(original.board[r][c]){const p=original.board[r][c];put(g,9-r,c,p==='將'?'帥':p==='帥'?'將':p,original.pieceColors[r][c]==='red'?'black':'red');}assert.equal(g.evaluateGameState().status,'black_wins');assert.equal(g.evaluateGameState().reason,'checkmate');});
test('continuous undo restores exact state and clone is independent',()=>{const g=new XiangqiGame(),before=JSON.stringify(g);g.applyMove({row:6,col:0},{row:5,col:0});g.applyMove({row:3,col:0},{row:4,col:0});g.applyMove({row:5,col:0},{row:4,col:0});const clone=g.clone();clone.undoMove();assert.equal(g.moveHistory.length,3);assert.ok(g.undoMove());assert.ok(g.undoMove());assert.ok(g.undoMove());assert.equal(JSON.stringify(g),before);assert.equal(g.undoMove(),false);});
test('AI both colors return legal moves without mutating input and yield during search',async()=>{const ai=new XiangqiAI(),g=new XiangqiGame();let ticks=0;const timer=setInterval(()=>ticks++,5);try{for(let i=0;i<8;i++){const before=JSON.stringify(g);const m=await ai.getBestMove(g,i%2?'medium':'easy',null,{timeLimit:80});assert.equal(JSON.stringify(g),before);assert.ok(m);assert.ok(g.isLegalMove(m.from.row,m.from.col,m.to.row,m.to.col));g.applyMove(m.from,m.to);}assert.ok(ticks>3);}finally{clearInterval(timer);}});
test('AI captures and finishes forced winning positions for both colors',async()=>{for(const side of ['red','black']){const g=empty(side);const red=side==='red';put(g,red?9:0,3,red?'帥':'將',side);put(g,red?0:9,4,red?'將':'帥',red?'black':'red');put(g,red?2:7,4,'車',side);const move=await new XiangqiAI().getBestMove(g,'medium',null,{timeLimit:300});assert.ok(g.isLegalMove(move.from.row,move.from.col,move.to.row,move.to.col));g.applyMove(move.from,move.to);assert.equal(g.evaluateGameState().status,side+'_wins');}});
test('AI cancellation discards result',async()=>{const controller=new AbortController();const pending=new XiangqiAI().getBestMove(new XiangqiGame(),'hard',null,{signal:controller.signal});setTimeout(()=>controller.abort(),10);assert.equal(await pending,null);});
