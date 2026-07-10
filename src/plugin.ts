import streamDeck from "@elgato/streamdeck";

import { RollFormulaAction, MonsterActionRoll } from "./actions/roll-formula";
import { ToggleDaylight } from "./actions/daylight";
import { ToggleMarker } from "./actions/markers";
import { InitiativeAction } from "./actions/initiative";
import { OpenTabAction } from "./actions/tabs";
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
streamDeck.actions.registerAction(new InitiativeAction());
streamDeck.actions.registerAction(new OpenTabAction());
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
