import {
  IndexResultsCard,
  type ResultsCardBrand,
  type ResultsCardKind,
} from "./data";

// 单张长卡的基准尺寸。桌面端按 335 x 600 的比例做列栈。
export const RESULTS_CARD_WIDTH = 335;
export const RESULTS_CARD_HEIGHT = 600;

// 行间和列间共用的固定 gap。
export const RESULTS_CARD_GAP = 18;

// 顶部额外预留的安全区，避免第一张 Uber 被裁掉。
export const RESULTS_SCENE_TOP_PADDING = 120;

// 五列加四段 gap，组成桌面端满屏场景宽度。
export const RESULTS_SCENE_WIDTH =
  RESULTS_CARD_WIDTH * 5 + RESULTS_CARD_GAP * 4;

// 第一列至少要铺到多少张卡的深度，其他列不足时会自动补 blank 卡。
const FIRST_COLUMN_TARGET_ROWS = 4;
// 再额外多补几排，避免滚动到最下方、开广角后邻列不够深而露出底色。
// 这里就是控制“每列还要额外补多少张纯白卡”的地方。
const EXTRA_FILL_ROWS = 2;

// 同一列里下一张卡相对上一张卡的垂直步长。
const CARD_STACK_STEP = RESULTS_CARD_HEIGHT + RESULTS_CARD_GAP;

// 第一列直接贴满屏场景最左边，所以横向起点是 0。
const SCENE_OFFSET_X = 0;

// 场景底部额外补一张卡的余量，避免最后一排紧贴底边。
const SCENE_BOTTOM_MARGIN = RESULTS_CARD_HEIGHT + RESULTS_CARD_GAP;

// 相邻两列的水平步长，等于卡宽加一段固定 gap。
const COLUMN_STACK_STEP = RESULTS_CARD_WIDTH + RESULTS_CARD_GAP;

// 开广角时各列的增宽权重，中间列最强。
const COLUMN_SPREAD_WEIGHTS = [0.44, 0.72, 1, 0.72, 0.44] as const;
const PROGRESS_EASE_POWER = 1.35;

// 共享的采样步长，保证相邻列在相同的 y 切片上一起变形。
const CURVE_SAMPLE_STEP = 24;
const CENTER_COLUMN_INDEX = 2;
const BOTTOM_BIAS_POWER = 3.6;
const CARD_CORNER_RADIUS = 16;
// 横向 gap 会随滚动逐渐增大，但同一时刻所有列共用同一个 gap。
const MAX_GAP_GROWTH = 22;
// 当中间列在这个纵向位置先撑到满屏宽时，就把它视为终态。
const WIDTH_LOCK_Y_PROGRESS = 0.76;
const MAX_SPREAD =
  ((RESULTS_SCENE_WIDTH - RESULTS_CARD_WIDTH) / RESULTS_CARD_WIDTH) * 2;

export type BaseResultsCardLayout = {
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

export type ResultsAnimatedCardLayout = BaseResultsCardLayout & {
  frameWidth: number;
  topWidth: number;
  bottomWidth: number;
  pathD: string;
  contentLeft: number;
  contentWidth: number;
};

export type BaseResultsCardScene = {
  sceneWidth: number;
  sceneHeight: number;
  cards: BaseResultsCardLayout[];
};

export type ResultsCardScene = {
  sceneWidth: number;
  sceneHeight: number;
  cards: ResultsAnimatedCardLayout[];
};

type ColumnMetrics = {
  top: number;
  bottom: number;
  baseLeft: number;
  baseCenter: number;
};

type ColumnBoundary = {
  left: number;
  right: number;
};

type BoundarySample = ColumnBoundary & {
  y: number;
};

const sceneDepthTarget =
  RESULTS_CARD_HEIGHT +
  (FIRST_COLUMN_TARGET_ROWS + EXTRA_FILL_ROWS - 1) * CARD_STACK_STEP;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const formatNumber = (value: number) => Number(value.toFixed(3));

// 把宽度增长明显压到下半段，避免出现“中间肚子大”的感觉。
const easeInBottomCurve = (value: number) =>
  Math.pow(clamp(value, 0, 1), BOTTOM_BIAS_POWER);

const buildBaseResultsCardSceneInternal = (): BaseResultsCardScene => {
  const cards: BaseResultsCardLayout[] = [];
  let deepestBottom = 0;

  IndexResultsCard.forEach((column, columnIndex) => {
    const left = SCENE_OFFSET_X + columnIndex * COLUMN_STACK_STEP;
    const columnCards = [...column.cards];

    let lastTop = column.startTop + (columnCards.length - 1) * CARD_STACK_STEP;
    let lastBottom = lastTop + RESULTS_CARD_HEIGHT;

    while (lastBottom < sceneDepthTarget) {
      columnCards.push({ kind: "blank" });
      lastTop += CARD_STACK_STEP;
      lastBottom = lastTop + RESULTS_CARD_HEIGHT;
    }

    columnCards.forEach((card, rowIndex) => {
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
    sceneHeight: deepestBottom + SCENE_BOTTOM_MARGIN,
    cards,
  };
};

const BASE_RESULTS_CARD_SCENE = buildBaseResultsCardSceneInternal();

const BASE_COLUMN_METRICS = Array.from(
  { length: IndexResultsCard.length },
  (_, index) => {
    const columnCards = BASE_RESULTS_CARD_SCENE.cards
      .filter((card) => card.columnIndex === index)
      .sort((cardA, cardB) => cardA.rowIndex - cardB.rowIndex);
    const firstCard = columnCards[0];
    const lastCard = columnCards[columnCards.length - 1];

    return {
      top: firstCard.top,
      bottom: lastCard.top + lastCard.height,
      baseLeft: firstCard.left,
      baseCenter: firstCard.left + RESULTS_CARD_WIDTH / 2,
    };
  },
) satisfies ColumnMetrics[];

const WIDTH_CURVE_TOP = Math.min(...BASE_COLUMN_METRICS.map((column) => column.top));
const WIDTH_CURVE_BOTTOM = Math.max(
  ...BASE_COLUMN_METRICS.map((column) => column.bottom),
);
const WIDTH_LOCK_Y =
  WIDTH_CURVE_TOP + (WIDTH_CURVE_BOTTOM - WIDTH_CURVE_TOP) * WIDTH_LOCK_Y_PROGRESS;
const CENTER_TARGET_DELTA = RESULTS_SCENE_WIDTH - RESULTS_CARD_WIDTH;
export const LOCKED_OPEN_PROGRESS = Math.pow(
  clamp(
    CENTER_TARGET_DELTA /
    Math.max(
      RESULTS_CARD_WIDTH *
      (COLUMN_SPREAD_WEIGHTS[CENTER_COLUMN_INDEX] ?? 1) *
      MAX_SPREAD,
      1,
    ),
    0,
    1,
  ),
  1 / PROGRESS_EASE_POWER,
);

// 裁切场景高度：精确截止到 WIDTH_LOCK_Y——中间列卡片宽度
// 首次等于场景宽度的 y 坐标，超出部分由 overflow: hidden 隐藏。
export const RESULTS_CLIPPED_SCENE_HEIGHT = WIDTH_LOCK_Y;

const getEffectiveOpenProgress = (progress: number) =>
  Math.min(clamp(progress, 0, 1), LOCKED_OPEN_PROGRESS);

const buildColumnDeltas = (progress: number) => {
  const easedProgress = Math.pow(
    getEffectiveOpenProgress(progress),
    PROGRESS_EASE_POWER,
  );

  return COLUMN_SPREAD_WEIGHTS.map(
    (weight) => RESULTS_CARD_WIDTH * weight * MAX_SPREAD * easedProgress,
  ) as number[];
};

const buildDynamicGap = (progress: number) => {
  const easedProgress = Math.pow(getEffectiveOpenProgress(progress), 1.15);

  return RESULTS_CARD_GAP + MAX_GAP_GROWTH * easedProgress;
};

const getColumnWidthAtY = (
  columnIndex: number,
  y: number,
  deltas: number[],
) => {
  const rawProgress = clamp(
    (y - WIDTH_CURVE_TOP) / Math.max(WIDTH_LOCK_Y - WIDTH_CURVE_TOP, 1),
    0,
    1,
  );

  return (
    RESULTS_CARD_WIDTH +
    (deltas[columnIndex] ?? 0) * easeInBottomCurve(rawProgress)
  );
};

// 所有列的边界都从同一个 y 切片同时计算出来，这样相邻列之间的可见 gap
// 无论滚动到哪里都保持一致，只是整体一起向外张开。
const getColumnBoundariesAtY = (
  y: number,
  deltas: number[],
  currentGap: number,
) => {
  const widths = BASE_COLUMN_METRICS.map((_, columnIndex) =>
    getColumnWidthAtY(columnIndex, y, deltas),
  );
  const boundaries: ColumnBoundary[] = Array.from(
    { length: BASE_COLUMN_METRICS.length },
    () => ({ left: 0, right: 0 }),
  );

  const centerWidth = widths[CENTER_COLUMN_INDEX] ?? RESULTS_CARD_WIDTH;
  const centerLeft =
    BASE_COLUMN_METRICS[CENTER_COLUMN_INDEX].baseCenter - centerWidth / 2;

  boundaries[CENTER_COLUMN_INDEX] = {
    left: centerLeft,
    right: centerLeft + centerWidth,
  };

  for (let columnIndex = CENTER_COLUMN_INDEX - 1; columnIndex >= 0; columnIndex -= 1) {
    const width = widths[columnIndex] ?? RESULTS_CARD_WIDTH;
    const right = boundaries[columnIndex + 1].left - currentGap;

    boundaries[columnIndex] = {
      left: right - width,
      right,
    };
  }

  for (
    let columnIndex = CENTER_COLUMN_INDEX + 1;
    columnIndex < boundaries.length;
    columnIndex += 1
  ) {
    const width = widths[columnIndex] ?? RESULTS_CARD_WIDTH;
    const left = boundaries[columnIndex - 1].right + currentGap;

    boundaries[columnIndex] = {
      left,
      right: left + width,
    };
  }

  return boundaries;
};

const buildSampleYs = (top: number, bottom: number) => {
  const sampleYs = [top];
  let y = Math.ceil(top / CURVE_SAMPLE_STEP) * CURVE_SAMPLE_STEP;

  if (y <= top) {
    y += CURVE_SAMPLE_STEP;
  }

  while (y < bottom) {
    sampleYs.push(y);
    y += CURVE_SAMPLE_STEP;
  }

  sampleYs.push(bottom);

  return sampleYs;
};

const buildCardSamples = (
  columnIndex: number,
  top: number,
  bottom: number,
  deltas: number[],
  currentGap: number,
) =>
  buildSampleYs(top, bottom).map((y) => {
    const boundary = getColumnBoundariesAtY(
      y,
      deltas,
      currentGap,
    )[columnIndex];

    return {
      y,
      left: boundary.left,
      right: boundary.right,
    };
  }) satisfies BoundarySample[];

const buildPathD = (
  samples: BoundarySample[],
  frameLeft: number,
  top: number,
  height: number,
) => {
  const localSamples = samples.map((sample) => ({
    y: sample.y - top,
    left: sample.left - frameLeft,
    right: sample.right - frameLeft,
  }));
  const firstSample = localSamples[0];
  const lastSample = localSamples[localSamples.length - 1];
  const cornerRadius = Math.min(
    CARD_CORNER_RADIUS,
    (firstSample.right - firstSample.left) / 2,
    (lastSample.right - lastSample.left) / 2,
    height / 6,
  );
  const interpolateSide = (
    side: "left" | "right",
    targetY: number,
  ) => {
    if (targetY <= localSamples[0].y) {
      return localSamples[0][side];
    }

    if (targetY >= localSamples[localSamples.length - 1].y) {
      return localSamples[localSamples.length - 1][side];
    }

    for (let index = 1; index < localSamples.length; index += 1) {
      const previousSample = localSamples[index - 1];
      const nextSample = localSamples[index];

      if (targetY <= nextSample.y) {
        const segmentProgress =
          (targetY - previousSample.y) / Math.max(nextSample.y - previousSample.y, 1);

        return (
          previousSample[side] +
          (nextSample[side] - previousSample[side]) * segmentProgress
        );
      }
    }

    return localSamples[localSamples.length - 1][side];
  };
  const topLeft = firstSample.left;
  const topRight = firstSample.right;
  const bottomLeft = lastSample.left;
  const bottomRight = lastSample.right;
  const rightAtTopRadius = interpolateSide("right", cornerRadius);
  const leftAtTopRadius = interpolateSide("left", cornerRadius);
  const rightAtBottomRadius = interpolateSide("right", height - cornerRadius);
  const leftAtBottomRadius = interpolateSide("left", height - cornerRadius);
  const commands = [
    `M ${formatNumber(topLeft + cornerRadius)} 0`,
    `L ${formatNumber(topRight - cornerRadius)} 0`,
    `Q ${formatNumber(topRight)} 0 ${formatNumber(rightAtTopRadius)} ${formatNumber(cornerRadius)}`,
  ];

  for (let index = 1; index < localSamples.length; index += 1) {
    const sample = localSamples[index];

    if (sample.y > cornerRadius && sample.y < height - cornerRadius) {
      commands.push(
        `L ${formatNumber(sample.right)} ${formatNumber(sample.y)}`,
      );
    }
  }

  commands.push(
    `L ${formatNumber(rightAtBottomRadius)} ${formatNumber(height - cornerRadius)}`,
    `Q ${formatNumber(bottomRight)} ${formatNumber(height)} ${formatNumber(bottomRight - cornerRadius)} ${formatNumber(height)}`,
    `L ${formatNumber(bottomLeft + cornerRadius)} ${formatNumber(height)}`,
    `Q ${formatNumber(bottomLeft)} ${formatNumber(height)} ${formatNumber(leftAtBottomRadius)} ${formatNumber(height - cornerRadius)}`,
  );

  for (let index = localSamples.length - 2; index >= 0; index -= 1) {
    const sample = localSamples[index];

    if (sample.y > cornerRadius && sample.y < height - cornerRadius) {
      commands.push(
        `L ${formatNumber(sample.left)} ${formatNumber(sample.y)}`,
      );
    }
  }

  commands.push(
    `L ${formatNumber(leftAtTopRadius)} ${formatNumber(cornerRadius)}`,
    `Q ${formatNumber(topLeft)} 0 ${formatNumber(topLeft + cornerRadius)} 0`,
  );
  commands.push("Z");

  return commands.join(" ");
};

export const buildBaseResultsCardScene = (): BaseResultsCardScene =>
  BASE_RESULTS_CARD_SCENE;

export const buildAnimatedResultsCardScene = (
  progress = 0,
): ResultsCardScene => {
  const deltas = buildColumnDeltas(progress);
  const currentGap = buildDynamicGap(progress);

  return {
    sceneWidth: BASE_RESULTS_CARD_SCENE.sceneWidth,
    sceneHeight: BASE_RESULTS_CARD_SCENE.sceneHeight,
    cards: BASE_RESULTS_CARD_SCENE.cards.map((card) => {
      const samples = buildCardSamples(
        card.columnIndex,
        card.top,
        card.top + card.height,
        deltas,
        currentGap,
      );
      const frameLeft = Math.min(...samples.map((sample) => sample.left));
      const frameRight = Math.max(...samples.map((sample) => sample.right));
      const topWidth = samples[0].right - samples[0].left;
      const bottomWidth =
        samples[samples.length - 1].right - samples[samples.length - 1].left;

      return {
        ...card,
        left: frameLeft,
        frameWidth: frameRight - frameLeft,
        topWidth,
        bottomWidth,
        pathD: buildPathD(samples, frameLeft, card.top, card.height),
        contentLeft: samples[0].left - frameLeft,
        contentWidth: topWidth,
      };
    }),
  };
};
