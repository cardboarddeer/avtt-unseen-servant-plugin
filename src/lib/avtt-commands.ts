export const AVTT_COMMANDS = {
  TOGGLE_DAYLIGHT: "toggleDaylight",
  TOGGLE_MARKER: "toggleMarker",
  CLEAR_MARKERS: "clearMarkers",

  NEXT_INITIATIVE: "nextInitiative",
  PREVIOUS_INITIATIVE: "previousInitiative",

  OPEN_GAME_LOG_TAB: "openGameLogTab",
  OPEN_TOKENS_TAB: "openTokensTab",
  OPEN_SCENES_TAB: "openScenesTab",
  OPEN_SOUNDS_TAB: "openSoundsTab",
  OPEN_JOURNAL_TAB: "openJournalTab",
  OPEN_SETTINGS_TAB: "openSettingsTab",

  ZOOM_IN: "zoomIn",
  ZOOM_OUT: "zoomOut",

  ROLL_WITH_PROMPT: "rollWithPrompt",
  ROLL_SELECTED_FORMULA: "rollSelectedFormula",
  SEND_TEXT_TO_GAMELOG: "sendTextToGamelog",
  TOGGLE_CONDITION: "toggleCondition",
  SET_SELECTED_TOKEN_SIZE: "setSelectedTokenSize",
  SET_TOKEN_STYLE: "setTokenStyle",
  SET_TOKEN_HEALTH_VISUAL: "setTokenHealthVisual",
  APPLY_TOKEN_IMAGE: "applyTokenImage",
  RESET_TOKEN_IMAGE: "resetTokenImage",
  SELECT_TOKEN: "selectToken",
  MODIFY_SELECTED_TOKEN_HP: "modifySelectedTokenHp",
  SPAWN_TOKEN_FROM_PATH: "spawnTokenFromPath",

  APPLY_PC_STAT_EFFECT: "applyPcStatEffect",
  CLEAR_PC_STAT_EFFECTS: "clearPcStatEffects",

  APPLY_PC_ROLL_BUFF: "applyPcRollBuff",

  TOGGLE_AURA: "toggleAura",
  TOGGLE_AURA_PRESET: "toggleAuraPreset",

  TOGGLE_LIGHT: "toggleLight",
  TOGGLE_LIGHT_PRESET: "toggleLightPreset",
  TOGGLE_VISION_TYPE: "toggleVisionType"
} as const;
