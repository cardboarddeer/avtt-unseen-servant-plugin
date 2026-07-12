import {
  action,
  DidReceiveSettingsEvent,
  KeyDownEvent,
  SingletonAction,
  WillAppearEvent
} from "@elgato/streamdeck";

import { sendAVTTCommand } from "../lib/avtt-client";
import { AVTT_COMMANDS } from "../lib/avtt-commands";

type TokenImageMode = "apply" | "reset";

type TokenImageSettings = {
  mode?: TokenImageMode;
  imageUrl?: string;
};

function getMode(settings?: TokenImageSettings): TokenImageMode {
  return settings?.mode === "reset" ? "reset" : "apply";
}

function getTitle(mode: TokenImageMode): string {
  return mode === "reset"
    ? "Reset\nImage"
    : "Token\nImage";
}

@action({
  UUID:
    "com.avtt-unseen-servent-plugin." +
    "avtt-unseen-servant-plugin.token-image"
})
export class TokenImageAction extends SingletonAction<TokenImageSettings> {
  private updateTitle(
    ev:
      | WillAppearEvent<TokenImageSettings>
      | DidReceiveSettingsEvent<TokenImageSettings>
      | KeyDownEvent<TokenImageSettings>
  ): void | Promise<void> {
    return ev.action.setTitle(
      getTitle(getMode(ev.payload.settings))
    );
  }

  override onWillAppear(
    ev: WillAppearEvent<TokenImageSettings>
  ): void | Promise<void> {
    return this.updateTitle(ev);
  }

  override onDidReceiveSettings(
    ev: DidReceiveSettingsEvent<TokenImageSettings>
  ): void | Promise<void> {
    return this.updateTitle(ev);
  }

  override async onKeyDown(
    ev: KeyDownEvent<TokenImageSettings>
  ): Promise<void> {
    const settings = ev.payload.settings || {};
    const mode = getMode(settings);

    if (mode === "reset") {
      await sendAVTTCommand({
        command: AVTT_COMMANDS.RESET_TOKEN_IMAGE
      });
    } else {
      const imageUrl = String(settings.imageUrl || "").trim();

      if (!imageUrl) {
        await ev.action.showAlert();
        return;
      }

      await sendAVTTCommand({
        command: AVTT_COMMANDS.APPLY_TOKEN_IMAGE,
        imageUrl
      });
    }

    await this.updateTitle(ev);
  }
}
