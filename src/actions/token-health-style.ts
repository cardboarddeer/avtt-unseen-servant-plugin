import {
  action,
  DidReceiveSettingsEvent,
  KeyDownEvent,
  SingletonAction,
  WillAppearEvent
} from "@elgato/streamdeck";

import { sendAVTTCommand } from "../lib/avtt-client";
import { AVTT_COMMANDS } from "../lib/avtt-commands";

type TokenHealthVisual =
  | "aura"
  | "auraBloodied50"
  | "conditionBloodied50"
  | "hpMeter"
  | "none";

type TokenHealthStyleSettings = {
  visual?: TokenHealthVisual;
};

const BUTTON_TITLES: Record<TokenHealthVisual, string> = {
  aura: "Health\nAura",
  auraBloodied50: "Aura\nBloodied 50",
  conditionBloodied50: "Condition\nBloodied 50",
  hpMeter: "HP\nMeter",
  none: "Health\nNone"
};

function getVisual(
  settings?: TokenHealthStyleSettings
): TokenHealthVisual {
  const visual = settings?.visual;

  if (
    visual === "auraBloodied50" ||
    visual === "conditionBloodied50" ||
    visual === "hpMeter" ||
    visual === "none"
  ) {
    return visual;
  }

  return "aura";
}

@action({
  UUID:
    "com.avtt-unseen-servent-plugin." +
    "avtt-unseen-servant-plugin.token-health-style"
})
export class TokenHealthStyleAction
  extends SingletonAction<TokenHealthStyleSettings> {

  private updateTitle(
    ev:
      | WillAppearEvent<TokenHealthStyleSettings>
      | DidReceiveSettingsEvent<TokenHealthStyleSettings>
      | KeyDownEvent<TokenHealthStyleSettings>
  ): void | Promise<void> {
    const visual = getVisual(ev.payload.settings);
    return ev.action.setTitle(BUTTON_TITLES[visual]);
  }

  override onWillAppear(
    ev: WillAppearEvent<TokenHealthStyleSettings>
  ): void | Promise<void> {
    return this.updateTitle(ev);
  }

  override onDidReceiveSettings(
    ev: DidReceiveSettingsEvent<TokenHealthStyleSettings>
  ): void | Promise<void> {
    return this.updateTitle(ev);
  }

  override async onKeyDown(
    ev: KeyDownEvent<TokenHealthStyleSettings>
  ): Promise<void> {
    const visual = getVisual(ev.payload.settings);

    await sendAVTTCommand({
      command: AVTT_COMMANDS.SET_TOKEN_HEALTH_VISUAL,
      visual
    });

    await this.updateTitle(ev);
  }
}
