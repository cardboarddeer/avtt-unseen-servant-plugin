export type MarkerSettings = {
  color?: string;
  text?: string;
};

export type RollSettings = {
  expression?: string;

  diceType?:
    | "d4"
    | "d6"
    | "d8"
    | "d10"
    | "d12"
    | "d20"
    | "d100";

  numberOfDice?: number | string;
  promptForNumberOfDice?: boolean;

  bonus?: number | string;
  promptForBonus?: boolean;

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
  mode?: "condition" | "customMarker" | "clearMarkers";
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

export type LightValueSettings = {
  feet?: string;
  color?: string;
};

export type LightPresetSettings = {
  presetName?: string;

  preset?: {
    name?: string;
    light1?: LightValueSettings;
    light2?: LightValueSettings;
    blur?: string;
  };

  animationName?: string;

  animationPreset?: {
    name?: string;
    mask?: string;
    rotate?: boolean;
    rpm?: string;
  };

  customLightMask?: string;
  customLightRotate?: boolean;
  customLightRpm?: string;

  label?: string;
};

export type VisionTypeSettings = {
  sense?: "vision" | "truesight" | "devilsight";
  feet?: string;
  promptForFeet?: boolean;
  color?: string;
  label?: string;
};

export type TokenHpModifierSettings = {
  mode?: "damage" | "heal" | "tempHp";
  amount?: number;
  label?: string;
};

export type SpawnTokenSettings = {
  tokenPath?: string;
  tokenName?: string;
  count?: number;
  sizeOverride?: number | null;
  label?: string;
};


export type PcRollBuffSettings = {
  category?: string;
  buff?: string;
  buffLabel?: string;
  buffType?: "checkbox" | "select";
  value?: string;
  enabled?: boolean;
  label?: string;
};

export type PcRollSettingSettings = {
  setting?:
    | "versatile"
    | "crit"
    | "critRange"
    | "hitRoll"
    | "damageRoll"
    | "checkRoll"
    | "saveRoll";

  value?: string;
  label?: string;
};
