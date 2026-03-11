export const IndexResultsTitleWord = ["The results speak for", "themselves"];
export const IndexResultsCardsCount = ["160", ".000", ".000", ".000", "+"];

export const IndexResultsFact = [
  {
    number: "99.99%",
    text: "platform uptime in 2022",
  },
  {
    number: "40",
    text: "countries certified to operate",
  },
  {
    number: "80X",
    text: "growth in volume since 2017",
  },
] as const;

export type ResultsCardKind = "brand" | "purple" | "blank";

export type ResultsCardBrand =
  | "uber"
  | "square"
  | "instacart"
  | "jpm"
  | "doordash";

export type ResultsColumnCard = {
  kind: ResultsCardKind;
  brand?: ResultsCardBrand;
};

export type ResultsColumnConfig = {
  startTop: number;
  cards: ResultsColumnCard[];
};

export const ResultsCardBrandMeta: Record<
  ResultsCardBrand,
  { label: string; logoSrc: string }
> = {
  uber: {
    label: "Uber",
    logoSrc: "/logo/uber.svg",
  },
  square: {
    label: "Square",
    logoSrc: "/logo/square.svg",
  },
  instacart: {
    label: "Instacart",
    logoSrc: "/logo/instacart.svg",
  },
  jpm: {
    label: "JPMorgan",
    logoSrc: "/logo/jpm.svg",
  },
  doordash: {
    label: "DoorDash",
    logoSrc: "/logo/doordash.svg",
  },
};

export const IndexResultsCard: ResultsColumnConfig[] = [
  {
    startTop: 0,
    cards: [{ kind: "brand", brand: "uber" }, { kind: "brand", brand: "square" }],
  },
  {
    startTop: 150,
    cards: [{ kind: "purple" }, { kind: "brand", brand: "instacart" }],
  },
  {
    startTop: 762 + 150,
    cards: [{ kind: "brand", brand: "jpm" }],
  },
  {
    startTop: 762 + 300,
    cards: [{ kind: "brand", brand: "doordash" }],
  },
  {
    startTop: 762 + 450,
    cards: [{ kind: "blank" }],
  },
] as const;
