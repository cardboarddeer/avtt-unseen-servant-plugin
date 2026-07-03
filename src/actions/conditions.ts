import { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { sendAVTTCommand } from "../lib/avtt-client";
import { AVTT_COMMANDS } from "../lib/avtt-commands";
import { ConditionSettings } from "../types/action-settings";
import { getConditionIconDataUrl } from "../lib/condition-icons";

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.condition" })
export class ConditionAction extends SingletonAction<ConditionSettings> {
  override async onWillAppear(ev: WillAppearEvent<ConditionSettings>): Promise<void> {
    const settings = ev.payload.settings;
    const condition = settings.condition || "Prone";

    await ev.action.setTitle(settings.label || condition);

    const icon = getConditionIconDataUrl(condition);
    if (icon) {
      await ev.action.setImage(icon);
    }

    const icon = getConditionIconDataUrl(condition);
    if (icon) {
      await ev.action.setImage(icon);
    }
  }

  override async onKeyDown(ev: KeyDownEvent<ConditionSettings>): Promise<void> {
    const settings = ev.payload.settings;
    const condition = settings.condition || "Prone";

    await sendAVTTCommand({
      command: AVTT_COMMANDS.TOGGLE_CONDITION,
      condition
    });

    await ev.action.setTitle(settings.label || condition);

    const icon = getConditionIconDataUrl(condition);
    if (icon) {
      await ev.action.setImage(icon);
    }
  }
}
