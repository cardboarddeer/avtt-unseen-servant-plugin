import {
  action,
  DidReceiveSettingsEvent,
  KeyDownEvent,
  SingletonAction,
  WillAppearEvent
} from "@elgato/streamdeck";

import {
  sendPlayerInfoPopupCommand
} from "../lib/player-tracker-client";

import {
  PlayerInfoPopupSettings
} from "../types/action-settings";

function getButtonLabel(
  settings: PlayerInfoPopupSettings
): string {
  return (
    settings.label?.trim() ||
    "Player Info"
  );
}

@action({
  UUID:
    "com.avtt-unseen-servent-plugin." +
    "avtt-unseen-servant-plugin.player-info-popup"
})
export class PlayerInfoPopupAction
  extends SingletonAction<
    PlayerInfoPopupSettings
  > {
  private async updateButtonTitle(
    event:
      | WillAppearEvent<
          PlayerInfoPopupSettings
        >
      | DidReceiveSettingsEvent<
          PlayerInfoPopupSettings
        >
      | KeyDownEvent<
          PlayerInfoPopupSettings
        >
  ): Promise<void> {
    await event.action.setTitle(
      getButtonLabel(
        event.payload.settings || {}
      )
    );
  }

  override async onWillAppear(
    event:
      WillAppearEvent<
        PlayerInfoPopupSettings
      >
  ): Promise<void> {
    await this.updateButtonTitle(
      event
    );
  }

  override async onDidReceiveSettings(
    event:
      DidReceiveSettingsEvent<
        PlayerInfoPopupSettings
      >
  ): Promise<void> {
    await this.updateButtonTitle(
      event
    );
  }

  override async onKeyDown(
    event:
      KeyDownEvent<
        PlayerInfoPopupSettings
      >
  ): Promise<void> {
    const settings =
      event.payload.settings || {};

    try {
      await sendPlayerInfoPopupCommand({
        image:
          settings.image?.trim() ||
          "test-info.png",

        title:
          settings.title?.trim() ||
          "Player Information"
      });

      await event.action.showOk();
    } catch (error) {
      console.error(
        "Could not open Player Tracker info popup:",
        error
      );

      await event.action.showAlert();
    }

    await this.updateButtonTitle(
      event
    );
  }
}
