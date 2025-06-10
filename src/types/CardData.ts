export type CardData = Readonly<{
  template: string;
  name: string;
  attribute: string;
  stars: number | null;
  symbol: string;
  art: string;
  edition: string;
  type: string;
  effect: string;
  atk: string;
  def: string;
  serial: string;
  copyright: string;
  pendulum: boolean;
  pendulumBlueScale: string;
  pendulumRedScale: string;
  pendulumEffect: string;
  linkRating: string;
  linkArrowTopLeft: boolean;
  linkArrowTopCenter: boolean;
  linkArrowTopRight: boolean;
  linkArrowMiddleLeft: boolean;
  linkArrowMiddleRight: boolean;
  linkArrowBottomLeft: boolean;
  linkArrowBottomCenter: boolean;
  linkArrowBottomRight: boolean;
}>;

export type LinkArrowKey =
  | "linkArrowTopLeft"
  | "linkArrowTopCenter"
  | "linkArrowTopRight"
  | "linkArrowMiddleLeft"
  | "linkArrowMiddleRight"
  | "linkArrowBottomLeft"
  | "linkArrowBottomCenter"
  | "linkArrowBottomRight";
