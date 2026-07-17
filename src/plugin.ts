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
import { TokenStyleAction } from "./actions/token-style";
import { TokenHealthStyleAction } from "./actions/token-health-style";
import { TokenHpModifierAction } from "./actions/token-hp-modifier";
import { SpawnTokenAction } from "./actions/spawn-token";
import { TokenImageAction } from "./actions/token-image";
import { ToggleAuraAction, AuraPresetAction } from "./actions/auras";
import {
  PcStatEffectAction,
  ClearPcEffectsAction
} from "./actions/pc-stat-effects";

import {
  PcRollBuffAction
} from "./actions/pc-roll-buff";

import {
  PcRollSettingAction
} from "./actions/pc-roll-settings";

import {
  ToggleLightAction,
  LightPresetAction,
  VisionTypeAction
} from "./actions/lights";

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
streamDeck.actions.registerAction(new TokenStyleAction());
streamDeck.actions.registerAction(new TokenHealthStyleAction());
streamDeck.actions.registerAction(new TokenHpModifierAction());
streamDeck.actions.registerAction(new SpawnTokenAction());
streamDeck.actions.registerAction(new TokenImageAction());
streamDeck.actions.registerAction(new ToggleAuraAction());
streamDeck.actions.registerAction(new AuraPresetAction());
streamDeck.actions.registerAction(new ToggleLightAction());
streamDeck.actions.registerAction(new LightPresetAction());
streamDeck.actions.registerAction(new VisionTypeAction());
streamDeck.actions.registerAction(new PcStatEffectAction());
streamDeck.actions.registerAction(new ClearPcEffectsAction());
streamDeck.actions.registerAction(new PcRollBuffAction());
streamDeck.actions.registerAction(new PcRollSettingAction());

streamDeck.connect();
