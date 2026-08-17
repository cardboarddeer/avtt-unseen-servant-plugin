import streamDeck from "@elgato/streamdeck";

import { RollFormulaAction, MonsterActionRoll } from "./actions/roll-formula";
import { ToggleDaylight } from "./actions/daylight";
import { ToggleMarker } from "./actions/markers";
import { GameLogMessageAction } from "./actions/game-log-message";
import { ConditionAction } from "./actions/conditions";
import { SetTokenSizeAction } from "./actions/set-token-size";
import { TokenStyleAction } from "./actions/token-style";
import { TokenHealthStyleAction } from "./actions/token-health-style";
import { TokenHpModifierAction } from "./actions/token-hp-modifier";
import { SpawnTokenAction } from "./actions/spawn-token";
import { AoeControllerAction } from "./actions/aoe-controller";
import {
  PlayerInfoPopupAction
} from "./actions/player-info-popup";
import {
  JournalNoteAction
} from "./actions/journal-note";
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
streamDeck.actions.registerAction(new MonsterActionRoll());
streamDeck.actions.registerAction(new GameLogMessageAction());
streamDeck.actions.registerAction(new ConditionAction());
streamDeck.actions.registerAction(new SetTokenSizeAction());
streamDeck.actions.registerAction(new TokenStyleAction());
streamDeck.actions.registerAction(new TokenHealthStyleAction());
streamDeck.actions.registerAction(new TokenHpModifierAction());
streamDeck.actions.registerAction(new SpawnTokenAction());
streamDeck.actions.registerAction(new AoeControllerAction());
streamDeck.actions.registerAction(new PlayerInfoPopupAction());
streamDeck.actions.registerAction(new JournalNoteAction());
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
