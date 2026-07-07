export type MarkerSettings = {
  color?: string;
  text?: string;
};

export type RollSettings = {
  expression?: string;
  rollType?: string;
  action?: string;
  damageType?: string;
};

export type RollSelectedFormulaSettings = {
  formula?: string;
  label?: string;
  rollType?:
    | "to hit"
    | "damage"
    | "save"
    | "check"
    | "heal"
    | "reroll"
    | "initiative"
    | "attack"
    | "roll"
    | "recharge";
};

export type GameLogMessageSettings = {
  title?: string;
  text?: string;
  headerStyle?: string;
};

export type ConditionSettings = {
  condition?: string;
  customCondition?: string;
  label?: string;
  removeOnTurnStart?: boolean;
};
