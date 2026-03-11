import {
  IndexResultsCard,
  type ResultsCardBrand,
  type ResultsCardKind,
} from "./data";

// 单张长卡的基准尺寸。桌面端按 335 x 600 的比例做列栈。
export const RESULTS_CARD_WIDTH = 335;
export const RESULTS_CARD_HEIGHT = 600;

// 行间和列间共用的统一 gap。
export const RESULTS_CARD_GAP = 18;

// 整个卡片场景在顶部额外预留的安全区，避免第一张 Uber 被裁掉。
export const RESULTS_SCENE_TOP_PADDING = 120;

// 五列横向铺满场景宽度，每列之间保留 4 段 gap。
export const RESULTS_SCENE_WIDTH =
  RESULTS_CARD_WIDTH * 5 + RESULTS_CARD_GAP * 4;

// 第一列至少要铺到多少张卡的深度，其他列不足时会自动补 blank 卡。
const FIRST_COLUMN_TARGET_ROWS = 4;

// 同一列里下一张卡相对上一张卡的垂直步长。
const CARD_STACK_STEP = RESULTS_CARD_HEIGHT + RESULTS_CARD_GAP;

// 第一列直接贴场景最左边，所以横向起点是 0。
const SCENE_OFFSET_X = 0;

// 场景底部额外补一张卡的余量，避免最后一排紧贴底边。
const SCENE_BOTTOM_MARGIN = RESULTS_CARD_HEIGHT + RESULTS_CARD_GAP;

// 相邻两列的水平步长，等于卡宽加一段固定 gap。
const COLUMN_STACK_STEP = RESULTS_CARD_WIDTH + RESULTS_CARD_GAP;

export type ResultsCardLayout = {
  id: string;
  columnIndex: number;
  rowIndex: number;
  kind: ResultsCardKind;
  brand?: ResultsCardBrand;
  left: number;
  top: number;
  width: number;
  height: number;
  zIndex: number;
};

export type ResultsCardScene = {
  sceneWidth: number;
  sceneHeight: number;
  cards: ResultsCardLayout[];
};

// 所有列至少要铺到与第一列 4 张卡相同的总深度。
const sceneDepthTarget =
  RESULTS_CARD_HEIGHT + (FIRST_COLUMN_TARGET_ROWS - 1) * CARD_STACK_STEP;

export const buildResultsCardScene = (): ResultsCardScene => {
  const cards: ResultsCardLayout[] = [];
  let deepestBottom = 0;

  IndexResultsCard.forEach((column, columnIndex) => {
    // 每一列的 left 只由列索引和统一列步长决定。
    const left = SCENE_OFFSET_X + columnIndex * COLUMN_STACK_STEP;
    const columnCards = [...column.cards];

    // 先找到当前列最后一张卡的底部，再决定是否继续向下补空白卡。
    let lastTop =
      column.startTop + (columnCards.length - 1) * CARD_STACK_STEP;
    let lastBottom = lastTop + RESULTS_CARD_HEIGHT;

    // 如果这一列还不够深，就继续往下补纯白卡，直到达到统一视觉深度。
    while (lastBottom < sceneDepthTarget) {
      columnCards.push({ kind: "blank" });
      lastTop += CARD_STACK_STEP;
      lastBottom = lastTop + RESULTS_CARD_HEIGHT;
    }

    columnCards.forEach((card, rowIndex) => {
      // 实际渲染时，所有卡都再整体下移一段顶部安全区。
      const top =
        RESULTS_SCENE_TOP_PADDING + column.startTop + rowIndex * CARD_STACK_STEP;
      const bottom = top + RESULTS_CARD_HEIGHT;

      deepestBottom = Math.max(deepestBottom, bottom);

      cards.push({
        id: `column-${columnIndex}-row-${rowIndex}`,
        columnIndex,
        rowIndex,
        kind: card.kind,
        brand: card.brand,
        left,
        top,
        width: RESULTS_CARD_WIDTH,
        height: RESULTS_CARD_HEIGHT,
        zIndex: columnIndex + 1,
      });
    });
  });

  return {
    sceneWidth: RESULTS_SCENE_WIDTH,
    // 场景高度由最深那张卡的底部决定，并额外保留一段底部余量。
    sceneHeight: deepestBottom + SCENE_BOTTOM_MARGIN,
    cards,
  };
};
