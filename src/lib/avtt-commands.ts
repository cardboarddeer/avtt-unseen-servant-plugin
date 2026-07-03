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

  ROLL_SELECTED_FORMULA: "rollSelectedFormula",
  SEND_TEXT_TO_GAMELOG: "sendTextToGamelog"
} as const;
