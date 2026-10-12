// UI translations are independent of engine state and search.
class XiangqiI18n {
    static messages = {
    "title": {
        "zh": "\u4e2d\u56fd\u8c61\u68cb",
        "en": "Xiangqi · Chinese Chess"
    },
    "language": {
        "zh": "\u8bed\u8a00",
        "en": "Language"
    },
    "mode": {
        "zh": "\u6a21\u5f0f",
        "en": "Game mode"
    },
    "aiMode": {
        "zh": "\u4eba\u673a（\u4f60\u6267\u7ea2 · AI \u6267\u9ed1）",
        "en": "Play AI (you: Red · AI: Black)"
    },
    "pvpMode": {
        "zh": "\u53cc\u4eba\u5bf9\u5f08",
        "en": "Two players"
    },
    "difficulty": {
        "zh": "\u96be\u5ea6",
        "en": "Difficulty"
    },
    "easy": {
        "zh": "\u7b80\u5355",
        "en": "Easy"
    },
    "medium": {
        "zh": "\u4e2d\u7b49",
        "en": "Medium"
    },
    "hard": {
        "zh": "\u56f0\u96be",
        "en": "Hard"
    },
    "newGame": {
        "zh": "\u65b0\u6e38\u620f",
        "en": "New game"
    },
    "undo": {
        "zh": "\u6094\u68cb",
        "en": "Undo"
    },
    "rules": {
        "zh": "\u73a9\u6cd5\u8bf4\u660e",
        "en": "How to play"
    },
    "closeRules": {
        "zh": "\u5173\u95ed\u73a9\u6cd5\u8bf4\u660e",
        "en": "Close instructions"
    },
    "boardLabel": {
        "zh": "\u4e2d\u56fd\u8c61\u68cb\u68cb\u76d8",
        "en": "Xiangqi board"
    },
    "redTurn": {
        "zh": "\u7ea2\u65b9\u8d70\u68cb",
        "en": "Red to move"
    },
    "blackTurn": {
        "zh": "\u9ed1\u65b9\u8d70\u68cb",
        "en": "Black to move"
    },
    "redCheck": {
        "zh": "\u7ea2\u65b9\u88ab\u5c06\u519b",
        "en": "Red is in check"
    },
    "blackCheck": {
        "zh": "\u9ed1\u65b9\u88ab\u5c06\u519b",
        "en": "Black is in check"
    },
    "redWin": {
        "zh": "\u7ea2\u65b9\u83b7\u80dc！",
        "en": "Red wins!"
    },
    "blackWin": {
        "zh": "\u9ed1\u65b9\u83b7\u80dc！",
        "en": "Black wins!"
    },
    "redBanner": {
        "zh": "\u7ea2\u65b9\u80dc",
        "en": "Red wins"
    },
    "blackBanner": {
        "zh": "\u9ed1\u65b9\u80dc",
        "en": "Black wins"
    },
    "checkmate": {
        "zh": "\u5c06\u6b7b",
        "en": "Checkmate"
    },
    "stalemate": {
        "zh": "\u56f0\u6bd9",
        "en": "No legal moves"
    },
    "captured": {
        "zh": "\u5c06\u5e05\u88ab\u5403",
        "en": "General captured"
    },
    "thinking": {
        "zh": "AI \u601d\u8003\u4e2d…",
        "en": "AI is thinking…"
    },
    "thinkingDepth": {
        "zh": "AI \u601d\u8003\u4e2d · \u6df1\u5ea6 {depth}",
        "en": "AI is thinking · Depth {depth}"
    },
    "aiError": {
        "zh": "AI \u641c\u7d22\u5931\u8d25，\u8bf7\u91cd\u5f00\u6216\u5207\u6362\u6a21\u5f0f",
        "en": "AI search failed. Start a new game or switch modes."
    },
    "intro": {
        "zh": "\u7ea2\u65b9\u5148\u8d70，\u53cc\u65b9\u8f6e\u6d41\u8d70\u4e00\u7740。\u70b9\u51fb\u5df1\u65b9\u68cb\u5b50，\u518d\u70b9\u51fb\u63d0\u793a\u4f4d\u7f6e\u5373\u53ef\u79fb\u52a8\u6216\u5403\u5b50。",
        "en": "Red moves first, then players alternate turns. Select one of your pieces and click a highlighted point to move or capture."
    },
    "pieceHeading": {
        "zh": "\u68cb\u5b50\u600e\u4e48\u8d70",
        "en": "How the pieces move"
    },
    "rook": {
        "zh": "\u8f66：\u6a2a\u7740\u6216\u7ad6\u7740\u8d70，\u6b65\u6570\u4e0d\u9650，\u4e0d\u80fd\u8d8a\u8fc7\u68cb\u5b50。",
        "en": "Chariot / Rook (\u8eca): Moves any distance horizontally or vertically, without jumping over pieces."
    },
    "horse": {
        "zh": "\u9a6c：\u8d70“\u65e5”\u5b57；\u524d\u8fdb\u65b9\u5411\u7d27\u90bb\u7684\u683c\u70b9\u6709\u5b50\u6321\u4f4f\u65f6，\u4e0d\u80fd\u8d70（\u8e69\u9a6c\u817f）。",
        "en": "Horse (\u99ac): Moves one point horizontally or vertically, then one point diagonally outward. It is blocked if the first point is occupied."
    },
    "elephant": {
        "zh": "\u76f8 / \u8c61：\u8d70“\u7530”\u5b57，\u4e0d\u80fd\u8fc7\u6cb3；\u4e2d\u95f4\u6709\u68cb\u5b50\u65f6\u4e0d\u80fd\u8d70（\u585e\u8c61\u773c）。",
        "en": "Elephant (\u76f8 / \u8c61): Moves exactly two points diagonally. It cannot cross the river or jump over a piece at the midpoint."
    },
    "advisor": {
        "zh": "\u4ed5 / \u58eb：\u5728\u4e5d\u5bab\u5185\u659c\u8d70\u4e00\u6b65。",
        "en": "Advisor (\u4ed5 / \u58eb): Moves one point diagonally and must stay inside the palace (the marked 3 × 3 area)."
    },
    "general": {
        "zh": "\u5e05 / \u5c06：\u5728\u4e5d\u5bab\u5185\u6a2a\u8d70\u6216\u7ad6\u8d70\u4e00\u6b65；\u53cc\u65b9\u5c06\u5e05\u4e0d\u80fd\u5728\u540c\u4e00\u5217\u65e0\u5b50\u963b\u9694\u5730\u9762\u5bf9\u9762。",
        "en": "General (\u5e25 / \u5c07): Moves one point horizontally or vertically inside the palace. The two generals cannot face each other on the same file with no piece between them."
    },
    "cannon": {
        "zh": "\u70ae：\u79fb\u52a8\u65f6\u4e0e\u8f66\u76f8\u540c；\u5403\u5b50\u65f6\u5fc5\u987b\u9694\u7740\u6070\u597d\u4e00\u679a\u68cb\u5b50。",
        "en": "Cannon (\u70ae): Moves like a rook without capturing. To capture, it must jump over exactly one intervening piece."
    },
    "soldier": {
        "zh": "\u5175 / \u5352：\u8fc7\u6cb3\u524d\u53ea\u80fd\u5411\u524d\u4e00\u6b65，\u8fc7\u6cb3\u540e\u4e5f\u80fd\u6a2a\u8d70\u4e00\u6b65，\u59cb\u7ec8\u4e0d\u80fd\u540e\u9000。",
        "en": "Soldier (\u5175 / \u5352): Moves one point forward. After crossing the river, it may also move one point sideways. It never moves backward."
    },
    "winningHeading": {
        "zh": "\u600e\u6837\u83b7\u80dc",
        "en": "How to win"
    },
    "winning": {
        "zh": "\u5c06\u5e05\u53d7\u5230\u653b\u51fb\u79f0\u4e3a“\u5c06\u519b”，\u5fc5\u987b\u5e94\u5bf9；\u4e0d\u80fd\u8d70\u51fa\u8ba9\u5df1\u65b9\u5c06\u5e05\u88ab\u653b\u51fb\u7684\u4e00\u7740。\u88ab\u5c06\u519b\u4e14\u65e0\u5408\u6cd5\u8d70\u6cd5\u4e3a“\u5c06\u6b7b”，\u6ca1\u6709\u4efb\u4f55\u5408\u6cd5\u8d70\u6cd5\u4e3a“\u56f0\u6bd9”，\u4e24\u79cd\u60c5\u51b5\u90fd\u5224\u8d1f。",
        "en": "An attacked general is in check and must be protected. You cannot make a move that leaves your general in check. A player loses if they have no legal moves, whether in check (checkmate) or not (stalemate)."
    },
    "controlsHeading": {
        "zh": "\u6a21\u5f0f\u4e0e\u64cd\u4f5c",
        "en": "Modes and controls"
    },
    "controlsText": {
        "zh": "\u53cc\u4eba\u6a21\u5f0f\u53cc\u65b9\u8f6e\u6d41\u64cd\u4f5c；\u4eba\u673a\u6a21\u5f0f\u4f60\u6267\u7ea2、AI \u6267\u9ed1，\u53ef\u9009\u62e9\u96be\u5ea6。\u53cc\u4eba\u6094\u68cb\u64a4\u56de\u4e00\u7740，\u4eba\u673a\u6094\u68cb\u56de\u5230\u4f60\u53ef\u91cd\u8d70\u7684\u56de\u5408。“\u65b0\u6e38\u620f”\u91cd\u65b0\u5f00\u5c40。",
        "en": "In Two players mode, both sides share this board. Against the AI, you play Red and the AI plays Black; choose a difficulty to suit you. Undo takes back one move in Two players mode, or returns to your turn against the AI. New game resets the board."
    },
    "keys": {
        "zh": "\u952e\u76d8：\u65b9\u5411\u952e\u79fb\u52a8\u5149\u6807，\u56de\u8f66\u6216\u7a7a\u683c\u9009\u5b50\u4e0e\u843d\u5b50。\u6309 Esc \u6216\u53f3\u4e0a\u89d2 × \u5173\u95ed\u8bf4\u660e。",
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
