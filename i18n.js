// UI translations are independent of engine state and search.
class XiangqiI18n {
    static messages = {
    "title": {
        "zh": "中国象棋",
        "en": "Xiangqi · Chinese Chess"
    },
    "language": {
        "zh": "语言 / Language",
        "en": "Language / 语言"
    },
    "mode": {
        "zh": "模式",
        "en": "Game mode"
    },
    "aiMode": {
        "zh": "人机（你执红 · AI 执黑）",
        "en": "Play AI (you: Red · AI: Black)"
    },
    "pvpMode": {
        "zh": "双人对弈",
        "en": "Two players"
    },
    "difficulty": {
        "zh": "难度",
        "en": "Difficulty"
    },
    "easy": {
        "zh": "简单",
        "en": "Easy"
    },
    "medium": {
        "zh": "中等",
        "en": "Medium"
    },
    "hard": {
        "zh": "困难",
        "en": "Hard"
    },
    "newGame": {
        "zh": "新游戏",
        "en": "New game"
    },
    "undo": {
        "zh": "悔棋",
        "en": "Undo"
    },
    "rules": {
        "zh": "玩法说明",
        "en": "How to play"
    },
    "closeRules": {
        "zh": "关闭玩法说明",
        "en": "Close instructions"
    },
    "boardLabel": {
        "zh": "中国象棋棋盘",
        "en": "Xiangqi board"
    },
    "redTurn": {
        "zh": "红方走棋",
        "en": "Red to move"
    },
    "blackTurn": {
        "zh": "黑方走棋",
        "en": "Black to move"
    },
    "redCheck": {
        "zh": "红方被将军",
        "en": "Red is in check"
    },
    "blackCheck": {
        "zh": "黑方被将军",
        "en": "Black is in check"
    },
    "redWin": {
        "zh": "红方获胜！",
        "en": "Red wins!"
    },
    "blackWin": {
        "zh": "黑方获胜！",
        "en": "Black wins!"
    },
    "redBanner": {
        "zh": "红方胜",
        "en": "Red wins"
    },
    "blackBanner": {
        "zh": "黑方胜",
        "en": "Black wins"
    },
    "checkmate": {
        "zh": "将死",
        "en": "Checkmate"
    },
    "stalemate": {
        "zh": "困毙",
        "en": "No legal moves"
    },
    "captured": {
        "zh": "将帅被吃",
        "en": "General captured"
    },
    "thinking": {
        "zh": "AI 思考中…",
        "en": "AI is thinking…"
    },
    "thinkingDepth": {
        "zh": "AI 思考中 · 深度 {depth}",
        "en": "AI is thinking · Depth {depth}"
    },
    "aiError": {
        "zh": "AI 搜索失败，请重开或切换模式",
        "en": "AI search failed. Start a new game or switch modes."
    },
    "intro": {
        "zh": "红方先走，双方轮流走一着。点击己方棋子，再点击提示位置即可移动或吃子。",
        "en": "Red moves first, then players alternate turns. Select one of your pieces and click a highlighted point to move or capture."
    },
    "pieceHeading": {
        "zh": "棋子怎么走",
        "en": "How the pieces move"
    },
    "rook": {
        "zh": "车：横着或竖着走，步数不限，不能越过棋子。",
        "en": "Chariot / Rook (車): Moves any distance horizontally or vertically, without jumping over pieces."
    },
    "horse": {
        "zh": "马：走“日”字；前进方向紧邻的格点有子挡住时，不能走（蹩马腿）。",
        "en": "Horse (馬): Moves one point horizontally or vertically, then one point diagonally outward. It is blocked if the first point is occupied."
    },
    "elephant": {
        "zh": "相 / 象：走“田”字，不能过河；中间有棋子时不能走（塞象眼）。",
        "en": "Elephant (相 / 象): Moves exactly two points diagonally. It cannot cross the river or jump over a piece at the midpoint."
    },
    "advisor": {
        "zh": "仕 / 士：在九宫内斜走一步。",
        "en": "Advisor (仕 / 士): Moves one point diagonally and must stay inside the palace (the marked 3 × 3 area)."
    },
    "general": {
        "zh": "帅 / 将：在九宫内横走或竖走一步；双方将帅不能在同一列无子阻隔地面对面。",
        "en": "General (帥 / 將): Moves one point horizontally or vertically inside the palace. The two generals cannot face each other on the same file with no piece between them."
    },
    "cannon": {
        "zh": "炮：移动时与车相同；吃子时必须隔着恰好一枚棋子。",
        "en": "Cannon (炮): Moves like a rook without capturing. To capture, it must jump over exactly one intervening piece."
    },
    "soldier": {
        "zh": "兵 / 卒：过河前只能向前一步，过河后也能横走一步，始终不能后退。",
        "en": "Soldier (兵 / 卒): Moves one point forward. After crossing the river, it may also move one point sideways. It never moves backward."
    },
    "winningHeading": {
        "zh": "怎样获胜",
        "en": "How to win"
    },
    "winning": {
        "zh": "将帅受到攻击称为“将军”，必须应对；不能走出让己方将帅被攻击的一着。被将军且无合法走法为“将死”，没有任何合法走法为“困毙”，两种情况都判负。",
        "en": "An attacked general is in check and must be protected. You cannot make a move that leaves your general in check. A player loses if they have no legal moves, whether in check (checkmate) or not (stalemate)."
    },
    "controlsHeading": {
        "zh": "模式与操作",
        "en": "Modes and controls"
    },
    "controlsText": {
        "zh": "双人模式双方轮流操作；人机模式你执红、AI 执黑，可选择难度。双人悔棋撤回一着，人机悔棋回到你可重走的回合。“新游戏”重新开局。",
        "en": "In Two players mode, both sides share this board. Against the AI, you play Red and the AI plays Black; choose a difficulty to suit you. Undo takes back one move in Two players mode, or returns to your turn against the AI. New game resets the board."
    },
    "keys": {
        "zh": "键盘：方向键移动光标，回车或空格选子与落子。按 Esc 或右上角 × 关闭说明。",
        "en": "Keyboard: Use arrow keys to move the cursor, and Enter or Space to select and move. Press Esc or the × button to close these instructions."
    }
};
    constructor() {
        let saved;
        try { saved = localStorage.getItem('xiangqi-language'); } catch (_) { /* Storage may be unavailable for file URLs. */ }
        const browserLanguage = typeof navigator !== 'undefined' ? navigator.language : 'zh';
        this.language = ['zh','en'].includes(saved) ? saved : (/^zh/i.test(browserLanguage) ? 'zh' : 'en');
        this.apply();
    }
    t(key, params={}) {
        let text = XiangqiI18n.messages[key]?.[this.language] ?? key;
        for (const [name,value] of Object.entries(params)) text = text.replaceAll('{'+name+'}',String(value));
        return text;
    }
    setLanguage(language) {
        if (!['zh','en'].includes(language)) return;
        this.language=language;
        try {localStorage.setItem('xiangqi-language',language);} catch (_) {}
        this.apply();
    }
    apply() {
        document.documentElement.lang=this.language==='zh'?'zh-CN':'en';
        document.title=this.t('title');
        document.getElementById('language').value=this.language;
        for(const element of document.querySelectorAll('[data-i18n]')) element.textContent=this.t(element.dataset.i18n);
        for(const element of document.querySelectorAll('[data-i18n-aria]')) element.setAttribute('aria-label',this.t(element.dataset.i18nAria));
    }
}
if(typeof module!=='undefined' && module.exports) module.exports={XiangqiI18n};
