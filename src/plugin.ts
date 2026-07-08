import streamDeck from "@elgato/streamdeck";

import { RollFormulaAction, MonsterActionRoll } from "./actions/roll-formula";
import { ToggleDaylight } from "./actions/daylight";
import { ToggleMarker, ClearMarkers } from "./actions/markers";
import { NextInitiative, PreviousInitiative } from "./actions/initiative";
import {
  OpenGameLogTab,
  OpenTokensTab,
  OpenScenesTab,
  OpenSoundsTab,
  OpenJournalTab,
  OpenSettingsTab
} from "./actions/tabs";
import { ZoomIn, ZoomOut } from "./actions/zoom";
import { GameLogMessageAction } from "./actions/game-log-message";
import { ConditionAction } from "./actions/conditions";
import { SelectedPcHpAction } from "./actions/selected-pc-hp";
import { SetTokenSizeAction } from "./actions/set-token-size";
import { ToggleAuraAction, AuraPresetAction } from "./actions/auras";

streamDeck.logger.setLevel("trace");

streamDeck.actions.registerAction(new RollFormulaAction());
streamDeck.actions.registerAction(new ToggleDaylight());
streamDeck.actions.registerAction(new ToggleMarker());
streamDeck.actions.registerAction(new ClearMarkers());
streamDeck.actions.registerAction(new NextInitiative());
streamDeck.actions.registerAction(new PreviousInitiative());
streamDeck.actions.registerAction(new OpenGameLogTab());
streamDeck.actions.registerAction(new OpenTokensTab());
streamDeck.actions.registerAction(new OpenScenesTab());
streamDeck.actions.registerAction(new OpenSoundsTab());
streamDeck.actions.registerAction(new OpenJournalTab());
streamDeck.actions.registerAction(new OpenSettingsTab());
streamDeck.actions.registerAction(new ZoomIn());
streamDeck.actions.registerAction(new ZoomOut());
streamDeck.actions.registerAction(new MonsterActionRoll());
streamDeck.actions.registerAction(new GameLogMessageAction());
streamDeck.actions.registerAction(new ConditionAction());
streamDeck.actions.registerAction(new SelectedPcHpAction());
streamDeck.actions.registerAction(new SetTokenSizeAction());
streamDeck.actions.registerAction(new ToggleAuraAction());
streamDeck.actions.registerAction(new AuraPresetAction());

streamDeck.connect();
