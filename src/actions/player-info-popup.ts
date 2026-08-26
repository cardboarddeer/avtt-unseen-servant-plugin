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
  sendAVTTCommand
} from "../lib/avtt-client";

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

    const image =
      settings.image?.trim() ||
      "test-info.png";

    const title =
      settings.title?.trim() ||
      "Player Information";

    try {
      // Player Tracker dashboard popup is deliberately disabled
      // (AboveVTT's own popup replaces it) — left in place, not
      // deleted, in case it needs to come back.
      // await sendPlayerInfoPopupCommand({ image, title });

      await sendAVTTCommand({
        command: "showImagePopup",
        image,
        title,
        zoomEnabled: settings.zoomEnabled === true
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
