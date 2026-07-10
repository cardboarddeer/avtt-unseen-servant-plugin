import {
  action,
  DidReceiveSettingsEvent,
  KeyDownEvent,
  SingletonAction,
  WillAppearEvent
} from "@elgato/streamdeck";

import { sendAVTTCommand } from "../lib/avtt-client";
import { AVTT_COMMANDS } from "../lib/avtt-commands";

type InitiativeSettings = {
  direction?: "next" | "previous";
};

function getDirection(settings?: InitiativeSettings): "next" | "previous" {
  return settings?.direction === "previous" ? "previous" : "next";
}

function getTitle(direction: "next" | "previous"): string {
  return direction === "previous"
    ? "Prev\nInit"
    : "Next\nInit";
}

@action({
  UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.initiative"
})
export class InitiativeAction extends SingletonAction<InitiativeSettings> {
  override onWillAppear(
    ev: WillAppearEvent<InitiativeSettings>
  ): void | Promise<void> {
    return ev.action.setTitle(getTitle(getDirection(ev.payload.settings)));
  }

  override onDidReceiveSettings(
    ev: DidReceiveSettingsEvent<InitiativeSettings>
  ): void | Promise<void> {
    return ev.action.setTitle(getTitle(getDirection(ev.payload.settings)));
  }

  override async onKeyDown(
    ev: KeyDownEvent<InitiativeSettings>
  ): Promise<void> {
    const direction = getDirection(ev.payload.settings);

    await sendAVTTCommand({
      command:
        direction === "previous"
          ? AVTT_COMMANDS.PREVIOUS_INITIATIVE
          : AVTT_COMMANDS.NEXT_INITIATIVE
    });

    await ev.action.setTitle(getTitle(direction));
  }
}
