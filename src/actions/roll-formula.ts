import { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { sendAVTTRoll, sendAVTTCommand } from "../lib/avtt-client";
import { AVTT_COMMANDS } from "../lib/avtt-commands";
import { RollSettings, RollSelectedFormulaSettings } from "../types/action-settings";



@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.roll" })
export class RollFormulaAction extends SingletonAction<RollSettings> {
  override onWillAppear(ev: WillAppearEvent<RollSettings>): void | Promise<void> {
    const title = ev.payload.settings.action || "Roll";
    return ev.action.setTitle(title);
  }

  override async onKeyDown(ev: KeyDownEvent<RollSettings>): Promise<void> {
    const settings = ev.payload.settings;

    let rollType = settings.rollType || "check";

    if (rollType === "damage" && settings.damageType) {
      rollType = settings.damageType.toLowerCase() + " damage";
    }

    const roll = {
      expression: settings.expression || "1d20",
      rollType,
      action: settings.action || "Stream Deck"
    };

    await sendAVTTRoll(roll);

    await ev.action.setTitle(settings.action || roll.expression);
  }
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.roll-selected-formula" })
export class MonsterActionRoll extends SingletonAction<RollSelectedFormulaSettings> {
  override async onKeyDown(ev: any) {
    const settings = ev.payload.settings || {};

    await sendAVTTCommand({
      command: AVTT_COMMANDS.ROLL_SELECTED_FORMULA,
      formula: settings.formula || "1d20",
      label: settings.label || "Selected Token Roll",
      rollType: settings.rollType || "check"
    });
  }
}
