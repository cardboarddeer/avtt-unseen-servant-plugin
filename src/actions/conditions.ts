import { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { sendAVTTCommand } from "../lib/avtt-client";
import { AVTT_COMMANDS } from "../lib/avtt-commands";
import { ConditionSettings } from "../types/action-settings";
import { getConditionIconPath } from "../lib/condition-icons";

function getSelectedStatus(settings: ConditionSettings): string {
  if (settings.condition === "__custom__") {
    return settings.customCondition?.trim() || "Custom Status";
  }

  return settings.condition || "Prone";
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.condition" })
export class ConditionAction extends SingletonAction<ConditionSettings> {
  override async onWillAppear(ev: WillAppearEvent<ConditionSettings>): Promise<void> {
    const settings = ev.payload.settings;
    const status = getSelectedStatus(settings);

    await ev.action.setTitle(settings.label || status);

    const icon = getConditionIconPath(status);
    if (icon) {
      await ev.action.setImage(icon);
    }
  }

  override async onKeyDown(ev: KeyDownEvent<ConditionSettings>): Promise<void> {
    const settings = ev.payload.settings;
    const status = getSelectedStatus(settings);

    await sendAVTTCommand({
      command: AVTT_COMMANDS.TOGGLE_CONDITION,
      condition: status
    });

    await ev.action.setTitle(settings.label || status);

    const icon = getConditionIconPath(status);
    if (icon) {
      await ev.action.setImage(icon);
    }
  }
}
