# 中国象棋

直接用浏览器打开 index.html，无需安装依赖或启动服务。

## 功能

- 中文 / English 随时切换；首次按浏览器语言选择，后续记住玩家偏好，切换不重置棋局。
- 支持双人对弈；人机模式固定玩家执红、AI 执黑，简单、中等、困难三档难度。
- 点击棋子选中，再点击合法落点；也可用方向键和回车/空格操作。
- 双人模式每次悔棋撤销一手；人机模式恢复到玩家可重走的回合。
- AI 思考或动画期间锁定落子；新游戏、悔棋会取消旧任务。
- H 切换页面高对比样式，+ / - 调整页面字体。

## 结构

- engine.js：XiangqiGame 纯状态与规则，支持合法走法、make/unmake、克隆和结构化胜负判断。
- ai.js：XiangqiAI，negamax、Alpha-Beta、MVV-LVA、位置表、迭代加深。
- i18n.js：中英界面、状态和玩法说明翻译及语言偏好。
- script.js：Canvas UI、DPR 静态层与棋子精灵、动画和 AI 集成。

引擎走法格式为 {from: {row, col}, to: {row, col}}；行 0 为黑方底线，行 9 为红方底线。
正常局面 reason 为 null；终局 reason 为 checkmate / stalemate / captured。

AI 在搜索内部定期用 setTimeout(0) 让出主线程。简单最多深度 2，中等最多 4，困难最多 6；时间预算分别约 0.5 / 1 / 1.5 秒。到时返回上一完整深度的结果，深度 1 尚未完成时返回合法备用着，实际深度取决于设备和局面。搜索过程中重复局面评分为 0；引擎尚未包含正式重复局面、长将或和棋裁定，不保证完整自对弈必然结束。

## 验证

运行：

    node --check engine.js
    node --check ai.js
    node --check i18n.js
    node --check script.js
    node --test tests/engine-ai.test.js tests/ui.test.js tests/i18n.test.js

测试覆盖 14 项规则回归、连续悔棋、克隆、AI 双方合法落子、可控残局终局、搜索取消、事件循环让出，以及 DOM/Canvas 桩下的 DPR、缩放点击、动画取消、人机悔棋和胜负显示。

浏览器手工验收：打开页面，选困难难度，检查走棋动画、思考状态、悔棋与重开。真实浏览器画面和高分屏观感仍需实机确认。
