import {
  action,
  DidReceiveSettingsEvent,
  KeyDownEvent,
  SingletonAction,
  WillAppearEvent
} from "@elgato/streamdeck";

import {
  sendAVTTCommand
} from "../lib/avtt-client";

import {
  AVTT_COMMANDS
} from "../lib/avtt-commands";

import {
  SpawnTokenSettings
} from "../types/action-settings";

@action({
  UUID:
    "com.avtt-unseen-servent-plugin." +
    "avtt-unseen-servant-plugin.spawn-token"
})
export class SpawnTokenAction
  extends SingletonAction<SpawnTokenSettings> {

  private async updateButton(
    ev:
      | WillAppearEvent<SpawnTokenSettings>
      | DidReceiveSettingsEvent<SpawnTokenSettings>
      | KeyDownEvent<SpawnTokenSettings>
  ): Promise<void> {
    const settings =
      ev.payload.settings || {};

    const title =
      settings.label ||
      settings.tokenName ||
      "Token Spawner";

    await ev.action.setTitle(title);
  }

  override async onWillAppear(
    ev: WillAppearEvent<SpawnTokenSettings>
  ): Promise<void> {
    await this.updateButton(ev);
  }

  override async onDidReceiveSettings(
    ev: DidReceiveSettingsEvent<SpawnTokenSettings>
  ): Promise<void> {
    await this.updateButton(ev);
  }

  override async onKeyDown(
    ev: KeyDownEvent<SpawnTokenSettings>
  ): Promise<void> {
    const settings =
      ev.payload.settings || {};

    const tokenPath =
      String(settings.tokenPath || "").trim();

    const count = Math.max(
      1,
      Math.floor(
        Number(settings.count || 1)
      )
    );

    const sizeOverride =
      Number(settings.sizeOverride);

    if (!tokenPath) {
      await ev.action.showAlert();
      return;
    }

    try {
      await sendAVTTCommand({
        command:
          AVTT_COMMANDS.SPAWN_TOKEN_FROM_PATH,

        tokenPath,
        count,

        sizeOverride:
          Number.isFinite(sizeOverride) &&
          sizeOverride > 0
            ? sizeOverride
            : null
      });

      await ev.action.showOk();
    } catch {
      await ev.action.showAlert();
    }

    await this.updateButton(ev);
  }
}
