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
  mode?: "condition" | "customMarker";
  condition?: string;
  markerColor?: string;
  markerText?: string;
  label?: string;
  removeOnTurnStart?: boolean;
};


export type AuraPresetSettings = {
  presetName?: string;
  preset?: {
    name?: string;
    aura1?: {
      feet?: string;
      color?: string;
    };
    aura2?: {
      feet?: string;
      color?: string;
    };
    animation?: string;
  };
  customAuraMask?: string;
  customAuraRotate?: boolean;
  label?: string;
};
