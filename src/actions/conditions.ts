import { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { sendAVTTCommand } from "../lib/avtt-client";
import { AVTT_COMMANDS } from "../lib/avtt-commands";
import { ConditionSettings } from "../types/action-settings";

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.condition" })
export class ConditionAction extends SingletonAction<ConditionSettings> {
  override onWillAppear(ev: WillAppearEvent<ConditionSettings>): void | Promise<void> {
    const settings = ev.payload.settings;
    return ev.action.setTitle(settings.label || settings.condition || "Condition");
  }

  override async onKeyDown(ev: KeyDownEvent<ConditionSettings>): Promise<void> {
    const settings = ev.payload.settings;
    const condition = settings.condition || "Prone";

    await sendAVTTCommand({
      command: AVTT_COMMANDS.TOGGLE_CONDITION,
      condition
    });

    await ev.action.setTitle(settings.label || condition);
  }
}
